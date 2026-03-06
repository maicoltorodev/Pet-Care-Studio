"use client"
import { useEffect, useRef } from 'react'
import type { DependencyList } from 'react'
import { supabase } from '@/lib/supabase'
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js'

// Simple logger fallback as @/lib/logger is missing
const logger = {
  debug: (...args: unknown[]) => console.debug('[Realtime]', ...args),
  error: (...args: unknown[]) => console.error('[Realtime]', ...args)
};

interface RealtimeSubscription {
  tableName: string
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*'
  callback: (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => void
}

/**
 * Hook personalizado para manejar suscripciones a Supabase Realtime
 * con cleanup automático para evitar memory leaks
 */
export function useSupabaseRealtime(subscriptions: RealtimeSubscription[], deps: DependencyList = []) {
  const channelsRef = useRef<RealtimeChannel[]>([])

  useEffect(() => {
    // Crear suscripciones
    const channels = subscriptions.map(({ tableName, event = '*', callback }) => {
      const channelName = `realtime-${tableName}-${Date.now()}`
      const channel = supabase.channel(channelName)
        .on('postgres_changes', {
          event: event as 'INSERT' | 'UPDATE' | 'DELETE' | '*',
          schema: 'public',
          table: tableName
        } as unknown as { [key: string]: string }, callback as unknown as (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => void)
        .subscribe()

      logger.debug(`Realtime subscription created: ${channelName} for ${tableName}`)
      return channel as unknown as RealtimeChannel
    })

    channelsRef.current = channels

    // Cleanup function
    return () => {
      channels.forEach((channel, index) => {
        try {
          supabase.removeChannel(channel)
          logger.debug(`Realtime subscription cleaned up: ${subscriptions[index].tableName}`)
        } catch (error) {
          logger.error('Error cleaning up realtime subscription', {
            tableName: subscriptions[index].tableName,
            error
          })
        }
      })
      channelsRef.current = []
    }
  }, deps)

  // Función para forzar cleanup manual si es necesario
  const forceCleanup = () => {
    channelsRef.current.forEach((channel, index) => {
      try {
        supabase.removeChannel(channel)
        logger.debug(`Manual cleanup: ${subscriptions[index]?.tableName || 'unknown'}`)
      } catch (error) {
        logger.error('Error in manual cleanup', { error })
      }
    })
    channelsRef.current = []
  }

  return { forceCleanup }
}

/**
 * Hook específico para suscribirse a una sola tabla
 */
export function useSupabaseTable(
  tableName: string,
  callback: (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => void,
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*' = '*',
  deps: DependencyList = []
) {
  return useSupabaseRealtime([{ tableName, event, callback }], deps)
}

/**
 * Hook para suscripciones múltiples con diferentes eventos
 */
export function useSupabaseMultipleTables(
  subscriptions: Array<{
    tableName: string
    callback: (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => void
    event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*'
  }>,
  deps: DependencyList = []
) {
  return useSupabaseRealtime(subscriptions, deps)
}
