"use client"
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

export function BeforeAfterMobile({ content, transformations }: { content: ContentItem[], transformations: Transformation[] }) {
    const header = {
        title: content.find((c: ContentItem) => c.key === "results_title")?.value || "Evolución y",
        highlight: content.find((c: ContentItem) => c.key === "results_highlight")?.value || "transformación"
    }

    const visibleTransformations = transformations?.filter((t: Transformation) => t.is_visible !== false) || [];

    return (
        <section id="resultados" className="relative py-24 px-5 overflow-hidden bg-background border-b border-white/5">
            <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-primary/10 cinematic-glow blur-[100px]" />

            <div className="relative z-10 w-full mb-16 pt-8 text-center">
                <div className="inline-flex luxury-badge mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    Transformaciones
                </div>
                <h2 className="cinematic-heading-md leading-tight text-4xl">
                    {header.title} <br />
                    <span className="text-primary">{header.highlight}</span>
                </h2>
            </div>

            {visibleTransformations.length > 0 ? (
                <div className="flex flex-col gap-10">
                    {visibleTransformations.map((item: Transformation) => (
                        <div
                            key={item.id}
                            className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-card/80 backdrop-blur-xl w-full"
                        >
                            {/* Layout Vertical en Mobile para "Antes/Después" */}
                            <div className="flex flex-col w-full relative">
                                
                                {/* Etiqueta central flotante */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-background border border-border/40 shadow-2xl rotate-90">
                                    <div className="h-full w-[2px] bg-primary/50" />
                                </div>

                                <div className="relative aspect-video w-full overflow-hidden bg-black/60 border-b border-white/10">
                                    {item.before_image_url && (
                                        <Image
                                            src={item.before_image_url}
                                            alt={`${item.name} antes`}
                                            fill
                                            className="object-cover"
                                        />
                                    )}
                                    <span className="absolute top-4 left-4 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-[8px] font-black uppercase tracking-widest text-white/70 border border-white/10">
                                        Antes
                                    </span>
                                </div>

                                <div className="relative aspect-video w-full overflow-hidden bg-black/60">
                                    {item.after_image_url && (
                                        <Image
                                            src={item.after_image_url}
                                            alt={`${item.name} después`}
                                            fill
                                            className="object-cover"
                                        />
                                    )}
                                    <span className="absolute bottom-4 right-4 rounded-full bg-primary/90 backdrop-blur-md px-3 py-1 text-[8px] font-black uppercase tracking-widest text-white shadow-[0_0_10px_rgba(var(--color-primary),0.4)]">
                                        Después
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 text-center border-t border-white/5 bg-gradient-to-t from-black/40 to-transparent">
                                <p className="font-serif text-xl font-medium text-white tracking-wide">{item.name}</p>
                                <p className="mt-1 text-[9px] font-black tracking-[0.3em] text-primary uppercase">{item.breed}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 px-6 rounded-[2rem] border border-border/20 bg-card/30 backdrop-blur-xl">
                    <p className="font-serif text-2xl text-foreground font-medium mb-3">Galería en preparación</p>
                    <p className="text-muted-foreground text-sm">Vuelve pronto para ver resultados increíbles.</p>
                </div>
            )}
        </section>
    )
}
