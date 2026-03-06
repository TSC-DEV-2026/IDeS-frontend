import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Layers, Package, ArrowRight, Sparkles } from "lucide-react";

import api from "@/utils/axiosInstance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

type Evento = { id: number };
type Lote = { id: number };
type Produto = { id: number };

export default function AdminDashboardPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      try {
        const [ev, lt, pr] = await Promise.all([
          api.get("/event/eventos"),
          api.get("/event/lotes"), // pode vir vazio se backend exigir id_evento (aqui só pra contar, tratamos)
          api.get("/event/produtos"),
        ]);

        if (!alive) return;

        setEventos(ev.data || []);
        setLotes(Array.isArray(lt.data) ? lt.data : []);
        setProdutos(Array.isArray(pr.data) ? pr.data : []);
      } catch {
        if (!alive) return;
        // fallback: pelo menos eventos
        try {
          const ev = await api.get("/event/eventos");
          if (!alive) return;
          setEventos(ev.data || []);
        } catch {}
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const stats = useMemo(
    () => [
      { label: "Eventos", value: eventos.length, icon: CalendarDays },
      { label: "Lotes", value: lotes.length, icon: Layers },
      { label: "Produtos", value: produtos.length, icon: Package },
    ],
    [eventos.length, lotes.length, produtos.length]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border  bg-card px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            Gerencie o congresso com rapidez
          </div>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">
            Visão geral
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Crie eventos, depois cadastre lotes (ingressos) e produtos (loja).
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="relative overflow-hidden">
              <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/10 blur-2xl" />
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                  {s.label}
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                    <Icon className="h-4 w-4" />
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">
                  {loading ? "—" : s.value}
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Total cadastrado
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Checklist rápido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="font-medium">1) Crie o evento</div>
              <div className="text-muted-foreground">
                Nome, datas, horários e local.
              </div>
            </div>
            <Badge variant={eventos.length ? "default" : "secondary"}>
              {eventos.length ? "ok" : "pendente"}
            </Badge>
          </div>

          <Separator />

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="font-medium">2) Cadastre lotes</div>
              <div className="text-muted-foreground">
                Lotes com preço, número e vagas.
              </div>
            </div>
            <Badge variant={lotes.length ? "default" : "secondary"}>
              {lotes.length ? "ok" : "pendente"}
            </Badge>
          </div>

          <Separator />

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="font-medium">3) Cadastre produtos</div>
              <div className="text-muted-foreground">
                Itens da loja e imagem (URL do S3).
              </div>
            </div>
            <Badge variant={produtos.length ? "default" : "secondary"}>
              {produtos.length ? "ok" : "pendente"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
