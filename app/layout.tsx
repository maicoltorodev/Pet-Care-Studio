import type { Metadata, Viewport } from 'next'
import { Outfit, Lexend } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CustomCursor } from "@/components/custom-cursor"
import { ToasterProvider } from "@/components/toaster-provider"
import { ConfirmProvider } from "@/components/confirm-dialog"
import './globals.css'

import { supabase } from "@/lib/supabase"

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })
const lexend = Lexend({ subsets: ['latin'], variable: '--font-lexend' })

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await supabase.from("site_content").select("*")
  const siteName = data?.find(c => c.key === 'site_name')?.value || 'Pet Care Studio'
  const tagline = data?.find(c => c.key === 'site_tagline')?.value || 'Peluquería Canina Profesional'
  const desc = data?.find(c => c.key === 'footer_description')?.value || 'Tu mascota merece lo mejor. Servicios profesionales de grooming canino. Agenda tu cita hoy.'
  const logo = data?.find(c => c.key === 'site_logo_url')?.value || '/icons/logo.png'
  const keywords = "peluquería canina, grooming, spa para perros, baño y corte, estética de mascotas"

  return {
    metadataBase: new URL(process.env.SITE_URL || 'https://petcarestudio.vercel.app'),
    title: {
      default: `${siteName} | ${tagline}`,
      template: `%s | ${siteName}`,
    },
    description: desc,
    keywords: keywords,
    authors: [{ name: siteName }],
    openGraph: {
      title: siteName,
      description: desc,
      images: [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: siteName,
      description: desc,
      images: [],
    },
    icons: {
      icon: [
        { url: '/icons/favicon.ico', sizes: '32x32' },
        { url: '/icons/icon.svg', type: 'image/svg+xml' },
        { url: '/icons/icon-dark.svg', type: 'image/svg+xml', media: '(prefers-color-scheme: dark)' },
      ],
      apple: '/icons/apple-icon.png',
      other: [
        {
          rel: 'mask-icon',
          url: '/icons/safari-pinned-tab.svg',
          color: '#1A1A1A',
        },
        {
          rel: 'apple-touch-startup-image',
          url: '/icons/splash/apple-splash-2778-1284.png',
          media: '(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)',
        },
      ],
    },
    other: {
      'script:ld+json': JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: siteName,
        url: process.env.SITE_URL || 'https://petcarestudio.vercel.app',
        logo: `${process.env.SITE_URL || 'https://petcarestudio.vercel.app'}/icons/logo.png`,
      }),
    },
  }
}

export const viewport: Viewport = {
  themeColor: '#FCFAF7',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${outfit.variable} ${lexend.variable}`}>
      <body className="font-sans antialiased">
        <ConfirmProvider>
          <CustomCursor />
          {children}
          <Analytics />
          <ToasterProvider />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js');
                  });
                }
              `,
            }}
          />
        </ConfirmProvider>
      </body>
    </html>
  )
}

