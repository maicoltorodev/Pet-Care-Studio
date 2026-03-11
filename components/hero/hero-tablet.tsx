"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function HeroTablet({
    slogan,
    scrollToBooking
}: {
    slogan: any,
    scrollToBooking: () => void
}) {
    const router = useRouter()
    const videoRef = useRef<HTMLVideoElement>(null)
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
    }, [])

    const isVideo = slogan.media?.endsWith('.mp4') || slogan.media?.includes('video')

    return (
        <section className="relative flex min-h-[100svh] lg:min-h-[800px] flex-col overflow-hidden bg-background">
            {/* Background Media — en tablet podemos hacerlo sutilmente off-center o asimétrico si el video lo permite, de lo contrario base parallax */}
            <div className="absolute inset-0 z-0">
                {isVideo ? (
                    <video ref={videoRef} autoPlay muted loop playsInline key={slogan.media}
                        className="h-full w-full object-cover opacity-50 contrast-125 saturate-50 transition-all duration-[2s] ease-in-out">
                        <source src={slogan.media} type="video/mp4" />
                    </video>
                ) : (
                    <Image src={slogan.media} alt="Hero background" fill
                        className="object-cover opacity-50 contrast-125 saturate-50 transition-all duration-[2s] ease-in-out" />
                )}
                {/* Vignette estilo viñeta teatral para guiar la vista hacia el contenido */}
                <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-background/90" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background/95" />
            </div>

            {/* Grid 12 columnas estilo asimétrico para tablet */}
            <div className="relative z-10 grid grid-cols-12 h-full w-full max-w-7xl mx-auto px-8 gap-6 pt-20">
                
                {/* Columna Izquierda — Titular + CTA */}
                <div className="col-span-8 flex flex-col justify-center h-full pb-20">
                    <h1 className="font-serif text-[65px] leading-[1.05] tracking-tight text-white drop-shadow-xl animate-in fade-in slide-in-from-left-8 duration-1000 delay-300"
                        style={{ fontStyle: 'normal' }}>
                        {slogan.main}
                    </h1>

                    {slogan.subtitle && (
                        <p className="mt-8 text-xl font-light text-white/70 leading-relaxed max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
                            {slogan.subtitle}
                        </p>
                    )}

                    <div className="mt-12 flex items-center gap-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700">
                        <Button onClick={scrollToBooking}
                            className="group relative overflow-hidden bg-primary text-white border-none h-16 w-64 text-sm font-black tracking-[0.2em] uppercase rounded-xl shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                            <span className="relative z-10">{slogan.cta}</span>
                            <div className="absolute inset-0 bg-white/20 -translate-x-full transition-transform duration-700 ease-out group-hover:translate-x-0 skew-x-12" />
                        </Button>
                    </div>
                </div>

                {/* Columna Derecha — Logo Vertical flotante, compensado hacia arriba */}
                <div className="col-span-4 flex flex-col items-center justify-start h-full px-0 pt-0">
                    <div onClick={handleLogoClick}
                        className="w-[700px] -ml-48 -mt-12 cursor-pointer animate-in fade-in zoom-in-95 duration-1000 delay-200">
                        <div className="floating-element" style={{ animationDuration: '8s' }}>
                            <div className="relative aspect-square drop-shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
                                <Image src={slogan.logo} alt="Logo" fill className="object-contain scale-[1.7]" priority />
                            </div>
                        </div>
                    </div>
                    
                    {/* Elemento de estética tech sutil en tablet */}
                    <div className="mt-20 flex flex-col items-center opacity-60">
                        <div className="h-24 w-px bg-gradient-to-b from-primary/80 to-transparent" />
                        <span className="mt-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/40 rotate-180" style={{ writingMode: 'vertical-rl' }}>
                            Experiencia Grado Elite
                        </span>
                    </div>
                </div>
            </div>
        </section>
    )
}
