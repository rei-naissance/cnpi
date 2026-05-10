import type { Url } from '@/types'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Copy, Download, Trash, ExternalLink } from 'lucide-react'
import { deleteUrl } from '@/features/links/api'
import useFetch from '@/shared/hooks/use-fetch'
import { BeatLoader } from 'react-spinners'

const LinkCard = ({
  url,
  fetchUrls,
}: {
  url: Url
  fetchUrls: () => Promise<void> | void
}) => {
  const downloadImage = () => {
    const anchor = document.createElement('a')
    anchor.href = url.qr
    anchor.download = url.title
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
  }

  const { loading: loadingDelete, func: fnDeleteUrl } = useFetch(deleteUrl)

  return (
    <div className="flex flex-col md:flex-row gap-5 border border-border p-4 bg-card/30 backdrop-blur-md rounded-2xl hover:bg-primary/5 transition-colors group">
      <div className="h-32 w-32 shrink-0 bg-white rounded-xl p-2 flex items-center justify-center overflow-hidden border border-border self-center md:self-start">
        <img
          src={url.qr}
          className="w-full h-full object-contain"
          alt="QR Code"
        />
      </div>
      
      <div className="flex flex-col flex-1 justify-between py-1">
        <div className="flex flex-col gap-1">
          <Link to={`/link/${url.id}`} className="text-2xl font-extrabold hover:text-primary transition-colors cursor-pointer w-fit">
            {url.title}
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-primary bg-primary/10 px-2 py-1 rounded-md font-mono text-sm font-bold tracking-wide">
              cnpi.vercel.app/{url.custom_url ?? url.short_url}
            </span>
          </div>
          <a href={url.original_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground transition-colors mt-2 w-fit">
            <ExternalLink className="w-3 h-3" />
            <span className="truncate max-w-[300px] md:max-w-md">{url.original_url}</span>
          </a>
        </div>
        
        <span className="flex flex-1 items-end font-mono text-xs text-muted-foreground/60 mt-4 md:mt-0 uppercase tracking-widest">
          {new Date(url.created_at).toLocaleString()}
        </span>
      </div>

      <div className="flex md:flex-col gap-2 items-end justify-start self-end md:self-stretch">
        <Button
          variant="outline"
          size="icon"
          className="btn-slice border-border bg-background/50 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
          onClick={() =>
            navigator.clipboard.writeText(`https://cnpi.vercel.app/${url.short_url}`)
          }
          title="Copy Link"
        >
          <span className="flex items-center justify-center w-full h-full"><Copy className="h-4 w-4" /></span>
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          className="btn-slice border-border bg-background/50 hover:bg-secondary hover:text-secondary-foreground hover:border-secondary transition-colors" 
          onClick={downloadImage}
          title="Download QR"
        >
          <span className="flex items-center justify-center w-full h-full"><Download className="h-4 w-4" /></span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="btn-slice border-border bg-background/50 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors text-destructive"
          title="Delete Link"
          onClick={() => {
            fnDeleteUrl(url.id).then(() => fetchUrls())
          }}
        >
          <span className="flex items-center justify-center w-full h-full">{loadingDelete ? <BeatLoader size={5} color="currentColor" /> : <Trash className="h-4 w-4" />}</span>
        </Button>
      </div>
    </div>
  )
}

export default LinkCard