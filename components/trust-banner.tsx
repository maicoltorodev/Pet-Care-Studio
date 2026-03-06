import { Shield, Award, Heart } from "lucide-react"

const defaultStats = [
  { icon: Heart, value: "+3K", label: "Mascotas", key: 1 },
  { icon: Award, value: "+8", label: "Experiencia", key: 2 },
  { icon: Shield, value: "100%", label: "Premium", key: 3 },
]

interface ContentItem {
  key: string
  value: string
}

export function TrustBanner({ content }: { content: ContentItem[] }) {
  const stats = defaultStats.map(stat => {
    const val = content.find((c: ContentItem) => c.key === `trust_stat_${stat.key}_val`)?.value
    const label = content.find((c: ContentItem) => c.key === `trust_stat_${stat.key}_label`)?.value
    return {
      ...stat,
      value: val || stat.value,
      label: label || stat.label
    }
  })

  return (
    <section className="relative bg-background border-y border-border/40 overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 cinematic-glow" />

      <div className="mx-auto max-w-5xl relative z-10">
        {/* Desktop View (Standard Grid) */}
        <div className="hidden md:grid grid-cols-3 gap-12 py-16 px-6">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center group cursor-default">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/50 transition-all duration-500 group-hover:bg-primary group-hover:shadow-lg group-hover:shadow-primary/20">
                <stat.icon className="h-7 w-7 text-primary transition-colors duration-500 group-hover:text-white" />
              </div>
              <p className="font-serif text-4xl font-medium tracking-tight text-foreground">{stat.value}</p>
              <p className="mt-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Mobile View (Sleek Horizontal Bar) */}
        <div className="flex md:hidden items-center justify-between py-10 px-4">
          {stats.map((stat, index) => (
            <div key={stat.label} className="flex flex-1 flex-col items-center text-center relative">
              {/* Divider */}
              {index !== 0 && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[1px] h-8 bg-border/60" />
              )}

              <div className="mb-2">
                <stat.icon className="h-5 w-5 text-primary opacity-80" />
              </div>
              <p className="font-serif text-xl font-bold text-foreground leading-none">{stat.value}</p>
              <p className="mt-1.5 text-[7px] font-black uppercase tracking-[0.15em] text-muted-foreground/80 leading-none">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

