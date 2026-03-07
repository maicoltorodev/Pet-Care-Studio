import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
    Sparkles, Save, Loader2, Link as LinkIcon,
    Instagram, Youtube, Music, Globe, FileText,
    Facebook, Twitter, Phone
} from "lucide-react"
import { useCMS } from "@/hooks/use-cms"

export function IdentidadTab() {
    const { content, saveContent, saving } = useCMS();
    const [localData, setLocalData] = useState<Record<string, string>>({});

    useEffect(() => {
        if (content && content.length > 0) {
            const newLocal: Record<string, string> = {};
            content.forEach((c: { key: string; value: string }) => { newLocal[c.key] = c.value; });
            setLocalData(newLocal);
        }
    }, [content]);

    const handleChange = (key: string, val: string) => setLocalData(prev => ({ ...prev, [key]: val }));
    const handleBlur = (key: string, val: string) => saveContent(key, val);
    const handleSwitch = (key: string, checked: boolean) => {
        const val = checked ? "true" : "false";
        handleChange(key, val);
        saveContent(key, val);
    };
    const getLocalVal = (key: string, fallback: string = "") =>
        localData[key] !== undefined ? localData[key] : fallback;

    return (
        <div className="space-y-8 max-w-[1200px] mx-auto pb-32 animate-in fade-in duration-700">

            {/* HEADER */}
            <div className="admin-card py-10 px-10 text-center">
                <div className="admin-divider absolute top-0 left-0 w-full" />
                <div className="relative z-10 flex flex-col items-center gap-3">
                    <h2 className="admin-title text-4xl">Perfil de tu <span className="text-primary">Negocio</span></h2>
                    <p className="admin-body">Información, contacto y redes sociales</p>

                    <button
                        onClick={() => saveContent("site_name", getLocalVal("site_name"))}
                        disabled={saving}
                        className="mt-4 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2"
                    >
                        {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                        Forzar Actualización de Caché
                    </button>
                </div>
            </div>

            <div className="grid gap-8 xl:grid-cols-2">
                {/* Información Principal */}
                <div className="admin-card p-10">
                    <div className="admin-divider absolute top-0 left-0 w-full" />
                    <div className="flex items-center gap-5 mb-10">
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                            <Sparkles className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="admin-section-title">Información Principal</h3>
                            <p className="admin-muted mt-1">Cómo te ven tus clientes</p>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="admin-muted text-primary/60">Nombre del Local</label>
                            <Input className="admin-input text-lg" placeholder="Ej: Pet Care Studio"
                                value={getLocalVal("site_name")}
                                onChange={(e) => handleChange("site_name", e.target.value)}
                                onBlur={(e) => handleBlur("site_name", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="admin-muted text-primary/60">Slogan</label>
                            <Input className="admin-input" placeholder="Ej: Peluquería Canina Profesional"
                                value={getLocalVal("site_tagline")}
                                onChange={(e) => handleChange("site_tagline", e.target.value)}
                                onBlur={(e) => handleBlur("site_tagline", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="admin-muted text-primary/60">Sobre Nosotros</label>
                            <Textarea className="admin-input min-h-[140px] resize-none pt-4"
                                placeholder="Elevamos el estándar de la estética canina..."
                                value={getLocalVal("footer_description")}
                                onChange={(e) => handleChange("footer_description", e.target.value)}
                                onBlur={(e) => handleBlur("footer_description", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="admin-muted">Botón Principal</label>
                            <Input className="admin-input text-primary font-black tracking-widest uppercase"
                                placeholder="Ej: Agendar Experiencia"
                                value={getLocalVal("hero_button_text")}
                                onChange={(e) => handleChange("hero_button_text", e.target.value)}
                                onBlur={(e) => handleBlur("hero_button_text", e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* Contacto */}
                <div className="admin-card p-10">
                    <div className="admin-divider absolute top-0 left-0 w-full" />
                    <div className="flex items-center gap-5 mb-10">
                        <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20 shrink-0">
                            <Globe className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                            <h3 className="admin-section-title">Contacto</h3>
                            <p className="admin-muted mt-1">Tus datos para que te encuentren</p>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="admin-muted text-accent/70">WhatsApp</label>
                                <Input className="admin-input text-lg" placeholder="318 386 8043"
                                    value={getLocalVal("footer_phone")}
                                    onChange={(e) => handleChange("footer_phone", e.target.value)}
                                    onBlur={(e) => handleBlur("footer_phone", e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="admin-muted text-accent/50">Correo</label>
                                    <Switch className="scale-75 data-[state=checked]:bg-accent"
                                        checked={getLocalVal("footer_email_enabled", "true") === "true"}
                                        onCheckedChange={(c) => handleSwitch("footer_email_enabled", c)} />
                                </div>
                                <Input className="admin-input" placeholder="hola@petcarestudio.com"
                                    value={getLocalVal("footer_email")}
                                    onChange={(e) => handleChange("footer_email", e.target.value)}
                                    onBlur={(e) => handleBlur("footer_email", e.target.value)}
                                    disabled={getLocalVal("footer_email_enabled", "true") === "false"} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="admin-muted text-accent/50">Dirección</label>
                            <Input className="admin-input" placeholder="CRA 15 no.118 78, Bogotá"
                                value={getLocalVal("footer_address")}
                                onChange={(e) => handleChange("footer_address", e.target.value)}
                                onBlur={(e) => handleBlur("footer_address", e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* Títulos de la Web */}
                <div className="admin-card p-10">
                    <div className="admin-divider absolute top-0 left-0 w-full" />
                    <div className="flex items-center gap-5 mb-10">
                        <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
                            <FileText className="h-6 w-6 text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="admin-section-title">Títulos de la Web</h3>
                            <p className="admin-muted mt-1">Cabeceras de cada sección</p>
                        </div>
                    </div>
                    <div className="space-y-6">
                        {[
                            { section: "Resultados", titleKey: "results_title", accentKey: "results_highlight" },
                            { section: "Testimonios", titleKey: "testimonials_title", accentKey: "testimonials_highlight" },
                        ].map((s) => (
                            <div key={s.section} className="space-y-4 p-6 rounded-2xl bg-black/30 border border-white/[0.07]">
                                <div className="flex items-center justify-between">
                                    <span className="admin-section-title text-sm text-white/60">{s.section}</span>
                                    <span className="admin-badge-success">{s.section}</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="admin-dim">Título Base</label>
                                        <Input className="admin-input h-11 text-sm"
                                            value={getLocalVal(s.titleKey)}
                                            onChange={(e) => handleChange(s.titleKey, e.target.value)}
                                            onBlur={(e) => handleBlur(s.titleKey, e.target.value)} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="admin-dim">Acento</label>
                                        <Input className="admin-input h-11 text-sm text-emerald-400 border-emerald-500/10"
                                            value={getLocalVal(s.accentKey)}
                                            onChange={(e) => handleChange(s.accentKey, e.target.value)}
                                            onBlur={(e) => handleBlur(s.accentKey, e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="space-y-2 pt-2">
                            <label className="admin-muted">Frase de Invitación en Testimonios</label>
                            <Input className="admin-input"
                                value={getLocalVal("testimonials_summary")}
                                onChange={(e) => handleChange("testimonials_summary", e.target.value)}
                                onBlur={(e) => handleBlur("testimonials_summary", e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* Redes Sociales */}
                <div className="admin-card p-10">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-500/30 to-transparent" />
                    <div className="flex items-center gap-5 mb-10">
                        <div className="h-12 w-12 rounded-2xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20 shrink-0">
                            <LinkIcon className="h-6 w-6 text-pink-400" />
                        </div>
                        <div>
                            <h3 className="admin-section-title">Ecosistema Digital</h3>
                            <p className="admin-muted mt-1">Conecta tu marca con el mundo</p>
                        </div>
                        <div className="ml-auto flex items-center gap-2 admin-pill">
                            <div className="h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
                            Canales Activos
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        {[
                            { key: "instagram", icon: Instagram, label: "Instagram", grad: "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]" },
                            { key: "facebook", icon: Facebook, label: "Facebook", grad: "bg-blue-600" },
                            { key: "tiktok", icon: Music, label: "TikTok", grad: "bg-white text-black" },
                            { key: "youtube", icon: Youtube, label: "YouTube", grad: "bg-red-600" },
                            { key: "twitter", icon: Twitter, label: "Twitter/X", grad: "bg-black" },
                            { key: "whatsapp", icon: Phone, label: "WhatsApp", grad: "bg-green-500" }
                        ].map((social) => {
                            const enabled = getLocalVal(`social_${social.key}_enabled`) === "true";
                            return (
                                <div key={social.key}
                                    className={`px-6 py-4 rounded-2xl border transition-all duration-300 ${enabled ? "bg-white/[0.04] border-white/10" : "bg-black/20 border-white/[0.06] opacity-40 grayscale"}`}>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${enabled ? social.grad : "bg-white/5"}`}>
                                            <social.icon className="h-4 w-4" />
                                        </div>
                                        <span className="admin-muted w-24 shrink-0">{social.label}</span>
                                        <Input
                                            className="admin-input h-10 flex-1 text-xs"
                                            placeholder={`URL de ${social.label}...`}
                                            value={getLocalVal(`social_${social.key}_url`)}
                                            onChange={(e) => handleChange(`social_${social.key}_url`, e.target.value)}
                                            onBlur={(e) => handleBlur(`social_${social.key}_url`, e.target.value)}
                                            disabled={!enabled} />
                                        <Switch className="shrink-0"
                                            checked={enabled}
                                            onCheckedChange={(c) => handleSwitch(`social_${social.key}_enabled`, c)} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Auto-save indicator */}
            <div className="flex justify-center pt-8">
                <div className="admin-pill gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    {saving ? "Guardando..." : "Guardado automáticamente"}
                    {saving && <Loader2 className="h-3 w-3 animate-spin text-emerald-500" />}
                </div>
            </div>
        </div>
    )
}
