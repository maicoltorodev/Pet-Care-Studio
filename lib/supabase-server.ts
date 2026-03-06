import { createClient } from '@supabase/supabase-js'

// Cliente con service_role — SOLO para uso en API Routes (server-side)
// Crea el cliente de forma lazy para no fallar en build-time si falta la env var
export function getSupabaseAdmin() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    )
}
