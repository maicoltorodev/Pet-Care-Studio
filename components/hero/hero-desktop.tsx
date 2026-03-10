"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function HeroDesktop({
    slogan,
    scrollToBooking
}: {
    slogan: any,
    scrollToBooking: () => void
}) {
    const router = useRouter()
    const videoRef = useRef<HTMLVideoElement>(null)
    const logoRef = useRef<HTMLDivElement>(null)
    const [logoClicks, setLogoClicks] = useState(0)

    const handleLogoClick = () => {
        const next = logoClicks + 1
        if (next >= 7) { router.push("/admin/login"); setLogoClicks(0) }
        else setLogoClicks(next)
    }

    // Reset clicks after 2s inactivity
    useEffect(() => {
        if (logoClicks === 0) return
        const timer = setTimeout(() => setLogoClicks(0), 2000)
        return () => clearTimeout(timer)
    }, [logoClicks])

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

    const isVideo = slogan.media?.endsWith('.mp4') || slogan.media?.includes('video')

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

            <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-7xl mx-auto h-full w-full">
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
