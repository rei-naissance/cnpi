import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { LinkIcon, Zap, Copy, Gauge, Terminal, ShieldCheck, Activity } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger)

const LandingPage = () => {
  const [url, setUrl] = useState("")
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)

  const handleShorten = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (url) navigate(`/auth?createNew=${url}`)
  }

  useGSAP(() => {
    // Ambient blob drift
    gsap.to(".ambient-blob-1", {
      x: 120,
      y: 60,
      scale: 1.15,
      duration: 10,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    })
    gsap.to(".ambient-blob-2", {
      x: -100,
      y: -60,
      scale: 1.2,
      duration: 13,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 1.5,
    })

    // Hero badge fades in first
    gsap.from(".hero-badge", {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      delay: 0.1,
    })

    // Hero words stagger in with 3D flip
    gsap.from(".hero-word", {
      y: 70,
      opacity: 0,
      rotationX: 30,
      duration: 0.9,
      stagger: 0.07,
      ease: "back.out(1.6)",
      delay: 0.3,
    })

    // Hero paragraph
    gsap.from(".hero-para", {
      y: 24,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      delay: 0.85,
    })

    // Form slides up
    gsap.from(".hero-form", {
      y: 30,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      delay: 1.05,
    })

    // Preview pill floats in then loops
    gsap.from(".link-preview-pill", {
      y: 16,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      delay: 1.3,
      onComplete: () => {
        gsap.to(".link-preview-pill", {
          y: -14,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        })
      },
    })

    // Stats section
    gsap.from(".stat-item", {
      scrollTrigger: { trigger: ".stats-section", start: "top 85%" },
      y: 40,
      opacity: 0,
      scale: 0.9,
      duration: 0.8,
      stagger: 0.1,
      ease: "back.out(1.7)",
    })

    // Features left copy
    gsap.from(".features-copy > *", {
      scrollTrigger: { trigger: ".features-section", start: "top 78%" },
      x: -40,
      opacity: 0,
      duration: 0.9,
      stagger: 0.15,
      ease: "power3.out",
    })

    // Feature cards cascade
    gsap.from(".feature-card", {
      scrollTrigger: { trigger: ".features-section", start: "top 72%" },
      y: 70,
      opacity: 0,
      scale: 0.95,
      duration: 1,
      stagger: 0.14,
      ease: "power3.out",
    })

    // CTA section
    gsap.from(".cta-inner > *", {
      scrollTrigger: { trigger: ".cta-section", start: "top 80%" },
      y: 40,
      opacity: 0,
      duration: 0.9,
      stagger: 0.15,
      ease: "power3.out",
    })

  }, { scope: containerRef })

  const handleInputFocus = () => {
    gsap.to(".hero-form", {
      scale: 1.015,
      borderColor: "rgba(0, 255, 194, 0.4)",
      boxShadow: "0 0 32px rgba(0, 255, 194, 0.12)",
      duration: 0.4,
      ease: "power2.out",
    })
  }

  const handleInputBlur = () => {
    gsap.to(".hero-form", {
      scale: 1,
      borderColor: "rgba(38, 38, 38, 1)",
      boxShadow: "0 4px 24px -1px rgba(0,0,0,0.4)",
      duration: 0.4,
      ease: "power2.out",
    })
  }

  return (
    <div ref={containerRef} className="flex flex-col w-full">
      {/* ─── Hero ─── */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 pb-20 pt-10 overflow-hidden">
        <div className="hero-gradient-cutoff" />
        <div className="ambient-blob ambient-blob-1 absolute w-[600px] h-[600px] -top-48 -left-48 bg-primary" />
        <div className="ambient-blob ambient-blob-2 absolute w-[600px] h-[600px] bottom-0 -right-48 bg-accent" />

        <div className="relative z-10 w-full max-w-4xl text-center flex flex-col gap-12 mt-10">
          <div className="flex flex-col gap-5">
            <span className="hero-badge text-xs font-mono text-primary uppercase tracking-[0.25em] font-bold">
              A student infrastructure project
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight text-foreground" style={{ perspective: '600px' }}>
              <span className="hero-word inline-block">Better</span>{' '}
              <span className="hero-word inline-block">links</span>{' '}
              <span className="hero-word inline-block">for</span>
              <br />
              <span className="hero-word inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary">everyday</span>{' '}
              <span className="hero-word inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary">sharing</span>
            </h1>
            <p className="hero-para max-w-xl mx-auto text-lg text-muted-foreground">
              A lightweight URL shortener built for speed, simplicity, and clean analytics. Built for learning and experimentation.
            </p>
          </div>

          {/* Shorten bar */}
          <form
            onSubmit={handleShorten}
            className="hero-form input-container glass-panel p-2 rounded-2xl flex flex-col md:flex-row items-center gap-2 max-w-3xl mx-auto w-full border border-border"
          >
            <div className="flex-1 w-full flex items-center px-6 gap-3">
              <LinkIcon className="text-muted-foreground w-5 h-5 flex-shrink-0" />
              <input
                className="w-full bg-transparent border-none outline-none focus:ring-0 text-foreground placeholder:text-muted-foreground/50 py-4 font-mono text-sm"
                placeholder="Paste a long link to shorten..."
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                required
              />
            </div>
            <button
              type="submit"
              className="btn-slice w-full md:w-auto bg-primary text-primary-foreground font-bold px-10 py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <span>Shorten</span>
              <Zap className="w-5 h-5 fill-current" />
            </button>
          </form>

          {/* Floating link preview */}
          <div className="flex flex-col items-center gap-3">
            <div className="link-preview-pill glass-panel px-6 py-3 rounded-full flex items-center gap-4 border border-dashed border-border opacity-70">
              <div className="flex items-center gap-1 font-mono">
                <span className="text-sm text-muted-foreground">cnpi.io/</span>
                <span className="text-sm text-primary font-bold">x7R9k</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <button type="button" className="flex items-center gap-1 text-primary text-sm font-semibold hover:opacity-80 transition-opacity">
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section className="stats-section border-y border-border bg-sidebar/50 backdrop-blur-sm">
        <div className="px-6 py-12 max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: 'Fast', label: 'Redirects' },
            { value: 'Simple', label: 'Dashboards' },
            { value: 'Custom', label: 'Short Links' },
            { value: 'Free', label: 'Always' },
          ].map(({ value, label }) => (
            <div key={label} className="stat-item flex flex-col gap-1">
              <span className="text-3xl font-extrabold text-foreground">{value}</span>
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="features-section px-6 py-32 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
          <div className="features-copy md:col-span-5 flex flex-col gap-6">
            <span className="text-xs font-bold font-mono text-secondary bg-secondary/10 px-4 py-1.5 rounded-full w-fit tracking-wider uppercase">
              Open & Experimental
            </span>
            <h2 className="text-4xl md:text-5xl text-foreground font-extrabold leading-tight">
              Simple tools that actually work.
            </h2>
            <p className="text-lg text-muted-foreground pr-8">
              No fluff, no enterprise jargon. Just a clean URL shortener built for everyday use while learning what goes into real infrastructure.
            </p>
          </div>

          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="feature-card glass-panel dark-gradient p-8 rounded-2xl flex flex-col gap-6 group cursor-default">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform duration-300">
                <Gauge className="text-primary w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">Fast Redirects</h3>
                <p className="text-sm text-muted-foreground">Links resolve quickly. Vercel edge handles the routing — no extra hops, no slowdowns.</p>
              </div>
            </div>

            <div className="feature-card glass-panel dark-gradient-alt p-8 rounded-2xl flex flex-col gap-6 group cursor-default">
              <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center border border-secondary/20 group-hover:scale-110 transition-transform duration-300">
                <Terminal className="text-secondary w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">Custom Short Links</h3>
                <p className="text-sm text-muted-foreground">Pick your own slug instead of a random string. Share links that actually make sense.</p>
              </div>
            </div>

            <div className="feature-card glass-panel p-8 rounded-2xl flex flex-col gap-6 group cursor-default">
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center border border-accent/20 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="text-accent w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">Supabase Auth</h3>
                <p className="text-sm text-muted-foreground">Sign in with email or Google. Your links stay private and tied to your account.</p>
              </div>
            </div>

            <div className="feature-card glass-panel p-8 rounded-2xl flex flex-col gap-6 group cursor-default">
              <div className="w-14 h-14 bg-destructive/10 rounded-xl flex items-center justify-center border border-destructive/20 group-hover:scale-110 transition-transform duration-300">
                <Activity className="text-destructive w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">Click Analytics</h3>
                <p className="text-sm text-muted-foreground">See where your clicks come from — device type, country, city. Simple dashboard, no noise.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="cta-section px-6 pb-32">
        <div className="max-w-7xl mx-auto glass-panel border border-border p-12 md:p-24 rounded-[2rem] text-center flex flex-col items-center gap-10 overflow-hidden relative">
          <div className="ambient-blob absolute top-0 right-0 w-64 h-64 bg-primary/20 -mr-32 -mt-32" />
          <div className="ambient-blob absolute bottom-0 left-0 w-64 h-64 bg-accent/20 -ml-32 -mb-32" />

          <div className="cta-inner relative z-10 flex flex-col items-center gap-8">
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
              Give it a shot.<br />It's free and takes 30 seconds.
            </h2>
            <button
              onClick={() => navigate('/auth')}
              className="btn-slice bg-primary text-primary-foreground px-10 py-5 rounded-full font-bold text-lg shadow-[0_0_30px_rgba(255,255,255,0.12)] hover:shadow-[0_0_50px_rgba(255,255,255,0.22)] transition-shadow duration-300"
            >
              <span>Create an Account</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
