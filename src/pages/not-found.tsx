import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
    <h1 className="text-6xl font-extrabold">404</h1>
    <p className="text-xl text-gray-400">Page not found</p>
    <Button asChild variant="outline" className="btn-slice border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
      <Link to="/"><span className="flex items-center justify-center w-full h-full">Go home</span></Link>
    </Button>
  </div>
)

export default NotFound
