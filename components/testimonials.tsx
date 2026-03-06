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

export function Testimonials({ content, testimonials }: { content: ContentItem[], testimonials: Testimonial[] }) {
  const [wizardOpen, setWizardOpen] = useState(false)

  const header = {
    title: content.find((c: ContentItem) => c.key === "testimonials_title")?.value || "La confianza de",
    highlight: content.find((c: ContentItem) => c.key === "testimonials_highlight")?.value || "nuestra comunidad",
    summary: content.find((c: ContentItem) => c.key === "testimonials_summary")?.value || "5/5 basado en 21 reseñas certificadas"
  }

  return (
    <section id="testimonios" className="cinematic-section border-b border-white/5">
      {/* Cinematic Glow Effects */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-accent/5 cinematic-glow shadow-accent/20 opacity-40" />
      <div className="absolute bottom-0 left-1/4 w-[800px] h-[800px] bg-primary/10 cinematic-glow shadow-primary/20 opacity-40" />

      <div className="mx-auto max-w-7xl relative z-10">
        <div className="mb-24 flex flex-col items-center text-center focus-in">
          <div className="luxury-badge mb-8">
            <Star className="w-4 h-4 text-primary" />
            Testimonios Selectos
          </div>
          <h2 className="cinematic-heading-md">
            {header.title} <br className="hidden md:block" /> <span className=" text-primary">{header.highlight}</span>
          </h2>
        </div>

        {testimonials.length > 0 ? (
          <div className="grid gap-10 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="group cinematic-card"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Subtle Top Inner Glow */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20" />

                {/* Main Proof Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/60">
                  {testimonial.image_url ? (
                    <>
                      <Image
                        src={testimonial.image_url}
                        alt={`Resultado de ${testimonial.pet_name || 'mascota'}`}
                        fill
                        className="luxury-img"
                      />

                      {/* Rating Overlay on Image */}
                      <div className="absolute bottom-8 left-8 z-10">
                        <div className="flex gap-1.5 p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-border/20 shadow-xl">
                          {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-[#f59e0b] text-[#f59e0b] drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 opacity-80"
                      style={{ background: 'linear-gradient(135deg, var(--color-background) 0%, var(--color-card) 100%)' }}>
                      <span className="font-serif text-8xl font-medium text-foreground/10 leading-none select-none drop-shadow-2xl">
                        {testimonial.client_name?.[0]?.toUpperCase() ?? '?'}
                      </span>
                      <div className="flex gap-1.5 p-3 rounded-2xl bg-secondary/30 backdrop-blur-md border border-border/20 shadow-xl">
                        {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-primary/50 text-primary/50" />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col p-8 flex-1 relative z-10">
                  <div className="mb-6 text-primary/30 group-hover:text-primary/60 transition-colors duration-500">
                    <Quote className="h-8 w-8 fill-current" />
                  </div>

                  <div className="flex-1">
                    <p className={`mb-8 font-light leading-relaxed text-muted-foreground line-clamp-4 ${testimonial.content?.length > 150 ? 'text-base' : 'text-lg'}`}>
                      {`"${testimonial.content || ''}"`}
                    </p>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5">
                    <div>
                      <p className="font-serif text-xl font-medium text-foreground leading-none mb-2">{testimonial.client_name}</p>
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/40">
                        {testimonial.pet_name} <span className="mx-2 opacity-50 text-primary">•</span> {testimonial.pet_breed}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 px-6 cinematic-card max-w-2xl mx-auto shadow-2xl">
            <div className="mx-auto w-20 h-20 mb-8 bg-secondary/20 border border-border/40 rounded-full flex items-center justify-center text-primary">
              <Quote className="h-8 w-8" />
            </div>
            <p className="font-serif text-3xl text-foreground font-medium mb-4">Comunidad en crecimiento</p>
            <p className="text-muted-foreground font-light text-balance text-lg">
              Las historias de nuestras experiencias luxury se publicarán aquí muy pronto.
            </p>
          </div>
        )}

        {/* Rating summary + CTA */}
        <div className="mt-24 flex flex-col items-center gap-10">
          <div className="group inline-flex flex-col sm:flex-row items-center gap-6 rounded-full bg-secondary/30 backdrop-blur-xl px-10 py-5 border border-border/40 shadow-2xl hover:bg-secondary/50 transition-colors duration-500">
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-5 w-5 fill-[#f59e0b] text-[#f59e0b] drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
              ))}
            </div>
            <div className="hidden sm:block w-px h-6 bg-white/10" />
            <span className="text-sm font-medium text-foreground tracking-wide">
              {header.summary}
            </span>
          </div>

          {/* Botón para abrir el wizard */}
          <button
            onClick={() => setWizardOpen(true)}
            className="group relative overflow-hidden bg-transparent border-2 border-primary text-primary h-16 px-12 text-sm font-black tracking-[0.2em] uppercase rounded-full transition-all duration-500 hover:scale-105 shadow-[0_0_30px_-10px_rgba(var(--color-primary),0.5)]"
          >
            <div className="relative z-10 flex items-center gap-4">
              <MessageSquarePlus className="h-5 w-5 transition-transform duration-500 group-hover:-rotate-12" />
              <span className="group-hover:text-white transition-colors duration-500">Dejar mi reseña</span>
            </div>
            <div className="absolute inset-0 bg-primary translate-y-[100%] transition-transform duration-500 group-hover:translate-y-0" />
          </button>
        </div>
      </div>

      {/* Wizard modal */}
      {wizardOpen && <TestimonialWizard onClose={() => setWizardOpen(false)} />}
    </section>
  )
}

