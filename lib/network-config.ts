/**
 * Utilidad inteligente para gestión de URLs y configuración de red.
 * Detecta automáticamente si estamos en entorno local o producción
 * y selecciona el backend adecuado sin intervención manual.
 */

// La constante de producción es ahora la verdad universal para Pet Care Studio
const RAILWAY_BACKEND_URL = "https://server-api-whatsapp-production.up.railway.app";

export const getBackendUrl = () => {
    // 1. Prioridad absoluta a la variable de entorno si el usuario decide cambiarla
    if (process.env.NEXT_PUBLIC_BACKEND_URL) return process.env.NEXT_PUBLIC_BACKEND_URL;

    // 2. Por defecto, siempre conectamos a Railway (Producción)
    // El usuario prefiere no simular el servidor localmente.
    return RAILWAY_BACKEND_URL;
};

export const ADMIN_API_KEY = process.env.NEXT_PUBLIC_ADMIN_API_KEY || "super_secret_admin_key_123";

const IS_PRODUCTION = typeof window !== 'undefined' &&
    (window.location.hostname.includes('railway.app') ||
        window.location.hostname.includes('petcarestudio.com'));

export const networkConfig = {
    isProduction: IS_PRODUCTION,
    backendUrl: getBackendUrl(),
    adminApiKey: ADMIN_API_KEY
};
