import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    const missing = !supabaseUrl ? 'NEXT_PUBLIC_SUPABASE_URL' : 'NEXT_PUBLIC_SUPABASE_ANON_KEY';
    throw new Error(
        `Error de Inicialización: Falta la variable ${missing} en Vercel. ` +
        "Asegúrate de que el nombre sea EXACTO y esté marcada la casilla 'Production' en el panel de Environment Variables."
    )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
