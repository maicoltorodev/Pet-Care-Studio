import React from 'react'
import { WifiOff, Home, Phone } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function OfflinePage() {
    return (
        <div className="min-h-screen bg-[#FCFAF7] flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <WifiOff className="w-10 h-10 text-amber-500" />
            </div>

            <h1 className="text-3xl font-bold text-[#1A1A1A] mb-4 font-outfit">
                Sin conexión a internet
            </h1>

            <p className="text-gray-600 max-w-md mb-8 font-lexend">
                Parece que has perdido la conexión. No te preocupes, puedes seguir explorando
                nuestra información básica o contactarnos por teléfono si es urgente.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-sm">
                <Button asChild variant="outline" className="border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-all">
                    <Link href="/">
                        <Home className="mr-2 h-4 w-4" />
                        Ir al Inicio
                    </Link>
                </Button>

                <Button className="bg-amber-600 hover:bg-amber-700 text-white shadow-lg">
                    <a href="tel:+573000000000" className="flex items-center">
                        <Phone className="mr-2 h-4 w-4" />
                        Llamar ahora
                    </a>
                </Button>
            </div>

            <p className="mt-12 text-sm text-gray-400">
                Pet Care Studio - Tu mascota en las mejores manos.
            </p>
        </div>
    )
}
