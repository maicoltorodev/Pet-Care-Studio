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

export function ServicesTablet({ services, header }: { services: ServiceItem[], header: any }) {
    return (
        <section id="servicios" className="cinematic-section border-b border-white/5 py-24 px-8 overflow-hidden">
            {/* Ambient Background for Tablet */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 cinematic-glow blur-[120px] shadow-primary/20" />
            
            <div className="mx-auto max-w-7xl relative z-10">
                <div className="flex flex-col mb-20 focus-in">
                    <div className="luxury-badge mb-8 self-start animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Sparkles className="w-3 h-3 text-primary" />
                        Catálogo Exclusivo
                    </div>
                    
                    {/* Tablet Typography is slightly larger than mobile but tighter than desktop */}
                    <div className="grid grid-cols-12 gap-8 items-end">
                        <div className="col-span-7">
                            <h2 className="font-serif leading-[1.1] text-[4vw] tracking-tight text-white animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                                {header.title} <br />
                                <span className="text-primary italic font-light pr-2">{header.highlight}</span>
                            </h2>
                        </div>
                        <div className="col-span-5 pb-2">
                             <p className="text-white/60 text-lg font-light leading-relaxed border-l border-primary/30 pl-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                                {header.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Asymmetric Zig-Zag Layout for Tablet */}
                {services.length > 0 ? (
                    <div className="flex flex-col gap-24">
                        {services.map((service, index) => {
                            const IconComponent = iconMap[service.icon] || Sparkles
                            const isEven = index % 2 === 0
                            
                            return (
                                <div
                                    key={service.id || service.title}
                                    className={`flex items-stretch gap-10 cinematic-card overflow-visible animate-in fade-in slide-in-from-bottom-8 duration-1000 ${isEven ? 'flex-row' : 'flex-row-reverse'}`}
                                >
                                    {/* Contenedor Izquierdo (Imagen) */}
                                    <div className="w-5/12 relative aspect-[4/5] overflow-hidden rounded-2xl bg-black/50 shadow-2xl flex-shrink-0">
                                        {service.image_url ? (
                                            <Image
                                                src={service.image_url}
                                                alt={service.title}
                                                fill
                                                className="luxury-img object-cover opacity-90 transition-all duration-1000 hover:scale-105 hover:opacity-100"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-background to-card border border-white/5">
                                                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/5 backdrop-blur-md">
                                                    <IconComponent className="h-8 w-8 text-primary/50" />
                                                </div>
                                            </div>
                                        )}
                                        {/* Cost Label Flotante */}
                                        <div className={`absolute top-6 ${isEven ? 'left-6' : 'right-6'} bg-black/60 backdrop-blur-md px-5 py-2 rounded-full border border-white/10 flex items-center gap-3`}>
                                            <span className="text-[10px] uppercase tracking-widest text-white/50 font-black">Inversión</span>
                                            <span className="text-white font-bold">{service.price}</span>
                                        </div>
                                    </div>

                                    {/* Contenedor Derecho (Contenido) */}
                                    <div className="w-7/12 flex flex-col justify-center py-6 px-4">
                                        <div className="flex items-center gap-6 mb-6">
                                           <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-card border border-border/40 shadow-xl">
                                                <IconComponent className="h-7 w-7 text-primary" />
                                            </div>
                                            <h3 className="font-serif text-3xl font-medium text-white tracking-tight">{service.title}</h3>
                                        </div>
                                        
                                        <p className="mb-8 text-white/50 text-base leading-relaxed pr-8">
                                            {service.description}
                                        </p>

                                        <ul className="mb-10 space-y-4">
                                            {service.features?.map((feature: string) => (
                                                <li key={feature} className="flex items-start gap-4 text-sm font-medium text-white/80">
                                                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/80 flex-shrink-0 shadow-[0_0_8px_rgba(var(--color-primary),0.8)]" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                        
                                        <div className="mt-auto pt-8">
                                             <a
                                                href="#footer"
                                                className="inline-flex items-center gap-4 h-14 px-8 rounded-full bg-transparent border-2 border-primary/30 text-white text-xs font-black tracking-[0.2em] uppercase transition-all duration-300 hover:bg-primary hover:border-primary"
                                            >
                                                <span>Agendar Cita</span>
                                                <div className="w-8 h-px bg-white/50" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : null}
            </div>
        </section>
    )
}
