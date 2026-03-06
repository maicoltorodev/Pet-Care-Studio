"use client"

import { useEffect, useRef, useState } from "react"
import { PawPrint } from "lucide-react"

export function CustomCursor() {
    const [isMobile, setIsMobile] = useState(true) // default true to avoid SSR flash
    const [isHovering, setIsHovering] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const cursorRef = useRef<HTMLDivElement>(null)
    const posRef = useRef({ x: -100, y: -100 })
    const rafRef = useRef<number>(0)

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 1024 || 'ontouchstart' in window
            setIsMobile(mobile)
            document.body.classList.toggle("has-custom-cursor", !mobile)
        }

        checkMobile()
        window.addEventListener("resize", checkMobile)

        const moveCursor = (e: MouseEvent) => {
            posRef.current = { x: e.clientX, y: e.clientY }
            setIsVisible(true)
        }

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            const isInteractive =
                target.tagName === "BUTTON" ||
                target.tagName === "A" ||
                !!target.closest("button") ||
                !!target.closest("a") ||
                target.classList.contains("cursor-pointer")
            setIsHovering(isInteractive)
        }

        // RAF loop for smooth cursor — no framer-motion needed
        const loop = () => {
            if (cursorRef.current) {
                cursorRef.current.style.transform =
                    `translate(${posRef.current.x}px, ${posRef.current.y}px) translate(-50%, -50%)`
            }
            rafRef.current = requestAnimationFrame(loop)
        }
        rafRef.current = requestAnimationFrame(loop)

        window.addEventListener("mousemove", moveCursor)
        window.addEventListener("mouseover", handleMouseOver)
        document.addEventListener("mouseleave", () => setIsVisible(false))
        document.addEventListener("mouseenter", () => setIsVisible(true))

        return () => {
            window.removeEventListener("resize", checkMobile)
            window.removeEventListener("mousemove", moveCursor)
            window.removeEventListener("mouseover", handleMouseOver)
            document.body.classList.remove("has-custom-cursor")
            cancelAnimationFrame(rafRef.current)
        }
    }, [])

    if (isMobile) return null

    return (
        <div
            ref={cursorRef}
            className="pointer-events-none fixed left-0 top-0 z-[10000] mix-blend-difference will-change-transform transition-opacity duration-300"
            style={{ opacity: isVisible ? 1 : 0 }}
        >
            <div
                className="transition-transform duration-200"
                style={{
                    transform: isHovering ? 'scale(1.5) scaleX(-1) rotate(-15deg)' : 'scale(1) scaleX(-1)'
                }}
            >
                <PawPrint className="h-8 w-8 text-white" />
            </div>
        </div>
    )
}
