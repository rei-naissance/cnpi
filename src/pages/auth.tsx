import { useSearchParams } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Login from "@/components/login"
import Signup from "@/components/signup"

const Auth = () => {
  
  const [searchParams] = useSearchParams()
  return (
    <div className="flex flex-col items-center mt-36 gap-10">
      <h1 className="font-extrabold text-5xl">
        {searchParams.get("createNew") ? "Wait a second, let's get started with an account first" : "Login / Sign Up"}
      </h1>

      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Login />
        </TabsContent>
        <TabsContent value="signup">
          <Signup />
        </TabsContent>
      </Tabs>

    </div>
  )
}

export default Auth