"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

const navLinks = [
  { label: "Servicios", href: "#servicios" },
  { label: "Resultados", href: "#resultados" },
  { label: "Testimonios", href: "#testimonios" },
  { label: "Ubicación", href: "#ubicacion" },
]

interface ContentItem {
  key: string
  value: string
}

export function Navbar({ content }: { content: ContentItem[] }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (mobileOpen) {
      document.body.classList.add("mobile-menu-open")
      document.body.style.overflow = "hidden"
    } else {
      document.body.classList.remove("mobile-menu-open")
      document.body.style.overflow = "unset"
    }
  }, [mobileOpen])

  const handleNavClick = (href: string) => {
    setMobileOpen(false)
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: "smooth" })
  }

  const getContent = (key: string, fallback: string) => {
    return content.find(c => c.key === key)?.value || fallback
  }

  const siteName = getContent('site_name', 'Pet Care Studio')
  const logoUrl = getContent('site_logo_url', '/icons/logo.webp')

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${scrolled || mobileOpen
        ? "bg-background/80 backdrop-blur-xl py-4 shadow-2xl"
        : "bg-gradient-to-b from-black/60 to-transparent py-8"
        }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-12">
        {/* LOGO (Shared with responsive Logic) */}
        <button
          onClick={() => {
            setMobileOpen(false)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className="flex items-center gap-4 group"
        >
          <div className={`relative transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 ${scrolled ? "h-10 w-10" : "h-14 w-14"}`}>
            <Image
              src={logoUrl}
              alt={siteName}
              fill
              className="object-contain filter drop-shadow-2xl"
            />
          </div>
          <span className={`font-serif tracking-tight transition-all duration-700 text-left leading-none ${scrolled || mobileOpen ? "text-xl text-foreground" : "text-2xl text-white drop-shadow-lg"
            }`}>
            <span className="font-medium text-white">{siteName.split(' ')[0]}</span>{" "}
            <span className="opacity-100 text-primary">{siteName.split(' ').slice(1).join(' ')}</span>
          </span>
        </button>

        {/* ============================================================
            DESKTOP NAVIGATION (Hidden on Mobile)
            ============================================================ */}
        <div className="hidden items-center gap-12 md:flex">
          <div className="flex items-center gap-10">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`relative group text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-500 ${scrolled
                  ? "text-foreground/70 hover:text-foreground"
                  : "text-white/80 hover:text-white"
                  }`}
              >
                {link.label}
                <span className={`absolute -bottom-2 left-0 h-px w-0 transition-all duration-500 group-hover:w-full ${scrolled ? "bg-foreground" : "bg-white"}`} />
              </button>
            ))}
          </div>
          <Button
            onClick={() => handleNavClick("#ubicacion")}
            className={`group relative overflow-hidden rounded-full px-8 py-6 text-[11px] font-black tracking-[0.2em] uppercase transition-all duration-500 hover:scale-105 ${scrolled
              ? "bg-foreground text-background shadow-xl hover:shadow-2xl hover:shadow-foreground/20"
              : "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-primary hover:text-primary-foreground"
              }`}
          >
            <span className="relative z-10">Agendar Cita</span>
          </Button>
        </div>

        {/* ============================================================
            MOBILE TOGGLE BUTTON (Hidden on Desktop)
            ============================================================ */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`relative z-50 p-2 md:hidden transition-all duration-500 ${mobileOpen ? "text-foreground scale-110" : scrolled ? "text-foreground" : "text-white"
            }`}
          aria-label={mobileOpen ? "Cerrar menu" : "Abrir menu"}
        >
          {mobileOpen ? <X className="h-8 w-8" /> : <Menu className="h-7 w-7" />}
        </button>
      </nav>

      {/* ============================================================
          MOBILE SIDE-DRAWER MENU (Hidden on Desktop)
          ============================================================ */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-500 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setMobileOpen(false)}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" />

        <div
          className={`absolute right-0 top-0 h-full w-[85%] max-w-sm bg-card p-8 shadow-2xl border-l border-border/50 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex h-full flex-col justify-between">
            <div className="space-y-12">
              <div className="flex flex-col items-center gap-6 border-b border-border/50 pb-10 mt-16 text-center">
                <div className="relative h-16 w-16">
                  <Image src={logoUrl} alt="Logo" fill className="object-contain" />
                </div>
                <p className="font-serif text-2xl font-medium text-foreground leading-tight">
                  {siteName.split(' ')[0]} <span className="text-primary">{siteName.split(' ').slice(1).join(' ')}</span>
                </p>
              </div>

              <div className="flex flex-col items-center gap-8">
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className="group"
                  >
                    <span className="font-serif text-3xl text-foreground transition-all group-hover:text-primary">
                      {link.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <Button
                onClick={() => handleNavClick("#footer")}
                className="w-full rounded-full bg-foreground h-16 text-[11px] uppercase tracking-[0.3em] font-black text-background shadow-2xl transition-transform hover:scale-105"
              >
                Toca para Contactar
              </Button>

              <div className="flex flex-col items-center pt-6 border-t border-border/50 gap-4">
                <div className="flex gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                  ))}
                </div>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground text-center">
                  © {new Date().getFullYear()} {siteName}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

