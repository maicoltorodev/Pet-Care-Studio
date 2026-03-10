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
                src: 'public/icons/icon.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: 'public/icons/apple-icon.png',
                sizes: '180x180',
                type: 'image/png',
            },
        ],

    }
}
