import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { TrustBanner } from "@/components/trust-banner"
import { TrustSection } from "@/components/trust-section"
import { Services } from "@/components/services"
import { BeforeAfter } from "@/components/before-after"
import { Testimonials } from "@/components/testimonials"
import { Location } from "@/components/location"
import { Footer } from "@/components/footer"
import { WhatsAppFab } from "@/components/whatsapp-fab"
import { supabase } from "@/lib/supabase"

export const dynamic = 'force-static' // ISR Strategy - We invalidate programmatically

// SIN revalidate por defecto - solo invalidación manual
// export const revalidate = 300 // ❌ Esto crea loop infinito con invalidaciones manuales

export default async function Home() {
  // Usar fetch con tags para caché granular
  const [contentResponse, servicesResponse, transResponse, testResponse] = await Promise.all([
    supabase.from("site_content").select("*"),
    supabase.from("services").select("*").order("order_index"),
    supabase.from("transformations").select("*").eq("is_visible", true).order("order_index"),
    supabase.from("testimonials").select("*").order("created_at", { ascending: false })
  ])

  const content = contentResponse.data || []
  const services = servicesResponse.data || []
  const transformations = transResponse.data || []
  const testimonials = testResponse.data || []

  return (
    <main className="min-h-screen">
      <Navbar content={content} />
      <Hero content={content} />
      <TrustBanner content={content} />
      <TrustSection content={content} />
      <BeforeAfter content={content} transformations={transformations} />
      <Services content={content} services={services} />
      <Testimonials content={content} testimonials={testimonials} />
      <Location content={content} />
      <Footer content={content} />
      <WhatsAppFab content={content} />
    </main>
  )
}

