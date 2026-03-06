"use server"

import { revalidatePath, revalidateTag } from "next/cache"

// Cache granular - invalida solo lo necesario
export async function invalidateCache(path: string = "/") {
    revalidatePath(path)
}

// Cache por tags - más específico
export async function invalidateTag(tag: string) {
    revalidateTag(tag, "max")
}

// Invalidación específica por tipo de contenido
export async function invalidateSiteContent() {
    revalidatePath("/")
    revalidateTag("site_content", "max")
}

export async function invalidateServices() {
    revalidatePath("/")
    revalidateTag("services", "max")
}

export async function invalidateTestimonials() {
    revalidatePath("/")
    revalidateTag("testimonials", "max")
}

export async function invalidateTransformations() {
    revalidatePath("/")
    revalidateTag("transformations", "max")
}

// Time-based cache con lógica inteligente
export async function scheduleRevalidate(path: string, minutes: number) {
    // Programar revalidación automática
    setTimeout(() => {
        revalidatePath(path)
        console.log(`Cache invalidado automáticamente para ${path} después de ${minutes} minutos`)
    }, minutes * 60 * 1000)
}

// Cache híbrido: manual + automático
export async function smartInvalidate(path: string, autoInvalidateMinutes?: number) {
    // Invalidación inmediata
    revalidatePath(path)

    // Si se especifica, programar revalidación automática
    if (autoInvalidateMinutes) {
        scheduleRevalidate(path, autoInvalidateMinutes)
    }
}

