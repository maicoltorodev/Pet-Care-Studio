// Sistema de caché con expiración real
interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number // Time to live en milisegundos
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<unknown>>()

  set<T>(key: string, data: T, ttlMinutes: number = 5): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000
    })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    // Verificar si expiró
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  clear(key?: string): void {
    if (key) {
      this.cache.delete(key)
    } else {
      this.cache.clear()
    }
  }

  // Verificar si está fresco (no expirado)
  isFresh(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false
    return Date.now() - entry.timestamp <= entry.ttl
  }
}

export const cache = new MemoryCache()

// Funciones de caché para datos específicos
export async function getCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMinutes: number = 5
): Promise<T> {
  // Verificar si tenemos datos frescos en caché
  const cached = cache.get<T>(key)
  if (cached !== null) {
    return cached
  }

  // Si no hay caché o expiró, obtener datos frescos
  const data = await fetcher()
  cache.set(key, data, ttlMinutes)
  return data
}
