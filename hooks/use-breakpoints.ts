"use client"
import { useEffect, useState } from "react"

// Breakpoints estratégicos para segmentación clara
const TABLET_MIN_WIDTH = 768
const DESKTOP_MIN_WIDTH = 1024

export function useBreakpoints() {
    const [isMobile, setIsMobile] = useState<boolean>(false)
    const [isTablet, setIsTablet] = useState<boolean>(false)
    const [isDesktop, setIsDesktop] = useState<boolean>(false)
    const [isTouch, setIsTouch] = useState<boolean>(false) // Flag de capabilities independiente

    useEffect(() => {
        const updateBreakpoints = () => {
            const width = window.innerWidth
            
            // 1. Sistema de Layout (Basado en dimensiones - 3 vías)
            setIsMobile(width < TABLET_MIN_WIDTH)
            setIsTablet(width >= TABLET_MIN_WIDTH && width < DESKTOP_MIN_WIDTH)
            setIsDesktop(width >= DESKTOP_MIN_WIDTH)

            // 2. Capabilities de Hardware (Táctil vs Puntero Fino) independientemente del tamaño
            const isTouchPrimary = window.matchMedia("(any-pointer: coarse)").matches
            setIsTouch(isTouchPrimary)
        }

        // Ejecución inicial
        updateBreakpoints()

        window.addEventListener("resize", updateBreakpoints)
        window.matchMedia("(any-pointer: coarse)").addEventListener("change", updateBreakpoints)
        
        return () => {
            window.removeEventListener("resize", updateBreakpoints)
            window.matchMedia("(any-pointer: coarse)").removeEventListener("change", updateBreakpoints)
        }
    }, [])

    return { isMobile, isTablet, isDesktop, isTouch }
}
