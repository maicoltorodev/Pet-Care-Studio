import Image from "next/image"

interface ContentItem {
  key: string
  value: string
}

interface Transformation {
  id: string
  name: string
  breed: string
  before_image_url?: string
  after_image_url?: string
  is_visible: boolean
}

export function BeforeAfter({ content, transformations }: { content: ContentItem[], transformations: Transformation[] }) {
  const header = {
    title: content.find((c: ContentItem) => c.key === "results_title")?.value || "Evolución y",
    highlight: content.find((c: ContentItem) => c.key === "results_highlight")?.value || "transformación"
  }

  // Filtrar los que estén visibles y que al menos tengan algún valor (no necesariamenten imagen, pero ayuda a que no tire error el map si vienen nulls)
  const visibleTransformations = transformations?.filter((t: Transformation) => t.is_visible !== false) || [];

  return (
    <section id="resultados" className="cinematic-section border-b border-white/5">
      {/* Cinematic Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 cinematic-glow" />

      <div className="mx-auto max-w-7xl relative z-10">
        <div className="mb-24 flex flex-col items-center text-center focus-in">
          <div className="luxury-badge mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Resultados Reales
          </div>
          <h2 className="cinematic-heading-md">
            {header.title} <br className="hidden md:block" /> <span className=" text-primary">{header.highlight}</span>
          </h2>
        </div>

        {visibleTransformations.length > 0 ? (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {visibleTransformations.map((item: Transformation, index: number) => (
              <div
                key={item.id}
                className="group cinematic-card"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Subtle Top Inner Glow */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20" />

                <div className="grid grid-cols-2 overflow-hidden relative z-10">
                  {/* Etiqueta central */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-background border border-border/40 shadow-2xl transition-transform duration-700 group-hover:rotate-180">
                    <div className="h-full w-[2px] bg-primary/50" />
                  </div>

                  <div className="relative aspect-[4/5] overflow-hidden bg-black/60">
                    {item.before_image_url && (
                      <Image
                        src={item.before_image_url}
                        alt={`${item.name} antes del grooming`}
                        fill
                        className="luxury-img grayscale"
                      />
                    )}
                    <span className="absolute top-6 left-6 rounded-full bg-black/40 backdrop-blur-md px-4 py-1.5 text-[9px] font-black uppercase tracking-widest text-foreground/70 border border-border/20">
                      Antes
                    </span>
                  </div>

                  <div className="relative aspect-[4/5] overflow-hidden border-l border-border/20 bg-black/60">
                    {item.after_image_url && (
                      <Image
                        src={item.after_image_url}
                        alt={`${item.name} después del grooming`}
                        fill
                        className="luxury-img"
                      />
                    )}
                    <span className="absolute top-6 right-6 rounded-full bg-primary/80 backdrop-blur-md px-4 py-1.5 text-[9px] font-black uppercase tracking-widest text-white shadow-[0_0_15px_rgba(var(--color-primary),0.5)]">
                      Después
                    </span>
                  </div>
                </div>

                <div className="p-8 text-center bg-transparent border-t border-border/20 relative z-10 flex-1 flex flex-col justify-center">
                  <p className="font-serif text-2xl font-medium text-foreground tracking-wide">{item.name}</p>
                  <p className="mt-2 text-[10px] font-black tracking-[0.3em] text-primary uppercase">{item.breed}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 px-6 rounded-[3rem] border border-border/20 bg-card/30 backdrop-blur-xl max-w-2xl mx-auto shadow-2xl">
            <p className="font-serif text-3xl text-foreground font-medium mb-4">Galería en preparación</p>
            <p className="text-muted-foreground font-light text-balance text-lg">
              Pronto mostraremos aquí las increíbles transformaciones de nuestros consentidos. Vuelve pronto para asombrarte.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

