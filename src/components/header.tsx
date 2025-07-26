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


const Header = () => {

  const navigate = useNavigate()
  
  const { user, fetchUser } = urlState()

  return (
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
              <DropdownMenuTrigger className="w-10 overflow-hidden rounded-full">
                <Avatar className="h-10 w-10 cursor-pointer">
                  <AvatarImage src={user?.user_metadata?.profile_pic} />
                  <AvatarFallback>{user?.user_metadata?.name?.split(" ").map((name: string) => name.charAt(0).toUpperCase()).join("")}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>{user?.user_metadata?.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LinkIcon className="mr-2 h-4 w-4" />
                  My URLs
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        }
      </div>
    </nav>
  )
}

export default Header
