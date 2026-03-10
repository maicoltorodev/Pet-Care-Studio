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

export function ServicesMobile({ services, header }: { services: ServiceItem[], header: any }) {
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
                                className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-card/80 backdrop-blur-xl transition-transform active:scale-[0.98]"
                            >
                                {/* Imagen del servicio como cover background mitigado en mobile */}
                                <div className="absolute inset-0 z-0">
                                    {service.image_url && (
                                        <>
                                            <Image
                                                src={service.image_url}
                                                alt={service.title}
                                                fill
                                                className="object-cover opacity-30"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                                        </>
                                    )}
                                </div>

                                <div className="p-8 relative z-10">
                                    <div className="flex items-start justify-between mb-8">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                                            <IconComponent className="h-6 w-6 text-primary" />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">Inversión</p>
                                            <p className="text-xl font-black tracking-tight text-white">{service.price}</p>
                                        </div>
                                    </div>

                                    <h3 className="mb-3 font-serif text-2xl font-medium text-white tracking-tight">{service.title}</h3>
                                    <p className="mb-8 text-white/60 text-sm leading-relaxed">
                                        {service.description}
                                    </p>

                                    <ul className="space-y-4 mb-8">
                                        {service.features?.map((feature: string) => (
                                            <li key={feature} className="flex items-start gap-4 text-xs font-medium text-white/80">
                                                <div className="mt-1 h-1 w-1 rounded-full bg-primary flex-shrink-0" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <a
                                        href="#footer"
                                        className="flex items-center justify-center w-full h-12 rounded-xl bg-primary text-primary-foreground text-xs font-black tracking-[0.2em] uppercase transition-colors"
                                    >
                                        Agendar
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
