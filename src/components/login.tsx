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
import { useState } from "react"
import * as Yup from "yup"


const Login = () => {
    const [errors, setErrors] = useState<{[key: string]: string}>({})
    const [formData, setFormData] = useState<{email: string, password: string}>({
        email: "",
        password: ""
    })

    const handleLogin = async () => {
        setErrors({})
        try {
            const schema = Yup.object().shape({
                email: Yup.string()
                    .email("Invalid email")
                    .required("Email is required"),
                password: Yup.string()
                    .min(8, "Password must be at least 8 characters")
                    .required("Password is required"),
            })
            
        await schema.validate(formData, { abortEarly: false })
        } catch (error: any) {
            const newErrors: {[key: string]: string} = {}

            error?.inner?.forEach((err: any) => {
                newErrors[err.path] = err.message
            })

            setErrors(newErrors)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }))
    }

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
                    <Input onChange={handleInputChange} type="email" placeholder="Email" className="w-full" />
                    {errors.email && <Error message={errors.email} />}
                </div>
                <div className="space-y-1">
                    <Input onChange={handleInputChange} type="email" placeholder="Email" className="w-full" />
                    {errors.password && <Error message={errors.password} />}
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