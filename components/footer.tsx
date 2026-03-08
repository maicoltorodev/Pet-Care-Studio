"use client"

import Image from "next/image"
import { Instagram, Facebook, MapPin, Phone, Mail, ArrowUpRight, Youtube, Twitter } from "lucide-react"

// Icono TikTok SVG personalizado (no está en lucide)
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
    </svg>
  )
}

// Icono WhatsApp SVG personalizado
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

const SOCIAL_NETWORKS = [
  { key: 'instagram', label: 'Instagram', Icon: Instagram, color: 'hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500' },
  { key: 'facebook', label: 'Facebook', Icon: Facebook, color: 'hover:bg-blue-600' },
  { key: 'whatsapp', label: 'WhatsApp', Icon: WhatsAppIcon, color: 'hover:bg-green-500' },
  { key: 'tiktok', label: 'TikTok', Icon: TikTokIcon, color: 'hover:bg-black' },
  { key: 'youtube', label: 'YouTube', Icon: Youtube, color: 'hover:bg-red-600' },
  { key: 'twitter', label: 'Twitter/X', Icon: Twitter, color: 'hover:bg-black' },
]

interface ContentItem {
  key: string
  value: string
}

export function Footer({ content }: { content: ContentItem[] }) {
  const currentYear = new Date().getFullYear()

  const getContent = (key: string, fallback: string) => {
    return content.find((c: ContentItem) => c.key === key)?.value || fallback
  }

  const siteName = getContent('site_name', 'Pet Care Studio')
  const tagline = getContent('site_tagline', 'Estética Canina de Alta Gama')
  const logoUrl = getContent('site_logo_url', '/icons/logo.png')
  const description = getContent('footer_description', 'Elevamos el estándar de la estética canina a una experiencia de lujo y bienestar completo para tu mascota.')
  const address = getContent('footer_address', 'CRA 15 no.118 78, Bogotá')
  const phone = getContent('footer_phone', '318 386 8043')
  const email = getContent('footer_email', 'hola@petcarestudio.com')
  const emailEnabled = getContent('footer_email_enabled', 'true') === 'true'

  // Filtrar redes sociales activas dinámicamente
  const activeSocials = SOCIAL_NETWORKS.filter(
    (net) => getContent(`social_${net.key}_enabled`, 'false') === 'true'
  )

  const quickLinks = [
    { label: "Nuestros Servicios", href: "#servicios" },
    { label: "Resultados Reales", href: "#resultados" },
    { label: "Comunidad", href: "#testimonios" },
    { label: "Agendar Cita", href: "#footer" },
  ]

  return (
    <footer id="footer" className="relative bg-background border-t border-border/20 overflow-hidden selection:bg-primary/20">
      {/* Cinematic Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/5 cinematic-glow" />

      <div className="mx-auto max-w-7xl px-6 py-20 lg:py-32 relative z-10">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-12">

          {/* Brand Identity Section */}
          <div className="lg:col-span-5 space-y-10">
            <div className="flex items-center gap-6">
              <div className="relative h-20 w-20">
                <Image
                  src={logoUrl}
                  alt={siteName}
                  fill
                  className="object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                />
              </div>
              <div className="flex flex-col">
                <p className="font-serif text-4xl font-medium tracking-tight text-foreground leading-none mb-2">
                  {siteName.split(' ')[0]} <span className="text-primary ">{siteName.split(' ').slice(1).join(' ')}</span>
                </p>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60">
                  {tagline}
                </p>
              </div>
            </div>

            <p className="max-w-md text-lg font-light leading-relaxed text-muted-foreground">
              {description}
            </p>

            {/* Redes sociales dinámicas */}
            {activeSocials.length > 0 && (
              <div className="flex flex-wrap gap-4 pt-4">
                {activeSocials.map(({ key, label, Icon, color }) => {
                  const url = getContent(`social_${key}_url`, '#')
                  return (
                    <a
                      key={key}
                      href={url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={label}
                      className={`group relative flex h-14 w-14 items-center justify-center rounded-full bg-secondary/30 border border-border/40 text-foreground/70 transition-all duration-500 hover:text-white hover:border-transparent ${color} shadow-[0_0_20px_-5px_rgba(0,0,0,0.5)]`}
                    >
                      <Icon className="relative z-10 h-5 w-5 transition-transform duration-500 group-hover:scale-110" />
                    </a>
                  )
                })}
              </div>
            )}
          </div>

          {/* Navigation Links Column */}
          <div className="lg:col-span-3 space-y-10 lg:pl-10">
            <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/50">Navegación</h4>
            <ul className="space-y-6">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="group flex items-center gap-3 text-muted-foreground transition-all duration-300 hover:text-white text-lg font-medium"
                  >
                    <span className="relative">
                      {link.label}
                      <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-500 group-hover:w-full" />
                    </span>
                    <ArrowUpRight className="h-4 w-4 opacity-0 -translate-y-2 translate-x-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="lg:col-span-4 space-y-10">
            <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/50">Contacto</h4>
            <div className="space-y-8">
              <div className="flex gap-6 items-start group">
                <div className="h-12 w-12 shrink-0 rounded-2xl bg-secondary/30 backdrop-blur-md border border-border/40 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-500 shadow-lg">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 mb-2">Dirección</p>
                  <p className="text-lg font-medium text-foreground tracking-wide">{address}</p>
                </div>
              </div>

              <div className="flex gap-6 items-start group">
                <div className="h-12 w-12 shrink-0 rounded-2xl bg-secondary/30 backdrop-blur-md border border-border/40 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-500 shadow-lg">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 mb-2">WhatsApp / Teléfono</p>
                  <p className="text-lg font-medium text-foreground tracking-wide">{phone}</p>
                </div>
              </div>

              {emailEnabled && (
                <div className="flex gap-6 items-start group">
                  <div className="h-12 w-12 shrink-0 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-500 shadow-lg">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">Correo Electrónico</p>
                    <p className="text-lg font-medium text-foreground tracking-wide">{email}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border/20 py-8 px-6 bg-secondary/20">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 text-center md:text-left">
            &copy; {currentYear} {siteName.toUpperCase()} <span className="opacity-50 mx-2">|</span> Todos los derechos reservados
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 hover:text-white transition-colors">Privacidad</a>
            <a href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 hover:text-white transition-colors">Accesibilidad</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

