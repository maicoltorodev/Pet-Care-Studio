"use client"
import { useState } from "react"
import Image from "next/image"
import { Star, Quote, MessageSquarePlus } from "lucide-react"
import { TestimonialWizard } from "@/components/testimonial-wizard"

interface ContentItem {
    key: string
    value: string
}

interface Testimonial {
    id?: string
    client_name: string
    pet_name: string
    pet_breed: string
    rating: number
    content: string
    image_url?: string
}

export function TestimonialsMobile({ content, testimonials }: { content: ContentItem[], testimonials: Testimonial[] }) {
    const [wizardOpen, setWizardOpen] = useState(false)

    const header = {
        title: content.find((c: ContentItem) => c.key === "testimonials_title")?.value || "La confianza de",
        highlight: content.find((c: ContentItem) => c.key === "testimonials_highlight")?.value || "nuestra comunidad",
        summary: content.find((c: ContentItem) => c.key === "testimonials_summary")?.value || "5/5 basado en 21 reseñas certificadas"
    }

    return (
        <section id="testimonios" className="relative py-24 px-5 overflow-hidden bg-background border-b border-white/5">
            <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-primary/20 cinematic-glow blur-[100px]" />

            <div className="relative z-10 w-full mb-16 pt-8">
                <div className="luxury-badge mb-6 scale-90 origin-left">
                    <Star className="w-3 h-3 text-primary" />
                    Comunidad
                </div>
                <h2 className="cinematic-heading-md leading-tight text-4xl mb-6">
                    {header.title} <br />
                    <span className="text-primary">{header.highlight}</span>
                </h2>
            </div>

            {testimonials.length > 0 ? (
                <div className="flex flex-col gap-8">
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-card/80 backdrop-blur-xl p-8"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <Quote className="h-6 w-6 text-primary/40" />
                                <div className="flex gap-1 bg-black/40 px-3 py-1.5 rounded-full border border-white/10">
                                    {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                                        <Star key={i} className="h-3 w-3 fill-[#f59e0b] text-[#f59e0b]" />
                                    ))}
                                </div>
                            </div>

                            <p className={`font-light leading-relaxed text-white/80 mb-8 w-full ${testimonial.content?.length > 150 ? 'text-sm' : 'text-base'}`}>
                                {`"${testimonial.content || ''}"`}
                            </p>

                            <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                                {testimonial.image_url ? (
                                    <div className="relative h-12 w-12 rounded-full overflow-hidden border border-primary/30">
                                        <Image
                                            src={testimonial.image_url}
                                            alt={testimonial.pet_name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/50 border border-border/20">
                                        <span className="font-serif text-xl font-medium text-foreground/50">
                                            {testimonial.client_name?.[0]?.toUpperCase() ?? '?'}
                                        </span>
                                    </div>
                                )}
                                <div>
                                    <p className="font-serif text-lg font-medium text-white leading-none mb-1">{testimonial.client_name}</p>
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">
                                        {testimonial.pet_name} • {testimonial.pet_breed}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 px-6 rounded-[2rem] border border-border/20 bg-card/30 backdrop-blur-xl">
                    <Quote className="mx-auto h-8 w-8 text-primary/50 mb-4" />
                    <p className="font-serif text-2xl text-foreground font-medium mb-3">Comunidad en crecimiento</p>
                    <p className="text-muted-foreground text-sm">Próximamente historias increíbles.</p>
                </div>
            )}

            <div className="mt-16 flex flex-col items-center gap-8 w-full">
                <div className="text-center bg-secondary/20 border border-white/10 rounded-2xl py-4 flex flex-col items-center justify-center w-full shadow-lg">
                     <span className="text-xs font-medium text-white/70 tracking-wide">
                        {header.summary}
                    </span>
                 </div>
                <button
                    onClick={() => setWizardOpen(true)}
                    className="w-full h-14 bg-primary text-primary-foreground text-xs font-black tracking-[0.2em] uppercase rounded-xl flex items-center justify-center gap-3 active:scale-95 transition-transform"
                >
                    <MessageSquarePlus className="h-4 w-4" />
                    <span>Dejar mi reseña</span>
                </button>
            </div>

            {wizardOpen && <TestimonialWizard onClose={() => setWizardOpen(false)} />}
        </section>
    )
}
