"use client"

import React, { createContext, useContext, useState, useCallback } from "react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogPortal,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AlertCircle, HelpCircle } from "lucide-react"

interface ConfirmOptions {
    title: string
    description: string
    confirmText?: string
    cancelText?: string
    variant?: "default" | "destructive"
}

interface ConfirmContextType {
    confirm: (options: ConfirmOptions) => Promise<boolean>
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined)

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const [options, setOptions] = useState<ConfirmOptions>({
        title: "",
        description: "",
    })
    const [resolveRef, setResolveRef] = useState<((value: boolean) => void) | null>(null)

    const confirm = useCallback((options: ConfirmOptions) => {
        setOptions(options)
        setOpen(true)
        return new Promise<boolean>((resolve) => {
            setResolveRef(() => resolve)
        })
    }, [])

    const handleCancel = () => {
        setOpen(false)
        if (resolveRef) resolveRef(false)
    }

    const handleConfirm = () => {
        setOpen(false)
        if (resolveRef) resolveRef(true)
    }

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogPortal>
                    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                    <AlertDialogContent className="fixed top-[50%] left-[50%] z-50 w-full max-w-[500px] translate-x-[-50%] translate-y-[-50%] bg-[#080809]/95 backdrop-blur-3xl border border-white/10 p-10 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] gap-8 outline-none animate-in fade-in zoom-in-95 duration-500">
                        <AlertDialogHeader className="space-y-6">
                            <div className="flex justify-center sm:justify-start">
                                <div className={`h-16 w-16 rounded-2xl flex items-center justify-center border shadow-2xl ${options.variant === "destructive"
                                        ? "bg-rose-500/10 border-rose-500/20 text-rose-500"
                                        : "bg-primary/10 border-primary/20 text-primary"
                                    }`}>
                                    {options.variant === "destructive" ? <AlertCircle className="h-8 w-8" /> : <HelpCircle className="h-8 w-8" />}
                                </div>
                            </div>
                            <div className="space-y-2 text-center sm:text-left">
                                <AlertDialogTitle className="text-2xl font-sans font-black text-white uppercase tracking-tighter">
                                    {options.title}
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-sm font-medium text-white/40 leading-relaxed uppercase-first">
                                    {options.description}
                                </AlertDialogDescription>
                            </div>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-4 sm:gap-4 mt-4">
                            <AlertDialogCancel
                                onClick={handleCancel}
                                className="h-14 flex-1 rounded-2xl bg-white/5 border border-white/10 text-white/40 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white transition-all duration-500"
                            >
                                {options.cancelText || "Cancelar"}
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleConfirm}
                                className={`h-14 flex-1 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl transition-all duration-500 hover:scale-[1.02] active:scale-95 text-white ${options.variant === "destructive"
                                        ? "bg-rose-600 hover:bg-rose-500 shadow-rose-500/20"
                                        : "bg-primary hover:bg-primary/80 shadow-primary/20"
                                    }`}
                            >
                                {options.confirmText || "Confirmar"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogPortal>
            </AlertDialog>
        </ConfirmContext.Provider>
    )
}

export function useConfirm() {
    const context = useContext(ConfirmContext)
    if (!context) {
        throw new Error("useConfirm must be used within a ConfirmProvider")
    }
    return context.confirm
}
