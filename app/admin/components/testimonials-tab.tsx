"use client"
import React from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trash2, CheckCircle, Star, Ban, Award, Sparkles, Quote, Heart, Activity } from "lucide-react"
import { useCMS, Testimonial } from "@/hooks/use-cms"

const AVATAR_COLORS = [
    "from-violet-500 to-purple-600",
    "from-cyan-500 to-teal-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-600",
    "from-emerald-500 to-green-600",
    "from-blue-500 to-indigo-600",
]

export function TestimonialsTab() {
    const {
        testimonials, pendingTestimonials, handleApproveTestimonial,
        handleRejectTestimonial, handleTestimonialChange, handleUpdateTestimonial,
        handleDeleteTestimonial, saving
    } = useCMS();

    return (
        <div className="space-y-8 md:space-y-16 max-w-7xl mx-auto pb-32 selection:bg-primary/20 animate-in fade-in duration-1000">

            {/* HEADER */}
            <div className="admin-card py-10 px-10 text-center">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                <div className="relative z-10 flex flex-col items-center gap-6">
                    <h2 className="admin-title text-4xl">
                        Opiniones <span className="text-primary">De Clientes</span>
                    </h2>
                    <p className="admin-body">Gestiona lo que los dueños de mascotas dicen sobre tu trabajo</p>
                    <div className="admin-pill gap-3">
                        <Award className="h-4 w-4 text-primary" />
                        {testimonials?.length || 0} / 9 Publicaciones Activas
                    </div>
                </div>
            </div>

            <Tabs defaultValue="pending" className="w-full">
                {/* TAB SWITCHER */}
                <div className="flex justify-center mb-16">
                    <TabsList className="bg-black/50 border border-white/10 h-14 p-1.5 rounded-2xl backdrop-blur-3xl shadow-2xl gap-1">
                        <TabsTrigger
                            value="pending"
                            className="h-full rounded-xl px-4 md:px-8 data-[state=active]:bg-white/10 data-[state=active]:border data-[state=active]:border-white/20 border border-transparent transition-all duration-300"
                            style={{ fontStyle: 'normal' }}
                        >
                            <div className="flex items-center gap-3 text-white/40 data-[state=active]:text-white">
                                <Sparkles className="h-3.5 w-3.5 data-[state=active]:text-amber-400" />
                                <span className="admin-label">Por Aprobar</span>
                                {pendingTestimonials?.length > 0 && (
                                    <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                                )}
                            </div>
                        </TabsTrigger>
                        <TabsTrigger
                            value="approved"
                            className="h-full rounded-xl px-4 md:px-8 data-[state=active]:bg-white/10 data-[state=active]:border data-[state=active]:border-white/20 border border-transparent transition-all duration-300"
                            style={{ fontStyle: 'normal' }}
                        >
                            <div className="flex items-center gap-3 text-white/40 data-[state=active]:text-white">
                                <Award className="h-3.5 w-3.5 data-[state=active]:text-primary" />
                                <span className="admin-label">Publicadas</span>
                            </div>
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* POR APROBAR */}
                <TabsContent value="pending" className="animate-in fade-in slide-in-from-bottom-4 duration-500 outline-none">
                    {pendingTestimonials?.length === 0 ? (
                        <div className="py-40 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-[3rem] relative overflow-hidden group">
                            {/* Ambient glow */}
                            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
                            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-40 w-40 bg-primary/10 rounded-full blur-3xl animate-pulse pointer-events-none" />

                            <div className="relative mb-8">
                                <div className="h-24 w-24 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-all duration-700 group-hover:border-primary/40 shadow-[0_0_40px_rgba(45,212,191,0.15)]">
                                    <Heart className="h-10 w-10 text-primary/70 group-hover:text-primary transition-colors duration-500" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-black flex items-center justify-center">
                                    <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                                </div>
                            </div>

                            <h3 className="text-2xl font-black text-white tracking-tight mb-3" style={{ fontStyle: 'normal' }}>Tu bandeja está limpia</h3>
                            <p className="text-white/50 text-sm font-medium" style={{ fontStyle: 'normal' }}>Las nuevas reseñas de clientes aparecerán aquí para revisión</p>
                        </div>
                    ) : (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {pendingTestimonials?.map((t: Testimonial, idx: number) => (
                                <div key={t.id} className="admin-card group flex flex-col hover:-translate-y-1 transition-transform duration-300">
                                    <div className="absolute inset-0 bg-gradient-to-b from-amber-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[2.5rem] pointer-events-none" />

                                    {/* Image zone */}
                                    <div className="relative h-52 overflow-hidden rounded-t-[2.4rem]">
                                        {t.image_url ? (
                                            <>
                                                <img src={t.image_url} alt="Mascota" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                            </>
                                        ) : (
                                            <div className={`w-full h-full bg-gradient-to-br ${AVATAR_COLORS[idx % AVATAR_COLORS.length]} opacity-10`} />
                                        )}
                                        <div className="absolute top-6 right-6">
                                            <span className="bg-black/70 backdrop-blur-md text-amber-400 border border-amber-500/30 rounded-full px-4 py-1.5 admin-label shadow-xl">
                                                Pendiente
                                            </span>
                                        </div>
                                        <div className="absolute bottom-5 left-6">
                                            <div className="flex gap-0.5">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star key={i} className={`h-3 w-3 ${i < (t.rating || 5) ? "fill-amber-400 text-amber-400" : "text-white/10"}`} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-8 flex-1 space-y-6 relative z-10">
                                        <div>
                                            <h4 className="admin-section-title text-lg mb-1">{t.client_name}</h4>
                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                                <p className="admin-muted">Mascota: {t.pet_name || "—"}</p>
                                            </div>
                                        </div>

                                        <div className="relative p-6 bg-black/50 border border-white/[0.07] rounded-2xl text-white/60 text-sm leading-relaxed" style={{ fontStyle: 'normal' }}>
                                            <Quote className="absolute -top-3 -left-3 h-8 w-8 text-primary opacity-10" />
                                            "{t.content}"
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="p-8 pt-0 flex gap-3">
                                        <button onClick={() => handleRejectTestimonial(t)} title="Rechazar"
                                            className="admin-btn-danger w-12 px-0">
                                            <Ban className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => handleApproveTestimonial(t)}
                                            className="admin-btn-primary flex-1">
                                            <CheckCircle className="h-4 w-4" />
                                            Publicar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </TabsContent>

                {/* PUBLICADAS */}
                <TabsContent value="approved" className="animate-in fade-in slide-in-from-bottom-4 duration-500 outline-none">
                    {testimonials?.length === 0 ? (
                        <div className="py-48 flex flex-col items-center justify-center bg-white/[0.01] border border-dashed border-white/[0.06] rounded-[3rem] group">
                            <div className="h-20 w-20 rounded-full bg-white/[0.02] border border-white/[0.06] flex items-center justify-center mb-8 group-hover:scale-110 transition-all duration-700">
                                <Award className="h-8 w-8 text-white/10 group-hover:text-primary transition-colors" />
                            </div>
                            <h3 className="admin-title text-2xl opacity-30">Muro de Inspiración</h3>
                            <p className="admin-dim mt-4">Tus mejores historias aparecerán aquí</p>
                        </div>
                    ) : (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {testimonials?.map((t: Testimonial, idx: number) => (
                                <div key={t.id} className="admin-card group flex flex-col">
                                    {/* Image zone */}
                                    <div className="relative h-44 overflow-hidden rounded-t-[2.4rem]">
                                        {t.image_url ? (
                                            <>
                                                <img src={t.image_url} alt="Mascota" className="w-full h-full object-cover opacity-40 transition-transform duration-700 group-hover:scale-105" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                            </>
                                        ) : (
                                            <div className={`w-full h-full bg-gradient-to-br ${AVATAR_COLORS[idx % AVATAR_COLORS.length]} opacity-5`} />
                                        )}
                                        <div className="absolute top-5 right-5">
                                            <span className="bg-primary/20 backdrop-blur-md text-primary border border-primary/30 rounded-full px-4 py-1.5 admin-label shadow-xl">
                                                Visible
                                            </span>
                                        </div>
                                    </div>

                                    {/* Form fields */}
                                    <div className="p-8 space-y-5 flex-1">
                                        <div className="space-y-1.5">
                                            <label className="admin-muted ml-1">Nombre del Autor</label>
                                            <Input className="admin-input"
                                                value={t.client_name}
                                                onChange={(e) => handleTestimonialChange(t.id, "client_name", e.target.value)} />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="admin-muted ml-1">Mascota</label>
                                                <Input className="admin-input"
                                                    value={t.pet_name ?? ""}
                                                    onChange={(e) => handleTestimonialChange(t.id, "pet_name", e.target.value)} />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="admin-muted ml-1">Estado</label>
                                                <div className="flex items-center gap-2 h-14 px-4 bg-black/60 border border-white/[0.08] rounded-2xl">
                                                    <Activity className="h-3 w-3 text-primary animate-pulse" />
                                                    <span className="admin-muted">Publicado</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="admin-muted ml-1">Reseña</label>
                                            <Textarea
                                                className="admin-input min-h-[140px] resize-none pt-4"
                                                value={t.content}
                                                onChange={(e) => handleTestimonialChange(t.id, "content", e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="p-8 pt-0 flex justify-center">
                                        <button onClick={() => handleDeleteTestimonial(t.id)} title="Eliminar"
                                            className="admin-btn-danger w-12 px-0">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}
