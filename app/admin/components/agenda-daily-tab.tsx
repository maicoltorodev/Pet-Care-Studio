"use client"
import React, { useMemo, useState, useEffect, useRef } from "react"
import { now, toBusinessTime } from "@/lib/time"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
    CalendarIcon, Clock, Scissors, ChevronLeft, ChevronRight,
    Ban, CheckCircle, Trash2, Zap, LayoutGrid, List,
    PawPrint, History, Sparkles, TrendingUp, Plus, Lock, ArrowRight,
    User, MapPin, Phone
} from "lucide-react"
import { useAgenda, Appointment } from "@/hooks/use-agenda"
import { useLeads } from "@/hooks/use-leads"
import { useConfirm } from "@/components/confirm-dialog"
import { useIsMobile } from "@/hooks/use-is-mobile"

/* ──────────────────────────────────────────────
   Shared logic hook — reutilizado por ambas vistas
─────────────────────────────────────────────── */
function useAgendaLogic() {
    const { handleUpdateAppointmentStatus, handleDeleteAppointment, handleCreateManualReservation, getAppointmentsForDate, selectedDate, setSelectedDate } = useAgenda();
    const { aiSettings } = useLeads();
    const confirm = useConfirm();

    const simultaneous = parseInt(aiSettings.find(s => s.key === 'simultaneous_appointments')?.value || "1")
    const closedDaysStr = aiSettings.find(s => s.key === 'agenda_closed_days')?.value || ""
    const currentDayOfWeek = selectedDate.getDay()
    const isTodayClosed = closedDaysStr.split(',').includes(currentDayOfWeek.toString())

    const openingTime = useMemo(() => {
        const specificKey = `agenda_open_${currentDayOfWeek}`;
        const specific = aiSettings.find(s => s.key === specificKey)?.value;
        if (specific) return parseInt(specific.split(':')[0]);
        const global = aiSettings.find(s => s.key === 'agenda_open')?.value;
        if (global) return parseInt(global.split(':')[0]);
        return 9;
    }, [aiSettings, currentDayOfWeek])

    const closingTime = useMemo(() => {
        const specificKey = `agenda_close_${currentDayOfWeek}`;
        const specific = aiSettings.find(s => s.key === specificKey)?.value;
        if (specific) return parseInt(specific.split(':')[0]);
        const global = aiSettings.find(s => s.key === 'agenda_close')?.value;
        if (global) return parseInt(global.split(':')[0]);
        return 17;
    }, [aiSettings, currentDayOfWeek])

    const hours = useMemo(() => {
        const arr = []
        for (let i = openingTime; i < closingTime; i++) arr.push(i.toString().padStart(2, '0'))
        return arr
    }, [openingTime, closingTime])

    const isViewingToday = useMemo(() => {
        const today = now();
        return selectedDate.getDate() === today.getDate() &&
            selectedDate.getMonth() === today.getMonth() &&
            selectedDate.getFullYear() === today.getFullYear();
    }, [selectedDate])

    const [currentTime, setCurrentTime] = useState(now())
    const [direction, setDirection] = useState<'right' | 'left'>('right')

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(now()), 1000)
        return () => clearInterval(timer)
    }, [])

    const currentAppts = getAppointmentsForDate(selectedDate);

    const relativeDateLabel = useMemo(() => {
        const today = now();
        today.setHours(0, 0, 0, 0);
        const target = new Date(selectedDate);
        target.setHours(0, 0, 0, 0);
        const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return "HOY";
        if (diffDays === 1) return "MAÑANA";
        if (diffDays === 2) return "PASADO MAÑANA";
        if (diffDays === -1) return "AYER";
        if (diffDays === -2) return "ANTIER";
        if (diffDays > 0) return `EN ${diffDays} DÍAS`;
        return `HACE ${Math.abs(diffDays)} DÍAS`;
    }, [selectedDate]);

    const firstRowRef = useRef<HTMLDivElement | null>(null);
    const [rowHeight, setRowHeight] = useState(172);

    useEffect(() => {
        const el = firstRowRef.current;
        if (!el) return;
        const obs = new ResizeObserver(([entry]) => {
            const h = entry?.contentRect?.height;
            if (h && h > 0) setRowHeight(h);
        });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    const currentTimePosition = useMemo(() => {
        if (!isViewingToday) return null;
        const currentHour = currentTime.getHours();
        const currentMinutes = currentTime.getMinutes();
        if (currentHour < openingTime || currentHour >= closingTime) return null;
        const completedHours = currentHour - openingTime;
        return completedHours * rowHeight + (currentMinutes / 60) * rowHeight;
    }, [isViewingToday, currentTime, openingTime, closingTime, rowHeight]);

    const goPrevDay = () => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() - 1);
        const minDate = now();
        minDate.setDate(minDate.getDate() - 30);
        minDate.setHours(0, 0, 0, 0);
        if (d < minDate) { toast.error("Solo se permite visualizar hasta 1 mes atrás."); return; }
        setDirection('left');
        setSelectedDate(d);
    }

    const goNextDay = () => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() + 1);
        const maxDate = now();
        maxDate.setDate(maxDate.getDate() + 31);
        maxDate.setHours(23, 59, 59, 999);
        if (d > maxDate) { toast.error("Solo se permite visualizar hasta 1 mes en el futuro."); return; }
        setDirection('right');
        setSelectedDate(d);
    }

    const setToday = () => {
        const today = now();
        setDirection(today > selectedDate ? 'right' : 'left');
        setSelectedDate(today);
    };

    const formatTime12h = (timeStr: string) => {
        if (!timeStr) return '';
        const [hoursPart, minutesPart] = timeStr.split(':');
        let h = parseInt(hoursPart);
        const ampm = h >= 12 ? 'PM' : 'AM';
        return `${h % 12 || 12}:${minutesPart} ${ampm}`;
    }

    const isLocked = (appt: Appointment) => {
        if (appt.is_validated) return true;
        const apptDate = toBusinessTime(appt.appointment_date);
        const yesterday = now();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        return apptDate < yesterday;
    }

    return {
        handleUpdateAppointmentStatus, handleDeleteAppointment, handleCreateManualReservation,
        selectedDate, setSelectedDate,
        simultaneous, isTodayClosed, openingTime, closingTime, hours,
        isViewingToday, currentTime, direction,
        currentAppts, relativeDateLabel,
        firstRowRef, rowHeight, currentTimePosition,
        goPrevDay, goNextDay, setToday,
        formatTime12h, isLocked, confirm,
    }
}

/* ──────────────────────────────────────────────
   EXPORT — Router entre Mobile y Desktop
─────────────────────────────────────────────── */
export function AgendaDailyTab() {
    const isMobile = useIsMobile()
    return isMobile ? <AgendaMobile /> : <AgendaDesktop />
}

/* ══════════════════════════════════════════════
   DESKTOP — Layout original cinematográfico
══════════════════════════════════════════════ */
function AgendaDesktop() {
    const {
        handleUpdateAppointmentStatus, handleDeleteAppointment, handleCreateManualReservation,
        selectedDate, simultaneous, isTodayClosed, openingTime, closingTime, hours,
        isViewingToday, currentTime, currentAppts, relativeDateLabel,
        firstRowRef, currentTimePosition,
        goPrevDay, goNextDay, setToday,
        formatTime12h, isLocked, confirm,
    } = useAgendaLogic()

    return (
        <div className="space-y-16 max-w-7xl mx-auto selection:bg-primary/20 pb-32">

            {/* 📅 AGENDA CONTROL BAR */}
            <div className="relative z-50 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="bg-black/50 backdrop-blur-3xl border border-white/10 rounded-3xl p-4 flex items-center gap-3 shadow-2xl">
                    <button onClick={goPrevDay} className="h-12 w-12 rounded-2xl bg-white/[0.06] border border-white/10 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 flex items-center justify-center transition-all duration-200 shrink-0">
                        <ChevronLeft className="h-5 w-5" />
                    </button>

                    <div className="flex-1 flex items-center gap-4 px-4 py-2 rounded-2xl cursor-pointer hover:bg-white/[0.04] transition-all duration-200 group" onClick={setToday} title="Volver a hoy">
                        <div className="shrink-0">
                            {isViewingToday ? <div className="h-3 w-3 rounded-full bg-primary shadow-[0_0_12px_currentColor] animate-pulse" /> : <div className="h-3 w-3 rounded-full bg-white/10" />}
                        </div>
                        <div className="flex items-baseline gap-3">
                            <span className="text-4xl font-black text-white leading-none" style={{ fontStyle: 'normal' }}>{selectedDate.toLocaleDateString('es-ES', { day: 'numeric' })}</span>
                            <div className="flex flex-col">
                                <span className="text-[11px] font-bold uppercase tracking-widest text-white/90 leading-tight" style={{ fontStyle: 'normal' }}>{selectedDate.toLocaleDateString('es-ES', { weekday: 'long' })}</span>
                                <span className="text-[10px] font-medium uppercase tracking-widest text-white/40 leading-tight" style={{ fontStyle: 'normal' }}>{selectedDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</span>
                            </div>
                        </div>
                        <div className={`ml-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shrink-0 ${isViewingToday ? 'bg-primary/15 border-primary/30 text-primary' : 'bg-white/[0.04] border-white/10 text-white/40 group-hover:text-white/60'}`} style={{ fontStyle: 'normal' }}>
                            {relativeDateLabel}
                        </div>
                    </div>

                    <div className="h-10 w-px bg-white/10 shrink-0" />

                    {/* Stats */}
                    <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                            <CalendarIcon className="h-3.5 w-3.5 text-white/40" />
                            <span className="text-sm font-black text-white" style={{ fontStyle: 'normal' }}>{currentAppts.filter(a => a.pet_name !== 'RESERVADO').length}</span>
                            <span className="text-[10px] font-semibold text-white/30 uppercase tracking-wider" style={{ fontStyle: 'normal' }}>citas</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 transition-opacity duration-300" style={{ opacity: currentAppts.filter(a => a.status === 'completada').length > 0 ? 1 : 0, pointerEvents: currentAppts.filter(a => a.status === 'completada').length > 0 ? 'auto' : 'none' }}>
                            <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                            <span className="text-sm font-black text-emerald-400" style={{ fontStyle: 'normal' }}>{currentAppts.filter(a => a.status === 'completada').length}</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 transition-opacity duration-300" style={{ opacity: currentAppts.filter(a => a.status === 'agendada').length > 0 ? 1 : 0, pointerEvents: currentAppts.filter(a => a.status === 'agendada').length > 0 ? 'auto' : 'none' }}>
                            <Clock className="h-3.5 w-3.5 text-primary" />
                            <span className="text-sm font-black text-primary" style={{ fontStyle: 'normal' }}>{currentAppts.filter(a => a.status === 'agendada').length}</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 transition-opacity duration-300" style={{ opacity: isTodayClosed ? 1 : 0, pointerEvents: isTodayClosed ? 'auto' : 'none' }}>
                            <Ban className="h-3.5 w-3.5 text-white/30" />
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-wider" style={{ fontStyle: 'normal' }}>Cerrado</span>
                        </div>
                    </div>

                    <div className="h-10 w-px bg-white/10 shrink-0" />

                    {/* 🕐 LIVE CLOCK */}
                    <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] relative overflow-hidden group hover:bg-white/[0.07] hover:border-white/[0.14] transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            <div className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--color-primary),1)] animate-pulse shrink-0" />
                            <div className="flex items-baseline gap-0.5 relative z-10">
                                <span className="text-[1.35rem] font-black text-white tabular-nums leading-none tracking-tight" style={{ fontStyle: 'normal' }}>
                                    {(currentTime.getHours() % 12 || 12).toString().padStart(2, '0')}:{String(currentTime.getMinutes()).padStart(2, '0')}
                                </span>
                                <span className="text-[11px] font-black tabular-nums text-white/25 leading-none ml-0.5" style={{ fontStyle: 'normal' }}>:{String(currentTime.getSeconds()).padStart(2, '0')}</span>
                                <span className="text-[9px] font-black text-primary/70 uppercase tracking-widest leading-none ml-2" style={{ fontStyle: 'normal' }}>{currentTime.getHours() >= 12 ? 'PM' : 'AM'}</span>
                            </div>
                            <div className="border-l border-white/10 pl-3 ml-1 relative z-10">
                                <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] block leading-tight" style={{ fontStyle: 'normal' }}>COL</span>
                                <span className="text-[7px] font-semibold text-white/10 uppercase tracking-wider block leading-tight" style={{ fontStyle: 'normal' }}>UTC-5</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-10 w-px bg-white/10 shrink-0" />
                    <button onClick={setToday} className="px-5 h-12 rounded-2xl bg-primary/15 border border-primary/30 text-primary text-[11px] font-black uppercase tracking-widest hover:bg-primary/25 hover:border-primary/50 transition-all duration-200 shrink-0" style={{ fontStyle: 'normal', opacity: isViewingToday ? 0 : 1, pointerEvents: isViewingToday ? 'none' : 'auto' }}>Hoy</button>

                    <button onClick={goNextDay} className="h-12 w-12 rounded-2xl bg-white/[0.06] border border-white/10 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 flex items-center justify-center transition-all duration-200 shrink-0">
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* 🕰️ CINEMATIC TIMELINE GRID */}
            <div key={selectedDate.toISOString()} className="relative bg-black/40 backdrop-blur-3xl md:p-1 p-0.5 border border-white/10 rounded-[4rem] shadow-4xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-350">
                <div className="absolute inset-0 cinematic-vignette opacity-40 pointer-events-none" />
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary/5 blur-[200px] rounded-full pointer-events-none" />
                <div className="relative glass-card p-6 md:p-14 border-0 rounded-[3.8rem] overflow-hidden">
                    {isTodayClosed ? (
                        <div className="py-60 flex flex-col items-center justify-center text-center space-y-10 animate-in fade-in zoom-in-95 duration-500">
                            <div className="h-40 w-40 rounded-full bg-white/[0.02] text-white/5 flex items-center justify-center border border-white/[0.05] shadow-[0_0_80px_rgba(0,0,0,0.5)] relative">
                                <Ban className="h-16 w-16" />
                                <div className="absolute inset-0 rounded-full border border-white/5 animate-[ping_4s_linear_infinite] opacity-10" />
                            </div>
                            <div className="space-y-6">
                                <h3 className="admin-header-title text-5xl text-white/40">ESTUDIO CERRADO</h3>
                                <p className="admin-header-subtitle text-white/15 tracking-[1em] max-w-lg mx-auto">Día de recuperación para nuestro equipo de artistas.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-0 relative min-w-[700px]">
                            <div className="absolute left-[3.5rem] top-10 bottom-10 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent pointer-events-none" />
                            {hours.map((hour, idx) => {
                                const apptsInHour = currentAppts.filter(a => a.start_time.startsWith(hour));
                                return (
                                    <div key={hour} ref={idx === 0 ? firstRowRef : undefined} className={`flex min-h-[160px] relative group/row ${idx === hours.length - 1 ? 'border-b-0' : ''}`}>
                                        <div className="absolute inset-y-2 inset-x-0 bg-white/[0.02] opacity-0 group-hover/row:opacity-100 transition-opacity duration-1000 rounded-[2rem] pointer-events-none" />
                                        <div className="w-28 py-8 flex flex-col items-center shrink-0 sticky left-0 z-40">
                                            <div className="relative p-5 rounded-2xl bg-black/80 border border-white/30 backdrop-blur-3xl shadow-3xl flex flex-col items-center group-hover/row:scale-110 group-hover/row:border-primary/40 transition-all duration-700">
                                                <span className="text-2xl font-sans font-black text-white tracking-widest leading-none italic-none">{parseInt(hour) % 12 || 12}</span>
                                                <span className="admin-label text-primary opacity-70 mt-1.5">{parseInt(hour) >= 12 ? 'PM' : 'AM'}</span>
                                            </div>
                                            {idx < hours.length - 1 && <div className="flex-1 w-px bg-white/5 my-4" />}
                                        </div>
                                        <div className="flex-1 py-4 px-8 flex gap-6 overflow-x-auto custom-scrollbar items-center">
                                            {Array.from({ length: Math.max(simultaneous, apptsInHour.length) }).map((_, slotIdx) => {
                                                const appt = apptsInHour[slotIdx];
                                                if (appt) {
                                                    const isCompleted = appt.status === 'completada';
                                                    const isCancelled = appt.status === 'cancelada';
                                                    const isReserve = appt.pet_name === 'RESERVADO';
                                                    return (
                                                        <div key={appt.id} className={`w-[440px] shrink-0 p-5 rounded-[2.5rem] relative overflow-hidden group/card transition-all duration-700 border hover:-translate-y-1 hover:scale-[1.01] hover:shadow-2xl ${isReserve ? 'bg-white/[0.02] border-white/5' : 'bg-card/40 border-white/10'} flex flex-col gap-4 min-h-[140px]`}>
                                                            <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-10 pointer-events-none ${isCancelled ? 'bg-white' : isCompleted ? 'bg-emerald-500' : isReserve ? 'bg-primary/20' : 'bg-primary'}`} />
                                                            <div className={`absolute left-0 top-8 bottom-8 w-1.5 rounded-r-full ${isCancelled ? 'bg-white/10' : isCompleted ? 'bg-emerald-500' : isReserve ? 'bg-white/5' : 'bg-primary shadow-[0_0_15px_rgba(var(--color-primary),0.5)]'}`} />
                                                            <div className="flex items-start justify-between gap-4 relative z-10">
                                                                <div className="flex items-center gap-4 flex-1 min-w-0 pl-1">
                                                                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 shadow-2xl relative overflow-hidden ${isReserve ? 'bg-white/5 text-white/10' : 'bg-black/60 text-white'}`}>
                                                                        {!isReserve && <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />}
                                                                        {isReserve ? <Lock className="h-6 w-6" /> : <PawPrint className="h-7 w-7 relative z-10" />}
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center gap-2 mb-1">
                                                                            <h4 className={`admin-header-title text-lg truncate ${isCancelled ? 'line-through text-white/10' : 'text-white'} ${isReserve ? 'text-white/20' : ''}`}>
                                                                                {isReserve ? appt.pet_name : (appt.service_id || (appt.notes?.includes("Servicio solicitado:") ? appt.notes.split("Servicio solicitado:")[1].trim() : "ESTÉTICA CANINA"))}
                                                                            </h4>
                                                                            {appt.is_validated && !isReserve && <div className="h-4 w-4 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/40"><Zap className="h-2.5 w-2.5 text-white" /></div>}
                                                                        </div>
                                                                        {!isReserve && <div className="flex items-center gap-1.5 admin-label text-primary bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10 select-none shadow-sm translate-y-1 w-fit"><PawPrint className="h-3 w-3" />{appt.pet_name}</div>}
                                                                    </div>
                                                                </div>
                                                                {!isReserve && <div className={`px-3 py-1 rounded-full admin-label border shadow-sm translate-y-1 ${isCompleted ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : isCancelled ? 'bg-white/5 border-white/5 text-white/10' : 'bg-primary/10 border-primary/20 text-primary'}`}>{appt.status}</div>}
                                                            </div>
                                                            <div className="flex items-end justify-between gap-4 mt-auto relative z-10 pl-1">
                                                                <div className="flex items-center gap-2 text-white/40">
                                                                    <Clock className="h-3 w-3 text-primary/60" />
                                                                    <span className="admin-label lowercase first-letter:uppercase">{formatTime12h(appt.start_time)} — {formatTime12h(appt.end_time)}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 opacity-0 group-hover/card:opacity-100 translate-y-2 group-hover/card:translate-y-0 transition-all duration-500">
                                                                    {!isLocked(appt) && appt.status === 'agendada' && !isReserve && (
                                                                        <>
                                                                            <button onClick={() => handleUpdateAppointmentStatus(appt.id, 'completada')} className="h-9 w-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-xl shadow-primary/20 hover:scale-110 active:scale-95 transition-all" title="Finalizar Servicio"><CheckCircle className="h-5 w-5" /></button>
                                                                            <button onClick={() => handleUpdateAppointmentStatus(appt.id, 'cancelada')} className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 text-white/30 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all" title="Cancelar Cita"><Trash2 className="h-4 w-4" /></button>
                                                                        </>
                                                                    )}
                                                                    {isReserve && <button onClick={() => handleDeleteAppointment(appt.id)} className="h-10 w-10 rounded-2xl bg-white/5 border border-white/10 text-white/20 hover:text-destructive hover:bg-destructive/10 transition-all flex items-center justify-center"><Trash2 className="h-5 w-5" /></button>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                } else {
                                                    return (
                                                        <button
                                                            key={`empty-${hour}-${slotIdx}`}
                                                            onClick={async () => {
                                                                const ok = await confirm({ title: "Nueva Reserva", description: `¿Deseas reservar este espacio exclusivo para el día ${selectedDate.toLocaleDateString('es-ES')} a las ${formatTime12h(hour + ':00')}?`, confirmText: "Reservar Ahora", cancelText: "Volver" });
                                                                if (ok) handleCreateManualReservation(selectedDate, hour);
                                                            }}
                                                            className="w-[440px] shrink-0 p-8 border-2 border-dashed border-white/[0.04] rounded-[2.5rem] flex items-center justify-center bg-transparent transition-all duration-700 group/slot relative overflow-hidden h-[140px] hover:bg-white/[0.02] hover:border-primary/30 hover:scale-[1.01]"
                                                        >
                                                            <div className="flex flex-col items-center gap-3">
                                                                <div className="h-12 w-12 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center group-hover/slot:scale-110 group-hover/slot:border-primary/40 transition-all duration-700 shadow-xl group-hover/slot:bg-primary/5"><Plus className="h-6 w-6 text-white/10 group-hover/slot:text-primary transition-colors" /></div>
                                                                <span className="text-[10px] font-black text-white/[0.03] group-hover/slot:text-white/40 transition-all uppercase tracking-[1em] ml-2">DISPONIBLE</span>
                                                            </div>
                                                        </button>
                                                    );
                                                }
                                            })}
                                        </div>
                                    </div>
                                );
                            })}

                            {!isTodayClosed && (
                                <div className="flex border-b-0 relative group/closing mt-10">
                                    <div className="w-28 py-10 flex flex-col items-center shrink-0 sticky left-0 z-40">
                                        <div className="relative p-6 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-3xl shadow-xl flex flex-col items-center opacity-20 group-hover/closing:opacity-100 transition-all duration-1000">
                                            <span className="text-2xl font-sans font-black text-white tracking-widest leading-none">{closingTime % 12 || 12}</span>
                                            <span className="admin-label text-white/40 mt-2">{closingTime >= 12 ? 'PM' : 'AM'}</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 p-4 flex items-center px-12">
                                        <div className="w-full h-32 border border-white/[0.02] bg-white/[0.01] rounded-[3rem] flex items-center justify-center gap-10 group-hover/closing:border-white/5 transition-all duration-1000 relative overflow-hidden">
                                            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/5" />
                                            <div className="flex items-center gap-5 px-10 py-4 rounded-full bg-black/40 border border-white/10 shadow-3xl">
                                                <div className="h-2 w-2 rounded-full bg-destructive/60 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                                                <span className="text-[12px] font-black text-white/20 uppercase tracking-[0.8em]">END OF SESSION</span>
                                            </div>
                                            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/5" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Time progress line */}
                            {isViewingToday && currentTimePosition !== null && (
                                <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/80 to-transparent z-50 pointer-events-none flex items-center" style={{ top: `${currentTimePosition}px` }}>
                                    <div className="absolute -left-28 bg-primary text-black admin-label px-6 py-2 rounded-full shadow-[0_15px_40px_rgba(var(--color-primary),0.6)]" style={{ fontStyle: 'normal' }}>LIVE NOW</div>
                                    <div className="ml-24 h-4 w-4 rounded-full bg-primary shadow-[0_0_25px_rgba(var(--color-primary),1)] border-4 border-white/20 animate-pulse" />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Stats */}
            <div className="flex justify-center flex-col items-center gap-8 text-center">
                <div className="flex items-center gap-10 px-12 py-5 rounded-[2rem] bg-white/[0.02] border border-white/5 shadow-3xl backdrop-blur-xl">
                    <div className="flex flex-col items-center gap-1">
                        <span className="admin-label text-white/20">Capacidad Actual</span>
                        <p className="admin-header-subtitle text-primary">{simultaneous} Estilistas</p>
                    </div>
                    <div className="h-10 w-px bg-white/5" />
                    <div className="flex flex-col items-center gap-1">
                        <span className="admin-label text-white/20">Jornada Laboral</span>
                        <p className="admin-header-subtitle text-white">{openingTime}:00 — {closingTime}:00</p>
                    </div>
                    <div className="h-10 w-px bg-white/5" />
                    <div className="flex flex-col items-center gap-1">
                        <span className="admin-label text-white/20">Próximo Cierre</span>
                        <p className="admin-header-subtitle text-white/60">{isTodayClosed ? "Estudio Cerrado" : `${closingTime}:00 HRS`}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                        <div className="h-6 w-6 rounded-full bg-primary/20 border border-white/10 flex items-center justify-center backdrop-blur-md"><Zap className="h-3 w-3 text-primary animate-pulse" /></div>
                        <div className="h-6 w-6 rounded-full bg-emerald-500/20 border border-white/10 flex items-center justify-center backdrop-blur-md"><Sparkles className="h-3 w-3 text-emerald-500 animate-pulse" /></div>
                    </div>
                    <p className="admin-label text-white/10 opacity-50">Sincronización Inteligente vía WhatsApp AI Engine</p>
                </div>
            </div>
        </div>
    )
}

/* ══════════════════════════════════════════════
   MOBILE — Lista vertical por hora, sin scroll horizontal
══════════════════════════════════════════════ */
function AgendaMobile() {
    const {
        handleUpdateAppointmentStatus, handleDeleteAppointment, handleCreateManualReservation,
        selectedDate,
        simultaneous, isTodayClosed, openingTime, closingTime, hours,
        isViewingToday, currentTime, currentAppts, relativeDateLabel,
        goPrevDay, goNextDay, setToday,
        formatTime12h, isLocked, confirm,
    } = useAgendaLogic()

    const totalCitas = currentAppts.filter(a => a.pet_name !== 'RESERVADO').length
    const completadas = currentAppts.filter(a => a.status === 'completada').length
    const pendientes = currentAppts.filter(a => a.status === 'agendada').length

    return (
        <div className="space-y-4 pb-6">

            {/* ── Date Navigator ── */}
            <div className="bg-black/50 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-4 animate-in fade-in slide-in-from-top-4 duration-500">
                {/* Row 1: Nav + date */}
                <div className="flex items-center gap-3 mb-3">
                    <button onClick={goPrevDay} className="h-11 w-11 rounded-2xl bg-white/[0.06] border border-white/10 text-white/60 flex items-center justify-center shrink-0 active:scale-90 transition-all">
                        <ChevronLeft className="h-4 w-4" />
                    </button>

                    <button onClick={setToday} className="flex-1 flex items-center gap-3 px-3 py-2 rounded-2xl active:bg-white/[0.04]">
                        {isViewingToday
                            ? <div className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(var(--color-primary),1)] shrink-0" />
                            : <div className="h-2.5 w-2.5 rounded-full bg-white/10 shrink-0" />
                        }
                        <div className="flex items-baseline gap-2 flex-1">
                            <span className="text-3xl font-black text-white leading-none" style={{ fontStyle: 'normal' }}>
                                {selectedDate.toLocaleDateString('es-ES', { day: 'numeric' })}
                            </span>
                            <div className="flex flex-col items-start">
                                <span className="text-[11px] font-bold uppercase tracking-wide text-white/80 leading-tight capitalize" style={{ fontStyle: 'normal' }}>
                                    {selectedDate.toLocaleDateString('es-ES', { weekday: 'long' })}
                                </span>
                                <span className="text-[9px] font-medium uppercase tracking-wide text-white/30 leading-tight capitalize" style={{ fontStyle: 'normal' }}>
                                    {selectedDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                                </span>
                            </div>
                        </div>
                        <div className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shrink-0 ${isViewingToday ? 'bg-primary/15 border-primary/30 text-primary' : 'bg-white/[0.04] border-white/10 text-white/30'}`} style={{ fontStyle: 'normal' }}>
                            {relativeDateLabel}
                        </div>
                    </button>

                    <button onClick={goNextDay} className="h-11 w-11 rounded-2xl bg-white/[0.06] border border-white/10 text-white/60 flex items-center justify-center shrink-0 active:scale-90 transition-all">
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>

                {/* Row 2: Stats + Clock */}
                <div className="flex items-center gap-2">
                    {/* Stats pills */}
                    <div className="flex items-center gap-1.5 flex-1">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                            <CalendarIcon className="h-3 w-3 text-white/40" />
                            <span className="text-xs font-black text-white" style={{ fontStyle: 'normal' }}>{totalCitas}</span>
                        </div>
                        {completadas > 0 && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                <CheckCircle className="h-3 w-3 text-emerald-400" />
                                <span className="text-xs font-black text-emerald-400" style={{ fontStyle: 'normal' }}>{completadas}</span>
                            </div>
                        )}
                        {pendientes > 0 && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20">
                                <Clock className="h-3 w-3 text-primary" />
                                <span className="text-xs font-black text-primary" style={{ fontStyle: 'normal' }}>{pendientes}</span>
                            </div>
                        )}
                        {isTodayClosed && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                                <Ban className="h-3 w-3 text-white/30" />
                                <span className="text-[9px] font-black text-white/30 uppercase" style={{ fontStyle: 'normal' }}>Cerrado</span>
                            </div>
                        )}
                    </div>

                    {/* Compact live clock */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] shrink-0">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_6px_rgba(var(--color-primary),1)]" />
                        <span className="text-sm font-black text-white tabular-nums" style={{ fontStyle: 'normal' }}>
                            {(currentTime.getHours() % 12 || 12).toString().padStart(2, '0')}:{String(currentTime.getMinutes()).padStart(2, '0')}
                        </span>
                        <span className="text-[9px] font-black text-primary/60 uppercase" style={{ fontStyle: 'normal' }}>
                            {currentTime.getHours() >= 12 ? 'PM' : 'AM'}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Timeline vertical ── */}
            {isTodayClosed ? (
                <div className="bg-black/30 border border-white/10 rounded-[2rem] py-20 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
                    <div className="h-20 w-20 rounded-full bg-white/[0.02] text-white/10 flex items-center justify-center border border-white/[0.05]">
                        <Ban className="h-8 w-8" />
                    </div>
                    <div>
                        <h3 className="admin-header-title text-2xl text-white/30">ESTUDIO CERRADO</h3>
                        <p className="admin-label text-white/15 mt-2">Día de descanso del equipo.</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-2">
                    {hours.map((hour) => {
                        const apptsInHour = currentAppts.filter(a => a.start_time.startsWith(hour));
                        const isCurrentHour = isViewingToday && parseInt(hour) === currentTime.getHours();

                        return (
                            <div key={hour} className={`rounded-[1.8rem] border transition-all duration-300 overflow-hidden ${isCurrentHour ? 'border-primary/30 bg-primary/[0.03] shadow-[0_0_20px_rgba(var(--color-primary),0.1)]' : 'border-white/[0.06] bg-black/20'}`}>
                                {/* Hour header */}
                                <div className="flex items-center gap-3 px-4 pt-4 pb-2">
                                    <div className={`h-11 w-11 rounded-2xl flex flex-col items-center justify-center shrink-0 ${isCurrentHour ? 'bg-primary/20 border border-primary/30' : 'bg-white/[0.04] border border-white/[0.06]'}`}>
                                        <span className={`text-base font-black leading-none tabular-nums ${isCurrentHour ? 'text-primary' : 'text-white/60'}`} style={{ fontStyle: 'normal' }}>
                                            {parseInt(hour) % 12 || 12}
                                        </span>
                                        <span className={`text-[7px] font-black uppercase leading-tight ${isCurrentHour ? 'text-primary/60' : 'text-white/20'}`} style={{ fontStyle: 'normal' }}>
                                            {parseInt(hour) >= 12 ? 'PM' : 'AM'}
                                        </span>
                                    </div>
                                    {isCurrentHour && (
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                            <span className="text-[8px] font-black text-primary uppercase tracking-widest" style={{ fontStyle: 'normal' }}>AHORA</span>
                                        </div>
                                    )}
                                    {apptsInHour.length === 0 && (
                                        <span className="text-[9px] text-white/20 font-semibold ml-1" style={{ fontStyle: 'normal' }}>Disponible</span>
                                    )}
                                </div>

                                {/* Appointments for this hour */}
                                {apptsInHour.length > 0 ? (
                                    <div className="px-3 pb-3 space-y-2">
                                        {apptsInHour.map((appt) => {
                                            const isCompleted = appt.status === 'completada';
                                            const isCancelled = appt.status === 'cancelada';
                                            const isReserve = appt.pet_name === 'RESERVADO';
                                            const locked = isLocked(appt);

                                            return (
                                                <div key={appt.id} className={`relative rounded-[1.4rem] p-4 border ${isReserve ? 'bg-white/[0.01] border-white/[0.04]' : isCancelled ? 'bg-white/[0.01] border-white/[0.04] opacity-50' : isCompleted ? 'bg-emerald-500/5 border-emerald-500/15' : 'bg-card/30 border-white/[0.08]'}`}>
                                                    {/* Status line */}
                                                    <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full ${isCancelled ? 'bg-white/10' : isCompleted ? 'bg-emerald-500' : isReserve ? 'bg-white/5' : 'bg-primary shadow-[0_0_10px_rgba(var(--color-primary),0.6)]'}`} />

                                                    <div className="pl-3">
                                                        {/* Title row */}
                                                        <div className="flex items-start justify-between gap-2 mb-2">
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className={`text-sm font-black leading-tight ${isCancelled ? 'line-through text-white/20' : isReserve ? 'text-white/30' : 'text-white'}`} style={{ fontStyle: 'normal' }}>
                                                                    {isReserve ? 'RESERVADO' : (appt.service_id || (appt.notes?.includes("Servicio solicitado:") ? appt.notes.split("Servicio solicitado:")[1].trim() : "ESTÉTICA CANINA"))}
                                                                </h4>
                                                                {!isReserve && (
                                                                    <div className="flex items-center gap-1 mt-1">
                                                                        <PawPrint className="h-2.5 w-2.5 text-primary/60" />
                                                                        <span className="text-[10px] text-primary/60 font-semibold" style={{ fontStyle: 'normal' }}>{appt.pet_name}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {/* Status badge */}
                                                            <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wide border shrink-0 ${isCompleted ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : isCancelled ? 'bg-white/5 border-white/5 text-white/20' : isReserve ? 'bg-white/5 border-white/5 text-white/20' : 'bg-primary/10 border-primary/20 text-primary'}`} style={{ fontStyle: 'normal' }}>
                                                                {isReserve ? 'Bloqueado' : appt.status}
                                                            </div>
                                                        </div>

                                                        {/* Time + actions */}
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-1.5 text-white/30">
                                                                <Clock className="h-2.5 w-2.5 text-primary/40" />
                                                                <span className="text-[9px] font-medium" style={{ fontStyle: 'normal' }}>{formatTime12h(appt.start_time)} — {formatTime12h(appt.end_time)}</span>
                                                            </div>

                                                            {/* Action buttons — always visible on mobile */}
                                                            <div className="flex items-center gap-1.5">
                                                                {!locked && appt.status === 'agendada' && !isReserve && (
                                                                    <>
                                                                        <button
                                                                            onClick={() => handleUpdateAppointmentStatus(appt.id, 'completada')}
                                                                            className="h-8 w-8 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 active:scale-90 transition-all"
                                                                        >
                                                                            <CheckCircle className="h-4 w-4" />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleUpdateAppointmentStatus(appt.id, 'cancelada')}
                                                                            className="h-8 w-8 rounded-xl bg-white/5 border border-white/10 text-white/30 flex items-center justify-center active:scale-90 transition-all"
                                                                        >
                                                                            <Trash2 className="h-3.5 w-3.5" />
                                                                        </button>
                                                                    </>
                                                                )}
                                                                {isReserve && (
                                                                    <button
                                                                        onClick={() => handleDeleteAppointment(appt.id)}
                                                                        className="h-8 w-8 rounded-xl bg-white/5 border border-white/10 text-white/20 hover:text-destructive active:scale-90 transition-all flex items-center justify-center"
                                                                    >
                                                                        <Trash2 className="h-3.5 w-3.5" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    /* Empty slot — tap to reserve */
                                    <button
                                        onClick={async () => {
                                            const ok = await confirm({ title: "Nueva Reserva", description: `¿Reservar el ${selectedDate.toLocaleDateString('es-ES')} a las ${formatTime12h(hour + ':00')}?`, confirmText: "Reservar", cancelText: "Cancelar" });
                                            if (ok) handleCreateManualReservation(selectedDate, hour);
                                        }}
                                        className="w-full px-4 pb-4 flex items-center gap-2 text-white/15 active:text-white/40 transition-colors"
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                        <span className="text-[9px] font-black uppercase tracking-widest" style={{ fontStyle: 'normal' }}>Reservar slot</span>
                                    </button>
                                )}
                            </div>
                        )
                    })}

                    {/* End of session marker */}
                    <div className="flex items-center gap-3 px-4 py-3 rounded-[1.5rem] border border-white/[0.03] bg-transparent">
                        <div className="h-9 w-9 rounded-xl flex flex-col items-center justify-center bg-white/[0.02] border border-white/[0.04]">
                            <span className="text-sm font-black text-white/20 leading-none tabular-nums" style={{ fontStyle: 'normal' }}>{closingTime % 12 || 12}</span>
                            <span className="text-[7px] font-black text-white/10 uppercase" style={{ fontStyle: 'normal' }}>{closingTime >= 12 ? 'PM' : 'AM'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-destructive/40 animate-pulse" />
                            <span className="text-[9px] font-black text-white/15 uppercase tracking-widest" style={{ fontStyle: 'normal' }}>Fin de Jornada</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer stats */}
            <div className="grid grid-cols-3 gap-2">
                {[
                    { label: 'Estilistas', value: `${simultaneous}`, accent: 'text-primary' },
                    { label: 'Apertura', value: `${openingTime}:00`, accent: 'text-white' },
                    { label: 'Cierre', value: isTodayClosed ? 'Cerrado' : `${closingTime}:00`, accent: 'text-white/50' },
                ].map(s => (
                    <div key={s.label} className="flex flex-col items-center gap-1 py-3 px-2 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                        <span className="text-[9px] font-semibold text-white/20 uppercase tracking-wider" style={{ fontStyle: 'normal' }}>{s.label}</span>
                        <span className={`text-sm font-black ${s.accent}`} style={{ fontStyle: 'normal' }}>{s.value}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
