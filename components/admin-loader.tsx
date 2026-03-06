"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

export function AdminLoader({
    logoUrl,
    className,
    isFullScreen = true,
    label
}: {
    logoUrl?: string,
    className?: string,
    isFullScreen?: boolean,
    label?: string
}) {
    const logo = logoUrl || "/images/logo.png"

    return (
        <div className={cn(
            "flex flex-col items-center justify-center overflow-hidden",
            isFullScreen ? "fixed inset-0 z-50 bg-background" : "relative w-full py-20",
            className
        )}>
            {/* Fondo decorativo radial */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl animate-pulse" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-accent/5 blur-2xl" />
            </div>

            {/* Logo con animación */}
            <div className={cn(
                "relative flex items-center justify-center",
                isFullScreen ? "scale-100" : "scale-75"
            )}>
                {/* Anillo exterior pulsante */}
                <div className="absolute w-96 h-96 rounded-full border-2 border-primary/30 animate-ping" style={{ animationDuration: '2s' }} />
                {/* Anillo medio */}
                <div className="absolute w-72 h-72 rounded-full border-2 border-primary/50 animate-pulse" style={{ animationDuration: '1.5s' }} />

                {/* Contenedor logo */}
                <div
                    className="relative w-52 h-52 flex items-center justify-center"
                    style={{ animation: 'adminLogoFloat 2.5s ease-in-out infinite' }}
                >
                    <Image
                        src={logo}
                        alt="Pet Care Studio"
                        fill
                        className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
                        priority
                    />
                </div>
            </div>

            {label && (
                <div className="mt-12 text-center space-y-4 relative z-10">
                    <p className="text-[12px] font-black uppercase tracking-[0.6em] text-white/40 animate-pulse italic-none">
                        {label}
                    </p>
                    <div className="flex items-center justify-center gap-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.3s]" />
                        <div className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.15s]" />
                        <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
                    </div>
                </div>
            )}

            {/* CSS keyframes */}
            <style>{`
                @keyframes adminLogoFloat {
                  0%, 100% { transform: translateY(0px) scale(1); filter: drop-shadow(0 10px 30px rgba(0,0,0,0.06)); }
                  50%       { transform: translateY(-8px) scale(1.02); filter: drop-shadow(0 24px 48px rgba(0,0,0,0.10)); }
                }
            `}</style>
        </div>
    )
}


