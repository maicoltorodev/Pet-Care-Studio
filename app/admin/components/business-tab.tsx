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
    const [period, setPeriod] = useState(30)
    const { backendUrl: BACKEND_URL, adminApiKey: ADMIN_API_KEY } = networkConfig

    const fetchAnalytics = async (range = period) => {
        setLoading(true)
        setError(false)
        if (!BACKEND_URL || !ADMIN_API_KEY) { setLoading(false); return }
        try {
            const res = await fetch(`${BACKEND_URL}/api/admin/analytics?range=${range}`, {
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

    useEffect(() => { fetchAnalytics() }, [period])

    return { data, loading, error, period, setPeriod, fetchAnalytics }
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
    const { data, loading, error, period, setPeriod, fetchAnalytics } = useBusinessData()

    if (loading && !data) return <LoadingState />
    if (error && !data) return <ErrorState onRetry={fetchAnalytics} />

    const kpis = buildKpis(data, period)

    return (
        <div className="space-y-12 pb-20 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div>
                    <h2 className="admin-header-title text-4xl md:text-5xl mb-4">
                        Visión <span className="text-primary" style={{ fontStyle: 'normal' }}>Dual</span>
                    </h2>
                    <p className="admin-label text-white/60 text-sm max-w-xl">
                        Balance retrospectivo y proyección estratégica sincronizada a <span className="text-white font-bold" style={{ fontStyle: 'normal' }}>{period} días</span>.
                    </p>
                </div>
                <PeriodSelector period={period} onChange={setPeriod} />
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((kpi, i) => (
                    <KpiCard key={i} {...kpi} period={period} />
                ))}
            </div>

            {/* AI Insights */}
            {data?.insights && data.insights.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {data.insights.map((insight: any, i: number) => (
                        <InsightCard key={i} insight={insight} />
                    ))}
                </div>
            )}

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card className="admin-card p-10 h-full">
                        <ChartHeader icon={<Clock className="h-6 w-6 text-primary" />} title="Ritmo de Actividad" sub={`Últimos ${period} días`} />
                        <div className="h-[300px] w-full relative mt-8">
                            <EmptyOverlay show={!data?.charts?.heatmap || data.charts.heatmap.every((d: any) => d.mjes === 0)} label="Sin actividad registrada" />
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data?.charts?.heatmap || []}>
                                    <defs>
                                        <linearGradient id="colorMjesD" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2DD4BF" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#2DD4BF" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.08)" />
                                    <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} interval={3} />
                                    <YAxis hide domain={[0, 'auto']} />
                                    <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px' }} labelStyle={{ color: '#2DD4BF', fontSize: '10px', fontWeight: 'bold' }} />
                                    <Area type="monotone" dataKey="mjes" stroke="#2DD4BF" strokeWidth={3} fillOpacity={1} fill="url(#colorMjesD)" dot={true} animationDuration={2000} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                <div>
                    <Card className="admin-card p-10 h-full">
                        <ChartHeader icon={<Scissors className="h-6 w-6 text-blue-400" />} title="Servicios Estrella" sub={`Demanda ${period}D`} />
                        <div className="h-[250px] w-full mt-8 relative">
                            <EmptyOverlay show={!data?.charts?.services || data.charts.services.every((s: any) => s.value === 0)} label="Sin demanda" />
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={data?.charts?.services?.length ? data.charts.services : [{ name: 'Empty', value: 1 }]} innerRadius={60} outerRadius={80} paddingAngle={10} dataKey="value" stroke="none">
                                        {(data?.charts?.services || []).map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={data.charts.services.every((s: any) => s.value === 0) ? 'rgba(255,255,255,0.02)' : COLORS[index % COLORS.length]} />
                                        ))}
                                        {(!data?.charts?.services || data.charts.services.every((s: any) => s.value === 0)) && <Cell fill="rgba(255,255,255,0.03)" />}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px' }} itemStyle={{ color: '#fff', fontSize: '10px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <ServiceLegend services={data?.charts?.services || []} />
                    </Card>
                </div>
            </div>

            {/* Pets demographics */}
            <Card className="admin-card p-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                    <ChartHeader icon={<Users className="h-5 w-5 text-pink-400" />} title="Top Razas Atendidas" />
                    <div className="px-6 py-2 bg-white/5 rounded-full border border-white/10 admin-label text-white/40" style={{ fontStyle: 'normal' }}>
                        Censo {period} Días
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
    const { data, loading, error, period, setPeriod, fetchAnalytics } = useBusinessData()

    if (loading && !data) return <LoadingState />
    if (error && !data) return <ErrorState onRetry={fetchAnalytics} />

    const kpis = buildKpis(data, period)

    return (
        <div className="space-y-5 pb-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="admin-header-title text-2xl" style={{ fontStyle: 'normal' }}>
                        Visión <span className="text-primary">Dual</span>
                    </h2>
                    <p className="admin-label text-white/30 text-[10px] mt-0.5">Últimos <span className="text-white" style={{ fontStyle: 'normal' }}>{period}D</span></p>
                </div>
                <PeriodSelector period={period} onChange={setPeriod} compact />
            </div>

            {/* KPIs — 2×2 grid */}
            <div className="grid grid-cols-2 gap-3">
                {kpis.map((kpi, i) => (
                    <KpiCardMobile key={i} {...kpi} />
                ))}
            </div>

            {/* AI Insights — horizontal scroll */}
            {data?.insights && data.insights.length > 0 && (
                <div>
                    <p className="admin-label text-white/30 text-[9px] mb-2 flex items-center gap-1.5">
                        <Sparkles className="h-2.5 w-2.5 text-primary animate-pulse" /> INSIGHTS DE IA
                    </p>
                    <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                        {data.insights.map((insight: any, i: number) => (
                            <div key={i} className="flex-shrink-0 w-64 bg-white/[0.03] border border-white/[0.06] rounded-[1.5rem] p-4 relative overflow-hidden">
                                <div className={`absolute top-0 right-0 h-0.5 w-16 bg-gradient-to-l ${insight.type === 'positive' ? 'from-primary' : insight.type === 'strategic' ? 'from-blue-500' : 'from-amber-500'}`} />
                                <h4 className="admin-label text-primary mb-2 flex items-center gap-1.5" style={{ fontStyle: 'normal' }}>
                                    <Sparkles className="h-2.5 w-2.5" />{insight.title}
                                </h4>
                                <p className="text-[11px] text-white/50 leading-relaxed" style={{ fontStyle: 'normal' }}>{insight.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Area chart — full width, smaller height */}
            <div className="bg-black/30 border border-white/[0.06] rounded-[1.8rem] p-4">
                <div className="flex items-center gap-2 mb-4">
                    <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                        <p className="text-[11px] font-black text-white" style={{ fontStyle: 'normal' }}>Ritmo de Actividad</p>
                        <p className="admin-label text-white/20 text-[8px]">Últimos {period} días</p>
                    </div>
                </div>
                <div className="h-[180px] w-full relative">
                    <EmptyOverlay show={!data?.charts?.heatmap || data.charts.heatmap.every((d: any) => d.mjes === 0)} label="Sin actividad" />
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data?.charts?.heatmap || []}>
                            <defs>
                                <linearGradient id="colorMjesM" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2DD4BF" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#2DD4BF" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
                            <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 8 }} interval={5} />
                            <YAxis hide domain={[0, 'auto']} />
                            <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }} labelStyle={{ color: '#2DD4BF' }} />
                            <Area type="monotone" dataKey="mjes" stroke="#2DD4BF" strokeWidth={2} fillOpacity={1} fill="url(#colorMjesM)" dot={false} animationDuration={1500} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Services donut + legend */}
            <div className="bg-black/30 border border-white/[0.06] rounded-[1.8rem] p-4">
                <div className="flex items-center gap-2 mb-3">
                    <div className="h-8 w-8 rounded-xl bg-blue-500/10 flex items-center justify-center">
                        <Scissors className="h-4 w-4 text-blue-400" />
                    </div>
                    <p className="text-[11px] font-black text-white" style={{ fontStyle: 'normal' }}>Servicios Estrella</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="h-[140px] w-[140px] flex-shrink-0 relative">
                        <EmptyOverlay show={!data?.charts?.services || data.charts.services.every((s: any) => s.value === 0)} label="" />
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={data?.charts?.services?.length ? data.charts.services : [{ name: 'Empty', value: 1 }]} innerRadius={42} outerRadius={58} paddingAngle={8} dataKey="value" stroke="none">
                                    {(data?.charts?.services || []).map((entry: any, index: number) => (
                                        <Cell key={`cell-m-${index}`} fill={data.charts.services.every((s: any) => s.value === 0) ? 'rgba(255,255,255,0.02)' : COLORS[index % COLORS.length]} />
                                    ))}
                                    {(!data?.charts?.services || data.charts.services.every((s: any) => s.value === 0)) && <Cell fill="rgba(255,255,255,0.03)" />}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex-1 space-y-2 overflow-y-auto max-h-[140px] pr-1 custom-scrollbar">
                        <ServiceLegend services={data?.charts?.services || []} compact />
                    </div>
                </div>
            </div>

            {/* Pets demographics — compact list */}
            {data?.charts?.pets && data.charts.pets.length > 0 && (
                <div className="bg-black/30 border border-white/[0.06] rounded-[1.8rem] p-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-xl bg-pink-500/10 flex items-center justify-center">
                                <Users className="h-4 w-4 text-pink-400" />
                            </div>
                            <p className="text-[11px] font-black text-white" style={{ fontStyle: 'normal' }}>Top Razas</p>
                        </div>
                        <span className="admin-label text-white/20 text-[8px]">Censo {period}D</span>
                    </div>
                    <div className="space-y-3">
                        {data.charts.pets.slice(0, 6).map((pet: any, i: number) => (
                            <div key={i} className="space-y-1">
                                <div className="flex items-center justify-between admin-label">
                                    <span className="text-white/50 truncate max-w-[180px] capitalize text-[10px]" style={{ fontStyle: 'normal' }}>{pet.name}</span>
                                    <span className="text-primary" style={{ fontStyle: 'normal' }}>{pet.value}</span>
                                </div>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-primary/50 to-primary rounded-full transition-all duration-1000"
                                        style={{ width: `${(pet.value / (data.charts.pets[0]?.value || 1)) * 100}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

/* ════════════════════════════════════════
   Shared sub-components
════════════════════════════════════════ */
function buildKpis(data: any, period: number) {
    return [
        { label: "Conversión", value: `${data?.stats?.conversion?.value || '0'}%`, icon: Target, trend: data?.stats?.conversion?.trend || '0%', isPositive: !(data?.stats?.conversion?.trend || '').includes('-'), desc: `Éxito ${period}D` },
        { label: "En Caja", value: `$${(data?.stats?.revenue?.realized || 0).toLocaleString()}`, icon: DollarSign, trend: data?.stats?.revenue?.trend || '0%', isPositive: true, desc: `Proy: $${(data?.stats?.revenue?.projected || 0).toLocaleString()}` },
        { label: "ROI Tiempo", value: `${data?.stats?.efficiency?.value || '0'}h`, icon: Sparkles, trend: "IA Pro", isPositive: true, desc: "Ahorrado" },
        { label: "Fidelización", value: `${data?.stats?.loyalty?.value || '0'}%`, icon: Heart, trend: data?.stats?.loyalty?.trend || '0%', isPositive: !(data?.stats?.loyalty?.trend || '').includes('-'), desc: "Recurrencia" },
    ]
}

function KpiCard({ label, value, icon: Icon, trend, isPositive, desc, period }: any) {
    return (
        <Card className="admin-card p-8 hover:bg-white/[0.06] transition-all duration-700 group relative overflow-hidden h-full">
            <div className="absolute -right-4 -top-4 bg-primary/10 h-24 w-24 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700" />
            <Icon className="h-6 w-6 text-primary mb-6" />
            <h3 className="admin-label text-white/30 mb-2">{label}</h3>
            <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-white tracking-tighter" style={{ fontStyle: 'normal' }}>{value}</span>
                <div className={`flex items-center text-[10px] font-bold ${isPositive ? 'text-primary' : 'text-rose-500'}`}>
                    {isPositive ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                    {trend}
                </div>
            </div>
            <p className="admin-label text-white/20 mt-4 capitalize">{desc}</p>
        </Card>
    )
}

function KpiCardMobile({ label, value, icon: Icon, trend, isPositive, desc }: any) {
    return (
        <div className="bg-black/30 border border-white/[0.06] rounded-[1.5rem] p-4 relative overflow-hidden">
            <div className="absolute -right-2 -top-2 bg-primary/10 h-12 w-12 rounded-full blur-2xl" />
            <div className="flex items-center justify-between mb-2">
                <Icon className="h-4 w-4 text-primary" />
                <div className={`flex items-center text-[9px] font-bold ${isPositive ? 'text-primary' : 'text-rose-500'}`}>
                    {isPositive ? <ArrowUpRight className="h-2.5 w-2.5" /> : <ArrowDownRight className="h-2.5 w-2.5" />}
                    {trend}
                </div>
            </div>
            <p className="text-[9px] text-white/30 mb-1" style={{ fontStyle: 'normal' }}>{label}</p>
            <span className="text-xl font-black text-white" style={{ fontStyle: 'normal' }}>{value}</span>
            <p className="text-[8px] text-white/20 mt-1 capitalize" style={{ fontStyle: 'normal' }}>{desc}</p>
        </div>
    )
}

function InsightCard({ insight }: any) {
    return (
        <Card className="admin-card p-8 rounded-[2rem] relative overflow-hidden bg-gradient-to-br from-white/[0.05] to-transparent">
            <div className={`absolute top-0 right-0 h-1 w-20 bg-gradient-to-l ${insight.type === 'positive' ? 'from-primary' : insight.type === 'strategic' ? 'from-blue-500' : 'from-amber-500'}`} />
            <h4 className="admin-label text-primary mb-3 flex items-center gap-2" style={{ fontStyle: 'normal' }}>
                <Sparkles className="h-3 w-3" />{insight.title}
            </h4>
            <p className="text-sm text-white/60 font-medium leading-relaxed" style={{ fontStyle: 'normal' }}>{insight.text}</p>
        </Card>
    )
}

function PeriodSelector({ period, onChange, compact = false }: { period: number; onChange: (p: number) => void; compact?: boolean }) {
    return (
        <div className={`flex bg-white/5 border border-white/10 rounded-2xl p-1 backdrop-blur-xl ${compact ? 'gap-0.5' : 'gap-1'}`}>
            {[7, 30, 90].map((d) => (
                <button key={d} onClick={() => onChange(d)}
                    className={`${compact ? 'px-3 py-1.5 text-[9px]' : 'px-5 py-2 text-[10px]'} rounded-xl admin-label transition-all duration-300 ${period === d ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"}`}
                    style={{ fontStyle: 'normal' }}>
                    {d}D
                </button>
            ))}
        </div>
    )
}

function ChartHeader({ icon, title, sub }: { icon: React.ReactNode; title: string; sub?: string }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center">{icon}</div>
                <h3 className="admin-header-subtitle text-xl text-white">{title}</h3>
            </div>
            {sub && <span className="admin-label text-white/20">{sub}</span>}
        </div>
    )
}

function ServiceLegend({ services, compact = false }: { services: any[]; compact?: boolean }) {
    return (
        <div className={`space-y-${compact ? '2' : '4'} ${!compact ? 'max-h-[150px] overflow-y-auto pr-2 custom-scrollbar' : ''}`}>
            {services.map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className={`text-white/60 capitalize ${compact ? 'text-[10px]' : 'admin-label'}`} style={{ fontStyle: 'normal' }}>{item.name}</span>
                    </div>
                    <span className={`font-black text-white ${compact ? 'text-[10px]' : 'text-[11px]'}`} style={{ fontStyle: 'normal' }}>{item.value}</span>
                </div>
            ))}
        </div>
    )
}

function PetsGrid({ pets }: { pets: any[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8 relative min-h-[100px]">
            {pets.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/10 bg-white/[0.02] px-6 py-2 rounded-full border border-white/5">
                        Sin datos demográficos
                    </span>
                </div>
            )}
            {pets.map((pet: any, i: number) => (
                <div key={i} className="space-y-3">
                    <div className="flex items-center justify-between admin-label">
                        <span className="text-white/40 truncate max-w-[150px] capitalize">{pet.name}</span>
                        <span className="text-primary" style={{ fontStyle: 'normal' }}>{pet.value}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary/50 to-primary rounded-full"
                            style={{ width: `${(pet.value / (pets[0]?.value || 1)) * 100}%`, transition: 'width 1.5s ease' }} />
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
            <span className="admin-label text-white/10 bg-white/[0.02] px-4 py-1.5 rounded-full border border-white/5 text-[9px]">
                {label}
            </span>
        </div>
    )
}

function LoadingState() {
    return (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
            <div className="relative">
                <div className="h-20 w-20 rounded-full border-t-2 border-primary animate-spin" />
                <Sparkles className="absolute inset-0 m-auto h-6 w-6 text-primary animate-pulse" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20" style={{ fontStyle: 'normal' }}>Sincronizando Inteligencia...</p>
        </div>
    )
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
    return (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-8 px-6 text-center">
            <div className="h-24 w-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <Activity className="h-10 w-10 text-white/20" />
            </div>
            <div>
                <h3 className="text-2xl font-black text-white tracking-tighter mb-2" style={{ fontStyle: 'normal' }}>Motor de Analíticas Offline</h3>
                <p className="text-white/40 text-sm max-w-xs mx-auto" style={{ fontStyle: 'normal' }}>No pudimos conectar con el motor de inteligencia.</p>
            </div>
            <button onClick={onRetry} className="px-8 py-3 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all duration-500" style={{ fontStyle: 'normal' }}>
                Reintentar Conexión
            </button>
        </div>
    )
}
