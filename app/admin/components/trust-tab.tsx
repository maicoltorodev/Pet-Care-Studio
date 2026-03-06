"use client"
import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Shield, Lock, Save, Star, CheckCircle2, Activity, Heart, Sparkles, Users } from "lucide-react"
import { useCMS } from "@/hooks/use-cms"
import { Badge } from "@/components/ui/badge"

export function TrustTab() {
    const { content, saveContent } = useCMS();
    const [localData, setLocalData] = useState<Record<string, string>>({});

    useEffect(() => {
        if (content && content.length > 0) {
            const newLocal: Record<string, string> = {};
            content.forEach((c: { key: string; value: string }) => {
                newLocal[c.key] = c.value;
            });
            setLocalData(newLocal);
        }
    }, [content]);

    const handleChange = (key: string, val: string) => {
        setLocalData(prev => ({ ...prev, [key]: val }));
    };

    const handleBlur = (key: string, val: string) => {
        saveContent(key, val);
    };

    const getLocalVal = (key: string, fallback: string = "") => {
        return localData[key] !== undefined ? localData[key] : fallback;
    };

    return (
        <div className="space-y-12 max-w-7xl mx-auto pb-32 selection:bg-primary/20">
            {/* HEADER */}
            <div className="admin-card py-10 px-10 text-center">
                <div className="admin-divider absolute top-0 left-0 w-full" />
                <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                        <Shield className="h-7 w-7" />
                    </div>
                    <h2 className="admin-title text-4xl">
                        Garantías y <span className="text-primary">Confianza</span>
                    </h2>
                    <p className="admin-body">Configura lo que te hace especial y por qué deben elegirte</p>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { num: 1, icon: Users, label: "Total Clientes", fallbackVal: "+500", fallbackLabel: "Clientes felices" },
                    { num: 2, icon: Activity, label: "Experiencia", fallbackVal: "10+", fallbackLabel: "Años de trabajo" },
                    { num: 3, icon: Star, label: "Garantía", fallbackVal: "100%", fallbackLabel: "Atención garantizada" }
                ].map((item) => (
                    <div key={item.num} className="admin-card p-10 group transition-all duration-700 hover:border-white/20">
                        {/* Background Decoration */}
                        <div className="absolute -top-10 -right-10 h-40 w-40 bg-primary/5 blur-[80px] group-hover:bg-primary/10 transition-colors" />

                        <div className="relative z-10 space-y-10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                        <item.icon className="h-4 w-4 text-primary" />
                                    </div>
                                    <span className="admin-muted">Dato #{item.num}</span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="admin-muted">Número o Cifra</label>
                                    <Input
                                        className="admin-input h-16 text-4xl px-6 italic-none"
                                        placeholder={item.fallbackVal}
                                        value={getLocalVal(`trust_stat_${item.num}_val`)}
                                        onChange={(e) => handleChange(`trust_stat_${item.num}_val`, e.target.value)}
                                        onBlur={(e) => handleBlur(`trust_stat_${item.num}_val`, e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="admin-dim">Texto Corto</label>
                                    <Input
                                        className="admin-input h-10 text-[10px] px-4 text-white/50"
                                        placeholder={item.fallbackLabel}
                                        value={getLocalVal(`trust_stat_${item.num}_label`)}
                                        onChange={(e) => handleChange(`trust_stat_${item.num}_label`, e.target.value)}
                                        onBlur={(e) => handleBlur(`trust_stat_${item.num}_label`, e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid gap-12 lg:grid-cols-5 items-start">
                {/* Main Promise */}
                <div className="lg:col-span-3 admin-card">
                    <div className="p-10 border-b border-white/[0.05] bg-white/[0.01]">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-10 w-10 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                                <Lock className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="admin-section-title">Nuestra Promesa</h3>
                                <p className="admin-muted mt-1">Lo que nos hace únicos</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-10 space-y-10">
                        <div className="space-y-4">
                            <label className="admin-muted">Título del Compromiso</label>
                            <Input
                                className="admin-input h-16 text-2xl px-10 border-l-4 border-l-cyan-500/40 italic-none"
                                placeholder="NUESTRO COMPROMISO"
                                value={getLocalVal("trust_title")}
                                onChange={(e) => handleChange("trust_title", e.target.value)}
                                onBlur={(e) => handleBlur("trust_title", e.target.value)}
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="admin-muted">Descripción de tu Garantía</label>
                            <Textarea
                                className="admin-input min-h-[250px] text-base leading-relaxed p-10 text-white/40"
                                placeholder="Describe por qué los clientes deben elegir tu peluquería..."
                                value={getLocalVal("trust_description")}
                                onChange={(e) => handleChange("trust_description", e.target.value)}
                                onBlur={(e) => handleBlur("trust_description", e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Sub Points */}
                <div className="lg:col-span-2 space-y-8">
                    {[1, 2].map((num) => {
                        const accentColor = num === 1 ? "orange" : "emerald";
                        const accentHex = num === 1 ? "rgba(249,115,22,1)" : "rgba(16,185,129,1)";
                        const Icon = num === 1 ? Heart : Sparkles;

                        return (
                            <div key={num} className="admin-card overflow-hidden group transition-all duration-700">
                                <div className="p-8 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`h-10 w-10 rounded-2xl bg-${accentColor}-500/10 text-${accentColor}-500 flex items-center justify-center border border-${accentColor}-500/20 shadow-[0_0_15px_${accentHex.replace('1)', '0.1)')}]`}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <Badge variant="outline" className={`bg-${accentColor}-500/5 text-${accentColor}-500 border-${accentColor}-500/20 rounded-full px-3 py-0.5 admin-label italic-none`}>
                                                Garantía #{num}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <Input
                                            className={`admin-input h-10 text-sm px-4`}
                                            placeholder="Ej: Sin Jaulas ni Sedantes"
                                            value={getLocalVal(`trust_point_${num}_title`)}
                                            onChange={(e) => handleChange(`trust_point_${num}_title`, e.target.value)}
                                            onBlur={(e) => handleBlur(`trust_point_${num}_title`, e.target.value)}
                                        />
                                        <Textarea
                                            className={`admin-input h-24 text-xs px-4 py-3 text-white/40`}
                                            placeholder="Descripción detallada del beneficio..."
                                            value={getLocalVal(`trust_point_${num}_desc`)}
                                            onChange={(e) => handleChange(`trust_point_${num}_desc`, e.target.value)}
                                            onBlur={(e) => handleBlur(`trust_point_${num}_desc`, e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    <div className="p-8 rounded-[2rem] bg-white/[0.01] border border-dashed border-white/5 flex flex-col items-center justify-center text-center gap-4 opacity-50 group hover:opacity-100 transition-opacity">
                        <div className="h-10 w-10 flex items-center justify-center text-white/10">
                            <Save className="h-5 w-5 animate-pulse" />
                        </div>
                        <p className="admin-label text-white/20">Se guarda automáticamente</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
