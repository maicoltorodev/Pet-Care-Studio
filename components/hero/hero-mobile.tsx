"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function HeroMobile({
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
        <section className="relative flex h-[100dvh] flex-col items-center justify-center px-4 overflow-hidden bg-black">
            {/* Background Media */}
            <div className="absolute inset-0 z-0">
                {isVideo ? (
                    <video ref={videoRef} autoPlay muted loop playsInline key={slogan.media}
                        className="h-full w-full object-cover opacity-60 contrast-125 saturate-50 transition-all duration-[2s] ease-in-out">
                        <source src={slogan.media} type="video/mp4" />
                    </video>
                ) : (
                    <Image src={slogan.media} alt="Hero background" fill
                        className="object-cover opacity-60 contrast-125 saturate-50 transition-all duration-[2s] ease-in-out" />
                )}
                {/* Vignette agresiva para mobile y gradient de piso */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.9)_100%)]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center w-full h-full justify-center mt-12">
                <div onClick={handleLogoClick} className="mb-6 mt-16 w-[200px] cursor-pointer animate-in fade-in zoom-in-95 duration-700">
                    <div className="relative aspect-square drop-shadow-2xl">
                        <Image src={slogan.logo} alt="Logo" fill className="object-contain" priority />
                    </div>
                </div>

                <h1 className="cinematic-heading-md text-white px-4 drop-shadow-md animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 leading-tight"
                    style={{ fontStyle: 'normal' }}>
                    {slogan.main}
                </h1>

                {/* Subtítulo (oculto en el orginal móvil, pero vamos a dejarlo disponible, más acotado si existe) */}
                {slogan.subtitle && (
                    <p className="mt-4 px-6 text-[15px] font-light text-white/60 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
                        {slogan.subtitle}
                    </p>
                )}

                <div className="mt-10 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
                    <Button onClick={scrollToBooking} size="lg"
                        className="group relative overflow-hidden bg-primary text-primary-foreground h-16 w-[280px] text-sm font-bold tracking-widest uppercase rounded-full shadow-lg shadow-primary/40 transition-transform active:scale-95">
                        <span className="relative z-10">{slogan.cta.split(' ')[0]}</span>
                        {/* Shimmer sweep effect */}
                        <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-[shimmer_3s_infinite]" />
                    </Button>
                </div>
            </div>

            <style>{`
                @keyframes shimmer {
                    100% { left: 200%; }
                }
            `}</style>
        </section>
    )
}
