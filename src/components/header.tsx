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



const Header = () => {

  const navigate = useNavigate()
  const user = true // Replace with actual user authentication logic

  return (
    <nav className= "flex items-center justify-between py-4">
      <Link to="/">
        <img src="./cnpi-logo.png" className="h-14" alt="CNPI Logo" />
      </Link>

      <div>
        {!user ? (
            <Button variant="outline" onClick={() => navigate("/auth")}>Login</Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="w-10 overflow-hidden rounded-full">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Reinaissance</DropdownMenuLabel>
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