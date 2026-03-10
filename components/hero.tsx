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
  const { isMobile, isTablet, isDesktop } = useBreakpoints()

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
    logo: foundLogo || "/icons/logo.webp"
  }
  const scrollToBooking = () => document.getElementById("footer")?.scrollIntoView({ behavior: "smooth" })

  return (
    <>
      {isMobile && <HeroMobile slogan={slogan} scrollToBooking={scrollToBooking} />}
      {isTablet && <HeroTablet slogan={slogan} scrollToBooking={scrollToBooking} />}
      {isDesktop && <HeroDesktop slogan={slogan} scrollToBooking={scrollToBooking} />}
    </>
  )
}
