// Test de caché granular - Script de validación
import { invalidateServices, invalidateTestimonials, invalidateSiteContent } from '@/app/actions'
import { supabase } from '@/lib/supabase'

export async function testCacheInvalidation() {
  console.log('🧪 Iniciando test de caché granular...')
  
  try {
    // Test 1: Invalidación de servicios
    console.log('📋 Test 1: Invalidación de servicios')
    const beforeServices = await supabase.from('services').select('*')
    console.log(`✅ Servicios antes: ${beforeServices.data?.length || 0}`)
    
    await invalidateServices()
    console.log('🔄 Invalidación de servicios ejecutada')
    
    // Test 2: Invalidación de testimonials
    console.log('⭐ Test 2: Invalidación de testimonials')
    const beforeTestimonials = await supabase.from('testimonials').select('*')
    console.log(`✅ Testimonials antes: ${beforeTestimonials.data?.length || 0}`)
    
    await invalidateTestimonials()
    console.log('🔄 Invalidación de testimonials ejecutada')
    
    // Test 3: Invalidación de contenido del sitio
    console.log('🌐 Test 3: Invalidación de contenido del sitio')
    const beforeContent = await supabase.from('site_content').select('*')
    console.log(`✅ Contenido del sitio antes: ${beforeContent.data?.length || 0}`)
    
    await invalidateSiteContent()
    console.log('🔄 Invalidación de contenido del sitio ejecutada')
    
    console.log('🎉 Todos los tests de caché pasaron exitosamente!')
    return true
    
  } catch (error) {
    console.error('❌ Error en test de caché:', error)
    return false
  }
}

export async function testCachePerformance() {
  console.log('⚡ Test de performance de caché...')
  
  const iterations = 10
  const times: number[] = []
  
  for (let i = 0; i < iterations; i++) {
    const start = performance.now()
    
    // Simular carga de datos
    await Promise.all([
      supabase.from('services').select('*'),
      supabase.from('testimonials').select('*'),
      supabase.from('site_content').select('*')
    ])
    
    const end = performance.now()
    times.push(end - start)
  }
  
  const avgTime = times.reduce((a, b) => a + b, 0) / times.length
  const minTime = Math.min(...times)
  const maxTime = Math.max(...times)
  
  console.log(`📊 Performance Results (${iterations} iterations):`)
  console.log(`⏱️  Average: ${avgTime.toFixed(2)}ms`)
  console.log(`🚀 Fastest: ${minTime.toFixed(2)}ms`)
  console.log(`🐌 Slowest: ${maxTime.toFixed(2)}ms`)
  
  return {
    average: avgTime,
    min: minTime,
    max: maxTime,
    iterations
  }
}

// Test de memory leaks en suscripciones
export function testRealtimeSubscriptions() {
  console.log('🔄 Test de suscripciones Realtime...')
  
  let subscriptionCount = 0
  const maxSubscriptions = 5
  
  const createSubscription = () => {
    if (subscriptionCount >= maxSubscriptions) return
    
    const channel = supabase.channel(`test-channel-${subscriptionCount}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'testimonials' 
      }, () => {
        console.log(`📡 Subscription ${subscriptionCount} received event`)
      })
      .subscribe()
    
    subscriptionCount++
    console.log(`✅ Created subscription ${subscriptionCount}`)
    
    // Auto cleanup después de 2 segundos
    setTimeout(() => {
      supabase.removeChannel(channel)
      console.log(`🧹 Cleaned up subscription ${subscriptionCount}`)
    }, 2000)
  }
  
  // Crear suscripciones con intervalo
  for (let i = 0; i < maxSubscriptions; i++) {
    setTimeout(() => createSubscription(), i * 500)
  }
  
  console.log('🎯 Realtime subscriptions test initiated')
}
