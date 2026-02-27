import { useEffect, useRef, useState } from "react"

export function AboutSection() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="sobre"
      ref={ref}
      className="py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Section label */}
        <p className="mb-4 text-center font-mono text-sm font-semibold tracking-[0.3em] text-gold uppercase">
          Sobre o Congresso
        </p>
        <h2 className="mb-16 text-center font-sans text-4xl font-bold text-foreground md:text-5xl text-balance">
          Uma experiencia que vai <span className="text-gold">transformar</span> sua vida
        </h2>

        <div
          className={`grid items-center gap-12 transition-all duration-1000 md:grid-cols-2 md:gap-16 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {/* Image placeholder */}
          <div className="relative overflow-hidden rounded-sm">
            <div
              className="flex aspect-4/3 items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #0F1C2E 0%, #1A2D45 100%)",
              }}
            >
              <div className="text-center">
                <svg
                  className="mx-auto mb-4 h-16 w-16 text-gold/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                  />
                </svg>
                <p className="font-mono text-sm text-primary-foreground/50">
                  Congresso 2026
                </p>
              </div>
            </div>
            {/* Gold corner accent */}
            <div className="absolute top-0 left-0 h-20 w-20 border-t-2 border-l-2 border-gold/30" />
            <div className="absolute right-0 bottom-0 h-20 w-20 border-r-2 border-b-2 border-gold/30" />
          </div>

          {/* Text content */}
          <div>
            <h3 className="mb-6 font-sans text-2xl font-semibold text-foreground md:text-3xl">
              Descubra quem voce e em Cristo
            </h3>
            <p className="mb-6 font-mono text-base leading-relaxed text-muted-foreground">
              O Congresso Identidade e Santidade e um evento transformador projetado para
              levar cada participante a um encontro profundo com Deus. Durante tres dias
              intensos, voce sera desafiado a redescobrir sua verdadeira identidade em
              Cristo e a viver uma vida de santidade pratica e relevante.
            </p>
            <p className="mb-8 font-mono text-base leading-relaxed text-muted-foreground">
              Com preletores renomados, momentos de adoracao intensa e ensinos
              transformadores, este congresso sera um marco na sua caminhada espiritual.
              Junte-se a milhares de pessoas que ja decidiram viver de acordo com o
              proposito de Deus.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { number: "3", label: "Dias de evento" },
                { number: "12+", label: "Preletores" },
                { number: "5000+", label: "Participantes" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-sans text-3xl font-bold text-gold">{stat.number}</p>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
