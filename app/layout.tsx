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
  const logo = '/icons/logo.webp'
  const keywords = "peluquería canina, grooming, spa para perros, baño y corte, estética de mascotas"

  const baseUrl = process.env.SITE_URL || 'https://petcarestudio.vercel.app'

  return {
    metadataBase: new URL(baseUrl),
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
      images: [
        {
          url: '/opengraph-image',
          width: 1200,
          height: 630,
          alt: `${siteName} | ${tagline}`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: siteName,
      description: desc,
      images: ['/twitter-image'],
    },
    icons: {
      icon: [
        { url: "icons/favicon.ico", sizes: "any" },
        { url: "icons/icon.png", type: "image/png", sizes: "192x192" },
      ],
      apple: [
        { url: "icons/apple-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
    other: {
      "og:logo": `${baseUrl}/icons/logo.webp`,
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

