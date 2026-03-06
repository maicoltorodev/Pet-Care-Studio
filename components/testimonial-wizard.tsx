"use client"

import { useState, useRef, useCallback } from "react"
import { X, Star, Upload, ChevronRight, ChevronLeft, Check, Camera } from "lucide-react"

// Reutilizamos la misma lógica de compresión WebP del admin
function compressToWebp(file: File): Promise<File> {
    return new Promise((resolve) => {
        if (!file.type.startsWith("image/") || file.type === "image/gif") return resolve(file)
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (e) => {
            const img = new window.Image()
            img.src = e.target?.result as string
            img.onload = () => {
                const MAX = 1920
                let w = img.width, h = img.height
                if (w > h && w > MAX) { h = h * MAX / w; w = MAX }
                else if (h > MAX) { w = w * MAX / h; h = MAX }
                const canvas = document.createElement("canvas")
                canvas.width = w; canvas.height = h
                canvas.getContext("2d")?.drawImage(img, 0, 0, w, h)
                canvas.toBlob((blob) => {
                    if (blob) resolve(new File([blob], "review.webp", { type: "image/webp" }))
                    else resolve(file)
                }, "image/webp", 0.85)
            }
            img.onerror = () => resolve(file)
        }
        reader.onerror = () => resolve(file)
    })
}

const STEPS = ["Calificación", "Tus datos", "Tu reseña", "Tu foto"] as const
type Step = 0 | 1 | 2 | 3 | 4 // 4 = success

interface WizardProps {
    onClose: () => void
}

export function TestimonialWizard({ onClose }: WizardProps) {
    const [step, setStep] = useState<Step>(0)
    const [rating, setRating] = useState(0)
    const [hoveredRating, setHoveredRating] = useState(0)
    const [clientName, setClientName] = useState("")
    const [petName, setPetName] = useState("")
    const [petBreed, setPetBreed] = useState("")
    const [content, setContent] = useState("")
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [imageError, setImageError] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleImageSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.files?.[0]
        if (!raw) return
        setImageError("")
        const compressed = await compressToWebp(raw)
        if (compressed.size > 5 * 1024 * 1024) {
            setImageError("La imagen es demasiado pesada incluso comprimida (máx 5MB). Prueba con otra foto.")
            return
        }
        setImageFile(compressed)
        setImagePreview(URL.createObjectURL(compressed))
    }, [])

    const canAdvance = () => {
        if (step === 0) return rating > 0
        if (step === 1) return clientName.trim().length >= 2 && petName.trim().length >= 2 && petBreed.trim().length >= 2
        if (step === 2) return content.trim().length >= 20
        if (step === 3) return !!imageFile
        return false
    }

    const handleSubmit = async () => {
        if (!imageFile) return
        setSubmitting(true)
        setError("")
        try {
            // 1. Subir imagen
            const fd = new FormData()
            fd.append("file", imageFile)
            const uploadRes = await fetch("/api/testimonials/upload", { method: "POST", body: fd })
            const uploadData = await uploadRes.json()
            if (!uploadRes.ok) { setError(uploadData.error || "Error al subir la imagen."); setSubmitting(false); return }

            // 2. Enviar testimonio
            const submitRes = await fetch("/api/testimonials", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ client_name: clientName, pet_name: petName, pet_breed: petBreed, content, rating, image_url: uploadData.url })
            })
            const submitData = await submitRes.json()
            if (!submitRes.ok) { setError(submitData.error || "Error al enviar la reseña."); setSubmitting(false); return }

            setStep(4) // success
        } catch {
            setError("Error de conexión. Por favor intenta de nuevo.")
        }
        setSubmitting(false)
    }

    const starLabels = ["", "Malo", "Regular", "Bueno", "Muy bueno", "Excelente"]

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 transition-all duration-500"
            style={{ backdropFilter: "blur(20px)", background: "rgba(0,0,0,0.7)" }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
            <div className="relative w-full max-w-lg bg-card rounded-[3rem] shadow-2xl overflow-hidden"
                style={{ animation: "wizardIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both" }}>

                {/* Header */}
                <div className="px-10 pt-10 pb-0 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">
                            {step < 4 ? `Paso ${(step as number) + 1} de ${STEPS.length}` : "¡Listo!"}
                        </p>
                        <h2 className="font-serif text-2xl font-bold text-foreground mt-0.5">
                            {step < 4 ? STEPS[step as 0 | 1 | 2 | 3] : "¡Gracias por tu reseña!"}
                        </h2>
                    </div>
                    <button onClick={onClose} className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/80 transition-colors">
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Progress bar */}
                {step < 4 && (
                    <div className="mx-10 mt-6 h-1 rounded-full bg-border/30 overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${((step as number) + 1) / STEPS.length * 100}%` }} />
                    </div>
                )}

                {/* Step content */}
                <div className="px-10 py-8 min-h-[260px] flex flex-col justify-between">

                    {/* STEP 0: Rating */}
                    {step === 0 && (
                        <div className="flex flex-col items-center gap-6 py-4">
                            <p className="text-muted-foreground text-center">¿Cómo calificarías tu experiencia en Pet Care Studio?</p>
                            <div className="flex gap-3">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <button key={s} onClick={() => setRating(s)}
                                        onMouseEnter={() => setHoveredRating(s)} onMouseLeave={() => setHoveredRating(0)}
                                        className="transition-all duration-300 hover:scale-125 focus:outline-none">
                                        <Star className={`h-12 w-12 transition-all duration-300 ${s <= (hoveredRating || rating) ? "fill-primary text-primary drop-shadow-[0_0_10px_rgba(var(--color-primary),0.5)]" : "text-border fill-transparent"}`} />
                                    </button>
                                ))}
                            </div>
                            {(hoveredRating || rating) > 0 && (
                                <p className="font-serif text-xl font-medium text-foreground animate-in fade-in duration-200">
                                    {starLabels[hoveredRating || rating]}
                                </p>
                            )}
                        </div>
                    )}

                    {/* STEP 1: Datos */}
                    {step === 1 && (
                        <div className="flex flex-col gap-4">
                            <p className="text-muted-foreground text-sm">Cuéntanos un poco sobre ti y tu peludo.</p>
                            {[
                                { label: "Tu nombre", value: clientName, set: setClientName, placeholder: "Ej: María González" },
                                { label: "Nombre de tu mascota", value: petName, set: setPetName, placeholder: "Ej: Luna" },
                                { label: "Raza", value: petBreed, set: setPetBreed, placeholder: "Ej: Golden Retriever" }
                            ].map(f => (
                                <div key={f.label} className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">{f.label}</label>
                                    <input value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder}
                                        className="w-full h-12 rounded-2xl bg-secondary/50 border border-border/40 px-5 text-sm font-medium text-foreground outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/30" />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* STEP 2: Reseña */}
                    {step === 2 && (
                        <div className="flex flex-col gap-4">
                            <p className="text-muted-foreground text-sm">Comparte tu experiencia con la comunidad (20-500 caracteres).</p>
                            <textarea
                                value={content}
                                onChange={e => setContent(e.target.value.slice(0, 500))}
                                placeholder="Llevé a Luna por primera vez y quedé encantada con el trato..."
                                className="w-full h-36 rounded-2xl bg-secondary/50 border border-border/40 px-5 py-4 text-sm font-light text-foreground outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all resize-none leading-relaxed placeholder:text-muted-foreground/30"
                            />
                            <div className="flex justify-between items-center px-1">
                                <p className={`text-[10px] font-bold transition-colors ${content.trim().length < 20 ? "text-destructive/60" : "text-emerald-500"}`}>
                                    {content.trim().length < 20 ? "Mínimo 20 caracteres para continuar" : "Reseña válida"}
                                </p>
                                <p className={`text-[10px] font-bold transition-colors ${content.length >= 450 ? "text-amber-500" : "text-muted-foreground/40"}`}>
                                    {content.length} / 500
                                </p>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Foto */}
                    {step === 3 && (
                        <div className="flex flex-col gap-4 items-center">
                            <p className="text-muted-foreground text-sm text-center">Sube una foto de tu mascota. Se necesita para publicar la reseña.</p>
                            {imagePreview ? (
                                <div className="relative group">
                                    <img src={imagePreview} alt="Vista previa" className="w-48 h-48 rounded-3xl object-cover border-2 border-primary/20" />
                                    <button onClick={() => { setImageFile(null); setImagePreview(null) }}
                                        className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <X className="h-3 w-3" />
                                    </button>
                                    <button onClick={() => fileInputRef.current?.click()}
                                        className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-white/90 text-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="h-3 w-3" />
                                    </button>
                                </div>
                            ) : (
                                <button onClick={() => fileInputRef.current?.click()}
                                    className="w-48 h-48 rounded-3xl border-2 border-dashed border-border/40 bg-secondary/30 flex flex-col items-center justify-center gap-3 hover:border-primary/40 hover:bg-primary/5 transition-all group">
                                    <Upload className="h-8 w-8 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 group-hover:text-primary transition-colors">Subir foto</span>
                                </button>
                            )}
                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                            {imageError && <p className="text-destructive text-xs text-center">{imageError}</p>}
                            <p className="text-[10px] text-muted-foreground/40 text-center">Formatos: JPG, PNG, HEIC · Máx. 5MB · Se convierte a WebP automáticamente</p>
                        </div>
                    )}

                    {/* STEP 4: Success */}
                    {step === 4 && (
                        <div className="flex flex-col items-center gap-5 py-4 text-center">
                            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                                <Check className="h-10 w-10 text-primary" />
                            </div>
                            <p className="font-serif text-xl font-medium text-foreground max-w-xs">
                                Tu reseña está en revisión. La publicaremos pronto.
                            </p>
                            <p className="text-muted-foreground text-sm max-w-xs">
                                Nuestro equipo la revisará y aparecerá en la sección de testimonios una vez aprobada. ¡Gracias por confiar en nosotros!
                            </p>
                            <button onClick={onClose}
                                className="mt-2 h-12 px-8 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity">
                                Cerrar
                            </button>
                        </div>
                    )}

                    {/* Error general */}
                    {error && <p className="text-destructive text-sm text-center mt-2">{error}</p>}
                </div>

                {/* Footer navigation */}
                {step < 4 && (
                    <div className="px-10 pb-10 flex justify-between items-center">
                        <button onClick={() => setStep((s) => Math.max(0, s - 1) as Step)}
                            disabled={step === 0}
                            className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground disabled:opacity-0 transition-all">
                            <ChevronLeft className="h-4 w-4" /> Anterior
                        </button>

                        {step < 3 ? (
                            <button onClick={() => setStep((s) => (s + 1) as Step)} disabled={!canAdvance()}
                                className="flex items-center gap-2 h-12 px-8 rounded-full bg-primary text-white font-bold text-sm hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                                Siguiente <ChevronRight className="h-4 w-4" />
                            </button>
                        ) : (
                            <button onClick={handleSubmit} disabled={!canAdvance() || submitting}
                                className="flex items-center gap-2 h-12 px-8 rounded-full bg-primary text-white font-bold text-sm hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                                {submitting ? "Enviando..." : "Enviar reseña"} {!submitting && <Check className="h-4 w-4" />}
                            </button>
                        )}
                    </div>
                )}
            </div>

            <style>{`
        @keyframes wizardIn {
          from { opacity: 0; transform: scale(0.92) translateY(20px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
        </div>
    )
}

