"use client"
import { useEffect, useState } from "react"

// Breakpoints estratégicos para segmentación clara
const TABLET_MIN_WIDTH = 768
const DESKTOP_MIN_WIDTH = 1024

export function useBreakpoints() {
    // Inicializar en falso para evitar 'hydration mismatch' en el primer render, 
    // pero idealmente en un componente real esto deberia resolverse velozmente 
    // en el effect.
    const [isMobile, setIsMobile] = useState<boolean>(false)
    const [isTablet, setIsTablet] = useState<boolean>(false)
    const [isDesktop, setIsDesktop] = useState<boolean>(false)

    useEffect(() => {
        const updateBreakpoints = () => {
            const width = window.innerWidth
            setIsMobile(width < TABLET_MIN_WIDTH)
            setIsTablet(width >= TABLET_MIN_WIDTH && width < DESKTOP_MIN_WIDTH)
            setIsDesktop(width >= DESKTOP_MIN_WIDTH)
        }

        // Ejecución inicial
        updateBreakpoints()

        window.addEventListener("resize", updateBreakpoints)
        return () => window.removeEventListener("resize", updateBreakpoints)
    }, [])

    return { isMobile, isTablet, isDesktop }
}
