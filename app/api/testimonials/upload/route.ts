import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData()
        const file = formData.get('file') as File | null

        if (!file) {
            return NextResponse.json({ error: 'No se recibió ningún archivo.' }, { status: 400 })
        }

        // Límite: 5MB
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: 'La imagen supera el límite de 5MB.' }, { status: 400 })
        }

        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const fileName = `pending/${Date.now()}_review.webp`

        const { error: uploadError } = await getSupabaseAdmin().storage
            .from('site_assets')
            .upload(fileName, buffer, {
                contentType: 'image/webp',
                cacheControl: '3600',
                upsert: false
            })

        if (uploadError) {
            console.error('Storage upload error:', uploadError)
            return NextResponse.json({ error: 'Error al subir la imagen.' }, { status: 500 })
        }

        const { data } = getSupabaseAdmin().storage.from('site_assets').getPublicUrl(fileName)
        return NextResponse.json({ url: data.publicUrl })
    } catch (err) {
        console.error('Upload API error:', err)
        return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 })
    }
}
