import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Pet Care Studio',
        short_name: 'Pet Care',
        description: 'Peluquería canina profesional',
        start_url: '/',
        display: 'standalone',
        background_color: '#FCFAF7',
        theme_color: '#1A1A1A',
        icons: [
            {
                src: '/icons/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icons/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
            },
            {
                src: '/icons/icon-maskable-192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: '/icons/icon-maskable-512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
        ],
        shortcuts: [
            {
                name: 'Agendar Cita',
                short_name: 'Agendar',
                description: 'Pide un turno para tu mascota ahora mismo',
                url: '/reservar',
                icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }]
            },
            {
                name: 'Contactar WhatsApp',
                short_name: 'WhatsApp',
                description: 'Habla con Miel, nuestra asistente IA',
                url: 'https://wa.me/573143855079',
                icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }]
            }
        ],
        screenshots: [
            {
                src: '/icons/screenshots/desktop.png',
                sizes: '1920x1080',
                type: 'image/png',
                form_factor: 'wide',
                label: 'Dashboard de Pet Care Studio'
            },
            {
                src: '/icons/screenshots/mobile.png',
                sizes: '1170x2532',
                type: 'image/png',
                form_factor: 'narrow',
                label: 'Vista Móvil de Pet Care Studio'
            }
        ]
    }
}
