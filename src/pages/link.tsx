import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { urlState } from '@/context'
import useFetch from '@/shared/hooks/use-fetch'
import { getClicksForUrl } from '@/features/analytics/api'
import { deleteUrl, getUrl } from '@/features/links/api'
import { Copy, Download, LinkIcon, Trash, ExternalLink, Activity, ArrowLeft } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { BarLoader, BeatLoader } from 'react-spinners'
import LocationStats from '@/features/analytics/components/location-stats'
import DeviceStats from '@/features/analytics/components/device-stats'
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"

const LinkPage = () => {
  const { user } = urlState()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)

  const { loading, data: url, func, error } = useFetch(getUrl)
  const { loading: loadingStats, data: stats, func: fnStats } = useFetch(getClicksForUrl)
  const { loading: loadingDelete, func: fnDelete } = useFetch(deleteUrl)

  useEffect(() => {
    if (id && user?.id) {
      func({ id, user_id: user.id })
      fnStats(id)
    }
  }, [id, user?.id])

  useEffect(() => {
    if (error) navigate('/dashboard')
  }, [error])

  useGSAP(() => {
    if (!loading && url) {
      gsap.from(".anim-left-col > *", {
        x: -40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out"
      })
      
      gsap.from(".anim-right-col", {
        x: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.3
      })
    }
  }, { dependencies: [loading, url], scope: containerRef })

  const link = url?.custom_url ?? url?.short_url ?? ''

  const downloadImage = () => {
    if (!url) return
    const anchor = document.createElement('a')
    anchor.href = url.qr
    anchor.download = url.title
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
  }

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto w-full flex flex-col gap-8 px-6 md:px-0">
      {(loading || loadingStats) && (
        <BarLoader className="w-full rounded-full" height={2} width="100%" color="#6366F1" />
      )}
      
      <div className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors w-fit">
        <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 justify-between items-start">
        {/* Left Column: Link Details */}
        <div className="anim-left-col flex flex-col gap-8 w-full lg:w-[35%] xl:w-[30%]">
          <Card className="bg-card/40 backdrop-blur-xl border-border shadow-lg shadow-black/20 flex flex-col overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border pb-4">
              <CardTitle className="text-3xl font-extrabold tracking-tight break-all">
                {url?.title || 'Loading...'}
              </CardTitle>
              <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest mt-2">
                Created {url?.created_at ? new Date(url.created_at).toLocaleDateString() : ''}
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-6 pt-6">
              
              <div className="flex flex-col gap-2">
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Short URL</span>
                <a
                  href={`https://cnpi.vercel.app/${link}`}
                  target="_blank"
                  className="text-xl font-bold text-primary hover:underline hover:text-primary/80 transition-colors break-all flex items-center gap-2"
                >
                  cnpi.io/{link}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Destination</span>
                <a
                  href={url?.original_url}
                  target="_blank"
                  className="flex items-start gap-2 text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors break-all"
                >
                  <LinkIcon className="w-4 h-4 shrink-0 mt-0.5" />
                  {url?.original_url}
                </a>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                <Button
                  variant="secondary"
                  className="btn-slice flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold gap-2"
                  onClick={() =>
                    url &&
                    navigator.clipboard.writeText(`https://cnpi.vercel.app/${url.short_url}`)
                  }
                >
                  <span className="flex items-center justify-center w-full h-full"><Copy className="w-4 h-4 mr-2" /> Copy</span>
                </Button>
                <Button
                  variant="outline"
                  className="btn-slice flex-none border-border hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors text-destructive gap-2"
                  onClick={() => {
                    if (url) {
                      fnDelete(url.id).then(() => navigate('/dashboard'))
                    }
                  }}
                >
                  <span className="flex items-center justify-center w-full h-full">{loadingDelete ? <BeatLoader size={5} color="currentColor" /> : <Trash className="w-4 h-4" />}</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {url?.qr && (
            <Card className="bg-card/40 backdrop-blur-xl border-border shadow-lg shadow-black/20 overflow-hidden flex flex-col items-center p-8 gap-6">
              <div className="bg-white p-4 rounded-2xl w-full max-w-[240px] aspect-square flex items-center justify-center border border-border">
                <img
                  src={url.qr}
                  className="w-full h-full object-contain"
                  alt="QR Code"
                />
              </div>
              <Button variant="outline" className="btn-slice w-full border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors font-bold gap-2" onClick={downloadImage}>
                <span className="flex items-center justify-center w-full h-full"><Download className="w-4 h-4 mr-2" /> Download QR</span>
              </Button>
            </Card>
          )}
        </div>

        {/* Right Column: Analytics */}
        <div className="anim-right-col w-full lg:w-[65%] xl:w-[70%] flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-primary" />
            <h2 className="text-4xl font-extrabold tracking-tight">Analytics Engine</h2>
          </div>
          
          <Card className="bg-card/40 backdrop-blur-xl border-border shadow-lg shadow-black/20 flex flex-col overflow-hidden w-full h-full min-h-[500px]">
            {stats && stats.length > 0 ? (
              <CardContent className="flex flex-col gap-8 p-6 md:p-8">
                
                {/* Total Clicks Card inside Analytics */}
                <div className="bg-gradient-to-br from-primary/10 to-transparent border border-border rounded-2xl p-6 flex flex-col gap-2">
                  <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Total Engagement</span>
                  <p className="text-5xl font-extrabold text-foreground">{stats.length}</p>
                </div>

                <div className="grid grid-cols-1 gap-8">
                  <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-bold tracking-tight border-b border-border/50 pb-2">Geographic Distribution</h3>
                    <div className="bg-card/50 rounded-2xl border border-border p-4">
                      <LocationStats stats={stats} />
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-bold tracking-tight border-b border-border/50 pb-2">Device Telemetry</h3>
                    <div className="bg-card/50 rounded-2xl border border-border p-4">
                      <DeviceStats stats={stats} />
                    </div>
                  </div>
                </div>

              </CardContent>
            ) : (
              <CardContent className="flex items-center justify-center flex-1 min-h-[300px]">
                <div className="text-center flex flex-col items-center gap-4">
                  <Activity className="w-12 h-12 text-muted-foreground/30" />
                  <p className="text-muted-foreground font-mono">
                    {loadingStats === false ? 'Awaiting telemetry data...' : 'Establishing connection...'}
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

export default LinkPage