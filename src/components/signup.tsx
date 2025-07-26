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
import { signup } from "@/utils/apiAuth"
import type { LoginCredentials, SignupData } from "@/utils/apiAuth"
import { useNavigate, useSearchParams } from "react-router-dom"
import { urlState } from "@/context"


const Signup = () => {
    const [errors, setErrors] = useState<{[key: string]: string}>({})
    const [formData, setFormData] = useState<{name: string, email: string, password: string, profilePic: File | null}>({
        name: "",
        email: "",
        password: "",
        profilePic: null,
    })
    
    const navigate = useNavigate()
    let [searchParams, ] = useSearchParams()
    const longLink = searchParams.get("createNew")

    const {data, error, loading, func: fnSignup} = useFetch(
        (options: any) => signup(options as SignupData),
        formData
    )
    const { fetchUser }= urlState() 

    useEffect(() => {
        // console.log(data)
        if (error === null && data) {

            navigate(`/dashboard?createNew=${longLink ? `createNew=${longLink}` : ""}`)
            fetchUser()
        }
    }, [error, loading])

    const handleSignup = async () => {
        setErrors({})
        try {
            const schema = Yup.object().shape({
                name: Yup.string()
                    .required("Name is required"),
                email: Yup.string()
                    .email("Invalid email")
                    .required("Email is required"),
                password: Yup.string()
                    .min(8, "Password must be at least 8 characters")
                    .required("Password is required"),
                profilePic: Yup.mixed()
                    .required("Profile picture is required."),
            })
            
        await schema.validate(formData, { abortEarly: false })
        await fnSignup()
        } catch (error: any) {
            const newErrors: {[key: string]: string} = {}

            error?.inner?.forEach((err: any) => {
                newErrors[err.path] = err.message
            })

            setErrors(newErrors)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value, files} = e.target
        setFormData((prevState) => ({
            ...prevState,
            [name]: files ? files[0] : value,

        }))
    }

    return (
        <div>
            <Card>
            <CardHeader>
                <CardTitle>Signup</CardTitle>
                <CardDescription>Create a new account if you haven't already.</CardDescription>
            </CardHeader>
            {error && <Error message={error.message} />}
            <CardContent className="space-y-2">
                <div>
                    <Input onChange={handleInputChange} name= "name" type="text" placeholder="Name" className="w-full" />
                    {errors.name && <Error message={errors.name} />}
                </div>
                <div className="space-y-1">
                    <Input onChange={handleInputChange} name= "email" type="email" placeholder="Email" className="w-full" />
                    {errors.email && <Error message={errors.email} />}
                </div>
                <div className="space-y-1">
                    <Input onChange={handleInputChange} name="password" type="password" placeholder="Password" className="w-full" />
                    {errors.password && <Error message={errors.password} />}
                </div>
                <div>
                  <Input onChange={handleInputChange} name="profilePic" type="file" accept="image/*" />
                  {errors.profilePic && <Error message={errors.profilePic} />}
                </div>
            </CardContent>
            <CardFooter>
                <Button type="submit" onClick={handleSignup}>
                    {loading ? <BeatLoader size={10} color="#36d7b7" /> : "Signup"}
                </Button>
            </CardFooter>
            </Card>
        </div>
    )
}

export default Signup