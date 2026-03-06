"use client"
import React, { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { networkConfig } from "@/lib/network-config"
import { useConfirm } from "@/components/confirm-dialog"

export interface Lead {
    id: string
    name: string | null
    phone: string | null
    interest: string | null
    appointment_date: string | null
    status: string | null
    created_at: string
    product_service: string | null
    budget: string | null
    current_step: string | null
    summary: string | null
    bot_active: boolean
    medical_history: Record<string, unknown>
    total_appointments: number | null
    human_review_pending?: boolean
    customer_mood?: string
    last_customer_message_at: string
}

export interface AISetting {
    key: string
    value: string
    description: string | null
    updated_at: string
}

export interface ChatMessage {
    role: "user" | "model" | "system"
    parts: { text: string }[]
}

interface LeadsContextType {
    leads: Lead[]
    aiSettings: AISetting[]
    selectedLead: Lead | null
    leadChat: ChatMessage[]
    chatLoading: boolean
    lastInteraction: Date | null
    manualMessage: string
    coldLeads: Lead[]
    setManualMessage: React.Dispatch<React.SetStateAction<string>>
    handleSelectLead: (lead: Lead) => Promise<void>
    handleSendManualMessage: () => Promise<void>
    handleToggleBot: (active: boolean) => Promise<void>
    saveAISetting: (key: string, value: string) => Promise<void>
    handleResetAllData: () => Promise<void>
    fetchColdLeads: () => Promise<void>
    generateHook: (phone: string) => Promise<string | null>
    handleReengagementSuccess: (phone: string) => Promise<void>
}

const LeadsContext = createContext<LeadsContextType | null>(null)

export function LeadsProvider({ children }: { children: React.ReactNode }) {
    const [leads, setLeads] = useState<Lead[]>([])
    const [aiSettings, setAiSettings] = useState<AISetting[]>([])
    const confirm = useConfirm()

    // Chat states
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
    const [leadChat, setLeadChat] = useState<ChatMessage[]>([])
    const [chatLoading, setChatLoading] = useState(false)
    const [lastInteraction, setLastInteraction] = useState<Date | null>(null)
    const [manualMessage, setManualMessage] = useState("")
    const [coldLeads, setColdLeads] = useState<Lead[]>([])

    const { backendUrl: BACKEND_URL, adminApiKey: ADMIN_API_KEY } = networkConfig;

    const fetchColdLeads = async () => {
        if (!BACKEND_URL || !ADMIN_API_KEY) return;
        try {
            const res = await fetch(`${BACKEND_URL}/api/admin/leads/cold`, {
                headers: { "x-api-key": ADMIN_API_KEY }
            });
            if (res.ok) {
                const data = await res.json();
                setColdLeads(data.data || []);
            }
        } catch (err) {
            console.warn("Backend Offline (Cold Leads):", err);
        }
    }

    useEffect(() => {
        const fetchInitialLeads = async () => {
            try {
                // 1. Cargamos datos críticos de Supabase primero
                const [leadsRes, aiRes] = await Promise.all([
                    supabase.from("leads").select("*").order("created_at", { ascending: false }),
                    supabase.from("ai_settings").select("*")
                ])
                if (leadsRes.data) setLeads(leadsRes.data)
                if (aiRes.data) setAiSettings(aiRes.data)

                // 2. Cargamos leads fríos de forma independiente para que no bloquee ni crashee
                fetchColdLeads();
            } catch (err) {
                console.error("Error crítico cargando leads:", err);
            }
        }
        fetchInitialLeads()

        // Poll for cold leads every 5 minutes
        const interval = setInterval(fetchColdLeads, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [])

    const generateHook = async (phone: string): Promise<string | null> => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/admin/leads/${phone}/hook`, {
                headers: { "x-api-key": ADMIN_API_KEY }
            });
            if (res.ok) {
                const data = await res.json();
                return data.data.hook;
            }
        } catch (err) {
            console.error("Error generating hook:", err);
        }
        return null;
    }

    const handleReengagementSuccess = async (phone: string) => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/admin/leads/${phone}/reengage`, {
                method: "POST",
                headers: { "x-api-key": ADMIN_API_KEY }
            });
            if (res.ok) {
                // Actualizar lista de fríos localmente
                setColdLeads(prev => prev.filter(l => l.phone !== phone));
                // Recargar leads globales para ver el cambio de estado
                const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
                if (data) setLeads(data);
            }
        } catch (err) {
            console.error("Error marking reengagement:", err);
        }
    }

    useEffect(() => {
        const events = new EventSource(`${BACKEND_URL}/api/admin/events?api_key=${ADMIN_API_KEY}`)
        events.addEventListener("human_required", async (e) => {
            const data = JSON.parse(e.data)
            toast.error(`¡URGENTE! ${data.name} requiere atención manual`, { description: `Mensaje: "${data.message}"` })
            const res = await supabase.from("leads").select("*").order("created_at", { ascending: false })
            if (res.data) setLeads(res.data)
        })
        events.addEventListener("lead_updated", async (e: MessageEvent) => {
            const data = JSON.parse(e.data)
            const res = await supabase.from("leads").select("*").order("created_at", { ascending: false })
            if (res.data) setLeads(res.data)

            // Si el lead actualizado es el que tenemos abierto, recargar sus datos y chat
            setSelectedLead((current) => {
                if (current?.phone === data?.phone) {
                    // Recargar datos del Lead y del Chat
                    Promise.all([
                        supabase.from("leads").select("*").eq("phone", data.phone).single(),
                        supabase.from('chats').select('history, updated_at').eq('phone', data.phone).single()
                    ]).then(([{ data: leadData }, { data: chatData }]) => {
                        if (leadData) setSelectedLead(leadData);
                        if (chatData?.history) {
                            setLeadChat(chatData.history)
                            setLastInteraction(chatData.updated_at ? new Date(chatData.updated_at) : null)
                        }
                    })
                }
                return current
            })
        })
        // Canal secundario: Supabase Realtime para cambios directos en DB (Ficha Médica, etc)
        const leadsDbChannel = supabase.channel('leads-db-sync')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, (payload) => {
                const { eventType, new: newLead } = payload;
                const typedNew = newLead as Lead;

                if (eventType === 'UPDATE' || eventType === 'INSERT') {
                    setLeads(prev => {
                        const exists = prev.some(l => l.phone === typedNew.phone);
                        if (!exists && eventType === 'INSERT') return [typedNew, ...prev];
                        return prev.map(l => l.phone === typedNew.phone ? typedNew : l);
                    });

                    // Si el lead actualizado es el que tenemos abierto, actualizar sus datos
                    setSelectedLead((current) => {
                        if (current?.phone === typedNew.phone) {
                            return typedNew;
                        }
                        return current;
                    });
                } else if (eventType === 'DELETE') {
                    const typedOld = payload.old as { id: string; phone: string };
                    setLeads(prev => prev.filter(l => l.id !== typedOld.id && l.phone !== typedOld.phone));
                }
            })
            // Canal especial: Supabase Realtime para cambios directos en Chats
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'chats' }, (payload) => {
                const typedNew = payload.new as { phone: string; history: ChatMessage[]; updated_at: string; human_review_pending?: boolean };
                setSelectedLead((current) => {
                    if (current?.phone === typedNew.phone) {
                        setLeadChat(typedNew.history);
                        setLastInteraction(typedNew.updated_at ? new Date(typedNew.updated_at) : null);

                        // Si nos llega actualización de historial y es el seleccionado, 
                        // pero viene marcado como pendiente, lo limpiamos también
                        if (typedNew.human_review_pending) {
                            fetch(`${BACKEND_URL}/api/admin/leads/${typedNew.phone}/reviewed`, {
                                method: "POST", headers: { "x-api-key": ADMIN_API_KEY }
                            }).catch(console.error);
                        }
                    }
                    return current;
                });
            })
            .subscribe();

        // Canal terciario: Supabase Realtime para cambios en Configuración de IA
        const configDbChannel = supabase.channel('config-db-sync')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'ai_settings' }, (payload) => {
                const { eventType, new: newSetting } = payload;
                const typedNew = newSetting as AISetting;
                if (eventType === 'UPDATE' || eventType === 'INSERT') {
                    setAiSettings(prev => {
                        const existing = prev.find(s => s.key === typedNew.key);
                        if (!existing && eventType === 'INSERT') return [...prev, typedNew];
                        return prev.map(s => s.key === typedNew.key ? typedNew : s);
                    });
                }
            })
            .subscribe();

        return () => {
            events.close();
            supabase.removeChannel(leadsDbChannel);
            supabase.removeChannel(configDbChannel);
        }
    }, [BACKEND_URL, ADMIN_API_KEY])
    const handleSelectLead = async (lead: Lead) => {
        setSelectedLead(lead)
        setChatLoading(true)
        console.log("FETCHING CHAT FOR:", lead.phone)
        const response = await supabase.from('chats').select('history, updated_at').eq('phone', lead.phone)
        console.log("SUPABASE RESPONSE:", response)

        if (response.data && response.data.length > 0 && response.data[0].history) {
            setLeadChat(response.data[0].history)
            setLastInteraction(response.data[0].updated_at ? new Date(response.data[0].updated_at) : null)
        } else {
            console.log("NO DATA FOUND FOR CHAT", response.error)
            setLeadChat([])
            setLastInteraction(null)
        }

        // AUTO-CLEAR PENDING FLAG ON SELECTION
        if (lead.human_review_pending) {
            try {
                await fetch(`${BACKEND_URL}/api/admin/leads/${lead.phone}/reviewed`, {
                    method: "POST",
                    headers: { "x-api-key": ADMIN_API_KEY }
                });
                // Actualizar optimísticamente en la lista local
                setLeads(prev => prev.map(l => l.phone === lead.phone ? { ...l, human_review_pending: false } : l));
            } catch (err) {
                console.error("Error clearing pending flag:", err);
            }
        }

        setChatLoading(false)
    }

    const handleSendManualMessage = async () => {
        if (!manualMessage.trim() || !selectedLead) return;
        setChatLoading(true)
        try {
            const res = await fetch(`${BACKEND_URL}/api/admin/messages/send`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "x-api-key": ADMIN_API_KEY },
                body: JSON.stringify({ phone: selectedLead.phone, message: manualMessage })
            })
            if (res.ok) {
                toast.success("Mensaje enviado", { description: "La inteligencia artificial se ha pausado." })
                setManualMessage("")
                setLeadChat(prev => [...prev, { role: "model", parts: [{ text: `[NOTA DEL SISTEMA: UN AGENTE HUMANO INTERVINO Y LE ENVIÓ EL SIGUIENTE MENSAJE AL CLIENTE]: "${manualMessage}"` }] }])
                setSelectedLead((prev) => prev ? ({ ...prev, bot_active: false }) : null)
                setLeads(leads.map(l => l.phone === selectedLead.phone ? { ...l, bot_active: false } : l))
            } else {
                toast.error("Error al enviar el mensaje por API")
            }
        } catch { toast.error("Servidor Offline o problema CORS") }
        setChatLoading(false)
    }

    const handleToggleBot = async (active: boolean) => {
        if (!selectedLead) return;
        setChatLoading(true)
        try {
            const res = await fetch(`${BACKEND_URL}/api/admin/leads/${selectedLead.phone}/bot`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "x-api-key": ADMIN_API_KEY },
                body: JSON.stringify({ active })
            })
            if (res.ok) {
                toast.success(`IA ${active ? "Reactivada" : "Pausada"} para ${selectedLead.name}`)
                setSelectedLead((prev) => prev ? ({ ...prev, bot_active: active }) : null)
                setLeads(leads.map(l => l.phone === selectedLead.phone ? { ...l, bot_active: active } : l))
            }
        } catch { toast.error("Error reactivando IA") }
        setChatLoading(false)
    }

    const saveAISetting = async (key: string, value: string) => {
        const { error } = await supabase.from("ai_settings").upsert({ key, value })
        if (!error) {
            // Notificar al servidor que debe invalidar cache
            fetch(`${BACKEND_URL}/api/admin/config/refresh`, {
                method: "POST",
                headers: { "x-api-key": ADMIN_API_KEY }
            }).catch(err => console.error("Error refrescando cache del servidor:", err))

            setAiSettings(prev => {
                const existing = prev.find(a => a.key === key);
                if (existing) return prev.map(a => a.key === key ? { ...existing, value } : a);
                return [...prev, { key, value, description: null, updated_at: new Date().toISOString() }];
            })
            toast.success("Ajustes guardados y sincronizados con la IA")
        } else {
            toast.error("Error al guardar en base de datos")
        }
    }

    const handleResetAllData = async () => {
        const ok = await confirm({
            title: "¡ALERTA CRÍTICA!",
            description: "Esta acción es irreversible. Se borrarán todos los Leads, Chats, Citas y Memorias de la IA. Solo se conservará la configuración del sitio y los servicios.",
            confirmText: "Resetear Todo",
            variant: "destructive"
        })
        if (!ok) return;

        try {
            const res = await fetch(`${BACKEND_URL}/api/admin/reset-all`, {
                method: "POST",
                headers: { "x-api-key": ADMIN_API_KEY }
            });

            if (res.ok) {
                toast.success("Sistema reseteado correctamente", { description: "Todo ha vuelto a cero para pruebas limpias." });
                setLeads([]);
                setSelectedLead(null);
                setLeadChat([]);
                setTimeout(() => window.location.reload(), 1500);
            } else {
                toast.error("Error al resetear datos");
            }
        } catch {
            toast.error("Error de conexión con el servidor");
        }
    }

    return (
        <LeadsContext.Provider value={{
            leads, aiSettings, selectedLead, leadChat, chatLoading, lastInteraction, manualMessage, coldLeads, setManualMessage,
            handleSelectLead, handleSendManualMessage, handleToggleBot, saveAISetting, handleResetAllData,
            fetchColdLeads, generateHook, handleReengagementSuccess
        }}>
            {children}
        </LeadsContext.Provider>
    )
}

export const useLeads = () => {
    const context = useContext(LeadsContext)
    if (!context) throw new Error("useLeads must be used within LeadsProvider")
    return context
}

