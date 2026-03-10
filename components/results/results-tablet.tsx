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

export function BeforeAfterTablet({ content, transformations }: { content: ContentItem[], transformations: Transformation[] }) {
    const header = {
        title: content.find((c: ContentItem) => c.key === "results_title")?.value || "Evolución y",
        highlight: content.find((c: ContentItem) => c.key === "results_highlight")?.value || "transformación"
    }

    const visibleTransformations = transformations?.filter((t: Transformation) => t.is_visible !== false) || [];

    return (
        <section id="resultados" className="cinematic-section border-b border-white/5 py-24 px-8 overflow-hidden">
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/10 cinematic-glow blur-[120px] shadow-primary/20" />

            <div className="mx-auto max-w-7xl relative z-10">
                <div className="flex flex-col mb-16 focus-in">
                    <div className="luxury-badge mb-6 self-start">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        Historial Clínico Visual
                    </div>
                    <div className="grid grid-cols-12 gap-8 items-end">
                        <div className="col-span-8">
                            <h2 className="font-serif leading-[1.1] text-[4vw] tracking-tight text-white">
                                {header.title} <br />
                                <span className="text-primary italic font-light pr-2">{header.highlight}</span>
                            </h2>
                        </div>
                    </div>
                </div>

                {visibleTransformations.length > 0 ? (
                    <div className="grid gap-8 grid-cols-2">
                        {visibleTransformations.map((item: Transformation, index: number) => (
                            <div
                                key={item.id}
                                className="group cinematic-card relative overflow-hidden transition-transform duration-700 hover:-translate-y-1"
                                style={{ animationDelay: `${index * 150}ms` }}
                            >
                                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20" />

                                {/* En Tablet optamos por superponer "Antes" como thumbnail flotante sobre el "Después" para mayor impacto */}
                                <div className="relative aspect-[3/4] w-full bg-black/80 overflow-hidden">
                                    {/* Imagen Principal (Después) */}
                                    {item.after_image_url && (
                                        <Image
                                            src={item.after_image_url}
                                            alt={`${item.name} después`}
                                            fill
                                            className="luxury-img opacity-90 transition-opacity hover:opacity-100"
                                        />
                                    )}
                                    <span className="absolute bottom-6 right-6 rounded-full bg-primary/90 backdrop-blur-md px-4 py-1.5 text-[9px] font-black uppercase tracking-widest text-white shadow-[0_0_15px_rgba(var(--color-primary),0.5)] z-20">
                                        Resultado Final
                                    </span>

                                    {/* Miniatura (Antes) superpuesta */}
                                    <div className="absolute top-6 left-6 w-1/3 aspect-[3/4] rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl z-20 bg-black/60 transition-transform duration-700 origin-top-left group-hover:scale-110">
                                         {item.before_image_url && (
                                            <Image
                                                src={item.before_image_url}
                                                alt={`${item.name} antes`}
                                                fill
                                                className="object-cover"
                                            />
                                        )}
                                        <div className="absolute bottom-0 w-full bg-black/70 py-1 text-center">
                                             <span className="text-[7px] font-black uppercase tracking-widest text-white/50">
                                                Estado Previo
                                            </span>
                                        </div>
                                    </div>
                                    
                                     {/* Gradiente Inferior para texto */}
                                    <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 pointer-events-none" />
                                    
                                    <div className="absolute bottom-6 left-6 z-20">
                                        <p className="font-serif text-2xl font-medium text-white tracking-wide">{item.name}</p>
                                        <p className="mt-1 text-[10px] font-black tracking-[0.3em] text-primary uppercase">{item.breed}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                   <div className="text-center py-24 px-6 rounded-[2rem] border border-border/20 bg-card/30 backdrop-blur-xl">
                        <p className="font-serif text-2xl text-foreground font-medium mb-3">Galería en preparación</p>
                        <p className="text-muted-foreground text-sm">Vuelve pronto para ver resultados increíbles.</p>
                    </div>
                )}
            </div>
        </section>
    )
}
