"use client"
import React from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Loader2, Plus, Trash2, Camera, Save, CheckCircle, Sparkles, Scissors } from "lucide-react"
import { useCMS, Transformation } from "@/hooks/use-cms"

export function TransformationsTab() {
    const {
        transformations, handleAddTransformation, handleTransformationChange,
        handleUpdateTransformation, handleDeleteTransformation,
        handleTransformationImageUpload, handleRemoveTransformationMedia, saving
    } = useCMS();

    return (
        <div className="space-y-8 max-w-[1200px] mx-auto pb-32 animate-in fade-in duration-700">
            {/* HEADER */}
            <div className="admin-card py-10 px-10 text-center">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                <div className="relative z-10 flex flex-col items-center gap-5">
                    <h2 className="admin-title text-4xl">
                        Resultados <span className="text-primary">Reales</span>
                    </h2>
                    <p className="admin-body">Muestra los increíbles cambios de look en tu peluquería</p>
                    <button onClick={handleAddTransformation} disabled={saving} className="admin-btn-primary">
                        <Plus className="h-4 w-4" />
                        Subir Nueva Transformación
                    </button>
                </div>
            </div>

            <div className="grid gap-12 lg:grid-cols-2">
                {transformations?.map((trans: Transformation) => (
                    <div key={trans.id} className="admin-card transition-all duration-700">
                        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

                        {/* Comparison Visualizer */}
                        <div className="relative grid grid-cols-2 gap-0 overflow-hidden h-[260px] md:h-[460px] bg-black/40">
                            {/* VS Divider */}
                            <div className="absolute inset-y-0 left-1/2 w-px bg-white/10 z-10" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                                <div className="h-12 w-12 rounded-full bg-black/80 border border-white/10 flex items-center justify-center shadow-2xl backdrop-blur-3xl">
                                    <span className="admin-label text-white/20 italic-none">VS</span>
                                </div>
                            </div>

                            {/* Before Section */}
                            <div className="relative group/before overflow-hidden h-full">
                                <Badge className="absolute top-6 left-6 z-30 bg-black/60 backdrop-blur-md text-white/40 border-white/10 rounded-full px-4 py-1.5 admin-label italic-none">Antes</Badge>
                                {trans.before_image_url ? (
                                    <>
                                        <img src={trans.before_image_url} alt="Antes" className="w-full h-full object-cover grayscale-[40%] opacity-40 transition-transform duration-1000 group-hover/before:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
                                        <button
                                            onClick={() => handleRemoveTransformationMedia(trans.id.toString(), 'before_image_url', trans.before_image_url)}
                                            className="absolute bottom-6 left-6 h-10 w-10 bg-black/80 backdrop-blur-md text-white/20 hover:text-destructive border border-white/10 rounded-full transition-all flex items-center justify-center opacity-0 group-hover/before:opacity-100 hover:scale-110 active:scale-95"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </>
                                ) : (
                                    <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full bg-white/[0.01] hover:bg-white/[0.03] transition-all border-r border-white/5">
                                        <div className="h-14 w-14 rounded-full border border-white/5 flex items-center justify-center mb-4 transition-transform duration-500 group-hover/before:scale-110">
                                            <Camera className="h-5 w-5 text-white/10" />
                                        </div>
                                        <span className="admin-label text-white/10">Subir Antes</span>
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleTransformationImageUpload(e, trans.id.toString(), 'before_image_url')} disabled={saving} />
                                    </label>
                                )}
                            </div>

                            {/* After Section */}
                            <div className="relative group/after overflow-hidden h-full">
                                <Badge className="absolute top-6 right-6 z-30 bg-primary/20 backdrop-blur-md text-primary border-primary/20 rounded-full px-4 py-1.5 admin-label flex items-center gap-2 italic-none">
                                    <Sparkles className="h-3.5 w-3.5 animate-pulse" /> Después
                                </Badge>
                                {trans.after_image_url ? (
                                    <>
                                        <img src={trans.after_image_url} alt="Después" className="w-full h-full object-cover saturate-[1.2] transition-transform duration-1000 group-hover/after:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-l from-black/40 to-transparent" />
                                        <button
                                            onClick={() => handleRemoveTransformationMedia(trans.id.toString(), 'after_image_url', trans.after_image_url)}
                                            className="absolute bottom-6 right-6 h-10 w-10 bg-black/80 backdrop-blur-md text-white/20 hover:text-destructive border border-white/10 rounded-full transition-all flex items-center justify-center opacity-0 group-hover/after:opacity-100 hover:scale-110 active:scale-95"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </>
                                ) : (
                                    <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full bg-white/[0.01] hover:bg-white/[0.03] transition-all">
                                        <div className="h-14 w-14 rounded-full border border-white/5 flex items-center justify-center mb-4 transition-transform duration-500 group-hover/after:scale-110">
                                            <Sparkles className="h-5 w-5 text-white/10" />
                                        </div>
                                        <span className="admin-label text-white/10">Subir Después</span>
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleTransformationImageUpload(e, trans.id.toString(), 'after_image_url')} disabled={saving} />
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-5 md:p-10 space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="admin-muted">Nombre de la Mascota</label>
                                    <Input className="admin-input text-xl"
                                        value={trans.name}
                                        onChange={(e) => handleTransformationChange(trans.id.toString(), "name", e.target.value)}
                                        placeholder="Ej: Pinky" />
                                </div>
                                <div className="space-y-2">
                                    <label className="admin-muted">Raza o Descripción</label>
                                    <Input className="admin-input text-sm"
                                        value={trans.breed ?? ""}
                                        onChange={(e) => handleTransformationChange(trans.id.toString(), "breed", e.target.value)}
                                        placeholder="Ej: Poodle" />
                                </div>
                            </div>

                            <div className="border-t border-white/[0.06] pt-8">
                                <button onClick={() => handleDeleteTransformation(trans)}
                                    className="admin-btn-danger w-full rounded-xl gap-3 text-[10px] font-black uppercase tracking-widest">
                                    <Trash2 className="h-3.5 w-3.5" />
                                    Eliminar Resultado
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {transformations?.length === 0 && (
                    <div className="col-span-full py-40 flex flex-col items-center justify-center relative overflow-hidden rounded-[2.5rem] border border-dashed border-white/10 bg-white/[0.01] backdrop-blur-2xl group">
                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-primary/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                            <div className="h-24 w-24 rounded-full border border-dashed border-white/10 flex items-center justify-center group-hover:border-primary transition-all duration-700">
                                <Scissors className="h-10 w-10 text-white/5 group-hover:text-primary transition-colors duration-700" />
                            </div>
                        </div>
                        <h3 className="admin-title text-3xl opacity-30 mb-4">No hay fotos registradas</h3>
                        <p className="admin-dim mb-10">Sube las transformaciones de tus clientes</p>
                    </div>
                )}
            </div>
        </div>
    )
}
