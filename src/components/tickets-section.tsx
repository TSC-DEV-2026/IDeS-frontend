import { useEffect, useRef, useState } from "react"
import { X, CheckCircle2 } from "lucide-react"
import type { CartItem } from "@/types/cart"

const tickets = [
  {
    name: "Lote 1",
    price: "R$ 149,90",
    tag: "Promocional",
    benefits: ["Acesso a todas as palestras", "Material de apoio digital", "Certificado de participacao"],
  },
  {
    name: "Lote 2",
    price: "R$ 199,90",
    tag: "",
    benefits: ["Acesso a todas as palestras", "Material de apoio digital", "Certificado de participacao", "Kit do congresso"],
  },
  {
    name: "VIP",
    price: "R$ 399,90",
    tag: "Mais vendido",
    benefits: [
      "Acesso a todas as palestras",
      "Material de apoio digital",
      "Certificado de participacao",
      "Kit do congresso premium",
      "Assentos reservados",
      "Area VIP exclusiva",
      "Meet & Greet com preletores",
    ],
  },
  {
    name: "Combo Grupo",
    price: "R$ 119,90",
    tag: "Por pessoa (min. 5)",
    benefits: ["Acesso a todas as palestras", "Material de apoio digital", "Certificado de participacao", "Desconto exclusivo para grupos"],
  },
]


function parseBRL(v: string): number {
  // "R$ 149,90" -> 149.90
  const cleaned = v.replace(/[^0-9,]/g, "").replace(",", ".");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}
type Props = { onCheckoutAdd?: (item: CartItem) => void }

export function TicketsSection({ onCheckoutAdd }: Props) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<(typeof tickets)[0] | null>(null)
  const [checkoutDone, setCheckoutDone] = useState(false)

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

  function openModal(ticket: (typeof tickets)[0]) {
    setSelectedTicket(ticket)
    setCheckoutDone(false)
    setModalOpen(true)
  }

  function handleCheckout(e: React.FormEvent) {
    e.preventDefault()
    setCheckoutDone(true)
    if (selectedTicket && onCheckoutAdd) {
      onCheckoutAdd({ name: `Ingresso ${selectedTicket.name}`, price: parseBRL(selectedTicket.price) })
    }
  }

  return (
    <section id="ingressos" ref={ref} className="bg-secondary py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-4 text-center font-mono text-sm font-semibold tracking-[0.3em] text-gold uppercase">
          Ingressos
        </p>
        <h2 className="mb-16 text-center font-sans text-4xl font-bold text-foreground md:text-5xl text-balance">
          Garanta sua <span className="text-gold">vaga</span>
        </h2>

        <div
          className={`grid gap-8 transition-all duration-1000 sm:grid-cols-2 lg:grid-cols-4 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {tickets.map((ticket, i) => (
            <div
              key={ticket.name}
              className={`relative flex flex-col rounded-sm border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                ticket.name === "VIP"
                  ? "border-gold shadow-lg shadow-gold/10"
                  : "border-border hover:shadow-gold/5"
              }`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {ticket.tag && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-sm bg-gold px-3 py-1 font-mono text-xs font-semibold text-deep-blue">
                  {ticket.tag}
                </span>
              )}

              <h3 className="mt-2 text-center font-sans text-2xl font-bold text-foreground">
                {ticket.name}
              </h3>
              <p className="mt-2 text-center font-sans text-3xl font-bold text-gold">
                {ticket.price}
              </p>

              <ul className="mt-6 flex-1 space-y-3">
                {ticket.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2 font-mono text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    {b}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => openModal(ticket)}
                className={`mt-8 w-full rounded-sm py-3 font-mono text-sm font-semibold transition-all ${
                  ticket.name === "VIP"
                    ? "bg-gold text-deep-blue hover:bg-gold-light hover:shadow-lg"
                    : "border border-gold text-gold hover:bg-gold hover:text-deep-blue"
                }`}
              >
                Selecionar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Checkout Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-deep-blue/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative mx-4 w-full max-w-md rounded-sm border border-border bg-card p-8 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              aria-label="Fechar modal"
            >
              <X className="h-5 w-5" />
            </button>

            {!checkoutDone ? (
              <>
                <h3 className="font-sans text-2xl font-bold text-foreground">
                  Simulacao de Checkout
                </h3>
                <p className="mt-2 font-mono text-sm text-muted-foreground">
                  {selectedTicket?.name} — {selectedTicket?.price}
                </p>

                <form onSubmit={handleCheckout} className="mt-6 flex flex-col gap-4">
                  <div>
                    <label className="mb-1 block font-mono text-sm font-medium text-foreground">
                      Nome completo
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Seu nome"
                      className="w-full rounded-sm border border-input bg-background px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-mono text-sm font-medium text-foreground">
                      E-mail
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="seu@email.com"
                      className="w-full rounded-sm border border-input bg-background px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="mt-2 w-full rounded-sm bg-gold py-3 font-mono text-sm font-semibold text-deep-blue transition-all hover:bg-gold-light hover:shadow-lg"
                  >
                    Finalizar Compra
                  </button>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center py-6 text-center">
                <CheckCircle2 className="mb-4 h-16 w-16 text-gold" />
                <h3 className="font-sans text-2xl font-bold text-foreground">
                  Compra realizada com sucesso!
                </h3>
                <p className="mt-2 font-mono text-sm text-muted-foreground">
                  (simulacao visual)
                </p>
                <button
                  onClick={() => setModalOpen(false)}
                  className="mt-6 rounded-sm bg-gold px-6 py-3 font-mono text-sm font-semibold text-deep-blue transition-all hover:bg-gold-light"
                >
                  Fechar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
