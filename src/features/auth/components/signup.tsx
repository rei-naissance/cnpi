import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { BeatLoader } from 'react-spinners'
import Error from '@/shared/components/error'
import { useEffect, useState } from 'react'
import * as Yup from 'yup'
import useFetch from '@/shared/hooks/use-fetch'
import { signup } from '@/features/auth/api'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { urlState } from '@/context'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Upload, User } from 'lucide-react'

const step1Schema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
})

const stepVariants = {
  enter: (dir: number) => ({ x: dir * 32, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (dir: number) => ({ x: -dir * 32, opacity: 0 }),
}

const inputClass =
  'w-full h-11 bg-background/80 border-border rounded-lg px-4 font-mono text-sm placeholder:text-muted-foreground/35 focus-visible:ring-0 focus-visible:border-accent/60 transition-colors duration-150'

const labelClass = 'text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-0.5'

const Signup = () => {
  const [step, setStep] = useState<1 | 2>(1)
  const [stepDir, setStepDir] = useState(1)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    profilePic: null as File | null,
  })

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const longLink = searchParams.get('createNew')

  const { data, error, loading, func: fnSignup } = useFetch(signup)
  const { fetchUser } = urlState()

  useEffect(() => {
    if (error === null && data) {
      navigate(`/dashboard?createNew=${longLink ? `createNew=${longLink}` : ''}`)
      fetchUser()
    }
  }, [data, error])

  const goForward = async () => {
    setValidationErrors({})
    try {
      await step1Schema.validate(formData, { abortEarly: false })
      setStepDir(1)
      setStep(2)
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errs: Record<string, string> = {}
        err.inner.forEach((e) => { if (e.path) errs[e.path] = e.message })
        setValidationErrors(errs)
      }
    }
  }

  const goBack = () => {
    setStepDir(-1)
    setStep(1)
  }

  const handleSubmit = async (skipPic = false) => {
    await fnSignup({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      profilePic: skipPic ? null : formData.profilePic,
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((p) => ({ ...p, [name]: value }))
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFormData((p) => ({ ...p, profilePic: file }))
    const reader = new FileReader()
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-5">
      {error && <Error message={error.message} />}

      {/* Step progress pills */}
      <div className="flex items-center gap-2">
        <div className={`step-dot ${step === 1 ? 'active' : 'bg-accent/35'}`} />
        <div className={`step-dot ${step === 2 ? 'active' : ''}`} />
      </div>

      {/* Animated step container */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={stepDir}>
          {step === 1 ? (
            <motion.div
              key="step1"
              custom={stepDir}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.26, ease: [0.25, 1, 0.5, 1] }}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <label className={labelClass} htmlFor="su-name">Name</label>
                <div className="input-glow rounded-lg">
                  <Input
                    id="su-name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                {validationErrors.name && <Error message={validationErrors.name} />}
              </div>

              <div className="space-y-1.5">
                <label className={labelClass} htmlFor="su-email">Email</label>
                <div className="input-glow rounded-lg">
                  <Input
                    id="su-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                {validationErrors.email && <Error message={validationErrors.email} />}
              </div>

              <div className="space-y-1.5">
                <label className={labelClass} htmlFor="su-password">Password</label>
                <div className="input-glow rounded-lg">
                  <Input
                    id="su-password"
                    name="password"
                    type="password"
                    placeholder="Min. 8 characters"
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                {validationErrors.password && <Error message={validationErrors.password} />}
              </div>

              <Button
                className="btn-slice w-full h-11 mt-1 bg-accent text-accent-foreground font-bold rounded-lg shadow-[0_0_20px_rgba(0,255,194,0.18)] hover:shadow-[0_0_30px_rgba(0,255,194,0.32)] transition-shadow duration-300"
                onClick={goForward}
              >
                <span className="flex items-center justify-center gap-2 h-full w-full">
                  Continue <ArrowRight className="w-4 h-4" />
                </span>
              </Button>
            </motion.div>

          ) : (
            <motion.div
              key="step2"
              custom={stepDir}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.26, ease: [0.25, 1, 0.5, 1] }}
              className="flex flex-col gap-6"
            >
              <p className="text-sm text-muted-foreground text-center leading-relaxed">
                Add a profile picture — totally optional.<br />You can always change this later.
              </p>

              {/* Avatar upload */}
              <div className="flex flex-col items-center gap-3">
                <label htmlFor="avatar-upload" className="cursor-pointer group">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                    className="w-24 h-24 rounded-full border-2 border-dashed border-border group-hover:border-accent/50 transition-colors overflow-hidden flex items-center justify-center bg-card"
                  >
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 text-muted-foreground/40 group-hover:text-accent/50 transition-colors">
                        <User className="w-7 h-7" />
                        <Upload className="w-3 h-3" />
                      </div>
                    )}
                  </motion.div>
                  <input id="avatar-upload" type="file" accept="image/*" className="sr-only" onChange={handleFile} />
                </label>
                {avatarPreview && (
                  <button
                    type="button"
                    onClick={() => { setAvatarPreview(null); setFormData((p) => ({ ...p, profilePic: null })) }}
                    className="text-xs text-muted-foreground/50 hover:text-destructive/80 transition-colors"
                  >
                    Remove photo
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-2.5">
                <Button
                  className="btn-slice w-full h-11 bg-accent text-accent-foreground font-bold rounded-lg shadow-[0_0_20px_rgba(0,255,194,0.18)] hover:shadow-[0_0_30px_rgba(0,255,194,0.32)] transition-shadow duration-300"
                  onClick={() => handleSubmit(false)}
                  disabled={loading}
                >
                  <span className="flex items-center justify-center h-full w-full">
                    {loading ? <BeatLoader size={7} color="#050505" /> : 'Create Account'}
                  </span>
                </Button>

                {!formData.profilePic && (
                  <button
                    type="button"
                    onClick={() => handleSubmit(true)}
                    disabled={loading}
                    className="w-full h-11 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-all duration-200 disabled:opacity-50"
                  >
                    {loading ? <BeatLoader size={6} color="#b9cbc1" /> : 'Skip for now'}
                  </button>
                )}

                <button
                  type="button"
                  onClick={goBack}
                  className="text-xs text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors text-center py-1"
                >
                  ← Back
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Signup
