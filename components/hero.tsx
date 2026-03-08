"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface ContentItem {
  key: string
  value: string
}

export function Hero({ content }: { content: ContentItem[] }) {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const [logoClicks, setLogoClicks] = useState(0)

  const foundTagline = content.find((c) => c.key === "site_tagline")?.value
  const foundDesc = content.find((c) => c.key === "footer_description")?.value
  const foundMedia = content.find((c) => c.key === "hero_media_url")?.value
  const foundCta = content.find((c) => c.key === "hero_button_text")?.value
  const foundLogo = content.find((c) => c.key === "site_logo_url")?.value

  const slogan = {
    main: foundTagline || "Amor incondicional para tu mascota",
    subtitle: foundDesc || "",
    media: foundMedia || "/video.mp4",
    cta: foundCta || "Agendar Experiencia",
    logo: foundLogo || "/icons/logo.png"
  }

  // Reset clicks after 2s inactivity
  useEffect(() => {
    if (logoClicks === 0) return
    const timer = setTimeout(() => setLogoClicks(0), 2000)
    return () => clearTimeout(timer)
  }, [logoClicks])

  const handleLogoClick = () => {
    const next = logoClicks + 1
    if (next >= 7) { router.push("/admin/login"); setLogoClicks(0) }
    else setLogoClicks(next)
  }

  // Subtle parallax via CSS custom properties — no framer-motion
  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = 0.5

    const handleMouse = (e: MouseEvent) => {
      if (!logoRef.current) return
      const x = ((e.clientX / window.innerWidth) - 0.5) * 30
      const y = ((e.clientY / window.innerHeight) - 0.5) * 30
      logoRef.current.style.transform = `translate(${x}px, ${y}px)`
    }

    window.addEventListener("mousemove", handleMouse)
    return () => window.removeEventListener("mousemove", handleMouse)
  }, [])

  const scrollToBooking = () => document.getElementById("footer")?.scrollIntoView({ behavior: "smooth" })
  const isVideo = slogan.media.endsWith('.mp4') || slogan.media.includes('video')

  return (
    <section className="relative flex h-screen flex-col items-center justify-center px-4 overflow-hidden bg-background">
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        {isVideo ? (
          <video ref={videoRef} autoPlay muted loop playsInline key={slogan.media}
            className="h-full w-full object-cover opacity-50 contrast-125 saturate-50 transition-all duration-[2s] ease-in-out">
            <source src={slogan.media} type="video/mp4" />
          </video>
        ) : (
          <Image src={slogan.media} alt="Hero background" fill
            className="object-cover opacity-50 contrast-125 saturate-50 transition-all duration-[2s] ease-in-out scale-105" />
        )}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/20 to-background/90" />
      </div>

      {/* MOBILE */}
      <div className="relative z-10 flex flex-col items-center text-center md:hidden w-full h-full justify-center mt-12">
        <div onClick={handleLogoClick} className="mb-6 mt-24 w-[230px] cursor-pointer animate-in fade-in zoom-in-95 duration-700">
          <div className="floating-element">
            <div className="relative aspect-square drop-shadow-2xl">
              <Image src={slogan.logo} alt="Logo" fill className="object-contain" priority />
            </div>
          </div>
        </div>

        <h1 className="cinematic-heading-md text-white px-6 drop-shadow-md animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300"
          style={{ fontStyle: 'normal' }}>
          {slogan.main}
        </h1>

        <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
          <Button onClick={scrollToBooking} size="lg"
            className="group relative overflow-hidden bg-primary text-primary-foreground h-14 px-10 text-sm font-bold tracking-widest uppercase rounded-full shadow-lg shadow-primary/40 transition-all hover:scale-105 hover:bg-accent hover:text-accent-foreground">
            <span className="relative z-10">{slogan.cta.split(' ')[0]}</span>
            <div className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-0" />
          </Button>
        </div>
      </div>

      {/* DESKTOP */}
      <div className="relative z-10 hidden md:flex flex-col items-center justify-center text-center max-w-7xl mx-auto h-full w-full">
        {/* Logo with CSS parallax */}
        <div ref={logoRef} onClick={handleLogoClick}
          className="mb-8 mt-24 w-[450px] cursor-pointer transition-transform duration-300 ease-out animate-in fade-in zoom-in-95 duration-1000">
          <div className="floating-element">
            <div className="relative aspect-square drop-shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
              <Image src={slogan.logo} alt="Logo" fill className="object-contain" priority />
            </div>
          </div>
        </div>

        <div className="space-y-8 flex flex-col items-center w-full max-w-4xl mx-auto relative">
          <h1 className="cinematic-heading-lg text-white drop-shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300"
            style={{ fontStyle: 'normal' }}>
            {slogan.main}
          </h1>

          {slogan.subtitle && (
            <p className="max-w-2xl mx-auto text-xl font-light text-white/70 leading-relaxed tracking-wide animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
              {slogan.subtitle}
            </p>
          )}

          <div className="flex items-center justify-center gap-10 pt-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700">
            <Button onClick={scrollToBooking}
              className="group relative overflow-hidden bg-foreground text-background hover:bg-transparent hover:text-white border-2 border-transparent hover:border-white h-16 px-12 text-sm font-black tracking-[0.2em] uppercase rounded-full shadow-2xl transition-all duration-500 hover:scale-105">
              <span className="relative z-10">{slogan.cta}</span>
              <div className="absolute inset-0 bg-primary translate-y-[100%] transition-transform duration-500 group-hover:translate-y-0" />
            </Button>

            <button
              onClick={() => document.getElementById("servicios")?.scrollIntoView({ behavior: "smooth" })}
              className="group flex items-center gap-3 text-xs font-black uppercase tracking-[0.4em] text-white/60 hover:text-white transition-colors duration-300">
              Descubrir
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
