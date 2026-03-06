"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

export interface SystemLog {
    id: string
    created_at: string
    level: 'INFO' | 'ERROR' | 'WARN'
    phone: string | null
    message: string
    context: any
    stack: string | null
}

export function useSystemLogs() {
    const [logs, setLogs] = useState<SystemLog[]>([])
    const [loading, setLoading] = useState(true)

    const fetchLogs = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from("system_logs")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(100)

        if (!error && data) {
            setLogs(data)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchLogs()

        // Realtime subscription
        const channel = supabase.channel('system-logs-sync')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'system_logs' }, (payload) => {
                setLogs(prev => [payload.new as SystemLog, ...prev].slice(0, 100))
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    return { logs, loading, refetch: fetchLogs }
}
