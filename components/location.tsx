"use client"

import { MapPin, Navigation, Clock } from "lucide-react"

interface ContentItem {
    key: string
    value: string
}

export function Location({ content }: { content: ContentItem[] }) {
    const address = content.find((c: ContentItem) => c.key === 'footer_address')?.value || 'CRA 15 no.118 78 Bogotá, Colombia'
    const phone = content.find((c: ContentItem) => c.key === 'footer_phone')?.value || '318 386 8043'

    const handleGoogleMapsPath = () => {
        // Simple encoding for google maps using the address
        return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent("PET CARE STUDIO " + address)}`
    }

    return (
        <section id="ubicacion" className="cinematic-section border-t border-border/20">
            {/* Cinematic Glow Effects */}
            <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-primary/5 cinematic-glow" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 cinematic-glow" />
            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Information Column */}
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <div className="luxury-badge mb-2">
                                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                                Nuestra Ubicación
                            </div>
                            <h2 className="cinematic-heading-md">
                                Visítanos en el <br />
                                <span className=" text-primary">corazón de la ciudad</span>
                            </h2>
                            <p className="text-muted-foreground text-lg font-light leading-relaxed max-w-md">
                                Estamos ubicados en una zona privilegiada, listos para recibir a tu mascota en un ambiente seguro y profesional.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-serif text-xl font-bold text-foreground">Dirección</h4>
                                    <p className="text-muted-foreground font-light">{address.split(',')[0]}<br />{address.split(',')[1] || 'Bogotá'}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                                    <Clock className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="font-serif text-xl font-bold text-foreground">Contacto Directo</h4>
                                    <p className="text-muted-foreground font-light">Escríbenos o llámanos<br />+ {phone}</p>
                                </div>
                            </div>
                        </div>

                        <a
                            href={handleGoogleMapsPath()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-foreground px-8 py-4 text-sm font-black uppercase tracking-widest text-background transition-all duration-500 hover:scale-105 active:scale-95 shadow-2xl"
                        >
                            <div className="absolute inset-0 bg-primary translate-y-[100%] transition-transform duration-500 group-hover:translate-y-0" />
                            <Navigation className="relative z-10 h-4 w-4 transition-transform duration-500 group-hover:rotate-12" />
                            <span className="relative z-10 group-hover:text-primary-foreground transition-colors duration-500">Cómo Llegar</span>
                        </a>
                    </div>

                    {/* Map Column */}
                    <div className="map-container relative aspect-square lg:aspect-auto lg:h-[600px] w-full overflow-hidden rounded-[3rem] border border-border/40 shadow-2xl bg-card">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.4079143816443!2d-74.04373223757324!3d4.698981682248104!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9bcd4b8ea357%3A0x60b79171b415c76!2sPET%20CARE%20STUDIO!5e0!3m2!1ses-419!2sco!4v1772917216652!5m2!1ses-419!2sco"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="grayscale-[0.2] contrast-[1.1]"
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
    )
}

