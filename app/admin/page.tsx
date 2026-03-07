"use client"

import { BrainConfigTab } from "./components/brain-config-tab"
import { AgendaDailyTab } from "./components/agenda-daily-tab"
import { IdentidadTab } from "./components/identidad-tab"
import { TrustTab } from "./components/trust-tab"
import { TestimonialsTab } from "./components/testimonials-tab"
import { LeadsTab } from "./components/leads-tab"
import { ServicesTab } from "./components/services-tab"
import { TransformationsTab } from "./components/transformations-tab"
import { SystemLogsTab } from "./components/system-logs-tab"
import { BusinessTab } from "./components/business-tab"

import React, { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    LayoutDashboard, Scissors, MessageSquare, Bot, Users, Sparkles, Camera,
    Menu, X, Calendar as CalendarIcon, LogOut, Clock, ShieldAlert, BarChart3,
    ChevronRight, Settings
} from "lucide-react"

import { AdminLoader } from "@/components/admin-loader"
import { useAdminAuth } from "@/hooks/use-admin-auth"
import { AdminProviders } from "./providers"
import { useCMS } from "@/hooks/use-cms"
import { useIsMobile } from "@/hooks/use-is-mobile"

/* ─── Tab definitions ─────────────────────────────────────── */
const mainTabs = [
    { id: 'agenda_daily', label: 'Agenda', icon: CalendarIcon },
    { id: 'leads', label: 'Clientes', icon: Users },
    { id: 'business', label: 'Negocio', icon: BarChart3 },
]

const configTabs = [
    { id: 'testimonials', label: 'Opiniones', icon: MessageSquare },
    { id: 'services', label: 'Servicios', icon: Scissors },
    { id: 'transformations', label: 'Resultados', icon: Camera },
    { id: 'ia_logistica', label: 'Horarios / Capacidad', icon: Clock },
    { id: 'identidad', label: 'Información Web', icon: Sparkles },
    { id: 'trust', label: 'Confianza', icon: Users },
    { id: 'system_logs', label: 'Monitor', icon: ShieldAlert },
]

/* ─── Tab content renderer (shared) ──────────────────────── */
function TabContent({ activeTab }: { activeTab: string }) {
    return (
        <>
            {activeTab === "agenda_daily" && <AgendaDailyTab />}
            {activeTab === "ia_config" && <BrainConfigTab view="cerebro" />}
            {activeTab === "ia_logistica" && <BrainConfigTab view="agenda" />}
            {(activeTab === "agenda" || activeTab === "whatsapp") && <BrainConfigTab view="cerebro" />}
            {activeTab === "identidad" && <IdentidadTab />}
            {activeTab === "trust" && <TrustTab />}
            {activeTab === "testimonials" && <TestimonialsTab />}
            {activeTab === "leads" && <LeadsTab />}
            {activeTab === "business" && <BusinessTab />}
            {activeTab === "services" && <ServicesTab />}
            {activeTab === "transformations" && <TransformationsTab />}
            {activeTab === "system_logs" && <SystemLogsTab />}
        </>
    )
}

/* ─── Cinematic background ────────────────────────────────── */
function CinematicBg() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/5 cinematic-glow shadow-primary/10 opacity-30" />
            <div className="absolute bottom-0 left-1/4 w-[800px] h-[800px] bg-accent/5 cinematic-glow shadow-accent/5 opacity-20" />
            <div className="absolute inset-0 cinematic-vignette opacity-50" />
        </div>
    )
}

/* ══════════════════════════════════════════════════════════
   DESKTOP LAYOUT
══════════════════════════════════════════════════════════ */
function AdminDesktop({ activeTab, setActiveTab, handleLogout, logoUrl }: {
    activeTab: string
    setActiveTab: (tab: string) => void
    handleLogout: () => void
    logoUrl?: string
}) {
    const [isConfigOpen, setIsConfigOpen] = useState(false)

    return (
        <div className="flex min-h-screen bg-background selection:bg-primary/20 text-foreground overflow-hidden">
            <CinematicBg />

            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-50 w-80 bg-card/40 backdrop-blur-3xl border-r border-white/10 flex flex-col lg:translate-x-0 lg:static lg:h-screen lg:bg-card/25 transition-all duration-700 ease-in-out">
                <div className="p-10 h-full flex flex-col relative z-10 overflow-hidden">
                    <div className="flex items-center justify-center mb-12 relative">
                        <div className="flex flex-col items-center text-center group cursor-pointer" onClick={() => setActiveTab('agenda_daily')}>
                            <div>
                                <h1 className="admin-header-title text-xl leading-none">Pet Care <span className="text-primary ml-1 italic-none">Studio</span></h1>
                                <p className="admin-label text-white/10 mt-1.5 flex items-center justify-center gap-1.5 italic-none">
                                    <span className="h-1 w-1 rounded-full bg-primary animate-pulse" /> Panel de Control
                                </p>
                            </div>
                        </div>
                    </div>

                    <nav className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar scroll-smooth">
                        {/* Operativa Principal */}
                        <div className="space-y-1.5">
                            <label className="admin-label text-white/40 ml-6 mb-2 block italic-none">Operativa Diaria</label>
                            {mainTabs.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-500 group relative overflow-hidden ${activeTab === item.id ? "text-white" : "text-muted-foreground hover:text-white"}`}
                                >
                                    {activeTab === item.id && (
                                        <div className="absolute inset-0 bg-primary/30 backdrop-blur-md border border-primary/40 animate-in fade-in zoom-in-95 duration-500 rounded-2xl" />
                                    )}
                                    <item.icon className={`h-5 w-5 relative z-10 transition-all duration-500 ${activeTab === item.id ? "text-primary scale-110" : "opacity-40 group-hover:opacity-100 group-hover:text-primary"}`} />
                                    <span className="text-sm relative z-10 tracking-wide">{item.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Configuración Expandible */}
                        <div className="space-y-1.5 pt-4 border-t border-white/[0.03]">
                            <button
                                onClick={() => setIsConfigOpen(!isConfigOpen)}
                                className="w-full flex items-center justify-between px-6 py-4 rounded-2xl admin-label text-white/40 hover:text-white hover:bg-white/5 transition-all group italic-none"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="h-1.5 w-1.5 rounded-full bg-white/20 group-hover:bg-primary transition-colors" />
                                    Configuración
                                </div>
                                <X className={`h-3 w-3 transition-transform duration-500 ${isConfigOpen ? 'rotate-0 text-white' : 'rotate-45 text-white/40'}`} />
                            </button>

                            <div className={`overflow-hidden transition-all duration-700 ease-in-out ${isConfigOpen ? 'max-h-[1000px] opacity-100 space-y-1.5 mt-2' : 'max-h-0 opacity-0'}`}>
                                {configTabs.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`w-full flex items-center gap-4 px-6 py-3.5 rounded-2xl font-bold transition-all duration-500 group relative overflow-hidden ${activeTab === item.id ? "text-white" : "text-muted-foreground hover:text-white"}`}
                                    >
                                        {activeTab === item.id && (
                                            <div className="absolute inset-0 bg-white/5 backdrop-blur-md border border-white/10 animate-in fade-in zoom-in-95 duration-500 rounded-2xl" />
                                        )}
                                        <item.icon className={`h-4 w-4 relative z-10 transition-all duration-500 ${activeTab === item.id ? "text-primary opacity-100 scale-110" : "opacity-20 group-hover:opacity-100 group-hover:text-primary"}`} />
                                        <span className="text-xs relative z-10 tracking-wide">{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </nav>

                    <div className="pt-8 border-t border-white/5 mt-8">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-500 group"
                        >
                            <LogOut className="h-5 w-5 opacity-40 group-hover:opacity-100 transition-opacity" />
                            <span className="text-sm tracking-wide">Desconectar</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden w-full relative z-10">
                <main className={`flex-1 h-screen ${activeTab === 'leads' ? 'overflow-hidden' : 'overflow-y-auto'} px-6 py-12 md:px-12 md:py-16 custom-scrollbar scroll-smooth`}>
                    <div className={`max-w-7xl mx-auto ${activeTab === 'leads' ? '' : 'pb-32'}`}>
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
                            <TabContent activeTab={activeTab} />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

/* ══════════════════════════════════════════════════════════
   MOBILE LAYOUT
══════════════════════════════════════════════════════════ */
function AdminMobile({ activeTab, setActiveTab, handleLogout, logoUrl }: {
    activeTab: string
    setActiveTab: (tab: string) => void
    handleLogout: () => void
    logoUrl?: string
}) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    const currentMainTab = mainTabs.find(t => t.id === activeTab)
    const currentConfigTab = configTabs.find(t => t.id === activeTab)
    const currentTabLabel = currentMainTab?.label || currentConfigTab?.label || 'Admin'

    return (
        <div className="flex flex-col min-h-screen bg-background selection:bg-primary/20 text-foreground">
            <CinematicBg />

            {/* ── Top Bar ── */}
            <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-black/60 backdrop-blur-2xl border-b border-white/[0.06] flex items-center justify-between px-5">
                <div className="flex items-center gap-3">
                    {logoUrl
                        ? <img src={logoUrl} alt="Logo" className="h-7 w-auto object-contain" />
                        : <div className="h-7 w-7 rounded-xl bg-primary/20 flex items-center justify-center"><span className="text-primary text-[10px] font-black">PC</span></div>
                    }
                    <span className="font-black text-white text-[15px] tracking-tight" style={{ fontStyle: 'normal' }}>{currentTabLabel}</span>
                </div>

                <button
                    onClick={handleLogout}
                    className="h-9 w-9 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/40"
                >
                    <LogOut className="h-4 w-4" />
                </button>
            </header>

            {/* ── Content Area ── */}
            <main className={`flex-1 pt-16 pb-24 ${activeTab === 'leads' ? 'overflow-hidden h-screen' : 'overflow-y-auto custom-scrollbar'}`}>
                <div className={`${activeTab === 'leads' ? 'h-full' : 'px-4 py-6 max-w-2xl mx-auto'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                    <TabContent activeTab={activeTab} />
                </div>
            </main>

            {/* ── Bottom Tab Bar ── */}
            <nav className="fixed bottom-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-2xl border-t border-white/[0.06] safe-area-pb">
                <div className="flex items-stretch h-[72px]">
                    {mainTabs.map((tab) => {
                        const isActive = activeTab === tab.id
                        return (
                            <button
                                key={tab.id}
                                onClick={() => { setActiveTab(tab.id); setIsDrawerOpen(false) }}
                                className={`flex-1 flex flex-col items-center justify-center gap-1.5 relative transition-all duration-300 ${isActive ? 'text-primary' : 'text-white/30'}`}
                            >
                                {isActive && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--color-primary),1)]" />
                                )}
                                <tab.icon className={`h-5 w-5 transition-all duration-300 ${isActive ? 'scale-110' : ''}`} />
                                <span className="text-[9px] font-black uppercase tracking-widest" style={{ fontStyle: 'normal' }}>{tab.label}</span>
                            </button>
                        )
                    })}

                    {/* Más / Config button */}
                    <button
                        onClick={() => setIsDrawerOpen(true)}
                        className={`flex-1 flex flex-col items-center justify-center gap-1.5 relative transition-all duration-300 ${isDrawerOpen || currentConfigTab ? 'text-primary' : 'text-white/30'}`}
                    >
                        {(isDrawerOpen || currentConfigTab) && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--color-primary),1)]" />
                        )}
                        <Settings className="h-5 w-5" />
                        <span className="text-[9px] font-black uppercase tracking-widest" style={{ fontStyle: 'normal' }}>Más</span>
                    </button>
                </div>
            </nav>

            {/* ── Config Drawer (bottom sheet) ── */}
            {isDrawerOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setIsDrawerOpen(false)}
                    />
                    {/* Sheet */}
                    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#080809] border-t border-white/10 rounded-t-[2.5rem] animate-in slide-in-from-bottom duration-400 shadow-[0_-40px_80px_rgba(0,0,0,0.8)] max-h-[80vh] overflow-y-auto">
                        {/* Handle */}
                        <div className="flex justify-center pt-4 pb-2">
                            <div className="h-1 w-10 rounded-full bg-white/20" />
                        </div>
                        {/* Title */}
                        <div className="px-6 pb-4 flex items-center justify-between">
                            <h3 className="admin-header-title text-sm text-white/60">Configuración</h3>
                            <button onClick={() => setIsDrawerOpen(false)} className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center">
                                <X className="h-4 w-4 text-white/40" />
                            </button>
                        </div>
                        {/* Config tab list */}
                        <div className="px-4 pb-8 space-y-1">
                            {configTabs.map((item) => {
                                const isActive = activeTab === item.id
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => { setActiveTab(item.id); setIsDrawerOpen(false) }}
                                        className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 relative ${isActive ? 'bg-primary/10 border border-primary/20' : 'hover:bg-white/[0.04]'}`}
                                    >
                                        <div className={`h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 ${isActive ? 'bg-primary/20 text-primary' : 'bg-white/[0.04] text-white/30'}`}>
                                            <item.icon className="h-4 w-4" />
                                        </div>
                                        <span className={`text-sm font-bold tracking-wide ${isActive ? 'text-primary' : 'text-white/50'}`} style={{ fontStyle: 'normal' }}>{item.label}</span>
                                        <ChevronRight className={`h-4 w-4 ml-auto ${isActive ? 'text-primary' : 'text-white/20'}`} />
                                        {isActive && <div className="absolute right-4 h-2 w-2 rounded-full bg-primary animate-pulse" />}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

/* ══════════════════════════════════════════════════════════
   INNER — selects Desktop vs Mobile
══════════════════════════════════════════════════════════ */
function AdminDashboardInner() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const isMobile = useIsMobile()

    const activeTab = searchParams.get("tab") || "agenda_daily"
    const { handleLogout } = useAdminAuth()
    const { content, loading } = useCMS()

    const setActiveTab = (tab: string) => {
        router.push(`/admin?tab=${tab}`)
    }

    if (loading) {
        const logoUrl = content?.find((c: { key: string; value: string }) => c.key === 'site_logo_url')?.value
        return <AdminLoader logoUrl={logoUrl} />
    }

    const logoUrl = content?.find((c: { key: string; value: string }) => c.key === 'site_logo_url')?.value

    if (isMobile) {
        return <AdminMobile activeTab={activeTab} setActiveTab={setActiveTab} handleLogout={handleLogout} logoUrl={logoUrl} />
    }

    return <AdminDesktop activeTab={activeTab} setActiveTab={setActiveTab} handleLogout={handleLogout} logoUrl={logoUrl} />
}

/* ══════════════════════════════════════════════════════════
   ROOT EXPORT
══════════════════════════════════════════════════════════ */
export default function AdminDashboard() {
    const { loading } = useAdminAuth()

    if (loading) return <div className="h-screen w-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>

    return (
        <AdminProviders>
            <React.Suspense fallback={<div className="h-screen w-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>}>
                <AdminDashboardInner />
            </React.Suspense>
        </AdminProviders>
    )
}
