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
import { useEffect, useState } from "react"
import * as Yup from "yup"
import useFetch from "@/hooks/use-fetch"
import { login } from "@/utils/apiAuth"
import { useNavigate, useSearchParams } from "react-router-dom"


const Login = () => {
    const [errors, setErrors] = useState<{[key: string]: string}>({})
    const [formData, setFormData] = useState<{email: string, password: string}>({
        email: "",
        password: ""
    })
    
    const navigate = useNavigate()
    let [searchParams, ] = useSearchParams()
    const longLink = searchParams.get("createNew")

    const {data, error, loading, func: fnLogin} = useFetch(login, formData)

    useEffect(() => {
        // console.log(data)
        if (error === null && data) {
            navigate(`/dashboard?createNew=${longLink ? `createNew=${longLink}` : ""}`)
        }
    }, [data, error])

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
        await fnLogin()
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
            {error && <Error message={error.message} />}
            <CardContent className="space-y-2">
                <div className="space-y-1">
                    <Input onChange={handleInputChange} name= "email" type="email" placeholder="Email" className="w-full" />
                    {errors.email && <Error message={errors.email} />}
                </div>
                <div className="space-y-1">
                    <Input onChange={handleInputChange} name="password" type="password" placeholder="Password" className="w-full" />
                    {errors.password && <Error message={errors.password} />}
                </div>
            </CardContent>
            <CardFooter>
                <Button type="submit" onClick={handleLogin}>
                    {loading ? <BeatLoader size={10} /> : "Login"}
                </Button>
            </CardFooter>
            </Card>
        </div>
    )
}

export default Login