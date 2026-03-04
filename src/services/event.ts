import api from "@/utils/axiosInstance";

export type Evento = {
  id: number;
  nome_evento: string;
  local: string;
  dt_ini: string;
  dt_fim: string;
  hr_ini: string;
  hr_fim: string;
};

export type Lote = {
  id: number;
  id_evento: number;
  preco: number | string;
  num_lote: number;
  total_vagas: number;
};

export type Produto = {
  id: number;
  id_evento: number;
  preco: number | string;
  descricao: string;
  img?: string | null;
};

export async function listEventos() {
  const { data } = await api.get("/event/eventos");
  return data as Evento[];
}

export async function getEventoInfo(eventoId: number) {
  const { data } = await api.get(`/event/eventos/${eventoId}/info`);
  return data as { evento: Evento; lotes: Lote[]; produtos: Produto[] };
}

export function toNumber(v: number | string): number {
  if (typeof v === "number") return v;
  const n = Number(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}
