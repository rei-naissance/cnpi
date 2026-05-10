import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Error from '@/shared/components/error'
import { Filter, TrendingUp, Link as LinkIcon } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import { BarLoader } from 'react-spinners'
import useFetch from '@/shared/hooks/use-fetch'
import { urlState } from '@/context'
import { getUrls } from '@/features/links/api'
import { getClicks } from '@/features/analytics/api'
import type { Url, Click } from '@/types'
import LinkCard from '@/features/links/components/link-card'
import CreateLink from '@/features/links/components/create-link'
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const { user } = urlState()
  const containerRef = useRef<HTMLDivElement>(null)

  const {
    data: urls,
    error,
    loading,
    func: fnGetUrls,
  } = useFetch<Url[], [string]>(getUrls)

  const {
    loading: loadingClicks,
    data: clicks,
    func: fnClicks,
  } = useFetch<Click[], [number[]]>(getClicks)

  useEffect(() => {
    if (user?.id) fnGetUrls(user.id)
  }, [user?.id])

  useEffect(() => {
    if (urls?.length) fnClicks(urls.map((url) => url.id))
  }, [urls])

  useGSAP(() => {
    // Initial load animations
    const tl = gsap.timeline()
    
    tl.from(".stat-card", {
      y: 30,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: "power3.out"
    })
    .from(".header-elements > *", {
      x: -30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out"
    }, "-=0.6")
    
  }, { scope: containerRef })

  useGSAP(() => {
    // Animate list items when urls are loaded
    if (urls && urls.length > 0) {
      gsap.from(".link-card-item", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        clearProps: "all" // prevent layout issues after animation
      })
    }
  }, { dependencies: [urls], scope: containerRef })

  const filteredUrls = urls?.filter((url) =>
    url.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleInputFocus = () => {
    gsap.to(".search-container", {
      scale: 1.01,
      borderColor: "rgba(0, 255, 194, 0.5)",
      boxShadow: "0 0 20px rgba(0, 255, 194, 0.15)",
      duration: 0.5,
      ease: "power3.out"
    })
  }

  const handleInputBlur = () => {
    gsap.to(".search-container", {
      scale: 1,
      borderColor: "transparent",
      boxShadow: "0 0 0 rgba(0,0,0,0)",
      duration: 0.5,
      ease: "power3.out"
    })
  }

  return (
    <div ref={containerRef} className="flex flex-col gap-8 w-full max-w-7xl mx-auto px-6 md:px-0">
      {(loading || loadingClicks) && <BarLoader color="#6366F1" width="100%" height={2} />}
      
      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="stat-card bg-card/40 backdrop-blur-xl border-border shadow-lg shadow-black/20 bg-gradient-to-br from-primary/10 to-transparent">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Links Generated</CardTitle>
              <div className="p-2 bg-primary/10 rounded-lg">
                <LinkIcon className="text-primary w-5 h-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-extrabold text-foreground">{urls?.length ?? 0}</p>
          </CardContent>
        </Card>
        
        <Card className="stat-card bg-card/40 backdrop-blur-xl border-border shadow-lg shadow-black/20 bg-gradient-to-br from-secondary/10 to-transparent">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Total Clicks</CardTitle>
              <div className="p-2 bg-secondary/10 rounded-lg">
                <TrendingUp className="text-secondary w-5 h-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-extrabold text-foreground">{clicks?.length ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      <div className="header-elements flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4">
        <h1 className="text-4xl font-extrabold tracking-tight">My Links</h1>
        <CreateLink />
      </div>

      <div className="header-elements relative search-container rounded-lg border border-transparent transition-colors">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Filter className="h-5 w-5 text-muted-foreground" />
        </div>
        <Input
          type="text"
          placeholder="Filter Links by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          className="pl-10 h-14 bg-input border-border focus-visible:ring-0 focus-visible:ring-offset-0 font-mono text-sm"
        />
      </div>

      {error && <Error message={error.message} />}

      <div className="flex flex-col gap-4 mt-4">
        {(filteredUrls ?? []).map((url) => (
          <div key={url.id} className="link-card-item">
            <LinkCard
              url={url}
              fetchUrls={async () => {
                if (user?.id) await fnGetUrls(user.id)
              }}
            />
          </div>
        ))}
        {(filteredUrls?.length === 0 && !loading) && (
          <div className="link-card-item text-center py-12 text-muted-foreground bg-card/20 rounded-2xl border border-dashed border-border">
            No links found. Create one to get started!
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard