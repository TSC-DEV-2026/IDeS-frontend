import { useEffect, useMemo, useRef, useState } from "react";
import { X, CheckCircle2, Loader2 } from "lucide-react";
import type { CartItem } from "@/types/cart";

export type TicketVM = {
  id: number | string;
  name: string;
  price: number;
  tag?: string;
  benefits?: string[];
  vagas?: number;
};

type EventoVM = {
  nome_evento: string;
  local: string;
  dt_ini: string;
  dt_fim: string;
  hr_ini: string;
  hr_fim: string;
};

function formatBRL(v: number): string {
  try {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
  } catch {
    return `R$ ${v.toFixed(2)}`.replace(".", ",");
  }
}

type Props = {
  onCheckoutAdd?: (item: CartItem) => void;
  loading?: boolean;
  evento?: EventoVM | null;
  tickets?: TicketVM[];
};

export function TicketsSection({ onCheckoutAdd, loading, evento, tickets }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketVM | null>(null);
  const [checkoutDone, setCheckoutDone] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

const list = useMemo(() => (tickets ? tickets.slice() : []), [tickets]);

  function openModal(ticket: TicketVM) {
    setSelectedTicket(ticket);
    setCheckoutDone(false);
    setModalOpen(true);
  }

  function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setCheckoutDone(true);
    if (selectedTicket && onCheckoutAdd) {
      onCheckoutAdd({ name: `Ingresso ${selectedTicket.name}`, price: selectedTicket.price });
    }
  }

  return (
    <section id="ingressos" ref={ref} className="bg-secondary py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-4 text-center font-mono text-sm font-semibold tracking-[0.3em] text-gold uppercase">
          Ingressos
        </p>
        <h2 className="mb-6 text-center font-sans text-4xl font-bold text-foreground md:text-5xl text-balance">
          Garanta sua <span className="text-gold">vaga</span>
        </h2>

        {evento ? (
          <p className="mb-12 text-center font-mono text-sm text-muted-foreground">
            {evento.nome_evento} • {evento.local}
          </p>
        ) : (
          <div className="mb-12" />
        )}

        {loading ? (
          <div className="flex items-center justify-center gap-3 py-16 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="font-mono text-sm">Carregando lotes...</span>
          </div>
        ) : (
          <div
            className={`grid gap-8 transition-all duration-1000 sm:grid-cols-2 lg:grid-cols-4 ${
              visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            {list.map((ticket, i) => (
              <div
                key={String(ticket.id)}
                className={`relative flex flex-col rounded-sm border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  ticket.name.toUpperCase() === "VIP"
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
                  {formatBRL(ticket.price)}
                </p>

                <ul className="mt-6 flex-1 space-y-3">
                  {(ticket.benefits && ticket.benefits.length ? ticket.benefits : [
                    "Acesso a todas as palestras",
                    "Material de apoio digital",
                    "Certificado de participacao",
                  ]).map((b) => (
                    <li key={b} className="flex items-start gap-2 font-mono text-sm text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                      {b}
                    </li>
                  ))}
                  {typeof ticket.vagas === "number" && (
                    <li className="flex items-start gap-2 font-mono text-sm text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                      Vagas: {ticket.vagas}
                    </li>
                  )}
                </ul>

                <button
                  onClick={() => openModal(ticket)}
                  className={`mt-8 w-full rounded-sm py-3 font-mono text-sm font-semibold transition-all ${
                    ticket.name.toUpperCase() === "VIP"
                      ? "bg-gold text-deep-blue hover:bg-gold-light hover:shadow-lg"
                      : "border border-gold text-gold hover:bg-gold hover:text-deep-blue hover:cursor-pointer"
                  }`}
                >
                  Selecionar
                </button>
              </div>
            ))}
          </div>
        )}
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
                  {selectedTicket?.name} — {selectedTicket ? formatBRL(selectedTicket.price) : ""}
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
                  (Simulacao) Seu ingresso foi adicionado ao carrinho.
                </p>
                <button
                  onClick={() => setModalOpen(false)}
                  className="mt-6 rounded-sm border border-gold px-6 py-2 font-mono text-sm font-semibold text-gold hover:bg-gold hover:text-deep-blue"
                >
                  Fechar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
