"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { invalidateServices, invalidateTestimonials, invalidateTransformations, invalidateSiteContent } from "@/app/actions"
import { toast } from "sonner"
import { useConfirm } from "@/components/confirm-dialog"
import { compressImageToWebp } from "@/lib/image-optimization"

export interface SiteContent {
    key: string
    value: string
    updated_at?: string
}

export interface Service {
    id: string
    title: string
    description: string | null
    price: string | null
    features: string[] | null
    icon: string | null
    accent_color: string | null
    order_index: number
    image_url: string | null
    duration_minutes: number
    created_at: string
    updated_at: string
}

export interface Transformation {
    id: string | number
    name: string
    breed: string | null
    before_image_url: string | null
    after_image_url: string | null
    is_visible: boolean
    order_index: number
    created_at: string
}

export interface Testimonial {
    id: string
    client_name: string
    pet_name: string | null
    pet_breed: string | null
    content: string
    rating: number
    image_url: string | null
    status: 'approved' | 'pending' | 'rejected'
    is_visible: boolean
    created_at: string
}

interface CMSContextType {
    content: SiteContent[]
    services: Service[]
    transformations: Transformation[]
    testimonials: Testimonial[]
    pendingTestimonials: Testimonial[]
    loading: boolean
    saving: boolean
    fetchCMSData: () => Promise<void>
    compressImageToWebp: (file: File) => Promise<File>
    deleteFromStorage: (url: string | null | undefined) => Promise<void>
    saveContent: (key: string, value: string) => Promise<void>
    handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>, key: string) => Promise<void>
    handleRemoveMedia: (key: string, url: string | null | undefined) => Promise<void>
    handleAddService: () => Promise<void>
    handleServiceChange: (id: string, field: string, value: unknown) => void
    handleUpdateService: (service: Service) => Promise<void>
    handleDeleteService: (id: string) => Promise<void>
    handleServiceImageUpload: (event: React.ChangeEvent<HTMLInputElement>, serviceId: string, oldUrl: string | undefined) => Promise<void>
    handleMoveService: (id: string, direction: 'up' | 'down') => Promise<void>
    handleAddTransformation: () => Promise<void>
    handleTransformationChange: (id: string, field: string, value: unknown) => void
    handleUpdateTransformation: (trans: Transformation) => Promise<void>
    handleDeleteTransformation: (trans: Transformation) => Promise<void>
    handleTransformationImageUpload: (event: React.ChangeEvent<HTMLInputElement>, transId: string, field: 'before_image_url' | 'after_image_url') => Promise<void>
    handleRemoveTransformationMedia: (transId: string, field: 'before_image_url' | 'after_image_url', url: string | null | undefined) => Promise<void>
    handleTestimonialChange: (id: string, field: string, value: unknown) => void
    handleUpdateTestimonial: (t: Testimonial) => Promise<void>
    handleDeleteTestimonial: (id: string) => Promise<void>
    handleApproveTestimonial: (t: Testimonial) => Promise<void>
    handleRejectTestimonial: (t: Testimonial) => Promise<void>
    handleTestimonialImageUpload: (event: React.ChangeEvent<HTMLInputElement>, testimonialId: string, oldUrl: string | undefined) => Promise<void>
    setSaving: React.Dispatch<React.SetStateAction<boolean>>
}

const CMSContext = createContext<CMSContextType | null>(null)

export function CMSProvider({ children }: { children: React.ReactNode }) {
    const [content, setContent] = useState<SiteContent[]>([])
    const [services, setServices] = useState<Service[]>([])
    const [transformations, setTransformations] = useState<Transformation[]>([])
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [pendingTestimonials, setPendingTestimonials] = useState<Testimonial[]>([])
    const [saving, setSaving] = useState(false)
    const [loading, setLoading] = useState(true)
    const confirm = useConfirm()

    const fetchCMSData = async () => {
        setLoading(true)
        const [contentRes, servicesRes, transRes, testimonialsRes, pendingRes] = await Promise.all([
            supabase.from("site_content").select("*"),
            supabase.from("services").select("*").order("order_index"),
            supabase.from("transformations").select("*").order("order_index"),
            supabase.from("testimonials").select("*").eq("status", "approved").order("created_at", { ascending: false }),
            supabase.from("testimonials").select("*").eq("status", "pending").order("created_at", { ascending: false })
        ])

        if (contentRes.data) setContent(contentRes.data)
        if (servicesRes.data) setServices(servicesRes.data)
        if (transRes.data) setTransformations(transRes.data)
        if (testimonialsRes.data) setTestimonials(testimonialsRes.data)
        if (pendingRes.data) setPendingTestimonials(pendingRes.data)
        setLoading(false)
    }

    useEffect(() => {
        fetchCMSData()

        const globalChannel = supabase.channel('cms-global-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, (payload) => {
                const { eventType, new: newRecord, old: oldRecord } = payload;
                if (eventType === 'INSERT') {
                    const typedNew = newRecord as Service;
                    setServices(prev => prev.some(s => s.id === typedNew.id) ? prev : [...prev, typedNew].sort((a, b) => a.order_index - b.order_index));
                }
                else if (eventType === 'UPDATE') {
                    const typedNew = newRecord as Service;
                    setServices(prev => prev.map(s => s.id === typedNew.id ? typedNew : s).sort((a, b) => a.order_index - b.order_index));
                }
                else if (eventType === 'DELETE') {
                    const typedOld = oldRecord as { id: string };
                    setServices(prev => prev.filter(s => s.id !== typedOld.id));
                }
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'transformations' }, (payload) => {
                const { eventType, new: newRecord, old: oldRecord } = payload;
                if (eventType === 'INSERT') {
                    const typedNew = newRecord as Transformation;
                    setTransformations(prev => prev.some(t => t.id === typedNew.id) ? prev : [...prev, typedNew].sort((a, b) => a.order_index - b.order_index));
                }
                else if (eventType === 'UPDATE') {
                    const typedNew = newRecord as Transformation;
                    setTransformations(prev => prev.map(t => t.id === typedNew.id ? typedNew : t).sort((a, b) => a.order_index - b.order_index));
                }
                else if (eventType === 'DELETE') {
                    const typedOld = oldRecord as { id: string | number };
                    setTransformations(prev => prev.filter(t => t.id !== typedOld.id));
                }
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'testimonials' }, (payload) => {
                const { eventType, new: newRecord, old: oldRecord } = payload;

                if (eventType === 'INSERT') {
                    const typedNew = newRecord as Testimonial;
                    if (typedNew.status === 'approved') setTestimonials(prev => prev.some(t => t.id === typedNew.id) ? prev : [typedNew, ...prev].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
                    else setPendingTestimonials(prev => prev.some(t => t.id === typedNew.id) ? prev : [typedNew, ...prev].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
                } else if (eventType === 'UPDATE') {
                    const typedNew = newRecord as Testimonial;
                    // Remover de donde estaba antes y ponerlo donde va
                    setTestimonials(prev => prev.filter(t => t.id !== typedNew.id));
                    setPendingTestimonials(prev => prev.filter(t => t.id !== typedNew.id));

                    if (typedNew.status === 'approved') {
                        setTestimonials(prev => [typedNew, ...prev].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
                    } else {
                        setPendingTestimonials(prev => [typedNew, ...prev].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
                    }
                } else if (eventType === 'DELETE') {
                    const typedOld = oldRecord as { id: string };
                    setTestimonials(prev => prev.filter(t => t.id !== typedOld.id));
                    setPendingTestimonials(prev => prev.filter(t => t.id !== typedOld.id));
                }
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'site_content' }, (payload) => {
                const { eventType, new: newRecord, old: oldRecord } = payload;
                if (eventType === 'INSERT') {
                    const typedNew = newRecord as SiteContent;
                    setContent(prev => prev.some(c => c.key === typedNew.key) ? prev : [...prev, typedNew]);
                }
                else if (eventType === 'UPDATE') {
                    const typedNew = newRecord as SiteContent;
                    setContent(prev => prev.map(c => c.key === typedNew.key ? typedNew : c));
                }
                else if (eventType === 'DELETE') {
                    const typedOld = oldRecord as { key: string };
                    setContent(prev => prev.filter(c => c.key !== typedOld.key));
                }
            })
            .subscribe()

        return () => {
            supabase.removeChannel(globalChannel)
        }
    }, [])



    const deleteFromStorage = async (url: string | null | undefined) => {
        if (!url) return;
        try {
            const urlParts = url.split('/site_assets/')
            if (urlParts.length > 1) {
                const filePath = urlParts[1]
                await supabase.storage.from('site_assets').remove([filePath])
            }
        } catch (err) {
            console.error("Error al borrar el archivo del storage:", err)
        }
    }

    const clearAICache = () => {
        const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://server-api-whatsapp-production.up.railway.app"
        const ADMIN_API_KEY = process.env.NEXT_PUBLIC_ADMIN_API_KEY || "super_secret_admin_key_123"
        fetch(`${BACKEND_URL}/api/admin/config/refresh`, { method: "POST", headers: { "x-api-key": ADMIN_API_KEY } }).catch(console.error)
    }

    const saveContent = async (key: string, value: string) => {
        setSaving(true)
        const { error } = await supabase.from("site_content").upsert({
            key,
            value,
            updated_at: new Date().toISOString()
        })

        if (error) {
            console.error(`[SaveContent] Error for ${key}:`, error)
            toast.error("Error al sincronizar con la nube: " + error.message)
        } else {
            setContent(prev => {
                const existing = prev.find(c => c.key === key);
                if (existing) return prev.map(c => c.key === key ? { ...c, value } : c);
                return [...prev, { key, value }];
            });

            try {
                // Notificar a Next.js que revalide la caché pública
                await invalidateSiteContent()
                // Notificar al servidor de IA que recargue configs
                clearAICache()

                toast.success("Cambios publicados", {
                    description: "La página pública ha sido actualizada en tiempo real.",
                    duration: 3000
                })
            } catch (invError) {
                console.warn("[SaveContent] Falló la invalidación de caché:", invError)
            }
        }
        setSaving(false)
    }

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, key: string) => {
        let file = event.target.files?.[0]
        if (!file) return;

        setSaving(true)
        file = await compressImageToWebp(file)

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Archivo muy pesado", { description: "Sube un archivo de menor duración o resolución (Máximo 5MB)." })
            setSaving(false)
            return
        }

        const currentUrl = content.find(c => c.key === key)?.value
        if (currentUrl) await deleteFromStorage(currentUrl)

        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const filePath = `uploads/${fileName}`

        const { error: uploadError } = await supabase.storage.from('site_assets').upload(filePath, file, { cacheControl: '3600', upsert: false })
        if (uploadError) {
            toast.error("Error al subir el archivo")
            setSaving(false)
            return
        }

        const { data } = supabase.storage.from('site_assets').getPublicUrl(filePath)
        await saveContent(key, data.publicUrl)
        setSaving(false)
    }

    const handleRemoveMedia = async (key: string, url: string | null | undefined) => {
        const ok = await confirm({
            title: "¿Eliminar archivo?",
            description: "¿Estás seguro de que deseas eliminar este archivo multimedia de manera permanente?",
            variant: "destructive"
        })
        if (!ok) return;
        setSaving(true)
        await deleteFromStorage(url)
        await saveContent(key, "")
        toast.info("Archivo multimedia eliminado")
        setSaving(false)
    }

    // Services
    const handleAddService = async () => {
        setSaving(true)
        const newService = {
            title: "Nuevo Servicio Experiencia",
            description: "Descripción detallada de este nuevo servicio exclusivo.",
            price: "0.00",
            icon: "Scissors",
            order_index: services.length
        }
        const { data, error } = await supabase.from("services").insert([newService]).select()
        if (!error && data && data.length > 0) {
            const inserted = data[0] as Service;
            setServices(prev => [...prev, inserted]);
            toast.success("Servicio creado")
            await invalidateServices()  // Solo invalida servicios
            clearAICache()
        } else {
            toast.error("Error al crear servicio")
        }
        setSaving(false)
    }

    const serviceTimeoutRef = React.useRef<{ [key: string]: NodeJS.Timeout }>({})

    const handleServiceChange = (id: string, field: string, value: unknown) => {
        setServices(prev => {
            const newServices = prev.map(s => s.id === id ? { ...s, [field]: value } as Service : s)
            const updatedService = newServices.find(s => s.id === id)

            if (updatedService) {
                // Clear existing timeout for this service
                if (serviceTimeoutRef.current[id]) {
                    clearTimeout(serviceTimeoutRef.current[id])
                }

                // Set new timeout for auto-save (Efficient: wait until user stops typing)
                serviceTimeoutRef.current[id] = setTimeout(async () => {
                    setSaving(true)
                    const { error } = await supabase.from("services").update({
                        title: updatedService.title,
                        description: updatedService.description,
                        price: updatedService.price,
                        icon: updatedService.icon,
                        features: updatedService.features,
                        accent_color: updatedService.accent_color,
                        order_index: updatedService.order_index
                    }).eq("id", id)

                    if (!error) {
                        await invalidateServices()
                        clearAICache()
                        toast.success("¡Guardado!", {
                            id: `sync-${id}`,
                            description: `"${updatedService.title}" actualizado correctamente.`,
                            duration: 2000
                        })
                        console.log(`Servicio ${id} auto-sincronizado`)
                    }
                    serviceTimeoutRef.current[id] = undefined as any
                    setSaving(false)
                }, 1500)
            }

            return newServices
        })
    }

    const handleUpdateService = async (service: Service) => {
        setSaving(true)
        await supabase.from("services").update({
            title: service.title,
            description: service.description,
            price: service.price,
            icon: service.icon,
            features: service.features
        }).eq("id", service.id)
        await invalidateServices()
        clearAICache()
        toast.success("Sincronización manual completa")
        setSaving(false)
    }

    const handleDeleteService = async (id: string) => {
        const ok = await confirm({
            title: "¿Eliminar servicio?",
            description: "¿Estás seguro de que deseas eliminar este servicio? No aparecerá más en el catálogo público.",
            variant: "destructive"
        })
        if (!ok) return;
        setSaving(true)
        try {
            // Clear any pending auto-save
            if (serviceTimeoutRef.current[id]) {
                clearTimeout(serviceTimeoutRef.current[id])
            }
            const serviceToDelete = services.find(s => s.id === id)
            if (serviceToDelete?.image_url) await deleteFromStorage(serviceToDelete.image_url)

            const { error } = await supabase.from("services").delete().eq("id", id)

            if (error) {
                console.error("[DeleteService] Error al eliminar:", error)
                toast.error("Error al eliminar el servicio", { description: error.message })
                setSaving(false)
                return
            }

            // Actualización optimista del estado local para respuesta instantánea
            setServices(prev => prev.filter(s => s.id !== id))

            await invalidateServices()
            clearAICache()
            toast.info("Servicio eliminado del catálogo")
        } catch (err) {
            console.error("[DeleteService] Error inesperado:", err)
            toast.error("Error inesperado al eliminar")
        } finally {
            setSaving(false)
        }
    }

    const handleServiceImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, serviceId: string, oldUrl: string | undefined) => {
        let file = event.target.files?.[0]
        if (!file) return
        file = await compressImageToWebp(file)
        if (file.size > 5 * 1024 * 1024) { toast.error("Imagen muy pesada"); return }

        const filePath = `uploads/${Date.now()}_service.webp`
        const { error: uploadError } = await supabase.storage.from('site_assets').upload(filePath, file, { cacheControl: '3600', upsert: false })
        if (uploadError) { toast.error("Error al subir la imagen"); return }

        if (oldUrl) await deleteFromStorage(oldUrl)
        const { data } = supabase.storage.from('site_assets').getPublicUrl(filePath)
        await supabase.from('services').update({ image_url: data.publicUrl }).eq('id', serviceId)
        handleServiceChange(serviceId, 'image_url', data.publicUrl)
        toast.success("Imagen del servicio actualizada")
        await invalidateServices()  // Solo invalida servicios
    }

    const handleMoveService = async (id: string, direction: 'up' | 'down') => {
        const index = services.findIndex(s => s.id === id);
        if (index === -1) return;
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === services.length - 1) return;

        const newIndex = direction === 'up' ? index - 1 : index + 1;
        const newServices = [...services];
        const [movedItem] = newServices.splice(index, 1);
        newServices.splice(newIndex, 0, movedItem);

        // Actualizamos localmente primero
        setServices(newServices.map((s, i) => ({ ...s, order_index: i })));

        // Sincronizamos con DB
        setSaving(true);
        const updates = newServices.map((s, i) =>
            supabase.from("services").update({ order_index: i }).eq("id", s.id)
        );

        await Promise.all(updates);
        await invalidateServices();
        clearAICache();
        setSaving(false);
        toast.success("Orden actualizado");
    }

    // Transformations
    const handleAddTransformation = async () => {
        setSaving(true)
        const newTrans = {
            name: "Mascota",
            breed: "Raza",
            is_visible: true,
            order_index: (transformations?.length || 0) + 1
        }
        const { data, error } = await supabase.from("transformations").insert(newTrans).select().single()
        if (error) {
            toast.error("Error al crear transformación")
            setSaving(false)
            return
        }

        // Optimistic local update
        setTransformations(prev => [...prev, data as Transformation]);

        await invalidateTransformations()
        toast.success("Nueva foto agregada")
        setSaving(false)
    }

    const transformationTimeoutRef = React.useRef<{ [key: string]: NodeJS.Timeout }>({})

    const handleTransformationChange = (id: string, field: string, value: unknown) => {
        setTransformations(prev => {
            const newTrans = prev.map(t => String(t.id) === String(id) ? { ...t, [field]: value } as Transformation : t)
            const updatedTrans = newTrans.find(t => String(t.id) === String(id))

            if (updatedTrans && (field === 'name' || field === 'breed' || field === 'is_visible')) {
                if (transformationTimeoutRef.current[id]) {
                    clearTimeout(transformationTimeoutRef.current[id])
                }

                // Set new timeout for auto-save (Efficient: wait until user stops typing)
                transformationTimeoutRef.current[id] = setTimeout(async () => {
                    setSaving(true)
                    const { error } = await supabase.from("transformations").update({
                        name: updatedTrans.name,
                        breed: updatedTrans.breed,
                        is_visible: updatedTrans.is_visible,
                        before_image_url: updatedTrans.before_image_url,
                        after_image_url: updatedTrans.after_image_url,
                        order_index: updatedTrans.order_index
                    }).eq("id", id)

                    if (!error) {
                        await invalidateTransformations()
                        toast.success("¡Resultado Guardado!", {
                            id: `trans-${id}`,
                            description: `Cambios en "${updatedTrans.name}" sincronizados.`,
                            duration: 2000
                        })
                    }
                    transformationTimeoutRef.current[id] = undefined as any
                    setSaving(false)
                }, 1500)
            }

            return newTrans
        })
    }

    const handleUpdateTransformation = async (trans: Transformation) => {
        setSaving(true)
        await supabase.from("transformations").update({
            name: trans.name,
            breed: trans.breed,
            before_image_url: trans.before_image_url,
            after_image_url: trans.after_image_url,
            is_visible: trans.is_visible
        }).eq("id", String(trans.id))
        await invalidateTransformations()
        toast.success("Resultado actualizado exitosamente")
        setSaving(false)
    }

    const handleDeleteTransformation = async (trans: Transformation) => {
        const ok = await confirm({
            title: "¿Eliminar transformación?",
            description: "¿Estás seguro de eliminar este resultado del antes y después?",
            variant: "destructive"
        })
        if (!ok) return;
        setSaving(true)
        const id = trans.id.toString()
        if (transformationTimeoutRef.current[id]) {
            clearTimeout(transformationTimeoutRef.current[id])
        }

        try {
            if (trans.before_image_url) await deleteFromStorage(trans.before_image_url)
            if (trans.after_image_url) await deleteFromStorage(trans.after_image_url)
            const { error } = await supabase.from("transformations").delete().eq("id", id)

            if (error) throw error;

            // Optimistic local update
            setTransformations(prev => prev.filter(t => t.id.toString() !== id))

            await invalidateTransformations()
            toast.info("Resultado eliminado")
        } catch (error: any) {
            toast.error("Error al eliminar transformación", { description: error.message })
        } finally {
            setSaving(false)
        }
    }

    const handleTransformationImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, transId: string, field: 'before_image_url' | 'after_image_url') => {
        let file = event.target.files?.[0]
        if (!file) return;

        setSaving(true)
        file = await compressImageToWebp(file)

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Imagen muy pesada")
            setSaving(false)
            return
        }

        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}_trans.${fileExt}`
        const filePath = `uploads/${fileName}`

        const { error: uploadError } = await supabase.storage.from('site_assets').upload(filePath, file, { cacheControl: '3600', upsert: false })
        if (uploadError) {
            toast.error("Error al subir la imagen")
            setSaving(false)
            return
        }

        const { data } = supabase.storage.from('site_assets').getPublicUrl(filePath)
        handleTransformationChange(transId, field, data.publicUrl)
        await supabase.from("transformations").update({ [field]: data.publicUrl }).eq("id", String(transId))

        toast.success("Imagen de la galería guardada")
        setSaving(false)
    }

    const handleRemoveTransformationMedia = async (transId: string, field: 'before_image_url' | 'after_image_url', url: string | null | undefined) => {
        const ok = await confirm({
            title: "¿Eliminar imagen?",
            description: "¿Estás seguro de eliminar esta imagen de la transformación?",
            variant: "destructive"
        })
        if (!ok) return;
        setSaving(true)
        await deleteFromStorage(url)
        handleTransformationChange(transId, field, "")
        await supabase.from("transformations").update({ [field]: "" }).eq("id", String(transId))
        toast.info("Imagen de la galería eliminada")
        setSaving(false)
    }

    // Testimonials
    const testimonialTimeoutRef = React.useRef<{ [key: string]: NodeJS.Timeout }>({})

    const handleTestimonialChange = (id: string, field: string, value: unknown) => {
        setTestimonials(prev => {
            const newTestimonials = prev.map(t => String(t.id) === String(id) ? { ...t, [field]: value } as Testimonial : t)
            const updatedTestimonial = newTestimonials.find(t => String(t.id) === String(id))

            if (updatedTestimonial) {
                if (testimonialTimeoutRef.current[id]) {
                    clearTimeout(testimonialTimeoutRef.current[id])
                }
                testimonialTimeoutRef.current[id] = setTimeout(async () => {
                    setSaving(true)
                    const { error } = await supabase.from("testimonials").update({
                        client_name: updatedTestimonial.client_name,
                        pet_name: updatedTestimonial.pet_name,
                        pet_breed: updatedTestimonial.pet_breed,
                        content: updatedTestimonial.content,
                        rating: updatedTestimonial.rating,
                        is_visible: updatedTestimonial.is_visible
                    }).eq("id", id)

                    if (!error) {
                        await invalidateTestimonials()
                        toast.success("Reseña guardada", {
                            id: `testimonial-${id}`,
                            description: `"${updatedTestimonial.client_name}" actualizada.`,
                            duration: 2000
                        })
                    } else {
                        console.error("[TestimonialChange] Error auto-save:", error)
                        toast.error("Error al guardar la reseña", { description: error.message })
                    }
                    testimonialTimeoutRef.current[id] = undefined as any
                    setSaving(false)
                }, 1500)
            }

            return newTestimonials
        })
    }

    const handleUpdateTestimonial = async (t: Testimonial) => {
        await supabase.from("testimonials").update({
            client_name: t.client_name,
            pet_name: t.pet_name,
            pet_breed: t.pet_breed,
            content: t.content,
            rating: t.rating,
            is_visible: t.is_visible
        }).eq("id", t.id)
        await invalidateTestimonials()  // Solo invalida testimonials
        toast.success("Testimonio actualizado")
    }

    const handleDeleteTestimonial = async (id: string) => {
        const ok = await confirm({
            title: "¿Eliminar testimonio?",
            description: "¿Eliminar este testimonio permanentemente? Esta acción es irreversible.",
            variant: "destructive"
        })
        if (!ok) return;
        setSaving(true)
        try {
            const testimonialToDelete = testimonials.find(t => t.id === id)
            if (testimonialToDelete?.image_url) await deleteFromStorage(testimonialToDelete.image_url)

            const { error } = await supabase.from("testimonials").delete().eq("id", id)

            if (error) {
                console.error("[DeleteTestimonial] Error al eliminar:", error)
                toast.error("Error al eliminar el testimonio", { description: error.message })
                setSaving(false)
                return
            }

            // Actualización optimista del estado local
            setTestimonials(prev => prev.filter(t => t.id !== id))

            await invalidateTestimonials()
            toast.info("Testimonio eliminado correctamente")
        } catch (err) {
            console.error("[DeleteTestimonial] Error inesperado:", err)
            toast.error("Error inesperado al eliminar")
        } finally {
            setSaving(false)
        }
    }

    const handleApproveTestimonial = async (t: Testimonial) => {
        setSaving(true)
        try {
            const MAX_APPROVED = 9
            if (testimonials.length >= MAX_APPROVED) {
                const oldest = [...testimonials].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())[0]
                if (oldest) {
                    if (oldest.image_url) await deleteFromStorage(oldest.image_url)
                    const { error: delErr } = await supabase.from("testimonials").delete().eq("id", oldest.id)
                    if (delErr) console.error("[ApproveTestimonial] Error borrando el más viejo:", delErr)
                    else toast.info(`Reseña de ${oldest.client_name} eliminada para hacer espacio.`)
                }
            }

            const { error } = await supabase
                .from("testimonials")
                .update({ status: "approved", is_visible: true })
                .eq("id", t.id)

            if (error) {
                console.error("[ApproveTestimonial] Error al aprobar:", error)
                toast.error("Error al aprobar la reseña", { description: error.message })
                setSaving(false)
                return
            }

            // Actualización optimista del estado local — no esperar Realtime
            setPendingTestimonials(prev => prev.filter(p => p.id !== t.id))
            setTestimonials(prev => {
                if (prev.some(x => x.id === t.id)) return prev
                return [{ ...t, status: 'approved', is_visible: true }, ...prev]
            })

            await invalidateTestimonials()
            toast.success("¡Reseña publicada!", { description: `"${t.client_name}" ya es visible en tu sitio.` })
        } catch (err) {
            console.error("[ApproveTestimonial] Error inesperado:", err)
            toast.error("Error inesperado al aprobar la reseña")
        } finally {
            setSaving(false)
        }
    }

    const handleRejectTestimonial = async (t: Testimonial) => {
        const ok = await confirm({
            title: "¿Rechazar reseña?",
            description: "¿Rechazar y eliminar esta reseña permanentemente? Esta acción no se puede deshacer.",
            variant: "destructive"
        })
        if (!ok) return
        setSaving(true)
        try {
            if (t.image_url) await deleteFromStorage(t.image_url)
            const { error } = await supabase.from("testimonials").delete().eq("id", t.id)
            if (error) {
                console.error("[RejectTestimonial] Error al rechazar:", error)
                toast.error("Error al rechazar la reseña", { description: error.message })
                setSaving(false)
                return
            }
            // Actualización optimista del estado local
            setPendingTestimonials(prev => prev.filter(p => p.id !== t.id))
            toast.info("Reseña rechazada y eliminada")
        } catch (err) {
            console.error("[RejectTestimonial] Error inesperado:", err)
            toast.error("Error inesperado")
        } finally {
            setSaving(false)
        }
    }

    const handleTestimonialImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, testimonialId: string, oldUrl: string | undefined) => {
        let file = event.target.files?.[0]
        if (!file) return

        file = await compressImageToWebp(file)
        if (file.size > 5 * 1024 * 1024) { toast.error("Imagen muy pesada"); return }

        const filePath = `uploads/${Date.now()}_testimonial.webp`
        const { error: uploadError } = await supabase.storage.from('site_assets').upload(filePath, file, { cacheControl: '3600', upsert: false })
        if (uploadError) { toast.error("Error al subir la imagen"); return }

        if (oldUrl) await deleteFromStorage(oldUrl)
        const { data } = supabase.storage.from('site_assets').getPublicUrl(filePath)
        await supabase.from('testimonials').update({ image_url: data.publicUrl }).eq('id', testimonialId)
        handleTestimonialChange(testimonialId, 'image_url', data.publicUrl)
        toast.success("Imagen actualizada")
        await invalidateTestimonials()  // Solo invalida testimonials
    }

    return (
        <CMSContext.Provider value={{
            content, services, transformations, testimonials, pendingTestimonials, loading, saving,
            fetchCMSData, compressImageToWebp, deleteFromStorage, saveContent, handleImageUpload, handleRemoveMedia,
            handleAddService, handleServiceChange, handleUpdateService, handleDeleteService, handleServiceImageUpload, handleMoveService,
            handleAddTransformation, handleTransformationChange, handleUpdateTransformation, handleDeleteTransformation, handleTransformationImageUpload, handleRemoveTransformationMedia,
            handleTestimonialChange, handleUpdateTestimonial, handleDeleteTestimonial, handleApproveTestimonial, handleRejectTestimonial, handleTestimonialImageUpload,
            setSaving
        }}>
            {children}
        </CMSContext.Provider>
    )
}

export const useCMS = () => {
    const context = useContext(CMSContext)
    if (!context) throw new Error("useCMS must be used within CMSProvider")
    return context
}

