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

