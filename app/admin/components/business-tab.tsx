"use client"

import React, { useEffect, useState } from "react"
import {
    AreaChart, Area, PieChart, Pie, Cell, CartesianGrid,
    Tooltip, ResponsiveContainer, XAxis, YAxis
} from "recharts"
import {
    TrendingUp, Users, Scissors, Clock, Sparkles, Target,
    Activity, Heart, DollarSign, ArrowUpRight, ArrowDownRight
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { networkConfig } from "@/lib/network-config"
import { useIsMobile } from "@/hooks/use-is-mobile"

const COLORS = ['#2DD4BF', '#0EA5E9', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981']

/* ── Shared data logic ── */
function useBusinessData() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const { backendUrl: BACKEND_URL, adminApiKey: ADMIN_API_KEY } = networkConfig

    const fetchAnalytics = async () => {
        setLoading(true)
        setError(false)
        if (!BACKEND_URL || !ADMIN_API_KEY) { setLoading(false); return }
        try {
            // Rango de 365 para reflejar "desde siempre" en históricos
            const res = await fetch(`${BACKEND_URL}/api/admin/analytics?range=365`, {
                headers: { "x-api-key": ADMIN_API_KEY }
            })
            if (res.ok) {
                const result = await res.json()
                setData(result.data)
            } else { setError(true) }
        } catch (err) {
            console.warn("Analytics Engine Offline:", err)
            setError(true)
        } finally { setLoading(false) }
    }

    useEffect(() => { fetchAnalytics() }, [])

    return { data, loading, error, fetchAnalytics }
}

/* ── Root export — router ── */
export function BusinessTab() {
    const isMobile = useIsMobile()
    return isMobile ? <BusinessMobile /> : <BusinessDesktop />
}

/* ════════════════════════════════════════
   DESKTOP — original layout
════════════════════════════════════════ */
function BusinessDesktop() {
    const { data, loading, error, fetchAnalytics } = useBusinessData()

    if (loading && !data) return <LoadingState />
    if (error && !data) return <ErrorState onRetry={fetchAnalytics} />

    const kpis = buildKpis(data)

    return (
        <div className="space-y-12 pb-20 animate-in fade-in duration-1000">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div>
                    <h2 className="admin-header-title text-5xl md:text-6xl mb-4 italic-none">
                        Métricas <span className="text-primary">Estratégicas</span>
                    </h2>
                    <p className="admin-label text-white/40 text-sm max-w-2xl tracking-widest uppercase italic-none">
                        Visión global: Histórico acumulado y proyección dinámica a <span className="text-white font-black">7 días</span>.
                    </p>
                </div>
                <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-3xl shadow-2xl">
                    <Activity className="h-4 w-4 text-primary animate-pulse" />
                    <span className="admin-dim !text-white/40 !tracking-[0.2em] italic-none">Sincronización de Inteligencia Activa</span>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((kpi, i) => (
                    <KpiCard key={i} {...kpi} />
                ))}
            </div>

            {/* AI Insights - Refactored for Premium look */}
            {data?.insights && data.insights.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {data.insights.map((insight: any, i: number) => (
                        <InsightCard key={i} insight={insight} index={i} />
                    ))}
                </div>
            )}

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card className="admin-card p-10 h-full border-white/5 hover:border-white/10 transition-all duration-700">
                        <ChartHeader icon={<Clock className="h-6 w-6 text-primary" />} title="Ritmo de Actividad" sub={`Histórico Acumulado`} />
                        <div className="h-[350px] w-full relative mt-10">
                            <EmptyOverlay show={!data?.charts?.heatmap || data.charts.heatmap.every((d: any) => d.mjes === 0)} label="Sin actividad registrada" />
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data?.charts?.heatmap || []}>
                                    <defs>
                                        <linearGradient id="colorMjesD" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                                    <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} interval={3} />
                                    <YAxis hide domain={[0, 'auto']} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(15px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
                                        labelStyle={{ color: 'var(--color-primary)', fontSize: '12px', fontWeight: '900' }}
                                    />
                                    <Area type="monotone" dataKey="mjes" stroke="var(--color-primary)" strokeWidth={4} fillOpacity={1} fill="url(#colorMjesD)" dot={{ r: 4, strokeWidth: 2, fill: '#000' }} activeDot={{ r: 8, strokeWidth: 0 }} animationDuration={2500} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                <div>
                    <Card className="admin-card p-10 h-full border-white/5 hover:border-white/10 transition-all duration-700">
                        <ChartHeader icon={<Scissors className="h-6 w-6 text-blue-400" />} title="Servicios Estrella" sub={`Distribución Histórica`} />
                        <div className="h-[280px] w-full mt-10 relative">
                            <EmptyOverlay show={!data?.charts?.services || data.charts.services.every((s: any) => s.value === 0)} label="Sin demanda" />
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={data?.charts?.services?.length ? data.charts.services : [{ name: 'Empty', value: 1 }]} innerRadius={70} outerRadius={95} paddingAngle={8} dataKey="value" stroke="none">
                                        {(data?.charts?.services || []).map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={data.charts.services.every((s: any) => s.value === 0) ? 'rgba(255,255,255,0.02)' : COLORS[index % COLORS.length]} />
                                        ))}
                                        {(!data?.charts?.services || data.charts.services.every((s: any) => s.value === 0)) && <Cell fill="rgba(255,255,255,0.03)" />}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(15px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px' }} itemStyle={{ color: '#fff', fontSize: '11px', fontWeight: '700' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-8 border-t border-white/5 pt-8">
                            <ServiceLegend services={data?.charts?.services || []} />
                        </div>
                    </Card>
                </div>
            </div>

            {/* Pets demographics */}
            <Card className="admin-card p-12 border-white/5 bg-white/[0.04]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                    <ChartHeader icon={<Users className="h-5 w-5 text-pink-400" />} title="Mapa Demográfico" />
                    <div className="px-6 py-2 bg-white/5 rounded-full border border-white/10 admin-label text-white/40 italic-none tracking-widest">
                        CENSO TOTAL ACUMULADO
                    </div>
                </div>
                <PetsGrid pets={data?.charts?.pets || []} />
            </Card>
        </div>
    )
}

/* ════════════════════════════════════════
   MOBILE — stacked cards, compact charts
════════════════════════════════════════ */
function BusinessMobile() {
    const { data, loading, error, fetchAnalytics } = useBusinessData()

    if (loading && !data) return <LoadingState />
    if (error && !data) return <ErrorState onRetry={fetchAnalytics} />

    const kpis = buildKpis(data)

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-1000">
            {/* Header */}
            <div>
                <h2 className="admin-header-title text-3xl italic-none">
                    Visión <span className="text-primary">Estratégica</span>
                </h2>
                <p className="admin-label text-white/30 text-[9px] mt-2 tracking-widest uppercase italic-none">Histórico Acumulado & Proyección 7D</p>
            </div>

            {/* KPIs — 2×2 grid */}
            <div className="grid grid-cols-2 gap-4">
                {kpis.map((kpi, i) => (
                    <KpiCardMobile key={i} {...kpi} />
                ))}
            </div>

            {/* AI Insights — horizontal scroll */}
            {data?.insights && data.insights.length > 0 && (
                <div>
                    <p className="admin-label text-white/40 text-[10px] mb-4 flex items-center gap-2 italic-none tracking-[0.3em]">
                        <Sparkles className="h-3 w-3 text-primary animate-pulse" /> INTELIGENCIA DE NEGOCIO
                    </p>
                    <div className="flex gap-5 overflow-x-auto pb-6 custom-scrollbar snap-x">
                        {data.insights.map((insight: any, i: number) => (
                            <div key={i} className="flex-shrink-0 w-80 bg-white/[0.04] border border-white/[0.1] rounded-[2.5rem] p-7 relative overflow-hidden snap-center backdrop-blur-3xl shadow-2xl">
                                <div className={`absolute top-0 right-0 h-1.5 w-20 bg-gradient-to-l ${insight.type === 'positive' ? 'from-primary' : insight.type === 'strategic' ? 'from-blue-500' : 'from-amber-500'}`} />
                                <h4 className="admin-label text-primary mb-4 flex items-center gap-2 italic-none text-xs" style={{ fontStyle: 'normal' }}>
                                    <Sparkles className="h-3 w-3" />{insight.title}
                                </h4>
                                <p className="text-[13px] text-white/60 leading-relaxed font-medium italic-none" style={{ fontStyle: 'normal' }}>{insight.text}</p>
                                <div className="mt-6 flex items-center gap-1.5 opacity-20">
                                    <div className="h-1 w-1 rounded-full bg-white" />
                                    <span className="admin-dim tracking-[0.4em]">ADAPTIVE IA</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Area chart */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-[2.5rem] p-7 shadow-2xl">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                        <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-[13px] font-black text-white italic-none uppercase tracking-widest">Actividad</p>
                        <p className="admin-label text-white/20 text-[9px] tracking-[0.2em] uppercase italic-none">Volumen Histórico</p>
                    </div>
                </div>
                <div className="h-[220px] w-full relative">
                    <EmptyOverlay show={!data?.charts?.heatmap || data.charts.heatmap.every((d: any) => d.mjes === 0)} label="Sin actividad" />
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data?.charts?.heatmap || []}>
                            <defs>
                                <linearGradient id="colorMjesM" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} interval={5} />
                            <YAxis hide domain={[0, 'auto']} />
                            <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px', fontSize: '10px' }} labelStyle={{ color: 'var(--color-primary)', fontWeight: 'bold' }} />
                            <Area type="monotone" dataKey="mjes" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorMjesM)" dot={false} animationDuration={2000} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Services donut */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-[2.5rem] p-7">
                <div className="flex items-center gap-4 mb-6">
                    <div className="h-10 w-10 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                        <Scissors className="h-5 w-5 text-blue-400" />
                    </div>
                    <p className="text-[13px] font-black text-white italic-none uppercase tracking-widest">Servicios</p>
                </div>
                <div className="flex flex-col gap-8">
                    <div className="h-[180px] w-full relative">
                        <EmptyOverlay show={!data?.charts?.services || data.charts.services.every((s: any) => s.value === 0)} label="" />
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={data?.charts?.services?.length ? data.charts.services : [{ name: 'Empty', value: 1 }]} innerRadius={55} outerRadius={75} paddingAngle={8} dataKey="value" stroke="none">
                                    {(data?.charts?.services || []).map((entry: any, index: number) => (
                                        <Cell key={`cell-m-${index}`} fill={data.charts.services.every((s: any) => s.value === 0) ? 'rgba(255,255,255,0.02)' : COLORS[index % COLORS.length]} />
                                    ))}
                                    {(!data?.charts?.services || data.charts.services.every((s: any) => s.value === 0)) && <Cell fill="rgba(255,255,255,0.03)" />}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-4">
                        <ServiceLegend services={data?.charts?.services || []} compact />
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ════════════════════════════════════════
   Shared sub-components
════════════════════════════════════════*/ /* ── Shared sub-components ── */
function buildKpis(data: any) {
    return [
        {
            label: "Conversión",
            value: `${data?.stats?.conversion?.value || '0'}%`,
            icon: Target,
            trend: data?.stats?.conversion?.trend || '0%',
            isPositive: !(data?.stats?.conversion?.trend || '').includes('-'),
            desc: "Retrospectiva Total"
        },
        {
            label: "En Caja",
            value: `$${(data?.stats?.revenue?.realized || 0).toLocaleString()}`,
            icon: DollarSign,
            trend: data?.stats?.revenue?.trend || '0%',
            isPositive: true,
            desc: `Proy. 7D: $${(data?.stats?.revenue?.projected || 0).toLocaleString()}`
        },
        {
            label: "ROI Tiempo",
            value: `${data?.stats?.efficiency?.value || '0'}h`,
            icon: Sparkles,
            trend: "IA Activa",
            isPositive: true,
            desc: "Ahorro Acumulado"
        },
        {
            label: "Fidelización",
            value: `${data?.stats?.loyalty?.value || '0'}%`,
            icon: Heart,
            trend: data?.stats?.loyalty?.trend || '0%',
            isPositive: !(data?.stats?.loyalty?.trend || '').includes('-'),
            desc: "Tasa de Retorno"
        },
    ]
}

function KpiCard({ label, value, icon: Icon, trend, isPositive, desc }: any) {
    return (
        <Card className="admin-card p-10 hover:bg-white/[0.08] transition-all duration-700 group relative overflow-hidden h-full border-white/5 hover:border-white/20">
            <div className="absolute -right-8 -top-8 bg-primary/10 h-32 w-32 rounded-full blur-[80px] group-hover:bg-primary/20 transition-all duration-1000" />
            <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 mb-8 group-hover:border-primary/30 group-hover:bg-primary/5 transition-all duration-500">
                <Icon className="h-7 w-7 text-primary" />
            </div>
            <h3 className="admin-label text-white/30 mb-3 tracking-[0.2em] italic-none">{label}</h3>
            <div className="flex items-baseline gap-4">
                <span className="text-4xl font-black text-white tracking-tighter" style={{ fontStyle: 'normal' }}>{value}</span>
                <div className={`flex items-center text-[10px] font-black tracking-widest ${isPositive ? 'text-primary' : 'text-rose-500'}`}>
                    {isPositive ? <ArrowUpRight className="h-3.5 w-3.5 mr-1" /> : <ArrowDownRight className="h-3.5 w-3.5 mr-1" />}
                    {trend}
                </div>
            </div>
            <div className="mt-8 pt-6 border-t border-white/5">
                <p className="admin-label text-white/20 text-[9px] tracking-[0.2em] italic-none">{desc}</p>
            </div>
        </Card>
    )
}

function KpiCardMobile({ label, value, icon: Icon, trend, isPositive, desc }: any) {
    return (
        <div className="bg-black/30 border border-white/[0.08] rounded-[2rem] p-5 relative overflow-hidden backdrop-blur-3xl">
            <div className="absolute -right-4 -top-4 bg-primary/10 h-16 w-16 rounded-full blur-2xl" />
            <div className="flex items-center justify-between mb-4">
                <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className={`flex items-center text-[9px] font-black ${isPositive ? 'text-primary' : 'text-rose-500'}`}>
                    {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {trend}
                </div>
            </div>
            <p className="text-[10px] text-white/30 mb-1 font-bold italic-none tracking-wider uppercase">{label}</p>
            <span className="text-2xl font-black text-white tracking-tighter" style={{ fontStyle: 'normal' }}>{value}</span>
            <p className="text-[9px] text-white/20 mt-3 font-medium italic-none border-t border-white/5 pt-3">{desc}</p>
        </div>
    )
}

function InsightCard({ insight, index }: { insight: any; index: number }) {
    return (
        <Card className="admin-card p-10 rounded-[3.5rem] relative overflow-hidden bg-gradient-to-br from-white/[0.06] to-transparent border-white/5 hover:border-white/20 transition-all duration-1000 group shadow-2xl">
            <div className={`absolute top-0 right-0 h-1.5 w-32 bg-gradient-to-l opacity-30 group-hover:opacity-100 transition-opacity duration-700 ${insight.type === 'positive' ? 'from-primary' : insight.type === 'strategic' ? 'from-blue-500' : 'from-amber-500'}`} />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/5 transition-all duration-700 border border-white/5 group-hover:border-primary/20">
                        <Sparkles className={`h-6 w-6 ${insight.type === 'positive' ? 'text-primary' : insight.type === 'strategic' ? 'text-blue-400' : 'text-amber-400'}`} />
                    </div>
                    <span className="admin-dim !text-white/10 tracking-[0.5em] text-[8px]">ESTRATEGIA #{index + 1}</span>
                </div>

                <h4 className="admin-section-title text-primary text-sm mb-5 flex items-center gap-3 italic-none tracking-widest">
                    {insight.title}
                </h4>

                <p className="text-base text-white/55 font-medium leading-[1.8] italic-none line-clamp-5">
                    {insight.text}
                </p>

                <div className="mt-10 flex items-center gap-2">
                    <div className={`h-1.5 w-1.5 rounded-full ${insight.type === 'positive' ? 'bg-primary shadow-[0_0_10px_#1c7184]' : insight.type === 'strategic' ? 'bg-blue-500' : 'bg-amber-500'} animate-pulse`} />
                    <span className="admin-dim !text-white/20 !tracking-[0.4em]">SÍNTESIS ADAPTATIVA</span>
                </div>
            </div>
        </Card>
    )
}

function ChartHeader({ icon, title, sub }: { icon: React.ReactNode; title: string; sub?: string }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
                <div className="h-14 w-14 rounded-[1.5rem] bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">{icon}</div>
                <div>
                    <h3 className="admin-header-title text-2xl text-white italic-none">{title}</h3>
                    {sub && <p className="admin-dim !text-white/30 tracking-[0.2em] mt-1 italic-none">{sub}</p>}
                </div>
            </div>
        </div>
    )
}

function ServiceLegend({ services, compact = false }: { services: any[]; compact?: boolean }) {
    return (
        <div className={`grid grid-cols-${compact ? '1' : '2'} gap-${compact ? '3' : '6'}`}>
            {services.slice(0, 6).map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between group/legend">
                    <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full flex-shrink-0 animate-pulse" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className={`text-white/50 capitalize font-medium italic-none ${compact ? 'text-[11px]' : 'text-sm'}`}>{item.name}</span>
                    </div>
                    <span className={`font-black text-white italic-none ${compact ? 'text-[11px]' : 'text-base'}`}>{item.value}</span>
                </div>
            ))}
        </div>
    )
}

function PetsGrid({ pets }: { pets: any[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-10 relative min-h-[150px]">
            {pets.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="admin-dim bg-white/[0.02] px-10 py-3 rounded-full border border-white/5 scale-110">
                        Sin datos demográficos registrados
                    </span>
                </div>
            )}
            {pets.map((pet: any, i: number) => (
                <div key={i} className="space-y-4 group">
                    <div className="flex items-center justify-between">
                        <span className="text-white/40 truncate max-w-[200px] capitalize font-medium text-sm italic-none">{pet.name}</span>
                        <span className="text-primary font-black text-lg italic-none">{pet.value}</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div className="h-full bg-gradient-to-r from-primary/40 to-primary rounded-full shadow-[0_0_15px_rgba(var(--color-primary),0.3)] transition-all duration-2000"
                            style={{ width: `${(pet.value / (pets[0]?.value || 1)) * 100}%` }} />
                    </div>
                </div>
            ))}
        </div>
    )
}

function EmptyOverlay({ show, label }: { show: boolean; label: string }) {
    if (!show) return null
    return (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <span className="admin-label text-white/20 bg-black/60 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 text-[10px] tracking-[0.3em] font-black">
                {label}
            </span>
        </div>
    )
}

function LoadingState() {
    return (
        <div className="h-[70vh] flex flex-col items-center justify-center gap-10">
            <div className="relative">
                <div className="h-32 w-32 rounded-full border-t-2 border-primary/40 border-r-2 border-primary animate-spin" />
                <div className="absolute inset-0 m-auto h-20 w-20 rounded-full border-b-2 border-primary/20 animate-spin-slow" />
                <Sparkles className="absolute inset-0 m-auto h-8 w-8 text-primary animate-pulse" />
            </div>
            <div className="text-center space-y-3">
                <p className="text-[12px] font-black uppercase tracking-[0.6em] text-white/40 animate-pulse italic-none">Calculando Inteligencia Estratégica</p>
                <div className="flex items-center justify-center gap-1">
                    <div className="h-1 w-1 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.3s]" />
                    <div className="h-1 w-1 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.15s]" />
                    <div className="h-1 w-1 rounded-full bg-primary animate-bounce" />
                </div>
            </div>
        </div>
    )
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
    return (
        <div className="h-[70vh] flex flex-col items-center justify-center gap-10 px-6 text-center">
            <div className="h-32 w-32 rounded-[3rem] bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl overflow-hidden relative group">
                <div className="absolute inset-0 bg-rose-500/10 opacity-50 blur-2xl" />
                <Activity className="h-12 w-12 text-rose-500/50 group-hover:text-rose-500 transition-colors duration-500" />
            </div>
            <div className="space-y-4">
                <h3 className="text-4xl font-black text-white tracking-tight italic-none">Acceso Restringido o Fallido</h3>
                <p className="text-white/40 text-base max-w-sm mx-auto font-medium italic-none leading-relaxed">No pudimos conectar con el motor de analíticas. Verifica la conexión con el servidor.</p>
            </div>
            <button onClick={onRetry} className="group relative px-12 py-4 rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95">
                <div className="absolute inset-0 bg-white" />
                <span className="relative z-10 text-black font-black text-[11px] uppercase tracking-[0.3em] group-hover:text-primary transition-colors">Reintentar Sincronía</span>
            </button>
        </div>
    )
}
