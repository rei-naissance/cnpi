import { urlState } from '@/context'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Error from '@/shared/components/error'
import { useState, useRef, useEffect } from 'react'
import * as Yup from 'yup'
import { QRCode } from 'react-qrcode-logo'
import type { QRCode as QRCodeType } from 'react-qrcode-logo'
import cnpiLogo from '../../../../public/cnpi-logo-gold.png'
import useFetch from '@/shared/hooks/use-fetch'
import { createUrl, generateTitle } from '@/features/links/api'
import type { FormErrors } from '@/types'
import { Sparkles } from 'lucide-react'

const createLinkSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  longUrl: Yup.string().url('Invalid URL').required('Long URL is required'),
  customUrl: Yup.string(),
})

const CreateLink = () => {
  const { user } = urlState()
  const navigate = useNavigate()
  const ref = useRef<QRCodeType>(null)

  const [searchParams, setSearchParams] = useSearchParams()
  const longLink = searchParams.get('createNew')

  const [errors, setErrors] = useState<FormErrors>({})
  const [formValues, setFormValues] = useState({
    title: '',
    longUrl: longLink ?? '',
    customUrl: '',
  })

  const { error, data, func: fnCreateUrl } = useFetch(createUrl)
  const { loading: loadingSuggest, data: suggestedTitle, func: fnSuggestTitle } = useFetch(generateTitle)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSuggestTitle = async () => {
    if (formValues.longUrl) {
      setErrors((prev) => ({ ...prev, message: undefined }))
      await fnSuggestTitle(formValues.longUrl)
    }
  }

  useEffect(() => {
    if (suggestedTitle) {
      setFormValues((prev) => ({ ...prev, title: suggestedTitle }))
    }
  }, [suggestedTitle])

  const createNewUrl = async () => {
    setErrors({})
    try {
      await createLinkSchema.validate(formValues, { abortEarly: false })

      const canvas = document
        .querySelector('.qr-code-container')
        ?.querySelector('canvas')

      if (!canvas) {
        setErrors({ message: 'Failed to get QR code canvas' })
        return
      }

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b))
      )

      if (!blob) {
        setErrors({ message: 'Failed to create blob from canvas' })
        return
      }

      await fnCreateUrl(
        {
          title: formValues.title,
          longUrl: formValues.longUrl,
          customUrl: formValues.customUrl,
          user_id: user?.id ?? '',
        },
        new File([blob], 'qr.png', { type: 'image/png' })
      )
    } catch (err: unknown) {
      if (err instanceof Yup.ValidationError) {
        const newErrors: FormErrors = {}
        err.inner.forEach((e) => {
          if (e.path) newErrors[e.path as keyof FormErrors] = e.message
        })
        setErrors(newErrors)
      } else {
        setErrors({ message: 'An error occurred' })
      }
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
        if (!open) setSearchParams({})
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className="btn-slice border-border bg-background/50 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors font-bold">
          <span className="flex items-center justify-center w-full h-full">Generate New Link</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card/60 backdrop-blur-xl border border-border text-foreground shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <DialogHeader>
          <DialogTitle className="font-extrabold tracking-tight">Generate New</DialogTitle>
        </DialogHeader>

        <div className="qr-code-container flex justify-center bg-white p-2 rounded-xl mx-auto w-fit">
          {formValues.longUrl && (
            <QRCode
              ref={ref}
              value={formValues.longUrl}
              logoImage={cnpiLogo}
              logoWidth={150}
              logoHeight={150}
              size={350}
              bgColor="#ffffff"
              fgColor="#050505"
            />
          )}
        </div>

        <div className="flex gap-2">
          <Input
            id="title"
            name="title"
            value={formValues.title}
            onChange={handleChange}
            placeholder="Enter title"
            className="flex-1 bg-background border-border font-mono text-sm placeholder:text-muted-foreground/40 focus-visible:ring-1 focus-visible:ring-accent focus-visible:border-accent"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleSuggestTitle}
            disabled={!formValues.longUrl || loadingSuggest}
            title="Suggest title with AI"
            className="border-border hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Sparkles className="h-4 w-4" />
          </Button>
        </div>
        {errors.title && <Error message={errors.title} />}

        <Input
          id="longUrl"
          name="longUrl"
          value={formValues.longUrl}
          onChange={handleChange}
          placeholder="Enter long URL"
          className="bg-background border-border font-mono text-sm placeholder:text-muted-foreground/40 focus-visible:ring-1 focus-visible:ring-accent focus-visible:border-accent"
        />
        {errors.longUrl && <Error message={errors.longUrl} />}

        <div className="flex items-center gap-2">
          <div className="p-2 border border-border bg-muted/50 rounded-lg text-muted-foreground font-mono text-sm flex-none">cnpi.io/</div>
          <Input
            id="customUrl"
            name="customUrl"
            value={formValues.customUrl}
            onChange={handleChange}
            placeholder="Custom link (optional)"
            className="flex-1 bg-background border-border font-mono text-sm placeholder:text-muted-foreground/40 focus-visible:ring-1 focus-visible:ring-accent focus-visible:border-accent"
          />
        </div>
        {errors.customUrl && <Error message={errors.customUrl} />}
        {errors.message && <Error message={errors.message} />}

        <DialogFooter className="sm:justify-start pt-4">
          <Button className="btn-slice w-full bg-accent text-accent-foreground font-bold hover:brightness-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(0,255,194,0.15)]" onClick={createNewUrl}>
            <span className="flex items-center justify-center w-full h-full">Generate</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateLink
