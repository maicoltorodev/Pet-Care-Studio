/**
 * 🕐 TIME UTILITIES — Zona horaria centralizada
 *
 * CAMBIAR AQUÍ = afecta toda la app simultáneamente.
 * El negocio opera en una zona horaria fija independiente
 * del dispositivo del admin o del servidor (que corre en UTC).
 *
 * Para cambiar la zona horaria del negocio, modifica únicamente
 * la constante BUSINESS_TIMEZONE.
 */
export const BUSINESS_TIMEZONE = "America/Bogota"; // UTC-5 — Colombia

/**
 * Retorna la fecha/hora actual ajustada a la zona horaria del negocio.
 * Reemplaza `new Date()` en toda la lógica de agenda y horarios.
 */
export function now(): Date {
    return new Date(new Date().toLocaleString("en-US", { timeZone: BUSINESS_TIMEZONE }));
}

/**
 * Convierte cualquier fecha UTC a la zona horaria del negocio.
 * Útil para timestamps que vienen de Supabase (almacenados en UTC).
 */
export function toBusinessTime(date: Date | string): Date {
    const d = typeof date === "string" ? new Date(date) : date;
    return new Date(d.toLocaleString("en-US", { timeZone: BUSINESS_TIMEZONE }));
}

/**
 * Formatea una fecha en la zona horaria del negocio.
 * @param date - Fecha a formatear
 * @param options - Opciones de Intl.DateTimeFormat
 */
export function formatBusinessDate(
    date: Date | string,
    options: Intl.DateTimeFormatOptions = {}
): string {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("es-ES", {
        timeZone: BUSINESS_TIMEZONE,
        ...options,
    });
}

/**
 * Retorna solo la hora actual del negocio (0-23).
 */
export function businessHour(): number {
    return now().getHours();
}

/**
 * Retorna solo los minutos actuales del negocio (0-59).
 */
export function businessMinutes(): number {
    return now().getMinutes();
}

/**
 * Retorna el día de la semana actual del negocio (0=Dom, 1=Lun, ..., 6=Sáb).
 */
export function businessDayOfWeek(): number {
    return now().getDay();
}
