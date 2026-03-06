"use client"
import React from "react"
import { useSystemLogs } from "@/hooks/use-system-logs"
import { ShieldAlert, Terminal, Clock, Phone, AlertTriangle, Info, Bug, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function SystemLogsTab() {
    const { logs, loading, refetch } = useSystemLogs()

    const getLevelIcon = (level: string) => {
        switch (level) {
            case 'ERROR': return <Bug className="h-4 w-4 text-rose-500" />
            case 'WARN': return <AlertTriangle className="h-4 w-4 text-amber-500" />
            default: return <Info className="h-4 w-4 text-blue-500" />
        }
    }

    const getLevelClass = (level: string) => {
        switch (level) {
            case 'ERROR': return "border-rose-500/20 bg-rose-500/5"
            case 'WARN': return "border-amber-500/20 bg-amber-500/5"
            default: return "border-blue-500/20 bg-blue-500/5"
        }
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
            <div className="admin-card p-10 flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_15px_rgba(var(--color-primary),1)] animate-pulse" />
                        <span className="admin-muted text-primary/60">Diagnóstico en Vivo</span>
                    </div>
                    <h2 className="admin-title text-2xl md:text-4xl">Monitor de Sistema</h2>
                    <p className="admin-body mt-3 max-w-md">Registro inteligente de eventos, procesos de IA y errores críticos en tiempo real.</p>
                </div>
                <div className="flex items-center gap-4 relative z-10">
                    <button
                        onClick={() => refetch()}
                        disabled={loading}
                        className="admin-btn-ghost h-12 w-12 px-0 rounded-full disabled:opacity-40"
                    >
                        <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'}`} />
                    </button>
                    <span className="admin-pill">
                        {loading ? "Sincronizando..." : `${logs.length} Eventos`}
                    </span>
                </div>
            </div>

            <div className="grid gap-6">
                {logs.length === 0 && !loading ? (
                    <div className="flex flex-col items-center justify-center py-40 border border-dashed border-white/10 rounded-[3rem] bg-white/[0.01] relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <ShieldAlert className="h-20 w-20 text-white/5 mb-8 stroke-[1px]" />
                        <p className="admin-muted">No se han detectado eventos aún</p>
                    </div>
                ) : (
                    logs.map((log) => (
                        <div key={log.id} className={`group relative overflow-hidden rounded-[2.5rem] border transition-all duration-700 hover:bg-white/[0.02] shadow-[0_20px_60px_rgba(0,0,0,0.3)] admin-card ${getLevelClass(log.level)}`}>
                            <div className="p-5 md:p-10 flex flex-col lg:flex-row lg:items-start gap-6 md:gap-10">
                                <div className={`h-16 w-16 rounded-[1.5rem] flex items-center justify-center border shrink-0 shadow-2xl transition-transform duration-700 group-hover:scale-105 ${log.level === 'ERROR' ? "bg-rose-500/10 border-rose-500/20" :
                                    log.level === 'WARN' ? "bg-amber-500/10 border-amber-500/20" :
                                        "bg-blue-500/10 border-blue-500/20"
                                    }`}>
                                    {getLevelIcon(log.level)}
                                </div>

                                <div className="flex-1 space-y-6">
                                    <div className="flex flex-wrap items-center gap-4">
                                        <div className="flex items-center gap-3 px-4 py-2 bg-black/40 rounded-full border border-white/5 backdrop-blur-md">
                                            <Clock className="h-3.5 w-3.5 text-white/20" />
                                            <span className="text-[10px] font-mono text-white/40 tracking-tight">{new Date(log.created_at).toLocaleString()}</span>
                                        </div>
                                        {log.phone && (
                                            <div className="flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 backdrop-blur-md">
                                                <Phone className="h-3.5 w-3.5 text-primary/60" />
                                                <span className="text-[10px] font-mono text-primary/60 tracking-tighter">{log.phone}</span>
                                            </div>
                                        )}
                                        <Badge className={`rounded-xl px-4 py-1.5 font-black text-[9px] tracking-[0.2em] uppercase shadow-lg ${log.level === 'ERROR' ? "bg-rose-500 text-white" :
                                            log.level === 'WARN' ? "bg-amber-500 text-black border-none" :
                                                "bg-blue-600 text-white"
                                            }`}>
                                            {log.level}
                                        </Badge>
                                    </div>

                                    <div className="space-y-4">
                                        <p className="admin-body leading-relaxed">{log.message}</p>

                                        {log.context && Object.keys(log.context).length > 0 && (
                                            <div className="mt-6 p-8 rounded-[1.8rem] bg-black/60 border border-white/5 shadow-inner group/context relative overflow-hidden">
                                                <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover/context:opacity-[0.05] transition-opacity duration-1000">
                                                    <Terminal className="h-32 w-32" />
                                                </div>
                                                <div className="flex items-center gap-3 mb-4 opacity-30 group-hover/context:opacity-100 transition-opacity duration-700">
                                                    <Terminal className="h-4 w-4 text-primary" />
                                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Metadatos del Proceso</span>
                                                </div>
                                                <pre className="text-[11px] text-white/30 font-mono leading-relaxed overflow-x-auto selection:bg-primary/20">
                                                    {JSON.stringify(log.context, null, 2)}
                                                </pre>
                                            </div>
                                        )}

                                        {log.stack && (
                                            <details className="group/stack">
                                                <summary className="text-[10px] font-black text-rose-500/40 uppercase tracking-[0.4em] cursor-pointer hover:text-rose-400 transition-all list-none flex items-center gap-3 py-4">
                                                    <div className="h-px flex-1 bg-gradient-to-l from-rose-500/20 to-transparent" />
                                                    <span className="flex items-center gap-2 group-open/stack:text-rose-500">
                                                        <Bug className="h-3 w-3" />
                                                        Stack Trace
                                                    </span>
                                                    <div className="h-px flex-1 bg-gradient-to-r from-rose-500/20 to-transparent" />
                                                </summary>
                                                <div className="mt-4 p-8 rounded-[2rem] bg-rose-950/10 border border-rose-500/10 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,63,94,0.05),transparent)]" />
                                                    <pre className="text-[11px] text-rose-500/50 font-mono whitespace-pre-wrap leading-relaxed relative z-10 selection:bg-rose-500/20">
                                                        {log.stack}
                                                    </pre>
                                                </div>
                                            </details>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {/* Ambient padding for scroll */}
            <div className="h-20" />
        </div>
    )
}
