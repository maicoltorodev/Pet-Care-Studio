import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    // En Build Time de Vercel, si faltan las env vars, esto dará un error claro.
    throw new Error(
        "Faltan las variables de entorno de Supabase. " +
        "Asegúrate de configurar NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en el panel de Vercel."
    )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
