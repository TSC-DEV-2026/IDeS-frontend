import { useEffect, useRef, useState } from "react"

const speakers = [
  {
    name: "Pr. Daniel Oliveira",
    role: "Pastor e Conferencista",
    bio: "Lider da Igreja Restauracao com mais de 20 anos de ministerio. Autor de varios livros sobre identidade crista.",
  },
  {
    name: "Pra. Sarah Mendes",
    role: "Missionaria Internacional",
    bio: "Fundadora do ministerio Mulheres de Valor. Ja pregou em mais de 30 paises ao redor do mundo.",
  },
  {
    name: "Pr. Lucas Ferreira",
    role: "Teólogo e Escritor",
    bio: "Doutor em Teologia pela Universidade de Oxford. Referencia em estudos sobre santificacao.",
  },
  {
    name: "Dra. Ana Cristina",
    role: "Psicóloga Crista",
    bio: "Especialista em saude emocional e espiritualidade. Palestrante reconhecida internacionalmente.",
  },
  {
    name: "Pr. Marcos Aurelio",
    role: "Líder de Adoracao",
    bio: "Compositor e adorador com mais de 15 albuns gravados. Lidera o ministerio Nacao Santa.",
  },
  {
    name: "Pra. Rebeca Santos",
    role: "Pastora de Jovens",
    bio: "Pioneira no trabalho com a juventude crista no Brasil. Mentora de centenas de jovens lideres.",
  },
]

export function SpeakersSection() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

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
    <section id="preletores" ref={ref} className="bg-secondary py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-4 text-center font-mono text-sm font-semibold tracking-[0.3em] text-gold uppercase">
          Preletores
        </p>
        <h2 className="mb-16 text-center font-sans text-4xl font-bold text-foreground md:text-5xl text-balance">
          Servos de Deus que vao <span className="text-gold">impactar</span> sua vida
        </h2>

        <div
          className={`grid gap-8 transition-all duration-1000 sm:grid-cols-2 lg:grid-cols-3 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {speakers.map((speaker, i) => (
            <div
              key={speaker.name}
              className="group rounded-sm border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gold/5"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Avatar placeholder */}
              <div
                className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full"
                style={{
                  background: "linear-gradient(135deg, #0F1C2E 0%, #1A2D45 100%)",
                }}
              >
                <span className="font-sans text-2xl font-bold text-gold">
                  {speaker.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </span>
              </div>

              <h3 className="text-center font-sans text-xl font-bold text-foreground">
                {speaker.name}
              </h3>
              <p className="mt-1 text-center font-mono text-sm font-medium text-gold">
                {speaker.role}
              </p>
              <p className="mt-4 text-center font-mono text-sm leading-relaxed text-muted-foreground">
                {speaker.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
