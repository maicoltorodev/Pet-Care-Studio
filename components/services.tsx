"use client"
import { useBreakpoints } from "@/hooks/use-breakpoints"
import { ServicesMobile } from "./services/services-mobile"
import { ServicesTablet } from "./services/services-tablet"
import { ServicesDesktop } from "./services/services-desktop"

interface ContentItem {
  key: string
  value: string
}

interface ServiceItem {
  id?: string
  title: string
  icon: string
  image_url?: string
  accent_color?: string
  description: string
  features?: string[]
  price: string
}

export function Services({ content, services: initialServices }: { content: ContentItem[], services: ServiceItem[] }) {
  // Breakpoint management is purely CSS via display properties now

  const header = {
    title: content.find((c: ContentItem) => c.key === "services_title")?.value || "Cuidado experto para",
    highlight: content.find((c: ContentItem) => c.key === "services_highlight")?.value || "huellas exigentes",
    description: content.find((c: ContentItem) => c.key === "services_description")?.value || "Ofrecemos experiencias personalizadas diseñadas para la salud y belleza de tu mejor amigo."
  }

  const rawPhone = content.find((c: ContentItem) => c.key === "footer_phone")?.value || "573183868043"
  const cleanPhone = rawPhone.replace(/[^0-9]/g, '')
  const phone = cleanPhone || "573183868043"

  const services = initialServices || []

  return (
    <>
      <div className="block md:hidden">
        <ServicesMobile services={services} header={header} phone={phone} />
      </div>
      <div className="hidden md:block lg:hidden">
        <ServicesTablet services={services} header={header} phone={phone} />
      </div>
      <div className="hidden lg:block">
        <ServicesDesktop services={services} header={header} phone={phone} />
      </div>
    </>
  )
}

