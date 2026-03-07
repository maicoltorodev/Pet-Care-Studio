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

export async function invalidateSiteContent() {
    console.log("Invalidating site content cache...")
    revalidatePath("/", "layout")
    revalidatePath("/", "page")
    revalidateTag("site_content", "max")
}

export async function invalidateServices() {
    revalidatePath("/", "layout")
    revalidatePath("/", "page")
    revalidateTag("services", "max")
}

export async function invalidateTestimonials() {
    revalidatePath("/", "layout")
    revalidatePath("/", "page")
    revalidateTag("testimonials", "max")
}

export async function invalidateTransformations() {
    revalidatePath("/", "layout")
    revalidatePath("/", "page")
    revalidateTag("transformations", "max")
}

