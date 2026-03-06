"use client"
import React, { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { now } from "@/lib/time"
import { toast } from "sonner"
import { useConfirm } from "@/components/confirm-dialog"

export interface Appointment {
    id: string
    phone: string
    pet_name: string | null
    service_id: string | null
    appointment_date: string
    start_time: string
    end_time: string
    status: 'agendada' | 'completada' | 'cancelada' | 'reprogramada'
    is_validated: boolean
    notes: string | null
    created_at: string
    updated_at: string
}

interface AgendaContextType {
    appointments: Appointment[]
    selectedDate: Date
    setSelectedDate: React.Dispatch<React.SetStateAction<Date>>
    handleUpdateAppointmentStatus: (id: string, status: Appointment['status']) => Promise<void>
    handleDeleteAppointment: (id: string) => Promise<void>
    handleCreateManualReservation: (date: Date, hour: string) => Promise<void>
    getAppointmentsForDate: (date: Date) => Appointment[]
}

const AgendaContext = createContext<AgendaContextType | null>(null)

export function AgendaProvider({ children }: { children: React.ReactNode }) {
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [selectedDate, setSelectedDate] = useState<Date>(now())
    const confirm = useConfirm()

    useEffect(() => {
        const fetchAppointments = async () => {
            const { data } = await supabase.from("appointments").select("*").order("start_time", { ascending: true })
            if (data) setAppointments(data)
        }
        fetchAppointments()

        // Suscripción en tiempo real para citas (INSERT, UPDATE, DELETE)
        const channel = supabase.channel('agenda-global-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, (payload) => {
                console.log("🔔 Cambio en Agenda detectado:", payload.eventType)

                if (payload.eventType === 'INSERT') {
                    toast.success("¡Nueva cita agendada por la IA!", {
                        description: `Revisa la agenda para ver los detalles.`,
                        icon: "🔔"
                    });
                    setAppointments(prev => {
                        const newAppointment = payload.new as Appointment;
                        // Evitar duplicados si ya se agregó localmente
                        const exists = prev.some(a => a.id === newAppointment.id);
                        if (exists) return prev;
                        // Insertar y re-ordenar
                        const updated = [...prev, newAppointment];
                        return updated.sort((a, b) => a.start_time.localeCompare(b.start_time));
                    });
                } else if (payload.eventType === 'UPDATE') {
                    const updatedAppointment = payload.new as Appointment;
                    setAppointments(prev => prev.map(a => a.id === updatedAppointment.id ? updatedAppointment : a));
                } else if (payload.eventType === 'DELETE') {
                    toast.warning("Se ha cancelado o eliminado una cita", {
                        description: `La agenda ha sido liberada en ese horario.`,
                        icon: "📅"
                    });
                    const oldAppointment = payload.old as { id: string };
                    setAppointments(prev => prev.filter(a => a.id !== oldAppointment.id));
                }
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const handleUpdateAppointmentStatus = async (id: string, status: Appointment['status']) => {
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
        await supabase.from("appointments").update({ status }).eq("id", id);
        toast.success(`Cita marcada como ${status}`);
    }

    const handleCreateManualReservation = async (date: Date, hour: string) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        const startTime = `${hour}:00`;
        const nextHour = (parseInt(hour) + 1).toString().padStart(2, '0');
        const endTime = `${nextHour}:00`;

        const newReservation = {
            phone: "0000000000",
            pet_name: "RESERVADO",
            appointment_date: dateStr,
            start_time: startTime,
            end_time: endTime,
            status: 'agendada' as const,
            is_validated: true,
            notes: null
        };

        const { data, error } = await supabase.from("appointments").insert([newReservation]).select();

        if (error) {
            toast.error("Error al crear la reserva manual");
            console.error(error);
            return;
        }

        if (data) {
            setAppointments(prev => [...prev, data[0]].sort((a, b) => a.start_time.localeCompare(b.start_time)));
            toast.success("Espacio reservado correctamente");
        }
    }

    const handleDeleteAppointment = async (id: string) => {
        const ok = await confirm({
            title: "¿Eliminar cita?",
            description: "¿Confirma que desea eliminar esta cita o reserva? Esta acción es irreversible.",
            variant: "destructive"
        })
        if (!ok) return;
        setAppointments(prev => prev.filter(a => a.id !== id));
        await supabase.from("appointments").delete().eq("id", id);
        toast.info("Elemento eliminado correctamente.");
    }

    const getAppointmentsForDate = (date: Date) => {
        // Usar formato local YYYY-MM-DD para evitar desfases de zona horaria (ISO usa UTC)
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        return appointments.filter(a => a.appointment_date === dateStr);
    };

    return (
        <AgendaContext.Provider value={{
            appointments, selectedDate, setSelectedDate,
            handleUpdateAppointmentStatus, handleDeleteAppointment, handleCreateManualReservation, getAppointmentsForDate
        }}>
            {children}
        </AgendaContext.Provider>
    )
}

export const useAgenda = () => {
    const context = useContext(AgendaContext)
    if (!context) throw new Error("useAgenda must be used within AgendaProvider")
    return context
}

