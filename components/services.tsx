import Image from "next/image"
import {
  Scissors, Waves, Sparkles, ShowerHead as Shower, HeartPulse, Bath, LucideIcon, DollarSign,
  Wind, Stethoscope, Dog, Cat, Star, Gift
} from "lucide-react"

const iconMap: { [key: string]: LucideIcon } = {
  Scissors,
  Waves,
  Sparkles,
  Shower,
  HeartPulse,
  Bath,
  Wind,
  Stethoscope,
  Dog,
  Cat,
  Star,
  Gift
}

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
  const header = {
    title: content.find((c: ContentItem) => c.key === "services_title")?.value || "Cuidado experto para",
    highlight: content.find((c: ContentItem) => c.key === "services_highlight")?.value || "huellas exigentes",
    description: content.find((c: ContentItem) => c.key === "services_description")?.value || "Ofrecemos experiencias personalizadas diseñadas para la salud y belleza de tu mejor amigo."
  }

  const services = initialServices || []

  return (
    <section id="servicios" className="cinematic-section border-b border-white/5">
      {/* Cinematic Glow Effects */}
      <div className="absolute top-1/4 right-0 w-[800px] h-[800px] bg-primary/10 cinematic-glow shadow-primary/20" />
      <div className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-accent/10 cinematic-glow shadow-accent/20" />

      <div className="mx-auto max-w-7xl relative z-10">
        <div className="mb-24 flex flex-col md:flex-row md:items-end md:justify-between gap-10">
          <div className="max-w-3xl focus-in">
            <div className="luxury-badge mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              Nuestros Servicios
            </div>
            <h2 className="cinematic-heading-md">
              {header.title} <br />
              <span className=" text-primary">{header.highlight}</span>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm text-lg font-light leading-relaxed border-l border-primary/30 pl-6">
            {header.description}
          </p>
        </div>

        {services.length > 0 ? (
          <div className="grid gap-10 lg:grid-cols-3">
            {services.map((service, index) => {
              const IconComponent = iconMap[service.icon] || Sparkles
              return (
                <div
                  key={service.id || service.title}
                  className="group cinematic-card"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Subtle Top Inner Glow */}
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  {/* Imagen del servicio */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/50">
                    {service.image_url ? (
                      <>
                        <Image
                          src={service.image_url}
                          alt={service.title}
                          fill
                          className="luxury-img"
                        />
                      </>
                    ) : (
                      <div
                        className="absolute inset-0 flex items-center justify-center opacity-80"
                        style={{ background: 'linear-gradient(135deg, var(--color-background) 0%, var(--color-card) 100%)' }}
                      >
                        <div className={`flex h-24 w-24 items-center justify-center rounded-full bg-secondary/20 backdrop-blur-md border border-border/20 group-hover:bg-primary/20 transition-colors duration-700`}>
                          <IconComponent className="h-10 w-10 text-foreground" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col p-10 flex-1 relative z-10 -mt-6">
                    {/* Si hay imagen, ponemos el ícono flotante entre la imagen y el texto */}
                    {service.image_url && (
                      <div className="absolute right-10 -top-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-card border border-border/40 shadow-xl transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12 group-hover:border-primary/50">
                        <IconComponent className="h-7 w-7 text-primary" />
                      </div>
                    )}

                    {!service.image_url && (
                      <div className={`mb-8 flex h-16 w-16 items-center justify-center rounded-2xl ${service.accent_color || "bg-primary/20 text-primary"} transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12`}>
                        <IconComponent className="h-8 w-8" />
                      </div>
                    )}

                    <div className="flex-1 mt-4">
                      <h3 className="mb-4 font-serif text-3xl font-medium text-foreground tracking-tight">{service.title}</h3>
                      <p className="mb-10 text-muted-foreground font-light leading-relaxed">
                        {service.description}
                      </p>

                      <ul className="mb-10 space-y-5">
                        {service.features?.map((feature: string) => (
                          <li key={feature} className="flex items-start gap-4 text-sm font-medium text-foreground/80">
                            <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 shadow-sm shadow-primary/80" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-8 border-t border-border/20 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 mb-1.5">Inversión Base</p>
                        <p className="text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">{service.price}</p>
                      </div>
                      <a
                        href="#footer"
                        className="inline-flex items-center justify-center rounded-full h-14 w-14 bg-secondary/40 border border-border/40 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 group-hover:rotate-45"
                      >
                        <DollarSign className="h-6 w-6" />
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-32 px-6 rounded-[3rem] border border-border/20 bg-card/30 backdrop-blur-xl max-w-2xl mx-auto shadow-2xl">
            <div className="mx-auto w-20 h-20 mb-8 bg-secondary/20 border border-border/40 rounded-full flex items-center justify-center text-primary">
              <Scissors className="h-8 w-8" />
            </div>
            <p className="font-serif text-3xl text-foreground font-medium mb-4">Catálogo en actualización</p>
            <p className="text-muted-foreground font-light text-balance text-lg">
              Estamos preparando nuestras nuevas experiencias luxury para tu mascota. Por favor revisa más tarde o contáctanos directamente.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

