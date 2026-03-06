/**
 * useIsMobile — Hook centralizado de detección de breakpoint mobile.
 *
 * Retorna `true` cuando el viewport es menor a 768px (tablet/phone).
 * Usa ResizeObserver/matchMedia para ser reactivo sin flicker de SSR.
 */
"use client"
import { useEffect, useState } from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile(): boolean {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)

        // Set initial value
        setIsMobile(mq.matches)

        mq.addEventListener("change", handler)
        return () => mq.removeEventListener("change", handler)
    }, [])

    return isMobile
}
