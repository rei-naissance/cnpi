import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LinkIcon, LogOut, UserCircle } from 'lucide-react'
import { urlState } from '@/context'
import useFetch from '@/shared/hooks/use-fetch'
import { logout } from '@/features/auth/api'
import { BarLoader } from 'react-spinners'

const Header = () => {
  const navigate = useNavigate()
  const { user, fetchUser } = urlState()
  const { loading, func: fnLogout } = useFetch(logout)

  return (
    <>
      <nav className="bg-background/40 backdrop-blur-lg text-foreground fixed top-0 left-0 w-full z-50 border-b border-white/5">
        <div className="flex justify-between items-center px-6 md:px-12 h-20 w-full max-w-7xl mx-auto">
          <Link to="/" className="text-3xl font-extrabold text-primary font-sans tracking-tight hover:opacity-80 transition-opacity">
            CNPI
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link className="nav-link text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative" to="/dashboard">Dashboard</Link>
            <a className="nav-link text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative" href="#">Analytics</a>
            <a className="nav-link text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative" href="#">Support</a>
          </div>

          <div className="flex items-center gap-4">
            {!user ? (
              <Button onClick={() => navigate('/auth')} className="btn-slice rounded-full font-bold px-6 shadow-[0_0_15px_rgba(0,255,194,0.15)] hover:shadow-[0_0_25px_rgba(0,255,194,0.35)] transition-all duration-300">
                <span className="flex items-center justify-center h-full w-full">Login / Shorten</span>
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger className="w-10 overflow-hidden rounded-full border border-border hover:border-primary transition-colors">
                  <Avatar className="h-10 w-10 cursor-pointer">
                    <AvatarImage
                      src={user.user_metadata?.profile_pic as string | undefined}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-primary/20 text-primary font-bold text-sm">
                      {(user.user_metadata?.name as string | undefined)
                        ?.split(' ')
                        .map((n: string) => n.charAt(0).toUpperCase())
                        .join('') || <UserCircle className="h-5 w-5" />}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.user_metadata?.name as string | undefined || "User"}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer">
                    <LinkIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>My URLs</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:bg-destructive/10 cursor-pointer"
                    onClick={() => {
                      fnLogout().then(() => {
                        fetchUser()
                        navigate('/')
                      })
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        {loading && <BarLoader className="absolute bottom-0 w-full" width="100%" color="#6366F1" height={2} />}
      </nav>
    </>
  )
}

export default Header
