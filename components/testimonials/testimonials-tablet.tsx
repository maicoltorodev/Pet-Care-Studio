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

export function TestimonialsTablet({ content, testimonials }: { content: ContentItem[], testimonials: Testimonial[] }) {
    const [wizardOpen, setWizardOpen] = useState(false)

    const header = {
        title: content.find((c: ContentItem) => c.key === "testimonials_title")?.value || "La confianza de",
        highlight: content.find((c: ContentItem) => c.key === "testimonials_highlight")?.value || "nuestra comunidad",
        summary: content.find((c: ContentItem) => c.key === "testimonials_summary")?.value || "5/5 basado en 21 reseñas certificadas"
    }

    return (
        <section id="testimonios" className="cinematic-section border-b border-white/5 py-24 px-8 overflow-hidden">
            <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-accent/10 cinematic-glow blur-[120px] shadow-accent/20" />
            <div className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-primary/10 cinematic-glow blur-[120px] shadow-primary/20" />

            <div className="mx-auto max-w-7xl relative z-10">
                <div className="mb-20 focus-in flex flex-col pt-8">
                    <div className="luxury-badge mb-6 self-start">
                        <Star className="w-3 h-3 text-primary" />
                        Comunidad Selecta
                    </div>
                    <h2 className="font-serif leading-[1.1] text-[4vw] tracking-tight text-white max-w-2xl">
                        {header.title} <br />
                        <span className="text-primary italic font-light pr-2">{header.highlight}</span>
                    </h2>
                </div>

                {testimonials.length > 0 ? (
                    <div className="grid grid-cols-2 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={testimonial.id}
                                className="group cinematic-card hover:-translate-y-2 transition-transform duration-700 flex flex-col p-6"
                                style={{ animationDelay: `${index * 150}ms` }}
                            >
                                {/* Subtle Top Inner Glow */}
                                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20" />

                                <div className="flex justify-between items-start mb-6">
                                     <Quote className="h-8 w-8 text-primary/30 group-hover:text-primary/60 transition-colors" />
                                    <div className="flex gap-1 bg-black/40 px-3 py-1.5 rounded-full border border-white/10">
                                         {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                                            <Star key={i} className="h-3 w-3 fill-[#f59e0b] text-[#f59e0b]" />
                                        ))}
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <p className={`mb-8 font-light leading-relaxed text-white/80 ${testimonial.content?.length > 150 ? 'text-sm' : 'text-base'}`}>
                                        {`"${testimonial.content || ''}"`}
                                    </p>
                                </div>

                                <div className="mt-auto flex items-center gap-4 pt-6 border-t border-white/5">
                                    {testimonial.image_url ? (
                                        <div className="relative h-14 w-14 rounded-full overflow-hidden border border-primary/30">
                                            <Image
                                                src={testimonial.image_url}
                                                alt={testimonial.pet_name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary/30 border border-border/20">
                                            <span className="font-serif text-2xl font-medium text-foreground/30">
                                                {testimonial.client_name?.[0]?.toUpperCase() ?? '?'}
                                            </span>
                                        </div>
                                    )}
                                     <div>
                                        <p className="font-serif text-lg font-medium text-foreground leading-none mb-1">{testimonial.client_name}</p>
                                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/50">
                                            {testimonial.pet_name} <span className="mx-2 opacity-50 text-primary">•</span> {testimonial.pet_breed}
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

                <div className="mt-24 flex flex-col items-center gap-8">
                    <div className="group inline-flex items-center gap-4 text-sm font-medium text-white/70 bg-secondary/30 backdrop-blur-md px-8 py-4 rounded-full border border-white/10 hover:bg-secondary/50">
                        {header.summary}
                         <div className="w-px h-4 bg-white/20 mx-2" />
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Star key={i} className="h-4 w-4 fill-[#f59e0b] text-[#f59e0b]" />
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={() => setWizardOpen(true)}
                        className="group relative overflow-hidden bg-primary h-14 px-10 rounded-full flex items-center justify-center gap-4 uppercase font-black text-xs tracking-[0.2em] shadow-[0_0_20px_-5px_rgba(var(--color-primary),0.5)] border border-primary/50 transition-all hover:scale-105"
                    >
                         <MessageSquarePlus className="h-4 w-4 text-white" />
                         <span className="text-white relative z-10 drop-shadow-md">Escribir Reseña</span>
                         {/* Shimmer sweep effect */}
                        <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-[shimmer_3s_infinite]" />
                    </button>
                </div>
            </div>

             {wizardOpen && <TestimonialWizard onClose={() => setWizardOpen(false)} />}
        </section>
    )
}
