import { useEffect, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "Qual a idade minima para participar?",
    answer:
      "O congresso e aberto para todas as idades. Menores de 16 anos devem estar acompanhados por um responsavel. Temos atividades especiais para criancas e adolescentes.",
  },
  {
    question: "Posso parcelar o ingresso?",
    answer:
      "Sim! Aceitamos parcelamento em ate 12x no cartao de credito. Tambem aceitamos PIX e boleto bancario com desconto de 5%.",
  },
  {
    question: "O evento tera estacionamento?",
    answer:
      "Sim, o Centro de Convencoes possui estacionamento proprio com capacidade para 2.000 veiculos. O valor e cobrado separadamente no local.",
  },
  {
    question: "Posso transferir meu ingresso para outra pessoa?",
    answer:
      "Sim, a transferencia pode ser feita ate 48 horas antes do evento atraves do nosso sistema online. Basta acessar sua area do participante.",
  },
  {
    question: "Haverá traducao simultanea?",
    answer:
      "Sim, teremos traducao simultanea em ingles e espanhol para todas as palestras principais. Os fones podem ser retirados no credenciamento.",
  },
  {
    question: "Como funciona o kit do congresso?",
    answer:
      "O kit inclui uma bolsa exclusiva, caderno, caneta, adesivos e um devocional especial. Participantes VIP recebem itens adicionais como camiseta e livro autografado.",
  },
]

export function FaqSection() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

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
    <section id="faq" ref={ref} className="bg-secondary py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-6">
        <p className="mb-4 text-center font-mono text-sm font-semibold tracking-[0.3em] text-gold uppercase">
          Perguntas Frequentes
        </p>
        <h2 className="mb-16 text-center font-sans text-4xl font-bold text-foreground md:text-5xl text-balance">
          Tire suas <span className="text-gold">duvidas</span>
        </h2>

        <div
          className={`flex flex-col gap-3 transition-all duration-1000 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {faqs.map((faq, i) => (
            <div
              key={faq.question}
              className="overflow-hidden rounded-sm border border-border bg-card transition-shadow hover:shadow-md"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-5 text-left"
              >
                <span className="pr-4 font-mono text-sm font-medium text-foreground">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-gold transition-transform duration-300 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === i ? "max-h-60 pb-5" : "max-h-0"
                }`}
              >
                <p className="px-6 font-mono text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
