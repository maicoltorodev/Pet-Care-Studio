"use client"
import React from "react"
import { CMSProvider } from "@/hooks/use-cms"
import { LeadsProvider } from "@/hooks/use-leads"
import { AgendaProvider } from "@/hooks/use-agenda"

export function AdminProviders({ children }: { children: React.ReactNode }) {
    return (
        <CMSProvider>
            <LeadsProvider>
                <AgendaProvider>
                    {children}
                </AgendaProvider>
            </LeadsProvider>
        </CMSProvider>
    )
}

