import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { BeatLoader } from "react-spinners"
import Error from "./error"


const Login = () => {
  return (
    <div>
        <Card>
        <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>to your account if you already have one.</CardDescription>
        </CardHeader>
        <Error message={"insert error"} />
        <CardContent className="space-y-2">
            <div className="space-y-1">
                <Input type="email" placeholder="Email" className="w-full" />
                <Error message={"insert error"} />
            </div>
            <div className="space-y-1">
                <Input type="email" placeholder="Email" className="w-full" />
                <Error message={"insert error"} />
            </div>
        </CardContent>
        <CardFooter>
            <Button>
                {true ? <BeatLoader size={10} /> : "Login"}
            </Button>
        </CardFooter>
        </Card>
    </div>
    
  )
}

export default Login