"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CheckCircle2, Phone, Clock, MapPin } from "lucide-react"

export function BookingForm() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="agendar" className="relative bg-background px-6 py-24 md:py-32 overflow-hidden border-t border-border/20">
      {/* Cinematic Glow Effects */}
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none opacity-40" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px] pointer-events-none opacity-30" />
      <div className="mx-auto max-w-7xl">
        <div className="mb-20 flex flex-col items-center text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.4em] text-accent">
            Reservaciones
          </p>
          <h2 className="max-w-3xl font-serif text-4xl font-medium leading-[1.2] text-foreground md:text-5xl lg:text-6xl text-balance">
            Agenda una <span className=" text-primary">experiencia exclusiva</span>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-lg font-light text-muted-foreground leading-relaxed">
            Tu mascota merece atención personalizada. Confirmamos tu cita en menos de 1 hora.
          </p>
        </div>

        <div className="grid gap-16 lg:grid-cols-2">
          {/* Form */}
          <div className="rounded-[2.5rem] bg-card p-10 shadow-2xl md:p-14 border border-white/10">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-accent/10">
                  <CheckCircle2 className="h-12 w-12 text-accent" />
                </div>
                <h3 className="mb-4 font-serif text-3xl font-medium text-foreground">
                  Solicitud Recibida
                </h3>
                <p className="max-w-xs text-muted-foreground font-light leading-relaxed">
                  Gracias por confiar en nosotros. Un asesor se pondrá en contacto contigo pronto.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setSubmitted(false)}
                  className="mt-8 rounded-full border-border hover:bg-secondary"
                >
                  Realizar otra reserva
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Propietario</Label>
                    <Input
                      id="name"
                      placeholder="Nombre completo"
                      required
                      className="h-14 rounded-2xl border-border bg-secondary/30 px-6 focus:bg-background transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Contacto</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      required
                      className="h-14 rounded-2xl border-border bg-secondary/30 px-6 focus:bg-background transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@correo.com"
                    required
                    className="h-14 rounded-2xl border-border bg-secondary/30 px-6 focus:bg-background transition-all"
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="pet-name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Nombre de Mascota</Label>
                    <Input
                      id="pet-name"
                      placeholder="Ej: Max"
                      required
                      className="h-14 rounded-2xl border-border bg-secondary/30 px-6 focus:bg-background transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="breed" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Raza / Tipo</Label>
                    <Input
                      id="breed"
                      placeholder="Ej: Golden Retriever"
                      className="h-14 rounded-2xl border-border bg-secondary/30 px-6 focus:bg-background transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Servicio de Interés</Label>
                  <Select required>
                    <SelectTrigger className="h-14 rounded-2xl border-border bg-secondary/30 px-6 focus:bg-background transition-all">
                      <SelectValue placeholder="Selecciona el tratamiento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bath">Baño Completo - Desde $25</SelectItem>
                      <SelectItem value="cut">Corte & Estilizado - Desde $40</SelectItem>
                      <SelectItem value="spa">Experiencia Spa - Desde $60</SelectItem>
                      <SelectItem value="dental">Estética Avanzada - Desde $35</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Comentarios Especiales</Label>
                  <Textarea
                    id="notes"
                    placeholder="Cuéntanos más sobre las necesidades de tu mascota..."
                    rows={3}
                    className="rounded-2xl border-border bg-secondary/30 p-6 focus:bg-background transition-all resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="mt-4 h-16 w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg font-medium rounded-full shadow-xl shadow-primary/10 transition-all hover:scale-[1.02] active:scale-95"
                >
                  Solicitar Reserva
                </Button>
              </form>
            )}
          </div>

          {/* Info sidebar */}
          <div className="flex flex-col gap-10 lg:pt-10">
            <div className="relative overflow-hidden rounded-[2rem] aspect-[16/10] shadow-2xl">
              <Image
                src="/images/grooming-salon.jpg"
                alt="Interior de Pet Care Studio"
                fill
                className="object-cover transition-transform duration-1000 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
              <div className="absolute bottom-6 left-8">
                <p className="text-white text-xs font-bold uppercase tracking-[0.3em]">Ambiente Premium</p>
                <p className="text-white/80 text-sm font-light mt-1">Higiene y seguridad absoluta</p>
              </div>
            </div>

            <div className="grid gap-8">
              <div className="flex items-start gap-6 group">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary/30 border border-border/40 transition-all group-hover:bg-primary/20">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/40 mb-1">Contacto Directo</p>
                  <p className="text-xl font-medium text-foreground tracking-tight">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary/30 border border-border/40 transition-all group-hover:bg-primary/20">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/40 mb-1">Horario de Atención</p>
                  <p className="text-lg font-medium text-foreground">Lun - Sáb: 9:00 AM - 7:00 PM</p>
                  <p className="mt-1 text-sm font-light text-muted-foreground/60 leading-relaxed">Domingos: 10:00 AM - 3:00 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary/30 border border-border/40 transition-all group-hover:bg-primary/20">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/40 mb-1">Visítanos</p>
                  <p className="text-lg font-medium text-foreground">Av. Principal 1234, Col. Centro</p>
                  <p className="mt-1 text-sm font-light text-muted-foreground/60 leading-relaxed">San Salvador, El Salvador</p>
                </div>
              </div>
            </div>

            <div className="relative mt-auto overflow-hidden rounded-[2rem] bg-secondary border border-border/40 p-10 text-center transition-transform hover:scale-[1.02]">
              <div className="absolute top-0 right-0 -mr-10 -mt-10 h-40 w-40 rounded-full bg-primary/10 blur-[50px]" />
              <p className="relative z-10 font-serif text-2xl font-medium text-foreground ">¿Tu primera visita?</p>
              <p className="relative z-10 mt-2 text-5xl font-bold text-primary tracking-tight">20% Off</p>
              <p className="relative z-10 mt-3 text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground/60">En tu primer servicio premium</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

