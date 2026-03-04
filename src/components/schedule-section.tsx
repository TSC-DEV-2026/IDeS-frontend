import { useEffect, useRef, useState } from "react"

const days = [
  {
    label: "Dia 1 - Sexta",
    date: "20 de Setembro",
    events: [
      { time: "18:00", title: "Credenciamento e recepção", speaker: "" },
      { time: "19:00", title: "Abertura oficial e louvor", speaker: "Pr. Marcos Aurelio" },
      { time: "20:00", title: "Palestra: Quem sou eu em Cristo?", speaker: "Pr. Daniel Oliveira" },
      { time: "21:30", title: "Momento de ministracao", speaker: "" },
    ],
  },
  {
    label: "Dia 2 - Sabado",
    date: "21 de Setembro",
    events: [
      { time: "09:00", title: "Devocional matinal", speaker: "Dra. Ana Cristina" },
      { time: "10:30", title: "Workshop: Santidade pratica", speaker: "Pr. Lucas Ferreira" },
      { time: "14:00", title: "Painel: Identidade e proposito", speaker: "Pra. Sarah Mendes" },
      { time: "16:00", title: "Workshop: Saude emocional", speaker: "Dra. Ana Cristina" },
      { time: "19:00", title: "Louvor e adoracao", speaker: "Pr. Marcos Aurelio" },
      { time: "20:00", title: "Palestra: O preco da santidade", speaker: "Pra. Rebeca Santos" },
    ],
  },
  {
    label: "Dia 3 - Domingo",
    date: "22 de Setembro",
    events: [
      { time: "09:00", title: "Cafe da manha especial", speaker: "" },
      { time: "10:00", title: "Culto de encerramento", speaker: "Pr. Daniel Oliveira" },
      { time: "12:00", title: "Envio e bencao final", speaker: "" },
    ],
  },
]

export function ScheduleSection() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const [activeDay, setActiveDay] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="programacao" ref={ref} className="py-16 md:py-20">
      <div className="mx-auto max-w-4xl px-6">
        <p className="mb-4 text-center font-mono text-sm font-semibold tracking-[0.3em] text-gold uppercase">
          Programacao
        </p>
        <h2 className="mb-16 text-center font-sans text-4xl font-bold text-foreground md:text-5xl text-balance">
          Tres dias de <span className="text-gold">transformação</span>
        </h2>

        {/* Day tabs */}
        <div
          className={`mb-10 flex flex-wrap justify-center gap-3 transition-all duration-1000 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {days.map((day, i) => (
            <button
              key={day.label}
              onClick={() => setActiveDay(i)}
              className={`rounded-sm px-6 py-3 font-mono text-sm font-medium transition-all ${
                activeDay === i
                  ? "bg-gold text-deep-blue shadow-lg"
                  : "border border-border bg-card text-muted-foreground hover:border-gold hover:text-gold"
              }`}
            >
              {day.label}
            </button>
          ))}
        </div>

        {/* Schedule table */}
        <div
          className={`transition-all duration-700 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <p className="mb-6 text-center font-mono text-sm text-muted-foreground">
            {days[activeDay].date}
          </p>
          <div className="overflow-hidden rounded-sm border border-border">
            {days[activeDay].events.map((event, i) => (
              <div
                key={`${event.time}-${event.title}`}
                className={`group flex items-start gap-6 px-6 py-5 transition-colors hover:bg-gold/5 ${
                  i !== days[activeDay].events.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <span className="shrink-0 font-mono text-sm font-semibold text-gold">
                  {event.time}
                </span>
                <div className="flex-1">
                  <p className="font-sans text-lg font-semibold text-foreground group-hover:text-gold transition-colors">
                    {event.title}
                  </p>
                  {event.speaker && (
                    <p className="mt-1 font-mono text-sm text-muted-foreground">
                      {event.speaker}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
