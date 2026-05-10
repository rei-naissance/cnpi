import { Outlet } from 'react-router-dom'
import Header from '@/shared/components/header'

const AppLayout = () => (
  <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/30 antialiased font-sans">
    <Header />
    <main className="flex-1 pt-24 pb-16">
      <Outlet />
    </main>

    <footer className="bg-card/50 text-muted-foreground py-16 border-t border-border mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 md:px-12 gap-10 max-w-7xl mx-auto">
        <div className="text-2xl text-foreground font-extrabold tracking-tighter">CNPI</div>
        <div className="flex flex-wrap justify-center items-center gap-8 text-sm font-medium">
          <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
          <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
          <span className="flex items-center gap-2 text-muted-foreground/70">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <span className="font-mono text-xs uppercase tracking-wider">Running</span>
          </span>
        </div>
        <div className="opacity-60 text-xs uppercase tracking-widest font-mono">
          © {new Date().getFullYear()} CNPI Systems.
        </div>
      </div>
    </footer>
  </div>
)

export default AppLayout
