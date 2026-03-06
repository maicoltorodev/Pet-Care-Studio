"use client"
import React, { useEffect, useRef, useState } from "react"
import {
    Bot, Users, MessageSquare, Send, Phone,
    Search, AlertCircle, Activity, ClipboardList,
    HeartPulse, Sparkles, ChevronRight, ChevronLeft, Zap, ZapOff, Trash2, ArrowLeft
} from "lucide-react"
import { useLeads, Lead } from "@/hooks/use-leads"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useConfirm } from "@/components/confirm-dialog"
import { useIsMobile } from "@/hooks/use-is-mobile"

/* ──────────────────────────────────────
   Helpers
 ────────────────────────────────────── */
const getInitials = (name: string | null) => name?.substring(0, 2).toUpperCase() ?? "?"
const getFirstChar = (name: string | null) => name?.substring(0, 1).toUpperCase() ?? "?"

const get24hWindowInfo = (lastMessageAt: string | null) => {
    if (!lastMessageAt) return { isOpen: false, remainingHours: 0, percent: 0 }
    const last = new Date(lastMessageAt).getTime()
    const now = new Date().getTime()
    const diff = now - last
    const windowMs = 24 * 60 * 60 * 1000
    const remaining = Math.max(0, windowMs - diff)
    const hours = Math.floor(remaining / (1000 * 60 * 60))
    const minutes = Math.floor((remaining / (1000 * 60)) % 60)
    return {
        isOpen: remaining > 0,
        remainingHours: hours,
        remainingMinutes: minutes,
        percent: (remaining / windowMs) * 100
    }
}

interface Pet {
    name?: string
    breed?: string
    medical?: string[]
    behavior?: string
    preferences?: string
}

interface ChatMessage {
    role: string
    content?: string
    text?: string
    parts?: {
        text?: string
        mediaUrl?: string
        mediaType?: 'image' | 'audio'
    }[]
}

/* ──────────────────────────────────────
   Color palette per lead (cycling)
 ────────────────────────────────────── */
const AVATAR_COLORS = [
    "from-violet-500 to-purple-600",
    "from-cyan-500 to-teal-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-600",
    "from-emerald-500 to-green-600",
    "from-blue-500 to-indigo-600",
]
function avatarColor(index: number) {
    return AVATAR_COLORS[index % AVATAR_COLORS.length]
}

/* ──────────────────────────────────────
   Media Renderer with Error Handling
  ────────────────────────────────────── */
function MediaBubble({ url, type }: { url: string; type: 'image' | 'audio' }) {
    const [error, setError] = useState(false)

    if (error) {
        return (
            <div className="bg-white/5 border border-white/10 rounded-[1.8rem] p-6 flex flex-col items-center gap-3 opacity-40 max-w-[200px]">
                <AlertCircle className="w-5 h-5 text-white/30" />
                <div className="text-center">
                    <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Archivo Expirado</p>
                    <p className="text-[8px] text-white/10 mt-1 uppercase tracking-tighter">Eliminado por optimización.</p>
                </div>
            </div>
        )
    }

    if (type === 'image') {
        return (
            <img
                src={url}
                alt="Imagen del chat"
                className="max-w-[300px] h-auto cursor-pointer hover:scale-[1.02] transition-transform duration-500 rounded-[1.8rem] border border-white/10 shadow-2xl"
                onError={() => setError(true)}
                onClick={() => window.open(url, '_blank')}
            />
        )
    }

    return (
        <div className="bg-white/5 p-5 flex flex-col gap-2 rounded-[1.8rem] border border-white/10 shadow-2xl">
            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Mensaje de Voz</span>
            <audio
                controls
                className="w-64 h-8 filter invert opacity-60"
                onError={() => setError(true)}
            >
                <source src={url} type="audio/mpeg" />
            </audio>
        </div>
    )
}

/* ──────────────────────────────────────
   Root export — routes Mobile vs Desktop
 ────────────────────────────────────── */
export function LeadsTab() {
    const isMobile = useIsMobile()
    return isMobile ? <LeadsMobile /> : <LeadsDesktop />
}

/* ──────────────────────────────────────
   DESKTOP layout (original 3-column)
 ────────────────────────────────────── */
function LeadsDesktop() {
    const {
        leads, selectedLead, handleSelectLead, chatLoading, leadChat,
        manualMessage, setManualMessage,
        handleSendManualMessage, handleToggleBot, handleResetAllData,
        coldLeads, generateHook, handleReengagementSuccess
    } = useLeads()
    const confirm = useConfirm()

    const chatContainerRef = useRef<HTMLDivElement>(null)
    const [search, setSearch] = useState("")

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
        }
    }, [leadChat, chatLoading])

    const filtered = (leads ?? [])
        .filter((l: Lead) =>
            (l.name?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
            (l.phone?.includes(search) ?? false)
        )
        .sort((a, b) => {
            // PUNTUACIÓN DE PRIORIDAD
            // 1. Pendiente de revisión humana (Máxima prioridad)
            // 2. Humor Urgente
            // 3. Modo Manual (Bot desactivado)

            const getPriority = (l: Lead) => {
                let score = 0;
                if (l.human_review_pending) score += 1000;
                if (l.customer_mood === 'URGENTE') score += 500;
                if (!l.bot_active) score += 100;
                return score;
            };

            const scoreA = getPriority(a);
            const scoreB = getPriority(b);

            if (scoreA !== scoreB) {
                return scoreB - scoreA;
            }

            // Si tienen la misma prioridad, ordenar por fecha de creación (más reciente arriba)
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });

    const selectedIndex = leads?.findIndex((l: Lead) => l.phone === selectedLead?.phone) ?? -1

    return (
        <div className="flex h-[calc(100vh-220px)] min-h-[600px] overflow-hidden rounded-[2.5rem] border border-white/20 bg-card/60 backdrop-blur-3xl relative shadow-[0_0_80px_rgba(0,0,0,0.6)] animate-in fade-in zoom-in-95 duration-700">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--color-primary),0.05),transparent)] pointer-events-none" />

            {/* ── Sidebar ── */}
            <aside className="w-[280px] flex-shrink-0 flex flex-col border-r border-white/10 bg-black/20 relative z-10 transition-all duration-700">
                <div className="p-8 pb-4">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="relative group/reset">
                                <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_20px_rgba(var(--color-primary),0.1)]">
                                    <MessageSquare className="w-5 h-5 text-primary" />
                                </div>
                                {/* Botón Temporal de Borrado (Solo Desarrollo) */}
                                <button
                                    onClick={async () => {
                                        const ok = await confirm({
                                            title: "Borrado Total",
                                            description: "🚨 ATENCIÓN: Esta acción es irreversible. Se eliminarán permanentemente todos los mensajes y citas de la base de datos.",
                                            confirmText: "Borrar Todo",
                                            variant: "destructive"
                                        });
                                        if (ok) {
                                            handleResetAllData?.();
                                        }
                                    }}
                                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover/reset:opacity-100 transition-all duration-300 hover:scale-125 shadow-lg z-20"
                                    title="Borrar todos los datos"
                                >
                                    <Trash2 className="w-2.5 h-2.5" />
                                </button>
                            </div>
                            <div>
                                <h3 className="admin-label text-white/60">Lista de</h3>
                                <p className="admin-header-title text-sm">Clientes</p>
                            </div>
                        </div>
                        <Badge className="bg-white/10 text-white/50 border-none rounded-full px-3 py-1 admin-label text-[9px] translate-y-1">
                            {leads?.length ?? 0}
                        </Badge>
                    </div>
                    {/* Search Component */}
                    <div className="flex items-center gap-4 bg-black/40 border border-white/10 rounded-[1.2rem] h-11 px-5 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all group/search">
                        <Search className="h-4 w-4 text-white/20 group-focus-within/search:text-primary transition-colors duration-500 shrink-0" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Buscar cliente..."
                            className="flex-1 border-none bg-transparent shadow-none focus:outline-none text-[11px] text-white/80 placeholder:text-white/20 mt-0.5"
                        />
                    </div>
                </div>

                {/* ── SECCIÓN PROACTIVA (RE-ENGAGEMENT) ── */}
                {coldLeads && coldLeads.length > 0 && (
                    <div className="px-6 py-4 animate-in slide-in-from-left duration-700">
                        <div className="flex items-center gap-3 mb-4 px-2">
                            <Sparkles className="h-3 w-3 text-primary animate-pulse" />
                            <h4 className="admin-label text-white/60">Atención Proactiva</h4>
                        </div>
                        <div className="space-y-3">
                            {coldLeads.slice(0, 3).map((lead) => {
                                const window = get24hWindowInfo(lead.last_customer_message_at);
                                return (
                                    <div
                                        key={lead.phone}
                                        className="group/cold bg-primary/5 hover:bg-primary/10 border border-primary/10 rounded-2xl p-4 transition-all duration-500 cursor-pointer"
                                        onClick={() => handleSelectLead(lead)}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-bold text-white/80 italic-none">{lead.name || lead.phone}</span>
                                            <span className="admin-label text-primary/80">-{window.remainingHours}h left</span>
                                        </div>
                                        <p className="admin-label text-white/40 line-clamp-1 mb-3">Interés en {lead.current_step}</p>
                                        <button
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                const hook = await generateHook(lead.phone!);
                                                if (hook) {
                                                    setManualMessage(hook);
                                                    handleSelectLead(lead);
                                                    toast.success("Gancho generado", { description: "Revisa el mensaje antes de enviar." });
                                                }
                                            }}
                                            className="w-full py-2 rounded-xl bg-primary/20 hover:bg-primary text-primary hover:text-white text-[8px] font-black uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-2 border border-primary/20"
                                        >
                                            <Sparkles className="h-2 w-2" />
                                            Generar Gancho
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="h-px bg-white/5 mt-6 w-full" />
                    </div>
                )}

                {/* Lead List Area */}
                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2 custom-scrollbar">
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 opacity-20">
                            <Users className="h-8 w-8 mb-4 stroke-[1px]" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Sin Clientes Registrados</span>
                        </div>
                    ) : (
                        filtered.map((lead: Lead, idx: number) => {
                            const isActive = selectedLead?.phone === lead.phone
                            return (
                                <button
                                    key={lead.phone}
                                    onClick={() => handleSelectLead(lead)}
                                    className={`w-full flex items-center gap-4 px-5 py-5 rounded-[1.8rem] text-left transition-all duration-700 relative group
                                        ${isActive
                                            ? "bg-primary/20 border-white/20 shadow-[0_10px_30px_rgba(var(--color-primary),0.2)]"
                                            : "hover:bg-white/[0.05] border-transparent"
                                        } border outline-none`}
                                >
                                    {/* Avatar Visual */}
                                    <div className="relative flex-shrink-0">
                                        {/* Avatar con Anillo de Estado de IA */}
                                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${avatarColor(idx)} flex items-center justify-center text-white font-black text-xs shadow-xl transition-all duration-700 relative z-10 ${isActive ? "scale-100" : "scale-90 group-hover:scale-95"} italic-none`}>
                                            {getFirstChar(lead.name)}

                                            {/* Aura Pulsante si el Bot está activo */}
                                            {lead.bot_active && (
                                                <div className="absolute inset-0 rounded-2xl border-2 border-blue-400/50 animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
                                            )}
                                        </div>

                                        {/* Modo de Operación (Bot vs Manual) - Badge minimalista sobre el avatar */}
                                        <div className={`absolute -top-1.5 -right-1.5 h-6 w-6 rounded-full border-2 border-[#050506] flex items-center justify-center z-20 shadow-xl transition-all duration-500 ${lead.bot_active ? "bg-blue-600 shadow-blue-500/20" : "bg-rose-600 shadow-rose-500/20"}`}>
                                            {lead.bot_active ? <Bot className="w-3 h-3 text-white" /> : <Users className="w-2.5 h-2.5 text-white" />}
                                        </div>
                                    </div>

                                    {/* Content Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <div className="flex items-center gap-2 truncate">
                                                <p className={`text-[13px] font-black tracking-tight truncate ${isActive ? "text-white" : "text-white/60"} group-hover:text-white transition-colors duration-500 italic-none`}>
                                                    {lead.name === lead.phone ? lead.phone : (lead.name || lead.phone)}
                                                </p>
                                                {/* Emoji integrado al flujo del nombre */}
                                                {lead.customer_mood && lead.customer_mood !== 'NEUTRAL' && (
                                                    <span className="text-xs filter drop-shadow-md">
                                                        {lead.customer_mood === 'FELIZ' ? '😊' :
                                                            lead.customer_mood === 'MOLESTO' ? '😠' :
                                                                lead.customer_mood === 'URGENTE' ? '🚨' : ''}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Nueva Barra de Estado Organizada */}
                                        <div className="flex flex-wrap items-center gap-2">
                                            {/* Ventana de WhatsApp 24h */}
                                            {(() => {
                                                const window = get24hWindowInfo(lead.last_customer_message_at);
                                                return (
                                                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md border text-[8px] admin-label lowercase first-letter:uppercase leading-none ${window.isOpen ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500/70' : 'bg-white/5 border-white/10 text-white/20'}`}>
                                                        <Activity className="w-2 h-2" />
                                                        {window.isOpen ? `${window.remainingHours}H` : 'OFF'}
                                                    </div>
                                                );
                                            })()}

                                            {/* Pendiente de Revisión */}
                                            {lead.human_review_pending && (
                                                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/20 border border-rose-500/30 text-rose-500 text-[8px] admin-label lowercase first-letter:uppercase leading-none animate-pulse">
                                                    <AlertCircle className="w-2 h-2" />
                                                    Revisión
                                                </div>
                                            )}

                                            {/* Pasarela/Step Actual */}
                                            <span className="text-[8px] text-white/20 admin-label truncate px-1 lowercase first-letter:uppercase">
                                                {lead.current_step || "Init"}
                                            </span>
                                        </div>
                                    </div>

                                    {isActive && <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_15px_rgba(var(--color-primary),1)] animate-pulse" />}
                                </button>
                            )
                        })
                    )}
                </div>
            </aside>

            {/* ── Main Panel ── */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10 bg-black/10">
                {!selectedLead ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
                            <div className="h-24 w-24 rounded-[2.5rem] bg-white/[0.02] border border-white/5 shadow-2xl flex items-center justify-center relative z-10">
                                <Bot className="h-8 w-8 text-white/10" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-sans font-black text-white/90 uppercase tracking-tighter mb-4">Chat con Clientes</h3>
                        <p className="text-[10px] text-white/20 font-black uppercase tracking-widest max-w-xs leading-relaxed">Selecciona un cliente de la lista de la izquierda para ver su historial de mensajes.</p>
                    </div>
                ) : (
                    <div className="flex flex-1 min-h-0 divide-x divide-white/5">
                        {/* ── Chat Column ── */}
                        <div className="flex flex-col flex-1 min-w-0">
                            {/* Minimalist Premium Chat Header */}
                            <div className="px-10 py-7 flex items-center justify-between bg-black/20 border-b border-white/5 backdrop-blur-2xl relative z-20">
                                <div className="flex items-center gap-6">
                                    <div className={`w-12 h-12 rounded-3xl bg-gradient-to-br ${avatarColor(selectedIndex)} shadow-2xl flex items-center justify-center text-white font-black text-sm border border-white/10 group-hover:scale-105 transition-transform`}>
                                        {getInitials(selectedLead.name)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h2 className="admin-header-title text-lg">
                                                {selectedLead.name === selectedLead.phone ? selectedLead.phone : (selectedLead.name || selectedLead.phone)}
                                            </h2>
                                            {selectedLead.current_step && (
                                                <Badge className="bg-primary/10 text-primary border-none rounded-full px-3 py-0.5 admin-label h-5 translate-y-[1px]">
                                                    {selectedLead.current_step}
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2 opacity-30">
                                                <Phone className="h-2.5 w-2.5 text-white" />
                                                <span className="text-[9px] font-mono text-white tracking-[0.2em] italic-none">{selectedLead.phone}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Minimalist Toggle */}
                                <div className="flex items-center p-1 bg-white/[0.03] rounded-2xl border border-white/5 backdrop-blur-md shadow-2xl">
                                    <button
                                        onClick={() => !selectedLead.bot_active && handleToggleBot(true)}
                                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl admin-label transition-all duration-500 italic-none
                                            ${selectedLead.bot_active
                                                ? "bg-primary text-white shadow-[0_10px_30px_rgba(var(--color-primary),0.3)]"
                                                : "text-white/20 hover:text-white/40"
                                            }`}
                                    >
                                        <Zap className={`h-2.5 w-2.5 ${selectedLead.bot_active ? "fill-white" : ""}`} />
                                        Miel IA
                                    </button>
                                    <button
                                        onClick={() => selectedLead.bot_active && handleToggleBot(false)}
                                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl admin-label transition-all duration-500 italic-none
                                            ${!selectedLead.bot_active
                                                ? "bg-rose-500 text-white shadow-[0_10px_30px_rgba(244,63,94,0.3)]"
                                                : "text-white/20 hover:text-white/40"
                                            }`}
                                    >
                                        <ZapOff className={`h-2.5 w-2.5 ${!selectedLead.bot_active ? "fill-white" : ""}`} />
                                        Manual
                                    </button>
                                </div>
                            </div>

                            {/* Chat History View */}
                            <div
                                ref={chatContainerRef}
                                className="flex-1 overflow-y-auto px-8 py-10 space-y-8 custom-scrollbar"
                            >
                                {chatLoading ? (
                                    <div className="flex flex-col items-center justify-center h-full space-y-8">
                                        <div className="w-24 h-24 relative">
                                            <div className="absolute inset-0 border-2 border-primary/10 rounded-full animate-[ping_3s_infinite]" />
                                            <div className="absolute inset-2 border-b-2 border-primary rounded-full animate-spin" />
                                            <div className="absolute inset-4 m-auto h-12 w-12 bg-primary/10 rounded-full border border-primary/20 flex items-center justify-center shadow-2xl">
                                                <Bot className="h-5 w-5 text-primary" />
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-black text-primary/60 uppercase tracking-[0.4em] animate-pulse">Cargando mensajes del cliente...</span>
                                    </div>
                                ) : (
                                    <div className="max-w-4xl mx-auto space-y-10">
                                        {leadChat.map((msg: ChatMessage, idx: number) => {
                                            const isBot = msg.role === "model"
                                            const parts = msg.parts || []

                                            // Fallback para estructura antigua o contenido directo
                                            if (parts.length === 0) {
                                                const fallbackText = msg.content || msg.text || ""
                                                if (fallbackText) parts.push({ text: fallbackText })
                                            }

                                            if (parts.length === 0) return null

                                            // Verificar notas del sistema
                                            const firstTextPart = parts.find(p => p.text)?.text || ""
                                            const isSystem = firstTextPart.includes("[NOTA DEL SISTEMA:")
                                            const isHumanNote = firstTextPart.includes("UN AGENTE HUMANO INTERVINO")

                                            // Ignorar notas técnicas internas de la IA que no son mensajes humanos
                                            if (isSystem && !isHumanNote) return null

                                            return (
                                                <div key={idx} className={`flex items-start gap-6 ${isBot ? "flex-row-reverse" : ""}`}>
                                                    <div className={`h-10 w-10 rounded-xl flex-shrink-0 flex items-center justify-center text-white text-[10px] font-black border border-white/5 shadow-2xl mt-1
                                                        ${isBot
                                                            ? (isHumanNote ? "bg-rose-500/20 text-rose-500 border-rose-500/30" : "bg-blue-500/20 text-blue-500 border-blue-500/30")
                                                            : `bg-gradient-to-br ${avatarColor(selectedIndex)}`
                                                        }`}>
                                                        {isBot
                                                            ? (isHumanNote ? <Users className="h-4 w-4" /> : <Bot className="h-5 w-5" />)
                                                            : getFirstChar(selectedLead.name)
                                                        }
                                                    </div>
                                                    <div className={`relative max-w-[80%] flex flex-col gap-3`}>
                                                        {parts.map((part, pIdx) => {
                                                            if (part.text) {
                                                                const cleanText = (isHumanNote && pIdx === 0)
                                                                    ? part.text.replace(/\[NOTA DEL SISTEMA: .*?\]: /, "").replace(/"/g, "")
                                                                    : part.text

                                                                return (
                                                                    <div key={pIdx} className={`px-6 py-4 rounded-[1.8rem] text-[13px] leading-relaxed shadow-[0_10px_50px_rgba(0,0,0,0.6)]
                                                                        ${isBot
                                                                            ? (isHumanNote
                                                                                ? "bg-rose-500/20 border border-rose-400/20 text-white"
                                                                                : "bg-blue-600/20 border border-blue-400/20 text-white")
                                                                            : "bg-white/[0.08] border border-white/20 text-white rounded-tl-none backdrop-blur-3xl shadow-xl"
                                                                        }`}>
                                                                        {cleanText}
                                                                    </div>
                                                                )
                                                            }
                                                            if (part.mediaUrl) {
                                                                return (
                                                                    <div key={pIdx} className={`${isBot ? "" : "rounded-tl-none"}`}>
                                                                        <MediaBubble
                                                                            url={part.mediaUrl}
                                                                            type={part.mediaType || 'image'}
                                                                        />
                                                                    </div>
                                                                )
                                                            }
                                                            return null
                                                        })}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                        {/* End marked by chatContainerRef */}
                                    </div>
                                )}
                            </div>

                            {/* Input Signal Injector */}
                            <div className="p-10 bg-white/[0.01] border-t border-white/5 backdrop-blur-2xl">
                                <div className="max-w-4xl mx-auto flex items-center gap-6">
                                    <div className="relative flex-1 group">
                                        <div className="absolute -inset-1 bg-primary/20 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000" />
                                        <input
                                            value={manualMessage}
                                            onChange={e => setManualMessage(e.target.value)}
                                            onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSendManualMessage()}
                                            placeholder="Escribe un mensaje aquí..."
                                            className="admin-input h-20 px-8 text-sm relative z-10"
                                        />
                                        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-2 admin-label opacity-10 z-10 pointer-events-none">
                                            Shift + Enter
                                        </div>
                                    </div>
                                    <button
                                        onClick={async () => {
                                            const phone = selectedLead.phone;
                                            await handleSendManualMessage();
                                            // Si este lead estaba en la lista de fríos, marcamos el éxito
                                            if (coldLeads.some(l => l.phone === phone)) {
                                                await handleReengagementSuccess(phone!);
                                            }
                                        }}
                                        disabled={!manualMessage.trim() || chatLoading}
                                        className="h-[4.5rem] w-[4.5rem] rounded-[2rem] bg-primary text-white flex items-center justify-center shadow-[0_15px_40px_rgba(var(--color-primary),0.3)] hover:-translate-y-1 disabled:opacity-20 disabled:translate-y-0 transition-all duration-500 active:scale-90 group relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <Send className="h-7 w-7 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* ── Technical Info Panel ── */}
                        <div className="w-[350px] flex-shrink-0 flex flex-col bg-white/[0.01] backdrop-blur-3xl overflow-hidden border-l border-white/10">
                            <MedicalPanel lead={selectedLead} />
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}

function MedicalPanel({ lead }: { lead: Lead }) {
    const history = lead.medical_history as { pets?: Pet[] } || {}
    const pets: Pet[] = history.pets || []

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Expedition Header */}
            <div className="p-8 border-b border-white/5 space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_15px_rgba(var(--color-primary),1)] animate-pulse" />
                        <h3 className="admin-label text-white/50">Detalles</h3>
                    </div>
                    <span className="admin-label text-primary/60">Citas: {lead.total_appointments || 0}</span>
                </div>

                {/* AI Synthesis Card */}
                {lead.summary && (
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/30 via-transparent to-transparent blur-2xl opacity-30 group-hover:opacity-60 transition-opacity duration-1000" />
                        <div className="relative bg-[#080809] border border-white/5 rounded-[2rem] p-8 overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-5">
                                <Sparkles className="h-20 w-20 text-white" />
                            </div>
                            <div className="flex items-center gap-4 mb-6">
                                <Sparkles className="h-4 w-4 text-primary" />
                                <span className="admin-label text-primary">Resumen de la IA</span>
                            </div>
                            <p className="text-[13px] text-white/40 font-medium leading-relaxed relative z-10 line-clamp-6 uppercase-first italic-none">{lead.summary}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Pets Registry Area */}
            <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 custom-scrollbar">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-white/20">
                            <HeartPulse className="h-5 w-5" />
                        </div>
                        <span className="admin-header-title text-sm">Mascotas</span>
                    </div>
                    <Badge className="bg-white/5 text-white/40 border-none rounded-full px-4 py-1.5 admin-label">
                        {pets.length} Mascotas
                    </Badge>
                </div>

                {pets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-5 space-y-6">
                        <Activity className="h-14 w-14 stroke-[1px]" />
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-center">Sin mascotas registradas</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {pets.map((pet: Pet, i: number) => (
                            <PetCard key={i} pet={pet} index={i} />
                        ))}
                    </div>
                )}
            </div>

            {/* Matrix Footer */}
            <div className="p-10 border-t border-white/5 bg-black/40 flex flex-col gap-6">
                <div className="flex items-center justify-between opacity-30">
                    <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.4em]">Gestión Segura por WhatsApp</span>
                    <div className="flex gap-1.5">
                        <div className="h-1 w-5 rounded-full bg-primary/20" />
                        <div className="h-1 w-5 rounded-full bg-primary/30 animate-pulse" />
                        <div className="h-1 w-8 rounded-full bg-primary/40" />
                    </div>
                </div>
            </div>
        </div>
    )
}

function PetCard({ pet, index }: { pet: Pet; index: number }) {
    const [open, setOpen] = useState(false)

    return (
        <div className={`glass-card overflow-hidden transition-all duration-1000 ${open ? "bg-white/[0.03] border-primary/20 shadow-[0_20px_60px_rgba(0,0,0,0.4)]" : "bg-white/[0.01] border-white/5 hover:bg-white/[0.03]"}`}>
            {/* Header Interactive */}
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between p-8 text-left transition-all duration-700"
            >
                <div className="flex items-center gap-5">
                    <div className={`h-14 w-14 rounded-3xl bg-gradient-to-br ${AVATAR_COLORS[index % AVATAR_COLORS.length]} shadow-2xl flex items-center justify-center text-white font-black text-lg border border-white/10 group-hover:scale-105 transition-transform italic-none`}>
                        {pet.name?.substring(0, 1).toUpperCase() ?? "?"}
                    </div>
                    <div>
                        <p className="text-base font-medium text-white tracking-tight italic-none">{pet.name || "Mascota"}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                            <span className="admin-label text-emerald-500/60 lowercase first-letter:uppercase">Información Lista</span>
                        </div>
                    </div>
                </div>
                <ChevronRight className={`h-5 w-5 text-white/10 transition-transform duration-700 ease-out ${open ? "rotate-90 text-primary" : ""}`} />
            </button>

            {/* Body Content */}
            <div className={`transition-all duration-1000 ease-in-out ${open ? "max-h-[800px] opacity-100 pb-8" : "max-h-0 opacity-0"} overflow-hidden`}>
                <div className="px-8 space-y-6">
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent mb-4" />
                    <InfoBlock
                        icon={<Sparkles className="h-4 w-4 text-amber-500" />}
                        label="Raza"
                        color="amber"
                        value={pet.breed || "No especificada."}
                    />
                    <InfoBlock
                        icon={<AlertCircle className="h-4 w-4 text-rose-500" />}
                        label="Salud y Cuidados"
                        color="rose"
                        value={pet.medical?.join(", ") || "Sin cuidados especiales registrados."}
                    />
                    <InfoBlock
                        icon={<Activity className="h-4 w-4 text-blue-500" />}
                        label="Comportamiento"
                        color="blue"
                        value={pet.behavior || "Se porta muy bien."}
                    />
                    <InfoBlock
                        icon={<ClipboardList className="h-4 w-4 text-primary" />}
                        label="Preferencias del Dueño"
                        color="teal"
                        value={pet.preferences || "Sin preferencias especiales."}
                    />
                </div>
            </div>
        </div>
    )
}

function InfoBlock({ icon, label, color, value }: {
    icon: React.ReactNode
    label: string
    color: "rose" | "blue" | "teal" | "amber"
    value: string
}) {
    const accents = {
        rose: "border-rose-500/10 bg-rose-500/[0.01] hover:bg-rose-500/[0.03]",
        blue: "border-blue-500/10 bg-blue-500/[0.01] hover:bg-blue-500/[0.03]",
        teal: "border-primary/10 bg-primary/[0.01] hover:bg-primary/[0.03]",
        amber: "border-amber-500/10 bg-amber-500/[0.01] hover:bg-amber-500/[0.03]",
    }[color]

    const textStyle = {
        rose: "text-rose-500",
        blue: "text-blue-500",
        teal: "text-primary",
        amber: "text-amber-500",
    }[color]

    return (
        <div className={`p-5 rounded-[1.8rem] border ${accents} transition-all duration-700 group/block`}>
            <div className="flex items-center gap-4 mb-3">
                <div className={`h-10 w-10 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center ${textStyle} shadow-2xl`}>
                    {icon}
                </div>
                <span className="admin-label text-white/30 group-hover/block:text-white/60 transition-colors">{label}</span>
            </div>
            <p className="text-[13px] text-white/50 font-light leading-relaxed pl-1 group-hover/block:text-white/80 transition-colors uppercase-first italic-none">{value}</p>
        </div>
    )
}

/* ══════════════════════════════════════════════════════════
   MOBILE — Navegación fullscreen entre vistas
   list → chat → medical
══════════════════════════════════════════════════════════ */
type MobileView = 'list' | 'chat' | 'medical'

function LeadsMobile() {
    const {
        leads, selectedLead, handleSelectLead, chatLoading, leadChat,
        manualMessage, setManualMessage,
        handleSendManualMessage, handleToggleBot, handleResetAllData,
        coldLeads, generateHook, handleReengagementSuccess
    } = useLeads()
    const confirm = useConfirm()

    const chatContainerRef = useRef<HTMLDivElement>(null)
    const [search, setSearch] = useState("")
    const [view, setView] = useState<MobileView>('list')

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
        }
    }, [leadChat, chatLoading])

    // When a lead is selected from the list, go to chat
    const handleSelectAndNavigate = (lead: Lead) => {
        handleSelectLead(lead)
        setView('chat')
    }

    const filtered = (leads ?? [])
        .filter((l: Lead) =>
            (l.name?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
            (l.phone?.includes(search) ?? false)
        )
        .sort((a, b) => {
            const getPriority = (l: Lead) => {
                let score = 0;
                if (l.human_review_pending) score += 1000;
                if (l.customer_mood === 'URGENTE') score += 500;
                if (!l.bot_active) score += 100;
                return score;
            };
            const scoreA = getPriority(a);
            const scoreB = getPriority(b);
            if (scoreA !== scoreB) return scoreB - scoreA;
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });

    const selectedIndex = leads?.findIndex((l: Lead) => l.phone === selectedLead?.phone) ?? -1

    /* ── View: List ── */
    if (view === 'list') {
        return (
            <div className="flex flex-col h-[calc(100vh-10rem)] bg-card/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-500">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--color-primary),0.04),transparent)] pointer-events-none rounded-[2rem]" />

                {/* Header */}
                <div className="p-5 border-b border-white/[0.06] flex items-center justify-between bg-black/20">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                            <MessageSquare className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest" style={{ fontStyle: 'normal' }}>Lista de</p>
                            <p className="text-sm font-black text-white" style={{ fontStyle: 'normal' }}>Clientes</p>
                        </div>
                    </div>
                    <Badge className="bg-white/10 text-white/50 border-none rounded-full px-3 py-1 admin-label text-[9px]">
                        {leads?.length ?? 0}
                    </Badge>
                </div>

                {/* Search */}
                <div className="px-4 py-3 border-b border-white/[0.04]">
                    <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl h-10 px-4 focus-within:border-primary/50 transition-all group/search-m">
                        <Search className="h-3.5 w-3.5 text-white/30 group-focus-within/search-m:text-primary shrink-0 transition-colors" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Buscar cliente..."
                            className="flex-1 border-none bg-transparent shadow-none focus:outline-none text-[11px] text-white/80 placeholder:text-white/20 h-full w-full"
                        />
                    </div>
                </div>

                {/* Proactive section */}
                {coldLeads && coldLeads.length > 0 && (
                    <div className="px-4 py-3 border-b border-white/[0.03]">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="h-3 w-3 text-primary animate-pulse" />
                            <span className="admin-label text-white/40 text-[9px]">Atención Proactiva</span>
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                            {coldLeads.slice(0, 3).map((lead) => {
                                const wInfo = get24hWindowInfo(lead.last_customer_message_at);
                                return (
                                    <div
                                        key={lead.phone}
                                        className="flex-shrink-0 w-44 bg-primary/5 border border-primary/10 rounded-2xl p-3 cursor-pointer active:bg-primary/10 transition-all"
                                        onClick={() => handleSelectAndNavigate(lead)}
                                    >
                                        <p className="text-[10px] font-black text-white/80 truncate mb-0.5" style={{ fontStyle: 'normal' }}>{lead.name || lead.phone}</p>
                                        <p className="admin-label text-primary/60 mb-2">-{wInfo.remainingHours}h</p>
                                        <button
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                const hook = await generateHook(lead.phone!);
                                                if (hook) {
                                                    setManualMessage(hook);
                                                    handleSelectAndNavigate(lead);
                                                    toast.success("Gancho generado");
                                                }
                                            }}
                                            className="w-full py-1.5 rounded-xl bg-primary/20 text-primary text-[7px] font-black uppercase tracking-widest transition-all border border-primary/20 flex items-center justify-center gap-1"
                                        >
                                            <Sparkles className="h-2 w-2" />
                                            Gancho
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Lead list */}
                <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1.5 custom-scrollbar">
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 opacity-20">
                            <Users className="h-8 w-8 mb-4 stroke-[1px]" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Sin Clientes</span>
                        </div>
                    ) : (
                        filtered.map((lead: Lead, idx: number) => {
                            const wInfo = get24hWindowInfo(lead.last_customer_message_at);
                            return (
                                <button
                                    key={lead.phone}
                                    onClick={() => handleSelectAndNavigate(lead)}
                                    className="w-full flex items-center gap-3 px-4 py-4 rounded-[1.5rem] text-left transition-all duration-500 active:bg-white/[0.06] border border-white/[0.04] hover:border-white/10 bg-white/[0.02]"
                                >
                                    {/* Avatar */}
                                    <div className="relative flex-shrink-0">
                                        <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${avatarColor(idx)} flex items-center justify-center text-white font-black text-xs shadow-xl italic-none`}>
                                            {getFirstChar(lead.name)}
                                            {lead.bot_active && <div className="absolute inset-0 rounded-2xl border-2 border-blue-400/40 animate-pulse" />}
                                        </div>
                                        <div className={`absolute -top-1 -right-1 h-5 w-5 rounded-full border-2 border-[#050506] flex items-center justify-center z-20 shadow-lg ${lead.bot_active ? "bg-blue-600" : "bg-rose-600"}`}>
                                            {lead.bot_active ? <Bot className="w-2.5 h-2.5 text-white" /> : <Users className="w-2 h-2 text-white" />}
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <p className="text-[13px] font-black tracking-tight truncate text-white/70 italic-none">
                                                {lead.name === lead.phone ? lead.phone : (lead.name || lead.phone)}
                                            </p>
                                            {lead.customer_mood && lead.customer_mood !== 'NEUTRAL' && (
                                                <span className="text-xs">
                                                    {lead.customer_mood === 'FELIZ' ? '😊' : lead.customer_mood === 'MOLESTO' ? '😠' : lead.customer_mood === 'URGENTE' ? '🚨' : ''}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[8px] admin-label ${wInfo.isOpen ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500/70' : 'bg-white/5 border-white/10 text-white/20'}`}>
                                                <Activity className="w-2 h-2" />
                                                {wInfo.isOpen ? `${wInfo.remainingHours}H` : 'OFF'}
                                            </div>
                                            {lead.human_review_pending && (
                                                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-rose-500/20 border border-rose-500/30 text-rose-500 text-[8px] admin-label animate-pulse">
                                                    <AlertCircle className="w-2 h-2" />
                                                    Revisión
                                                </div>
                                            )}
                                            <span className="text-[8px] text-white/20 admin-label truncate">{lead.current_step || "Init"}</span>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-white/20 shrink-0" />
                                </button>
                            )
                        })
                    )}
                </div>
            </div>
        )
    }

    /* ── View: Chat ── */
    if (view === 'chat' && selectedLead) {
        return (
            <div className="flex flex-col h-[calc(100vh-10rem)] bg-card/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-right duration-400">

                {/* Chat header */}
                <div className="px-4 py-4 flex items-center justify-between bg-black/30 border-b border-white/[0.06]">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setView('list')} className="h-9 w-9 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white/50 active:scale-90 transition-all">
                            <ArrowLeft className="h-4 w-4" />
                        </button>
                        <div className={`w-9 h-9 rounded-2xl bg-gradient-to-br ${avatarColor(selectedIndex)} flex items-center justify-center text-white font-black text-xs shadow-xl italic-none`}>
                            {getInitials(selectedLead.name)}
                        </div>
                        <div>
                            <p className="text-sm font-black text-white italic-none truncate max-w-[140px]">
                                {selectedLead.name === selectedLead.phone ? selectedLead.phone : (selectedLead.name || selectedLead.phone)}
                            </p>
                            <p className="text-[9px] text-white/30 font-mono" style={{ fontStyle: 'normal' }}>{selectedLead.phone}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Bot toggle compact */}
                        <div className="flex items-center bg-white/[0.03] rounded-xl border border-white/[0.06] p-0.5">
                            <button
                                onClick={() => !selectedLead.bot_active && handleToggleBot(true)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg admin-label transition-all duration-300 italic-none ${selectedLead.bot_active ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-white/20"}`}
                            >
                                <Zap className={`h-2.5 w-2.5 ${selectedLead.bot_active ? "fill-white" : ""}`} />
                                <span className="text-[8px] font-black uppercase" style={{ fontStyle: 'normal' }}>IA</span>
                            </button>
                            <button
                                onClick={() => selectedLead.bot_active && handleToggleBot(false)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg admin-label transition-all duration-300 italic-none ${!selectedLead.bot_active ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20" : "text-white/20"}`}
                            >
                                <ZapOff className={`h-2.5 w-2.5 ${!selectedLead.bot_active ? "fill-white" : ""}`} />
                                <span className="text-[8px] font-black uppercase" style={{ fontStyle: 'normal' }}>Manual</span>
                            </button>
                        </div>

                        {/* Medical panel button */}
                        <button
                            onClick={() => setView('medical')}
                            className="h-9 w-9 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white/40 active:scale-90 transition-all"
                        >
                            <HeartPulse className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Chat messages */}
                <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-5 custom-scrollbar">
                    {chatLoading ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-6">
                            <div className="w-16 h-16 relative">
                                <div className="absolute inset-0 border-2 border-primary/10 rounded-full animate-[ping_3s_infinite]" />
                                <div className="absolute inset-1.5 border-b-2 border-primary rounded-full animate-spin" />
                                <div className="absolute inset-3 m-auto h-8 w-8 bg-primary/10 rounded-full border border-primary/20 flex items-center justify-center">
                                    <Bot className="h-4 w-4 text-primary" />
                                </div>
                            </div>
                            <span className="text-[9px] font-black text-primary/60 uppercase tracking-[0.3em] animate-pulse">Cargando mensajes...</span>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {leadChat.map((msg: ChatMessage, idx: number) => {
                                const isBot = msg.role === "model"
                                const parts = msg.parts || []
                                if (parts.length === 0) {
                                    const fallbackText = msg.content || msg.text || ""
                                    if (fallbackText) parts.push({ text: fallbackText })
                                }
                                if (parts.length === 0) return null
                                const firstTextPart = parts.find(p => p.text)?.text || ""
                                const isSystem = firstTextPart.includes("[NOTA DEL SISTEMA:")
                                const isHumanNote = firstTextPart.includes("UN AGENTE HUMANO INTERVINO")
                                if (isSystem && !isHumanNote) return null

                                return (
                                    <div key={idx} className={`flex items-end gap-2.5 ${isBot ? "flex-row-reverse" : ""}`}>
                                        <div className={`h-8 w-8 rounded-xl flex-shrink-0 flex items-center justify-center text-white text-[9px] font-black border border-white/5 shadow-xl
                                            ${isBot
                                                ? (isHumanNote ? "bg-rose-500/20 text-rose-500 border-rose-500/30" : "bg-blue-500/20 text-blue-500 border-blue-500/30")
                                                : `bg-gradient-to-br ${avatarColor(selectedIndex)}`
                                            }`}>
                                            {isBot
                                                ? (isHumanNote ? <Users className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />)
                                                : getFirstChar(selectedLead.name)
                                            }
                                        </div>
                                        <div className="max-w-[78%] flex flex-col gap-2">
                                            {parts.map((part, pIdx) => {
                                                if (part.text) {
                                                    const cleanText = (isHumanNote && pIdx === 0)
                                                        ? part.text.replace(/\[NOTA DEL SISTEMA: .*?\]: /, "").replace(/"/g, "")
                                                        : part.text
                                                    return (
                                                        <div key={pIdx} className={`px-4 py-3 rounded-[1.4rem] text-[13px] leading-relaxed shadow-lg
                                                            ${isBot
                                                                ? (isHumanNote
                                                                    ? "bg-rose-500/20 border border-rose-400/20 text-white"
                                                                    : "bg-blue-600/20 border border-blue-400/20 text-white")
                                                                : "bg-white/[0.08] border border-white/20 text-white rounded-tl-none"
                                                            }`}>
                                                            {cleanText}
                                                        </div>
                                                    )
                                                }
                                                if (part.mediaUrl) {
                                                    return (
                                                        <div key={pIdx}>
                                                            <MediaBubble url={part.mediaUrl} type={part.mediaType || 'image'} />
                                                        </div>
                                                    )
                                                }
                                                return null
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Message input */}
                <div className="p-4 border-t border-white/[0.06] bg-black/20">
                    <div className="flex items-center gap-3">
                        <input
                            value={manualMessage}
                            onChange={e => setManualMessage(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSendManualMessage()}
                            placeholder="Escribe un mensaje..."
                            className="admin-input flex-1 px-5 py-3.5 text-sm"
                        />
                        <button
                            onClick={async () => {
                                const phone = selectedLead.phone;
                                await handleSendManualMessage();
                                if (coldLeads.some(l => l.phone === phone)) {
                                    await handleReengagementSuccess(phone!);
                                }
                            }}
                            disabled={!manualMessage.trim() || chatLoading}
                            className="h-12 w-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-xl shadow-primary/20 disabled:opacity-20 active:scale-90 transition-all"
                        >
                            <Send className="h-5 w-5 rotate-12" />
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    /* ── View: Medical ── */
    if (view === 'medical' && selectedLead) {
        return (
            <div className="flex flex-col h-[calc(100vh-10rem)] bg-card/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-right duration-400">
                {/* Header */}
                <div className="px-4 py-4 flex items-center gap-3 bg-black/30 border-b border-white/[0.06]">
                    <button onClick={() => setView('chat')} className="h-9 w-9 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white/50 active:scale-90 transition-all">
                        <ArrowLeft className="h-4 w-4" />
                    </button>
                    <div className="h-9 w-9 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/30">
                        <HeartPulse className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="text-sm font-black text-white italic-none">Historial Médico</p>
                        <p className="text-[9px] text-white/30" style={{ fontStyle: 'normal' }}>{selectedLead.name || selectedLead.phone}</p>
                    </div>
                    <span className="ml-auto admin-label text-primary/60">Citas: {selectedLead.total_appointments || 0}</span>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-4 py-5 custom-scrollbar">
                    <MedicalPanel lead={selectedLead} />
                </div>
            </div>
        )
    }

    /* Fallback — no lead selected */
    return (
        <div className="flex flex-col h-[calc(100vh-10rem)] bg-card/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.5)] items-center justify-center">
            <div className="h-16 w-16 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-center justify-center mb-4">
                <Bot className="h-6 w-6 text-white/10" />
            </div>
            <p className="text-xs font-black text-white/20 uppercase tracking-widest" style={{ fontStyle: 'normal' }}>Sin clientes</p>
        </div>
    )
}
