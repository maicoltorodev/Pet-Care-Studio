"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

import { useBreakpoints } from "@/hooks/use-breakpoints"
import { HeroMobile } from "./hero/hero-mobile"
import { HeroTablet } from "./hero/hero-tablet"
import { HeroDesktop } from "./hero/hero-desktop"

interface ContentItem {
  key: string
  value: string
}

export function Hero({ content }: { content: ContentItem[] }) {
  // Breakpoints check is now purely CSS-driven for structure. We only keep logic untouched.

  const foundTagline = content.find((c) => c.key === "site_tagline")?.value
  const foundDesc = content.find((c) => c.key === "footer_description")?.value
  const foundMedia = content.find((c) => c.key === "hero_media_url")?.value
  const foundCta = content.find((c) => c.key === "hero_button_text")?.value

  // Forzar inicio absoluto arriba del todo en la carga inicial
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
  }, [])

  const slogan = {
    main: foundTagline || "Amor incondicional para tu mascota",
    subtitle: foundDesc || "",
    media: foundMedia || "/video.mp4",
    cta: foundCta || "Agendar Experiencia",
    logo: "/icons/logo.webp"
  }
  const scrollToBooking = () => document.getElementById("footer")?.scrollIntoView({ behavior: "smooth" })

  return (
    <>
      <div className="block md:hidden">
        <HeroMobile slogan={slogan} scrollToBooking={scrollToBooking} />
      </div>
      <div className="hidden md:block lg:hidden">
        <HeroTablet slogan={slogan} scrollToBooking={scrollToBooking} />
      </div>
      <div className="hidden lg:block">
        <HeroDesktop slogan={slogan} scrollToBooking={scrollToBooking} />
      </div>
    </>
  )
}
