import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-server'
import { createHash } from 'crypto'

const RATE_LIMIT_DAYS = 15
const MAX_PENDING = 20   // Máximo de reseñas esperando moderación
const MAX_APPROVED = 9    // Máximo de reseñas activas en la web

function hashIP(ip: string): string {
    const salt = process.env.IP_SALT || 'petcare_salt'
    return createHash('sha256').update(ip + salt).digest('hex')
}

function getClientIP(req: NextRequest): string {
    return (
        req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
        req.headers.get('x-real-ip') ||
        '0.0.0.0'
    )
}

/** Borra un archivo del Storage a partir de su URL pública */
async function deleteStorageFile(url: string | null | undefined) {
    if (!url) return
    try {
        const parts = url.split('/site_assets/')
        if (parts.length > 1) {
            await getSupabaseAdmin().storage.from('site_assets').remove([parts[1]])
        }
    } catch { /* ignorar errores de storage al purgar */ }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { client_name, pet_name, pet_breed, content, rating, image_url } = body

        const MAX_CHARS = 500

        // ── Validación básica ─────────────────────────────────────────────────
        if (!client_name || !pet_name || !pet_breed || !content || !rating || !image_url) {
            return NextResponse.json({ error: 'Faltan campos requeridos.' }, { status: 400 })
        }
        if (content.length < 20) {
            return NextResponse.json({ error: 'La reseña debe tener al menos 20 caracteres.' }, { status: 400 })
        }
        if (content.length > MAX_CHARS) {
            return NextResponse.json({ error: `La reseña no puede superar los ${MAX_CHARS} caracteres.` }, { status: 400 })
        }

        const db = getSupabaseAdmin()

        // ── Rate limit por IP ─────────────────────────────────────────────────
        const ip = getClientIP(req)
        const ipHash = hashIP(ip)
        const cutoff = new Date(Date.now() - RATE_LIMIT_DAYS * 24 * 60 * 60 * 1000).toISOString()

        const { data: existing } = await db
            .from('testimonial_rate_limits')
            .select('submitted_at')
            .eq('ip_hash', ipHash)
            .gte('submitted_at', cutoff)
            .limit(1)

        if (existing && existing.length > 0) {
            const nextAllowed = new Date(new Date(existing[0].submitted_at).getTime() + RATE_LIMIT_DAYS * 24 * 60 * 60 * 1000)
            const daysLeft = Math.ceil((nextAllowed.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
            return NextResponse.json(
                { error: `Ya enviaste una reseña recientemente. Podrás enviar otra en ${daysLeft} día${daysLeft !== 1 ? 's' : ''}.` },
                { status: 429 }
            )
        }

        // ── Límite de pendientes (MAX_PENDING) ────────────────────────────────
        // Si ya hay MAX_PENDING pendientes, eliminar el más antiguo para hacer espacio
        const { data: pendingList } = await db
            .from('testimonials')
            .select('id, image_url, created_at')
            .eq('status', 'pending')
            .order('created_at', { ascending: true }) // el más viejo primero

        if (pendingList && pendingList.length >= MAX_PENDING) {
            const oldest = pendingList[0]
            await deleteStorageFile(oldest.image_url)
            await db.from('testimonials').delete().eq('id', oldest.id)
        }

        // ── Insertar testimonio como pendiente ────────────────────────────────
        const { error: insertError } = await db.from('testimonials').insert([{
            client_name: client_name.trim(),
            pet_name: pet_name.trim(),
            pet_breed: pet_breed.trim(),
            content: content.trim(),
            rating: Number(rating),
            image_url,
            status: 'pending',
            is_visible: false
        }])

        if (insertError) {
            console.error('Error inserting testimonial:', insertError)
            return NextResponse.json({ error: 'Error al guardar la reseña.' }, { status: 500 })
        }

        // ── Registrar el rate limit ───────────────────────────────────────────
        await db.from('testimonial_rate_limits').insert([{ ip_hash: ipHash }])

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error('Testimonial API error:', err)
        return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 })
    }
}

// Exportamos las constantes para que el admin pueda usarlas si las necesita
export { MAX_APPROVED }
