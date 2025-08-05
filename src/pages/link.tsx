import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { urlState } from "@/context"
import useFetch from "@/hooks/use-fetch"
import { getClicksForUrl } from "@/utils/apiClicks"
import { deleteUrl, getUrl } from "@/utils/apiUrls"
import { Copy, Download, LinkIcon, Trash } from "lucide-react"
import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { BarLoader, BeatLoader } from "react-spinners"
import Location from "@/components/location-stats"
import Device from "@/components/device-stats"

const Link = () => {
  const {user} = urlState()
  const {id} = useParams()
  const navigate = useNavigate()

  // Fetch the URL details
  const {
    loading,
    data: url,
    func,
    error
  } = useFetch(async (_: any, options: { id: string, user_id: string }) => getUrl(options))

  // Fetch the click stats
  const {
    loading: loadingStats,
    data: stats,
    func: fnStats,
  } = useFetch(async (_options: any, id: string) => getClicksForUrl(id))

  // Delete function
  const { loading: loadingDelete, func: fnDelete } = useFetch(async (_options: any, id: string) => deleteUrl(id))

  useEffect(() => {
    if (id && user?.id) {
      func({ id, user_id: user.id })
      fnStats(id)
    }
  }, [id, user?.id])

  if (error) {
    navigate("/dashboard")
  }

  let link = ""
  if (url) {
    link = url?.custom_url ? url?.custom_url : url.short_url
  }

  const downloadImage = () => {
        const imageUrl = url?.qr
        const fileName = url?.title

        const anchor = document.createElement("a")
        anchor.href = imageUrl
        anchor.download = fileName
        
        document.body.appendChild(anchor)
        anchor.click()
        document.body.removeChild(anchor)
    }

  return (
    <>
      {(loading || loadingStats) && (
        <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
      )}
      <div className="flex flex-col gap-8 sm:flex-row justify-between">
        <div className="flex flex-col items-start gap-8  rounded-lg sm:w-2/5">
          <span className="text-6xl font-extrabold hover:underline cursor-pointer">{url?.title}</span>
          <a 
            href={`https://cnpi.in/${link}`}
            target="_blank"
            className="text-3xl sm:text-4xl font-bold hover:underline cursor-pointer"
          >
            https://cnpi.in/{link}
          </a>
          <a
            href={url?.original_url}
            target="_blank"
            className="flex items-center gap-1 hover:underline cursor-pointer"
          >
            <LinkIcon className="p-1" />  
            {url?.original_url}
          </a>
          <span className="flex items-end font-extralight text-sm">
            {url?.created_at ? new Date(url.created_at).toLocaleString() : ""}
          </span>

          <div className="flex gap-2">
              <Button 
                  variant="ghost"
                  onClick={() => navigator.clipboard.writeText(`https://cnpi.in/${url.short_url}`)}
              >
                  <Copy />
              </Button>
              <Button 
                  variant="ghost"
                  onClick={downloadImage}
              >
                  <Download />
              </Button>
              <Button 
                  variant="ghost"
                  onClick={() => {
                      fnDelete(url.id)
                  }}
              >
                  {loadingDelete ? <BeatLoader size={5} color="white" /> : <Trash />}
              </Button>
          </div>
          <img
            src={url?.qr}
            className="w-full self-center sm:self-start ring ring-blue-500 p-1 object-contain"
            alt="QR Code"
          />
        </div>
          <Card className="sm:w-3/5">
            <CardHeader>
              <CardTitle className="text-4xl font-extrabold">Statistics</CardTitle>
            </CardHeader>

            {stats && stats?.length ? (
              <CardContent className="flex flex-col gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="">Total Clicks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{stats?.length}</p>
                  </CardContent>
                </Card>
                
                <CardTitle>Location Data</CardTitle>
                <Location stats={stats} />
                <CardTitle>Device Statistics</CardTitle>
                <Device stats={stats} />
              </CardContent>
            ) : (
              <CardContent>
                {loadingStats === false
                  ? "No statistics yet"
                  : "Loading statistics..."}
              </CardContent>
            )}
          </Card>
        </div>
    </>
  )
}
export default Link