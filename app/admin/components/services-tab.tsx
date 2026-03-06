"use client"
import React from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Plus, Trash2, Camera, Image as ImageIcon, Scissors,
    Waves, Sparkles, ShowerHead as Shower, HeartPulse, Bath, Wind,
    Stethoscope, Dog, Cat, Star, Gift, ArrowUp, ArrowDown
} from "lucide-react"
import { useCMS, Service } from "@/hooks/use-cms"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"

const iconList = [
    { id: 'Scissors', icon: Scissors, label: 'Corte' },
    { id: 'Waves', icon: Waves, label: 'Baño' },
    { id: 'Sparkles', icon: Sparkles, label: 'Spa' },
    { id: 'Shower', icon: Shower, label: 'Ducha' },
    { id: 'HeartPulse', icon: HeartPulse, label: 'Salud' },
    { id: 'Bath', icon: Bath, label: 'Tina' },
    { id: 'Wind', icon: Wind, label: 'Secado' },
    { id: 'Stethoscope', icon: Stethoscope, label: 'Vet' },
    { id: 'Dog', icon: Dog, label: 'Perro' },
    { id: 'Cat', icon: Cat, label: 'Gato' },
    { id: 'Star', icon: Star, label: 'Premium' },
    { id: 'Gift', icon: Gift, label: 'Regalo' }
]

const iconMap: { [key: string]: any } = {
    Scissors, Waves, Sparkles, Shower, HeartPulse, Bath, Wind,
    Stethoscope, Dog, Cat, Star, Gift
}

export function ServicesTab() {
    const {
        services, handleAddService, handleServiceChange, handleUpdateService,
        handleDeleteService, handleServiceImageUpload, handleMoveService, saving
    } = useCMS();

    const [pickerOpen, setPickerOpen] = React.useState(false)
    const [activeServiceId, setActiveServiceId] = React.useState<string | null>(null)

    const handleOpenPicker = (id: string) => {
        setActiveServiceId(id)
        setPickerOpen(true)
    }

    return (
        <div className="space-y-8 max-w-[1200px] mx-auto pb-32 animate-in fade-in duration-700">

            {/* HEADER */}
            <div className="admin-card py-10 px-10 text-center">
                <div className="admin-divider absolute top-0 left-0 w-full" />
                <div className="relative z-10 flex flex-col items-center gap-5">
                    <h2 className="admin-title text-4xl">
                        Tus <span className="text-primary">Servicios</span>
                    </h2>
                    <p className="admin-body">Gestiona los cuidados y precios de tu peluquería</p>
                    <button
                        onClick={handleAddService}
                        disabled={saving}
                        className="admin-btn-primary"
                    >
                        <Plus className="h-4 w-4" />
                        Agregar Nuevo Servicio
                    </button>
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {services?.map((service: Service) => (
                    <div key={service.id} className="admin-card group flex flex-col">
                        <div className="admin-divider absolute top-0 left-0 w-full" />

                        {/* Image Canvas */}
                        <div className="relative h-44 md:h-60 w-full bg-black/40 overflow-hidden rounded-t-[2.4rem]">
                            {service.image_url ? (
                                <>
                                    <img src={service.image_url} alt={service.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full space-y-4">
                                    <div className="h-16 w-16 rounded-full border border-white/[0.08] flex items-center justify-center group-hover:border-primary/30 group-hover:text-primary transition-all duration-500">
                                        <ImageIcon className="h-6 w-6 text-white/10" />
                                    </div>
                                    <span className="admin-dim">Sin Foto</span>
                                </div>
                            )}

                            {/* Upload trigger */}
                            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <label className="cursor-pointer admin-btn-primary text-[9px]">
                                    <Camera className="h-3 w-3" />
                                    Cambiar Foto
                                    <input type="file" className="hidden" accept="image/jpeg,image/png,image/webp"
                                        onChange={(e) => handleServiceImageUpload(e, service.id, service.image_url ?? undefined)} />
                                </label>
                            </div>

                            {/* Order controls */}
                            <div className="absolute top-5 right-5 flex flex-col gap-1 z-30">
                                <span className="admin-badge-muted text-[8px] mb-1">#{services.indexOf(service) + 1}</span>
                                <button onClick={() => handleMoveService(service.id, 'up')} disabled={services.indexOf(service) === 0}
                                    className="h-7 w-7 rounded-full bg-black/70 border border-white/10 text-white/40 flex items-center justify-center hover:bg-primary hover:text-white disabled:opacity-0 transition-all">
                                    <ArrowUp className="h-3 w-3" />
                                </button>
                                <button onClick={() => handleMoveService(service.id, 'down')} disabled={services.indexOf(service) === services.length - 1}
                                    className="h-7 w-7 rounded-full bg-black/70 border border-white/10 text-white/40 flex items-center justify-center hover:bg-primary hover:text-white disabled:opacity-0 transition-all">
                                    <ArrowDown className="h-3 w-3" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 md:p-8 flex-1 flex flex-col gap-5 relative">
                            {/* Icon preview (Clickable) */}
                            {service.image_url ? (
                                <button
                                    onClick={() => handleOpenPicker(service.id)}
                                    title="Cambiar Icono"
                                    className="absolute right-8 -top-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-card border border-white/20 shadow-2xl z-20 group-hover:scale-110 group-hover:border-primary/40 transition-all duration-500 hover:shadow-primary/30 active:scale-95"
                                >
                                    {React.createElement(iconMap[service.icon || 'Scissors'] || Scissors, { className: "h-6 w-6 text-primary" })}
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleOpenPicker(service.id)}
                                    className="mb-1 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all active:scale-95"
                                >
                                    {React.createElement(iconMap[service.icon || 'Scissors'] || Scissors, { className: "h-7 w-7 text-primary" })}
                                </button>
                            )}

                            <div className="space-y-2">
                                <label className="admin-muted">Nombre del Servicio</label>
                                <Input className="admin-input text-lg" value={service.title}
                                    onChange={(e) => handleServiceChange(service.id, "title", e.target.value)}
                                    placeholder="Nombre del servicio..." />
                            </div>

                            <div className="space-y-2 flex-1">
                                <label className="admin-muted">Descripción</label>
                                <Textarea
                                    className="admin-input min-h-[100px] resize-none pt-4"
                                    value={service.description ?? ""}
                                    onChange={(e) => handleServiceChange(service.id, "description", e.target.value)}
                                    placeholder="Detalla el proceso..." />
                            </div>

                            {/* Price */}
                            <div className="space-y-2">
                                <label className="admin-muted">Precio</label>
                                <div className="relative group/price">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-primary font-black text-xl z-20 pointer-events-none transition-transform group-focus-within/price:scale-110">$</span>
                                    <Input type="text" className="admin-input pl-14 text-2xl font-black"
                                        value={service.price ?? ""}
                                        onChange={(e) => handleServiceChange(service.id, "price", e.target.value)}
                                        placeholder="0" />
                                </div>
                            </div>

                            {/* Features */}
                            <div className="space-y-3 pt-2 border-t border-white/[0.06]">
                                <label className="admin-muted">Atributos Clave (3)</label>
                                {[0, 1, 2].map((idx) => (
                                    <div key={idx} className="relative group/feat">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary/40 z-20 pointer-events-none group-focus-within/feat:bg-primary transition-colors" />
                                        <Input className="admin-input h-11 pl-14 text-xs font-black uppercase tracking-widest"
                                            value={service.features?.[idx] || ""}
                                            onChange={(e) => {
                                                const nf = [...(service.features || ["", "", ""])];
                                                nf[idx] = e.target.value;
                                                handleServiceChange(service.id, "features", nf);
                                            }}
                                            placeholder={`Característica ${idx + 1}...`} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Delete */}
                        <div className="p-6 border-t border-white/[0.06] flex">
                            <button
                                className="admin-btn-danger w-full rounded-xl gap-3 text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
                                onClick={() => handleDeleteService(service.id)}
                                disabled={saving}
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                Eliminar Servicio
                            </button>
                        </div>
                    </div>
                ))}

                {services?.length === 0 && (
                    <div className="col-span-full py-32 flex flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-white/[0.08] bg-white/[0.01] group">
                        <Scissors className="h-16 w-16 text-white/[0.06] mb-8 group-hover:text-primary transition-colors duration-500" />
                        <h3 className="admin-title text-2xl text-white/20 mb-3">No hay servicios</h3>
                        <p className="admin-dim mb-10">Crea los servicios de tu peluquería</p>
                        <button onClick={handleAddService} className="admin-btn-primary">
                            <Plus className="h-4 w-4" /> Crear Primer Servicio
                        </button>
                    </div>
                )}
            </div>

            {/* ICON PICKER MODAL */}
            <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
                <DialogContent className="max-w-md bg-black/90 border-white/10 backdrop-blur-3xl rounded-[2.5rem] p-10 overflow-hidden">
                    <DialogHeader className="mb-8">
                        <DialogTitle className="admin-title text-2xl">Seleccionar <span className="text-primary">Icono</span></DialogTitle>
                        <DialogDescription className="admin-body">Elige el símbolo que mejor representa este servicio</DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-4 gap-4 p-2">
                        {iconList.map((item) => {
                            const Icon = item.icon
                            const currentService = services?.find(s => s.id === activeServiceId)
                            const isSelected = currentService?.icon === item.id

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        if (activeServiceId) {
                                            handleServiceChange(activeServiceId, "icon", item.id)
                                            setPickerOpen(false)
                                        }
                                    }}
                                    className={`group relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all duration-300 ${isSelected
                                        ? 'bg-primary/20 border-primary text-primary shadow-[0_0_20px_rgba(45,212,191,0.2)]'
                                        : 'bg-white/[0.03] border-white/10 text-white/30 hover:bg-white/[0.08] hover:border-white/20 hover:text-white'
                                        }`}
                                >
                                    <Icon className={`h-6 w-6 transition-transform duration-300 group-hover:scale-110 ${isSelected ? 'animate-pulse' : ''}`} />
                                    <span className="text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                        {item.label}
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
