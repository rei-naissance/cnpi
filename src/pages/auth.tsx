import { useNavigate, useSearchParams } from 'react-router-dom'
import Login from '@/features/auth/components/login'
import Signup from '@/features/auth/components/signup'
import { urlState } from '@/context'
import { useEffect, useRef, useState } from 'react'
import { Copy, LinkIcon } from 'lucide-react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { motion, AnimatePresence } from 'framer-motion'

type AuthMode = 'login' | 'signup'

const formVariants = {
  enter: (dir: number) => ({ x: dir * 36, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir: number) => ({ x: -dir * 36, opacity: 0 }),
}

const Auth = () => {
  const [searchParams] = useSearchParams()
  const longLink = searchParams.get('createNew')
  const navigate = useNavigate()
  const { isAuthenticated, loading } = urlState()
  const containerRef = useRef<HTMLDivElement>(null)

  const [mode, setMode] = useState<AuthMode>('login')
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate(`/dashboard?createNew=${longLink ? `createNew=${longLink}` : ''}`)
    }
  }, [isAuthenticated, loading])

  const switchMode = (next: AuthMode) => {
    if (next === mode) return
    setDirection(next === 'signup' ? 1 : -1)
    setMode(next)
  }

  /* One clean GSAP entrance — panels slide in, no looping GSAP */
  useGSAP(() => {
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from('.auth-left-panel', { x: -50, opacity: 0, duration: 0.85 })
      .from('.auth-right-content', { y: 28, opacity: 0, duration: 0.7 }, '-=0.5')
  }, { scope: containerRef })

  return (
    <div
      ref={containerRef}
      className="w-full flex flex-col lg:flex-row min-h-[calc(100vh-6rem)]"
    >
      {/* ═══ Left decorative panel ═══ */}
      <div className="auth-left-panel hidden lg:flex lg:w-[44%] xl:w-[42%] relative overflow-hidden border-r border-border">

        {/* Dot grid background */}
        <div className="dot-grid absolute inset-0 pointer-events-none" />

        {/* CSS-animated ambient blobs — no GSAP, no stutter */}
        <div className="auth-blob-1 ambient-blob absolute w-[380px] h-[380px] -top-28 -left-28 bg-accent" />
        <div className="auth-blob-2 ambient-blob absolute w-[320px] h-[320px] -bottom-20 -right-20 bg-primary/25" />

        {/* Content scaffold — brand top · copy center · stats bottom */}
        <div className="relative z-10 grid grid-rows-[auto_1fr_auto] w-full h-full px-10 py-10 xl:px-14 xl:py-12">

          {/* Brand */}
          <div>
            <span className="text-4xl font-extrabold text-primary tracking-tight leading-none">
              CNPI
            </span>
          </div>

          {/* Centre — fills remaining height, content vertically centered */}
          <div className="flex flex-col justify-center gap-7 py-8">
            <div className="flex flex-col gap-2.5">
              <span className="text-[11px] font-mono text-accent uppercase tracking-[0.28em]">
                A student project
              </span>
              <h2 className="text-3xl xl:text-[2.15rem] font-extrabold text-foreground leading-[1.12] tracking-tight">
                Better links for<br />everyday sharing.
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-[22rem]">
                Short links with clean analytics. Built for speed and simplicity — no enterprise fluff.
              </p>
            </div>

            {/* Floating link pill — CSS float animation */}
            <div className="auth-link-pill glass-panel px-5 py-2.5 rounded-full flex items-center gap-3.5 w-fit border border-dashed border-border/50 select-none">
              <LinkIcon className="w-3.5 h-3.5 text-muted-foreground/45 flex-shrink-0" />
              <div className="flex items-center gap-1 font-mono">
                <span className="text-sm text-muted-foreground/55">cnpi.io/</span>
                <span className="text-sm text-accent font-bold">x7R9k</span>
              </div>
              <div className="h-3.5 w-px bg-border flex-shrink-0" />
              <button
                type="button"
                className="flex items-center gap-1 text-accent/65 text-xs font-semibold hover:text-accent transition-colors"
              >
                <Copy className="w-3 h-3" />
                Copy
              </button>
            </div>
          </div>

          {/* Stats — always pinned to bottom */}
          <div className="border-t border-border/25 pt-7 flex items-center gap-9">
            {[
              { value: 'Fast',   label: 'Redirects' },
              { value: 'Simple', label: 'Analytics' },
              { value: 'Free',   label: 'Always' },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <span className="text-base font-extrabold text-foreground">{value}</span>
                <span className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-widest">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ Right form panel ═══ */}
      <div className="auth-right-content flex-1 flex flex-col items-center justify-center px-6 py-14 md:px-10 lg:px-14 relative">

        {/* Mobile-only ambient */}
        <div className="lg:hidden ambient-blob absolute w-[55vw] h-[55vw] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent opacity-[0.06]" />

        <div className="w-full max-w-sm flex flex-col gap-8 relative z-10">

          {/* Heading */}
          <div className="flex flex-col gap-1.5">
            <h1 className="font-extrabold text-3xl tracking-tight text-primary">
              {longLink ? 'Secure your link' : (mode === 'login' ? 'Welcome back' : 'Create account')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {longLink
                ? 'Sign in or sign up to track and manage your new short URL.'
                : mode === 'login'
                  ? 'Sign in to access your links and analytics.'
                  : 'Get started — it only takes a minute.'}
            </p>
          </div>

          {/* ── Mode toggle with Framer Motion sliding pill ── */}
          <div className="relative flex p-1 rounded-xl bg-background/50 border border-border">
            {/* Spring-animated pill */}
            <motion.div
              className="absolute top-1 bottom-1 rounded-lg bg-card border border-white/5 shadow-md"
              initial={false}
              animate={{
                left:  mode === 'login' ? '4px' : '50%',
                right: mode === 'login' ? '50%' : '4px',
              }}
              transition={{ type: 'spring', stiffness: 480, damping: 42 }}
            />
            {(['login', 'signup'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => switchMode(m)}
                className={`relative z-10 flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors duration-200 ${
                  mode === m ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/70'
                }`}
              >
                {m === 'login' ? 'Log in' : 'Sign up'}
              </button>
            ))}
          </div>

          {/* ── Directional form transition ── */}
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={mode}
                custom={direction}
                variants={formVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {mode === 'login' ? <Login /> : <Signup />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Legal note */}
          <p className="text-[11px] text-muted-foreground/35 text-center font-mono leading-relaxed">
            By continuing you agree to our{' '}
            <a href="#" className="hover:text-muted-foreground/60 transition-colors underline underline-offset-2">Terms</a>
            {' '}and{' '}
            <a href="#" className="hover:text-muted-foreground/60 transition-colors underline underline-offset-2">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Auth
