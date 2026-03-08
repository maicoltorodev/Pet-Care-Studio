"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Lock, User, Loader2, Sparkles, Eye, EyeOff, Scissors, Heart } from "lucide-react"
import { toast } from "sonner"

export default function LoginPage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [logoUrl, setLogoUrl] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        async function getLogo() {
            const { data } = await supabase.from("site_content").select("value").eq("key", "site_logo_url").single()
            if (data) setLogoUrl(data.value)
        }
        getLogo()
    }, [])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const loginIdentifier = username.includes("@") ? username : `${username}@petcare.admin`

        const { error } = await supabase.auth.signInWithPassword({
            email: loginIdentifier,
            password,
        })

        if (error) {
            setError("Usuario o contraseña incorrectos.")
            toast.error("Acceso denegado", { description: "Revisa bien tus credenciales." })
            setLoading(false)
        } else {
            toast.success("Bienvenido de nuevo")
            router.push("/admin")
        }
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-background px-6 py-12 selection:bg-primary/20 overflow-hidden">
            {/* Cinematic Background Elements */}
            <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
                <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-primary/10 cinematic-glow" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/5 cinematic-glow opacity-30" />
                <div className="absolute inset-0 cinematic-vignette" />
                <div className="absolute inset-0 cinematic-gradient-overlay" />

                {/* Large Background Brand Element - Cinematic Logo Overlay (Balanced) */}
                <div className="opacity-[0.08] select-none pointer-events-none transform -rotate-6 scale-[1.44] transition-all duration-1000 ease-out">
                    <img
                        src={logoUrl || "/icons/logo.png"}
                        alt="Brand Background"
                        className="w-[720px] h-auto object-contain filter grayscale brightness-200 contrast-125"
                        onError={(e) => {
                            // If both library and local fail, hide the element to stay clean
                            (e.target as HTMLImageElement).style.opacity = '0';
                        }}
                    />
                </div>
            </div>

            <div className="relative z-10 w-full max-w-xl">
                {/* Logo & Header */}
                <div className="mb-12 flex flex-col items-center text-center">
                    <div className="luxury-badge mb-6">
                        <Lock className="w-3 h-3 text-primary" />
                        Acceso Administrativo
                    </div>
                    <h1 className="cinematic-heading-md mb-4">
                        Bienvenido al <br />
                        <span className="text-primary tracking-tighter">Centro de Control</span>
                    </h1>
                    <p className="text-muted-foreground text-lg font-light max-w-sm">
                        Gestiona la experiencia luxury de tus clientes y sus mascotas.
                    </p>
                </div>

                {/* Login Card */}
                <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-xl p-8 md:p-12 shadow-2xl floating-element">
                    {/* Interior highlights to sell the glass effect */}
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    <form onSubmit={handleLogin} className="space-y-8 relative z-10">
                        <div className="space-y-6">
                            {/* Username Input */}
                            <div className="group space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-2 transition-colors group-focus-within:text-primary">
                                    Identificador de Usuario
                                </label>
                                <div className="relative">
                                    <User className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-white/20 transition-colors group-focus-within:text-primary" />
                                    <Input
                                        type="text"
                                        placeholder="admin"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="pl-16 h-16 rounded-[1.25rem] border-white/5 bg-white/[0.03] text-foreground placeholder:text-white/10 focus:border-primary/50 focus:ring-primary/10 transition-all border-2 text-base font-light backdrop-blur-md"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="group space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-2 transition-colors group-focus-within:text-primary">
                                    Contraseña Privada
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-white/20 transition-colors group-focus-within:text-primary" />
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-16 pr-16 h-16 rounded-[1.25rem] border-white/5 bg-white/[0.03] text-foreground placeholder:text-white/10 focus:border-primary/50 focus:ring-primary/10 transition-all border-2 text-base font-light backdrop-blur-md"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-primary transition-colors focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 rounded-[1.25rem] bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium text-center animate-in fade-in slide-in-from-top-2">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full h-16 overflow-hidden rounded-[1.5rem] bg-foreground text-background text-sm font-black uppercase tracking-[0.2em] transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <div className="absolute inset-0 bg-primary translate-y-[100%] transition-transform duration-500 group-hover:translate-y-0" />
                            <div className="relative z-10 flex items-center justify-center gap-3">
                                {loading ? (
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                ) : (
                                    <>
                                        Entrar al Panel <Sparkles className="h-5 w-5 transition-transform duration-500 group-hover:rotate-12" />
                                    </>
                                )}
                            </div>
                        </Button>
                    </form>
                </div>

                {/* Return Link */}
                <div className="mt-12 text-center">
                    <button
                        onClick={() => router.push('/')}
                        className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-colors duration-500"
                    >
                        ← Volver a la Galería Principal
                    </button>
                </div>
            </div>


        </div>
    )
}
