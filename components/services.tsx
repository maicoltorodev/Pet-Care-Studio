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
  const { isMobile, isTablet, isDesktop } = useBreakpoints()

  const header = {
    title: content.find((c: ContentItem) => c.key === "services_title")?.value || "Cuidado experto para",
    highlight: content.find((c: ContentItem) => c.key === "services_highlight")?.value || "huellas exigentes",
    description: content.find((c: ContentItem) => c.key === "services_description")?.value || "Ofrecemos experiencias personalizadas diseñadas para la salud y belleza de tu mejor amigo."
  }

  const services = initialServices || []

  return (
    <>
      {isMobile && <ServicesMobile services={services} header={header} />}
      {isTablet && <ServicesTablet services={services} header={header} />}
      {isDesktop && <ServicesDesktop services={services} header={header} />}
    </>
  )
}

