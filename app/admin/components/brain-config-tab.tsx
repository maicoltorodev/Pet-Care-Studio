import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Loader2, Save, Clock, Bot, ShieldCheck, Sparkles, Rocket, Ban, Plus, Minus, X, Check, Calendar
} from "lucide-react"
import { useLeads } from "@/hooks/use-leads"
import { useCMS } from "@/hooks/use-cms"

const DAYS = [
    { id: 1, label: "Lunes" },
    { id: 2, label: "Martes" },
    { id: 3, label: "Miércoles" },
    { id: 4, label: "Jueves" },
    { id: 5, label: "Viernes" },
    { id: 6, label: "Sábado" },
    { id: 0, label: "Domingo" },
]

export function BrainConfigTab({ view = "cerebro" }: { view?: "cerebro" | "agenda" }) {
    const { aiSettings, saveAISetting } = useLeads();
    const { saving } = useCMS();

    const [selectedDayLogistics, setSelectedDayLogistics] = useState<number>(new Date().getDay());
    const [editingTime, setEditingTime] = useState<{ id: string, label: string, icon: any } | null>(null);
    const [editingCapacity, setEditingCapacity] = useState<boolean>(false);
    const [tempTime, setTempTime] = useState<string | null>(null);
    const [tempCapacity, setTempCapacity] = useState<string>("1");

    const [localData, setLocalData] = useState<Record<string, string>>({
        system_instructions: "",
        simultaneous_appointments: "1",
        agenda_closed_days: "0"
    });

    useEffect(() => {
        if (aiSettings && aiSettings.length > 0) {
            const data: Record<string, string> = {};
            aiSettings.forEach((s: { key: string; value: string }) => {
                data[s.key] = s.value;
            });
            setLocalData(prev => ({ ...prev, ...data }));
        }
    }, [aiSettings]);

    const handleChange = (key: string, val: string) => {
        setLocalData(prev => ({ ...prev, [key]: val }));
    };

    const toggleDay = (dayId: number) => {
        const currentDays = localData.agenda_closed_days ? localData.agenda_closed_days.split(',').filter((x: string) => x !== "").map(Number) : [];
        let newDays;
        if (currentDays.includes(dayId)) {
            newDays = currentDays.filter((d: number) => d !== dayId);
        } else {
            newDays = [...currentDays, dayId];
        }
        const val = newDays.sort().join(',');
        handleChange("agenda_closed_days", val);
        saveAISetting("agenda_closed_days", val);
    };

    const isDayClosed = (dayId: number) => {
        return localData.agenda_closed_days?.split(',').includes(dayId.toString());
    };

    const getSetting = (key: string, day: number) => {
        const specific = localData[`${key}_${day}`];
        if (specific) return specific;
        return localData[key] || (key === 'agenda_open' ? '09:00' : '17:00');
    };

    const saveDaySetting = (key: string, day: number, value: string) => {
        handleChange(`${key}_${day}`, value);
        saveAISetting(`${key}_${day}`, value);
    };

    const openModal = (instr: { id: string, label: string, icon: any }) => {
        setEditingTime(instr);
        setTempTime(getSetting(instr.id, selectedDayLogistics));
    };

    const closeModal = () => {
        setEditingTime(null);
        setTempTime(null);
    };

    const commitChanges = () => {
        if (editingTime && tempTime) {
            saveDaySetting(editingTime.id, selectedDayLogistics, tempTime);
        }
        closeModal();
    };

    return (
        <div className="space-y-8 max-w-[1200px] mx-auto pb-24 animate-in fade-in duration-700">
            {/* HEADER */}
            <div className="admin-card py-10 px-10 text-center">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                <div className="relative z-10 flex flex-col items-center gap-5">
                    <h2 className="admin-header-title text-4xl">
                        {view === "cerebro" ? (
                            <>Peluquería <span className="text-primary" style={{ fontStyle: 'normal' }}>IA</span></>
                        ) : (
                            <>Horarios y <span className="text-primary" style={{ fontStyle: 'normal' }}>Capacidad</span></>
                        )}
                    </h2>
                    <p className="admin-label text-white/30">
                        {view === "cerebro"
                            ? "Entrena el ADN y la personalidad de tu asistente digital"
                            : "Define los límites operativos y la disponibilidad del Studio"}
                    </p>
                    <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-3">
                        {view === "cerebro" ? <Bot className="h-4 w-4 text-primary" /> : <Clock className="h-4 w-4 text-primary" />}
                        <span className="admin-label text-white/40">
                            {view === "cerebro" ? "Asistente Activo" : "Control de Agenda"}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 items-start">
                <div className="space-y-8">
                    {view === "cerebro" ? (
                        <div className="admin-card overflow-hidden">
                            <div className="p-8 border-b border-white/[0.06] flex items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <Bot className="h-5 w-5 text-amber-400/60" />
                                    <h3 className="admin-header-title text-lg text-white/70">Guía de Atención al Cliente</h3>
                                </div>
                                <button
                                    onClick={() => saveAISetting("system_instructions", localData.system_instructions)}
                                    className="h-10 px-6 rounded-xl bg-primary text-white admin-label shadow-xl hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                                    disabled={saving}
                                    style={{ fontStyle: 'normal' }}
                                >
                                    Guardar
                                </button>
                            </div>
                            <Textarea
                                value={localData.system_instructions}
                                onChange={(e) => handleChange("system_instructions", e.target.value)}
                                className="min-h-[600px] font-mono text-sm leading-relaxed bg-black/40 border-0 rounded-none p-10 text-white/60 focus-visible:ring-0"
                                style={{ fontStyle: 'normal' }}
                                placeholder="Define el comportamiento aquí..."
                            />
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in fade-in duration-700">
                            {/* 🗓️ Day Ribbon */}
                            <div className="admin-card">
                                <div className="flex gap-2 p-6 bg-white/[0.02] border-b border-white/[0.05] overflow-x-auto no-scrollbar">
                                    {DAYS.map((day) => {
                                        const active = selectedDayLogistics === day.id;
                                        const closed = isDayClosed(day.id);
                                        return (
                                            <button
                                                key={day.id}
                                                onClick={() => setSelectedDayLogistics(day.id)}
                                                className={`
                                                    flex-shrink-0 min-w-[72px] py-4 rounded-2xl flex flex-col items-center gap-2 transition-all duration-500
                                                    ${active ? 'bg-white/10 text-white border border-white/20 shadow-lg' : 'text-white/40 hover:text-white border border-transparent'}
                                                `}
                                            >
                                                <span className="text-[9px] font-semibold uppercase tracking-wide" style={{ fontStyle: 'normal' }}>{day.label.slice(0, 3)}</span>
                                                <div className={`h-1.5 w-1.5 rounded-full ${closed ? 'bg-destructive/60' : 'bg-emerald-500/60'} shadow-[0_0_8px_rgba(0,0,0,0.5)]`} />
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="p-10 space-y-12">
                                    <div className="flex items-center justify-between gap-6">
                                        <h3 className="admin-title text-2xl">
                                            {DAYS.find(d => d.id === selectedDayLogistics)?.label}
                                        </h3>
                                        <button
                                            onClick={() => toggleDay(selectedDayLogistics)}
                                            className={`px-8 h-12 rounded-xl admin-label transition-all border ${isDayClosed(selectedDayLogistics)
                                                ? 'bg-destructive/5 border-destructive/20 text-destructive'
                                                : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'}`}
                                            style={{ fontStyle: 'normal' }}
                                        >
                                            {isDayClosed(selectedDayLogistics) ? 'CERRADO' : 'ABIERTO'}
                                        </button>
                                    </div>

                                    {!isDayClosed(selectedDayLogistics) ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            {[
                                                { id: 'agenda_open', label: 'Apertura', icon: Rocket },
                                                { id: 'agenda_close', label: 'Cierre', icon: ShieldCheck }
                                            ].map((instr) => {
                                                const rawValue = getSetting(instr.id, selectedDayLogistics);
                                                const [h, m] = rawValue.split(':');
                                                const hour24 = parseInt(h);
                                                const hour12 = hour24 % 12 || 12;
                                                const period = hour24 >= 12 ? 'PM' : 'AM';

                                                return (
                                                    <div
                                                        key={instr.id}
                                                        onClick={() => openModal(instr)}
                                                        className="relative group overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/40 p-10 transition-all hover:bg-black/60 shadow-xl cursor-pointer flex flex-col items-center"
                                                    >
                                                        <div className="w-full flex items-center justify-between mb-5">
                                                            <div className="flex items-center gap-2">
                                                                <instr.icon className="h-4 w-4 text-white/20" />
                                                                <span className="admin-muted">{instr.label}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-baseline text-5xl md:text-7xl font-sans font-black tracking-tighter text-white" style={{ fontStyle: 'normal' }}>
                                                            <span>{hour12}</span>
                                                            <span>:{m}</span>
                                                            <span className={`text-base font-black tracking-widest ml-3 admin-label lowercase ${period === 'AM' ? 'text-emerald-500' : 'text-indigo-500'} translate-y-[-10px]`}>
                                                                {period}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="py-16 flex flex-col items-center text-center space-y-4 bg-white/[0.01] rounded-3xl border border-dashed border-white/[0.06]">
                                            <Ban className="h-10 w-10 text-white/[0.08]" />
                                            <h4 className="admin-section-title text-white/30">Día de Descanso</h4>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 💎 Cinematic Capacity Monitor */}
                            <div
                                onClick={() => {
                                    setTempCapacity(localData.simultaneous_appointments || "1");
                                    setEditingCapacity(true);
                                }}
                                className="admin-card p-10 shadow-2xl group cursor-pointer transition-all duration-700 hover:bg-white/[0.05] hover:border-white/30"
                            >
                                <div className="absolute top-0 right-0 p-8">
                                    <div className="h-10 w-10 rounded-full bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-center">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-12">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full scale-150 animate-pulse" />
                                        <div className="h-24 w-24 rounded-[2rem] bg-white/[0.03] text-white/40 flex items-center justify-center border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-700">
                                            <Calendar className="h-10 w-10" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <span className="admin-muted">Capacidad Máxima</span>
                                        <h3 className="admin-section-title">Peluqueros Disponibles</h3>
                                    </div>
                                    <div className="flex items-baseline gap-4">
                                        <span className="text-5xl md:text-7xl admin-stat drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                                            {localData.simultaneous_appointments || "1"}
                                        </span>
                                        <span className="admin-dim">Atención simultánea</span>
                                    </div>
                                </div>

                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-1000" />
                            </div>
                        </div>
                    )}
                </div>
            </div >

            {/* 🕰️ REFINED MODAL */}
            {
                editingTime && tempTime && (() => {
                    const [h, m] = tempTime.split(':');
                    const hour24 = parseInt(h);
                    const hour12 = hour24 % 12 || 12;
                    const period = hour24 >= 12 ? 'PM' : 'AM';

                    const updateTemp = (newH24: number, newM: string) => {
                        setTempTime(`${newH24.toString().padStart(2, '0')}:${newM}`);
                    };

                    const adjustHour = (delta: number) => {
                        let h12 = hour12 + delta;
                        if (h12 > 12) h12 = 1;
                        if (h12 < 1) h12 = 12;
                        const newH24 = period === 'PM' ? (h12 === 12 ? 12 : h12 + 12) : (h12 === 12 ? 0 : h12);
                        updateTemp(newH24, m);
                    };

                    const adjustMinute = (delta: number) => {
                        let min = (parseInt(m) + delta + 60) % 60;
                        updateTemp(hour24, min.toString().padStart(2, '0'));
                    };

                    const togglePeriod = () => {
                        const newH24 = (hour24 + 12) % 24;
                        updateTemp(newH24, m);
                    };

                    return (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl animate-in fade-in duration-500">
                            <div className="absolute inset-0" onClick={commitChanges} />

                            <div className="relative w-full max-w-md bg-zinc-900/90 border border-white/10 rounded-[2.5rem] shadow-2xl p-10 animate-in zoom-in-95 duration-500">
                                <button onClick={commitChanges} className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors">
                                    <X className="h-6 w-6" />
                                </button>

                                <div className="flex flex-col items-center space-y-8">
                                    <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">{editingTime.label}</h2>

                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col items-center gap-4">
                                            <button onClick={() => adjustHour(1)} className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors"><Plus className="h-5 w-5" /></button>
                                            <span className="text-8xl font-black tracking-tighter text-white">{hour12}</span>
                                            <button onClick={() => adjustHour(-1)} className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors"><Minus className="h-5 w-5" /></button>
                                        </div>
                                        <span className="text-5xl font-black text-white/10 mb-2">:</span>
                                        <div className="flex flex-col items-center gap-4">
                                            <button onClick={() => adjustMinute(5)} className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors"><Plus className="h-5 w-5" /></button>
                                            <span className="text-8xl font-black tracking-tighter text-white">{m}</span>
                                            <button onClick={() => adjustMinute(-5)} className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors"><Minus className="h-5 w-5" /></button>
                                        </div>
                                    </div>

                                    <button
                                        onClick={togglePeriod}
                                        className={`w-32 py-4 rounded-2xl text-xs font-black tracking-[0.3em] border transition-all duration-500
                                        ${period === 'AM' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' : 'border-indigo-500/20 text-indigo-400 bg-indigo-500/5'}
                                    `}
                                    >
                                        {period}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })()
            }

            {/* ⚡ CAPACITY MODAL */}
            {
                editingCapacity && (() => {
                    const commitCapacity = () => {
                        handleChange("simultaneous_appointments", tempCapacity);
                        saveAISetting("simultaneous_appointments", tempCapacity);
                        setEditingCapacity(false);
                    };

                    const adjust = (delta: number) => {
                        const current = parseInt(tempCapacity) || 1;
                        const next = Math.max(1, current + delta);
                        setTempCapacity(next.toString());
                    };

                    return (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl animate-in fade-in duration-500">
                            <div className="absolute inset-0" onClick={commitCapacity} />

                            <div className="relative w-full max-w-sm bg-zinc-900/90 border border-white/10 rounded-[2.5rem] shadow-2xl p-12 animate-in zoom-in-95 duration-500">
                                <button onClick={commitCapacity} className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors">
                                    <X className="h-6 w-6" />
                                </button>

                                <div className="flex flex-col items-center space-y-12">
                                    <div className="space-y-2 text-center">
                                        <p className="admin-header-title text-xl text-white/60">Citas Simultáneas</p>
                                    </div>

                                    <div className="flex items-center gap-10">
                                        <button onClick={() => adjust(-1)} className="p-4 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/5"><Minus className="h-6 w-6 text-white/40" /></button>
                                        <span className="text-9xl font-black tracking-tighter text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">{tempCapacity}</span>
                                        <button onClick={() => adjust(1)} className="p-4 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/5"><Plus className="h-6 w-6 text-white/40" /></button>
                                    </div>

                                    <div className="w-full flex flex-col items-center gap-4">
                                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/10">Capacidad Simultanea</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })()
            }
        </div >
    );
}

const formatTime12h = (timeStr?: string) => {
    if (!timeStr) return "--:--";
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${m} ${ampm}`;
};
