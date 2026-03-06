import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
    try {
        const secret = request.nextUrl.searchParams.get('secret');

        // Aquí deberías definir un REVALIDATION_SECRET en tus variables de entorno 
        // para proteger esta ruta contra accesos no autorizados.
        const expectedSecret = process.env.REVALIDATION_SECRET || 'mi_secreto_local';

        if (secret !== expectedSecret) {
            return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
        }

        // Ruta específica para la landing (home page)
        revalidatePath('/');

        return NextResponse.json({ revalidated: true, now: Date.now() });

    } catch (err) {
        return NextResponse.json({ message: 'Error revalidating', error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 });
    }
}
