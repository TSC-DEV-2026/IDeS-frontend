import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const tick = () => {
      const now = new Date().getTime()
      const diff = targetDate.getTime() - now
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  return timeLeft
}

export function HeroSection() {
  const target = new Date("2026-09-20T19:00:00")
  const { days, hours, minutes, seconds } = useCountdown(target)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
  }, [])

  return (
    <section
      id="inicio"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0F1C2E 0%, #1A2D45 40%, #0F1C2E 70%, #162238 100%)",
      }}
    >
      {/* Decorative cross */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.04]">
        <svg width="400" height="500" viewBox="0 0 400 500" fill="none">
          <rect x="170" y="0" width="60" height="500" fill="#C6A75E" />
          <rect x="50" y="120" width="300" height="60" fill="#C6A75E" />
        </svg>
      </div>

      {/* Subtle radial glow */}
      <div
        className="pointer-events-none absolute top-1/4 left-1/2 h-150 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(198,167,94,0.3) 0%, transparent 70%)",
        }}
      />

      <div
        className={`relative z-10 mx-auto max-w-4xl px-6 text-center transition-all duration-1000 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        {/* Tagline */}
        <p className="mb-6 font-mono text-sm font-semibold tracking-[0.3em] text-gold uppercase">
          Congresso 2026
        </p>

        {/* Title */}
        <h1 className="font-sans text-5xl leading-tight font-bold tracking-tight text-primary-foreground md:text-7xl lg:text-8xl">
          Identidade
          <span className="block text-gold">&amp; Santidade</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-2xl font-mono text-lg leading-relaxed font-light text-primary-foreground/70 md:text-xl">
          {'"'}Porque Dele, e por Ele, e para Ele, sao todas as coisas.{'"'}
          <span className="mt-1 block text-sm text-gold/70">Romanos 11:36</span>
        </p>

        {/* Date & Location */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 font-mono text-sm tracking-wide text-primary-foreground/60">
          <span>20 - 22 de Setembro de 2026</span>
          <span className="hidden h-4 w-px bg-gold/30 md:block" />
          <span>Centro de Convencoes - Sao Paulo, SP</span>
        </div>

        {/* Countdown */}
        <div className="mt-10 flex items-center justify-center gap-4 md:gap-6">
          {[
            { value: days, label: "Dias" },
            { value: hours, label: "Horas" },
            { value: minutes, label: "Min" },
            { value: seconds, label: "Seg" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center rounded-sm border border-gold/20 bg-deep-blue-light/50 px-4 py-3 backdrop-blur-sm md:px-6 md:py-4"
            >
              <span className="font-sans text-3xl font-bold text-gold md:text-4xl">
                {String(item.value).padStart(2, "0")}
              </span>
              <span className="mt-1 font-mono text-xs tracking-wider text-primary-foreground/50 uppercase">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/ingressos"
            className="rounded-sm bg-gold px-8 py-4 font-mono text-sm font-semibold tracking-wide text-deep-blue transition-all hover:bg-gold-light hover:shadow-xl hover:shadow-gold/20"
          >
            Comprar Ingresso
          </Link>
          <Link
            to="/programacao"
            className="rounded-sm border border-primary-foreground/30 px-8 py-4 font-mono text-sm font-medium tracking-wide text-primary-foreground/80 transition-all hover:border-gold hover:text-gold"
          >
            Ver Programacao
          </Link>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent" />
    </section>
  )
}
