"use client"

import { ShieldCheck, HeartHandshake, CheckCircle2 } from "lucide-react"

interface ContentItem {
    key: string
    value: string
}

export function TrustSection({ content }: { content: ContentItem[] }) {
    const getContent = (key: string, fallback: string) => {
        return content.find((c: ContentItem) => c.key === key)?.value || fallback
    }

    const title = getContent('trust_title', 'Tu mascota es familia')
    const description = getContent('trust_description', 'Sabemos el miedo que da dejar a tu perro. Por eso nuestro estudio está diseñado con los más altos estándares éticos, sin usar jaulas y priorizando su paz en cada etapa.')

    const point1Title = getContent('trust_point_1_title', 'Libres de Jaulas')
    const point1Desc = getContent('trust_point_1_desc', 'Tu perro estará libre jugando o descansando, nunca encerrado.')

    const point2Title = getContent('trust_point_2_title', 'Cosmética Premium')
    const point2Desc = getContent('trust_point_2_desc', 'Alineada al pH del animal, usamos champús hipoalergénicos sin químicos abrasivos.')

    return (
        <section className="cinematic-section border-b border-border/20">
            {/* Efectos de luz difuminados atrás */}
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 cinematic-glow bg-primary/40" />
            <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 cinematic-glow bg-secondary/20" />

            <div className="mx-auto max-w-7xl relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                    {/* Lado Izquierdo: La Promesa */}
                    <div className="space-y-10 focus-in">
                        <div className="luxury-badge">
                            <ShieldCheck className="w-4 h-4 text-primary" />
                            Nuestra Promesa
                        </div>

                        <h2 className="cinematic-heading-md">
                            {title}
                        </h2>

                        <p>
                            {description}
                        </p>
                    </div>

                    {/* Lado Derecho: Viñetas de Garantía */}
                    <div className="grid gap-6">

                        {/* Garantía 1 */}
                        <div className="group cinematic-card p-10">
                            <div className="absolute top-0 right-0 p-8 opacity-5 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-10">
                                <HeartHandshake className="w-40 h-40 text-foreground" />
                            </div>
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-8 shadow-inner ring-1 ring-white/10 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-serif font-medium mb-4 text-white group-hover:text-primary transition-colors duration-300">{point1Title}</h3>
                                <p>
                                    {point1Desc}
                                </p>
                            </div>
                        </div>

                        {/* Garantía 2 */}
                        <div className="group cinematic-card p-10">
                            <div className="absolute top-0 right-0 p-8 opacity-5 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-10">
                                <ShieldCheck className="w-40 h-40 text-foreground" />
                            </div>
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-secondary text-foreground rounded-2xl flex items-center justify-center mb-8 shadow-inner ring-1 ring-border group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-500">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-serif font-medium mb-4 text-foreground group-hover:text-accent transition-colors duration-300">{point2Title}</h3>
                                <p>
                                    {point2Desc}
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    )
}

