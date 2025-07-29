import { urlState } from "@/context"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import Error from "./error"
import { Card } from "./ui/card"
import { useState, useRef, useEffect } from "react"
import * as Yup from "yup"
import { QRCode } from "react-qrcode-logo"
import { QRCode as QRCodeType } from "react-qrcode-logo"
import cnpiLogo from "../../public/cnpi-logo-gold.png"
import useFetch from "@/hooks/use-fetch"
import { createUrl } from "@/utils/apiUrls"
import { FormErrors } from "@/utils/interfaces"

const CreateLink = () => {

    const {user} = urlState()
    const navigate = useNavigate()

    const ref = useRef<QRCodeType>(null)

    let [searchParams, setSearchParams] = useSearchParams()
    const longLink = searchParams.get("createNew")

    const [errors, setErrors] = useState<FormErrors>({})
    const [formValues, setFormValues] = useState({
        title: "",
        longUrl: longLink ? longLink : "",
        customUrl: ""
    })

    const validationSchema = Yup.object().shape({
        title: Yup.string()
            .required("Title is required"),
        longUrl: Yup.string()
            .url("Invalid URL")
            .required("Long URL is required"),
        customUrl: Yup.string(),
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({
            ...formValues,
            [e.target.name]: e.target.value
        })
    }

    const {
        loading,
        error,
        data, 
        func: fnCreateUrl
    } = useFetch(createUrl, {
        title: formValues.title,
        longUrl: formValues.longUrl,
        customUrl: formValues.customUrl,
        user_id: user.id
    })

    const createNewUrl = async () => {
        setErrors({})
        try {
            await validationSchema.validate(formValues, {abortEarly: false})

            const qrContainer = document.querySelector('.qr-code-container');
            if (!qrContainer) {
                setErrors({message: 'QR Code container not found'});
                return;
            }

            const canvas = qrContainer?.querySelector("canvas");
            if (!canvas) {
                setErrors({message: 'Failed to get canvas from QR code'});
                return;
            }

            const blob = await new Promise<Blob | null>((resolve) => 
                canvas?.toBlob((blob) => resolve(blob))
            );

            if (!blob) {
                setErrors({message: 'Failed to create blob from canvas'});
                return;
            }
            
            const file = new File([blob], "qr.png", {type: "image/png"})
            await fnCreateUrl(file);
        } catch (error: any) {
            const newErrors: FormErrors = {}

            if (error?.inner) {
                error.inner.forEach((err: any) => {
                    newErrors[err.path as keyof FormErrors] = err.message
                })
            } else {
                newErrors.message = error?.message || 'An error occurred'
            }

            setErrors(newErrors)
        }
    }

    useEffect(() => {
        if (error === null && data) {
            navigate(`/link/${data[0].id}`)
        }
    }, [error, data])

    return (
            <Dialog 
                defaultOpen={!!longLink}
                onOpenChange={(open) => {
                    if (!open) {
                        setSearchParams({})
                    }
                }}>
                <DialogTrigger asChild>
                    <Button variant="destructive">
                        Generate New Link
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Generate New</DialogTitle>
                    </DialogHeader>

                    <div className="qr-code-container">
                    {formValues?.longUrl && (
                        <QRCode value={formValues.longUrl}
                            logoImage={cnpiLogo}
                            logoWidth={150}
                            logoHeight={150}
                            size={350}
                            ref={ref}  
                            bgColor="#fffbea"
                            fgColor="#2c2c2c"
                        />
                    )}
                    </div>

                    <Input
                        id="title"
                        name="title"
                        value={formValues.title}
                        onChange={handleChange}
                        placeholder="Enter title" />
                    {errors.title && <Error message={errors.title} />}
                    <Input
                        id="longUrl"
                        name="longUrl"
                        value={formValues.longUrl}
                        onChange={handleChange}
                        placeholder="Enter looooooooooong URL" />
                    {errors.longUrl && <Error message={errors.longUrl} />}
                    <div className="flex items-center gap-2">
                        <Card className="p-2">cnpi.in/</Card> /
                        <Input
                            id="customUrl"
                            name="customUrl"
                            value={formValues.customUrl}
                            onChange={handleChange}
                            placeholder="Custom Link (optional)" />
                    </div>
                    {errors.customUrl && <Error message={errors.customUrl} />}
                    <DialogFooter className="sm:justify-start">
                        <Button variant="destructive" onClick={createNewUrl}>Generate</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
    )
}

export default CreateLink