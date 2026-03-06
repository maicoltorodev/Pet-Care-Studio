import { supabase } from "./supabase"

export async function getSiteContent() {
    const { data } = await supabase.from("site_content").select("*")
    return data?.reduce((acc: Record<string, string>, item: { key: string, value: string }) => {
        acc[item.key] = item.value
        return acc
    }, {} as Record<string, string>) || {}
}

export async function getServices() {
    const { data } = await supabase
        .from("services")
        .select("*")
        .order("order_index", { ascending: true })
    return data || []
}

export async function getAISettings() {
    const { data } = await supabase.from("ai_settings").select("*")
    return data?.reduce((acc: Record<string, string>, item: { key: string, value: string }) => {
        acc[item.key] = item.value
        return acc
    }, {} as Record<string, string>) || {}
}
