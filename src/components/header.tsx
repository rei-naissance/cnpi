import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Link, useNavigate } from 'react-router-dom'
import { Button } from "../components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { LinkIcon, LogOut } from "lucide-react"
import { urlState } from "@/context"
import useFetch from "@/hooks/use-fetch"
import { logout } from "@/utils/apiAuth"
import { BarLoader } from "react-spinners"

const Header = () => {

  const navigate = useNavigate()  
  const { user, fetchUser } = urlState()
  const { loading, func: fnLogout } = useFetch(logout)

  return (
    <>
    <nav className= "flex items-center justify-between py-6">
      <Link to="/" className="flex items-center gap-4">
        <img src="./cnpi-logo.png" className="h-14" alt="CNPI Logo" />
        <h1 className="text-4xl font-bold text-white" style={{ fontFamily: "'Rubik', sans-serif" }}>CNPI</h1>
      </Link>

      <div>
        {!user ? (
            <Button variant="outline" onClick={() => navigate("/auth")}>Login</Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="w-12 overflow-hidden rounded-full">
                <Avatar className="h-12 w-12 cursor-pointer">
                  <AvatarImage src={user?.user_metadata?.profile_pic} className="object-contain" />
                  <AvatarFallback>{user?.user_metadata?.name?.split(" ").map((name: string) => name.charAt(0).toUpperCase()).join("")}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>{user?.user_metadata?.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/dashboard" className="flex items-center gap-2">
                    <LinkIcon className="mr-2 h-4 w-4" />
                    My URLs
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                    <span onClick={() => {
                        fnLogout().then(() => {
                          fetchUser()
                          navigate("/")
                        })
                    }}>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        }
      </div>
    </nav>
    {loading && <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />}
    </>
  )
}

export default Header
