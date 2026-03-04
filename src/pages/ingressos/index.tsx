import { useEffect, useMemo, useState } from "react";
import { TicketsSection, type TicketVM } from "@/components/tickets-section";
import type { CartItem } from "@/types/cart";
import { getEventoInfo, listEventos, toNumber, type Evento } from "@/services/event";

type Props = { onCheckoutAdd: (item: CartItem) => void };

export default function IngressosPage({ onCheckoutAdd }: Props) {
  const [loading, setLoading] = useState(true);
  const [evento, setEvento] = useState<Evento | null>(null);
  const [tickets, setTickets] = useState<TicketVM[]>([]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      try {
        const eventos = await listEventos();
        const envId = Number((import.meta as any).env?.VITE_EVENTO_ID || 0);
        const chosen = (envId ? eventos.find((e) => e.id === envId) : eventos[0]) || null;

        if (!chosen) {
          if (mounted) {
            setEvento(null);
            setTickets([]);
          }
          return;
        }

        const info = await getEventoInfo(chosen.id);
        if (!mounted) return;

        setEvento(info.evento);

        const vm: TicketVM[] = info.lotes
          .slice()
          .sort((a, b) => a.num_lote - b.num_lote)
          .map((l) => ({
            id: l.id,
            name: `Lote ${l.num_lote}`,
            price: toNumber(l.preco),
            tag: l.num_lote === 1 ? "Promocional" : undefined,
            vagas: l.total_vagas,
          }));

        setTickets(vm);
      } catch {
        if (mounted) {
          setEvento(null);
          setTickets([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const eventoVM = useMemo(() => {
    if (!evento) return null;
    return {
      nome_evento: evento.nome_evento,
      local: evento.local,
      dt_ini: evento.dt_ini,
      dt_fim: evento.dt_fim,
      hr_ini: evento.hr_ini,
      hr_fim: evento.hr_fim,
    };
  }, [evento]);

  return (
    <TicketsSection
      loading={loading}
      evento={eventoVM}
      tickets={tickets}
      onCheckoutAdd={onCheckoutAdd}
    />
  );
}
