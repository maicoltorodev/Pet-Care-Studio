"use client"
import Image from "next/image"
import {
    Scissors, Waves, Sparkles, ShowerHead as Shower, HeartPulse, Bath, LucideIcon, DollarSign,
    Wind, Stethoscope, Dog, Cat, Star, Gift
} from "lucide-react"

const iconMap: { [key: string]: LucideIcon } = {
    Scissors, Waves, Sparkles, Shower, HeartPulse, Bath,
    Wind, Stethoscope, Dog, Cat, Star, Gift
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

export function ServicesMobile({ services, header, phone }: { services: ServiceItem[], header: any, phone: string }) {
    const getWhatsAppUrl = (serviceTitle: string) => {
        const message = `Hola, me gustaría agendar el servicio de ${serviceTitle}.`
        return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    }
    return (
        <section id="servicios" className="relative py-24 overflow-hidden px-5 bg-background border-b border-white/5">
            {/* Cinematic Glow Effects */}
            <div className="absolute top-1/4 -right-20 w-[400px] h-[400px] bg-primary/20 cinematic-glow blur-[100px]" />

            <div className="relative z-10 w-full mb-16 pt-8">
                <div className="luxury-badge mb-6 scale-90 origin-left">
                    <Sparkles className="w-3 h-3 text-primary" />
                    Catálogo
                </div>
                <h2 className="cinematic-heading-md leading-tight text-4xl mb-6">
                    {header.title} <br />
                    <span className="text-primary">{header.highlight}</span>
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed border-l-2 border-primary/30 pl-4">
                    {header.description}
                </p>
            </div>

            {services.length > 0 ? (
                <div className="flex flex-col gap-8">
                    {services.map((service, index) => {
                        const IconComponent = iconMap[service.icon] || Sparkles
                        return (
                            <div
                                key={service.id || service.title}
                                className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-card/60 backdrop-blur-xl transition-transform active:scale-[0.98]"
                            >
                                {/* Contenedor de Imagen (Top Half) */}
                                <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/80 border-b border-white/5">
                                    {service.image_url ? (
                                        <Image
                                            src={service.image_url}
                                            alt={service.title}
                                            fill
                                            className="object-cover opacity-90 transition-transform duration-700 active:scale-105"
                                        />
                                    ) : (
                                        <div
                                            className="absolute inset-0 flex items-center justify-center opacity-80"
                                            style={{ background: 'linear-gradient(135deg, var(--color-background) 0%, rgba(200,50,50,0.1) 100%)' }}
                                        >
                                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/5 backdrop-blur-md border border-white/10">
                                                <IconComponent className="h-8 w-8 text-primary/50" />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Contenedor de Contenido (Bottom Half) */}
                                <div className="p-6 relative z-10 bg-gradient-to-t from-background/90 to-transparent">
                                    {/* Icono flotante conector (Superpuesto entre imagen y texto) */}
                                    {service.image_url && (
                                        <div className="absolute right-6 -top-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-card border border-white/10 shadow-2xl">
                                            <IconComponent className="h-5 w-5 text-primary" />
                                        </div>
                                    )}

                                    {!service.image_url && (
                                         <div className="absolute right-6 -top-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 border border-primary/20 shadow-2xl">
                                            <IconComponent className="h-5 w-5 text-primary" />
                                        </div>
                                    )}

                                    <div className="flex items-start justify-between mb-6 mt-2">
                                        <div>
                                            <h3 className="font-serif text-[22px] font-medium text-white tracking-tight">{service.title}</h3>
                                        </div>
                                        <div className="text-right pl-4">
                                            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">Inversión</p>
                                            <p className="text-lg font-black tracking-tight text-white">{service.price}</p>
                                        </div>
                                    </div>

                                    <p className="mb-6 text-white/60 text-sm leading-relaxed font-light">
                                        {service.description}
                                    </p>

                                    <ul className="space-y-3 mb-8">
                                        {service.features?.map((feature: string) => (
                                            <li key={feature} className="flex items-start gap-4 text-xs font-medium text-white/80">
                                                <div className="mt-1 h-1 w-1 rounded-full bg-primary flex-shrink-0" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <a
                                        href={getWhatsAppUrl(service.title)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative overflow-hidden flex items-center justify-center w-full h-14 bg-primary text-primary-foreground text-[10px] font-black tracking-[0.2em] uppercase rounded-full shadow-lg shadow-primary/40 transition-transform active:scale-95"
                                    >
                                        <span className="relative z-10">Agendar Experiencia</span>
                                        <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-[shimmer_3s_infinite]" />
                                    </a>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="text-center py-20 px-6 rounded-[2rem] border border-border/20 bg-card/30 backdrop-blur-xl">
                    <p className="font-serif text-2xl text-foreground font-medium mb-3">Catálogo en actualización</p>
                    <p className="text-muted-foreground text-sm">Vuelve pronto para ver nuestras experiencias.</p>
                </div>
            )}
        </section>
    )
}
