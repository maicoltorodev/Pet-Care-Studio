"use client"
import { Toaster } from 'sonner'
import { CheckCircle2, AlertCircle, Info, XCircle } from 'lucide-react'

export function ToasterProvider() {
    return (
        <Toaster
            position="top-center"
            theme="dark"
            toastOptions={{
                unstyled: true,
                classNames: {
                    toast: "group flex items-center w-[480px] min-h-[90px] gap-6 p-8 rounded-[1.2rem] bg-zinc-950/95 backdrop-blur-3xl border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] animate-notification-flow pointer-events-auto relative overflow-hidden",
                    title: "text-[16px] font-bold text-white tracking-tight leading-tight font-sans",
                    description: "text-[12px] font-medium text-white/40 mt-1 leading-relaxed font-sans",
                    success: "border-l-4 border-l-emerald-500 shadow-[inset_10px_0_20px_-10px_rgba(16,185,129,0.3)]",
                    error: "border-l-4 border-l-rose-500 shadow-[inset_10px_0_20px_-10px_rgba(244,63,94,0.3)]",
                    info: "border-l-4 border-l-blue-500 shadow-[inset_10px_0_20px_-10px_rgba(59,130,246,0.2)]",
                    warning: "border-l-4 border-l-amber-500 shadow-[inset_10px_0_20px_-10px_rgba(245,158,11,0.2)]",
                    actionButton: "bg-primary text-white font-black text-[9px] uppercase tracking-widest rounded-full px-6 py-3 hover:scale-[1.05] transition-all shadow-xl active:scale-95 ml-auto",
                    cancelButton: "bg-white/5 text-white/60 font-black text-[9px] uppercase tracking-widest rounded-full px-6 py-3 hover:bg-white/10 transition-colors ml-2",
                    closeButton: "absolute top-4 right-4 text-white/20 hover:text-white transition-colors",
                },
            }}
            icons={{
                success: <CheckCircle2 className="h-7 w-7 text-emerald-500 shrink-0 drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]" />,
                error: <XCircle className="h-7 w-7 text-rose-500 shrink-0 drop-shadow-[0_0_10px_rgba(244,63,94,0.4)]" />,
                info: <Info className="h-7 w-7 text-blue-500 shrink-0 drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]" />,
                warning: <AlertCircle className="h-7 w-7 text-amber-500 shrink-0 drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]" />,
            }}
            duration={5000}
        />
    )
}

