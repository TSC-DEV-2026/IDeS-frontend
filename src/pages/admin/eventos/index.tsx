import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

import api from "@/utils/axiosInstance";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// ✅ toast confirmável via Sonner
import { toast } from "sonner";

type Evento = {
  id: number;
  nome_evento: string;
  local: string;
  dt_ini: string;
  dt_fim: string;
  hr_ini: string;
  hr_fim: string;
};

type FormState = {
  nome_evento: string;
  local: string;
  dt_ini: string;
  dt_fim: string;
  hr_ini: string;
  hr_fim: string;
};

const emptyForm: FormState = {
  nome_evento: "",
  local: "",
  dt_ini: "",
  dt_fim: "",
  hr_ini: "",
  hr_fim: "",
};

function normalizeDateInput(v: string) {
  return v;
}

function validateDates(dtIni: string, dtFim: string) {
  if (!dtIni || !dtFim) return null;
  if (dtFim < dtIni) return "A data fim não pode ser menor que a data início.";
  return null;
}

export default function AdminEventosPage() {
  const [items, setItems] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(false);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [saving, setSaving] = useState(false);

  const [createErr, setCreateErr] = useState<string | null>(null);
  const [editErr, setEditErr] = useState<string | null>(null);

  const [createForm, setCreateForm] = useState<FormState>(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<FormState>(emptyForm);

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get("/event/eventos");
      setItems(data || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const canSaveCreate = useMemo(() => {
    const f = createForm;
    const dateErr = validateDates(f.dt_ini, f.dt_fim);
    return (
      !dateErr &&
      f.nome_evento.trim() &&
      f.local.trim() &&
      f.dt_ini &&
      f.dt_fim &&
      f.hr_ini &&
      f.hr_fim
    );
  }, [createForm]);

  const canSaveEdit = useMemo(() => {
    const f = editForm;
    const dateErr = validateDates(f.dt_ini, f.dt_fim);
    return (
      !dateErr &&
      Boolean(editId) &&
      f.nome_evento.trim() &&
      f.local.trim() &&
      f.dt_ini &&
      f.dt_fim &&
      f.hr_ini &&
      f.hr_fim
    );
  }, [editForm, editId]);

  async function create() {
    if (!canSaveCreate || saving) return;

    const dateErr = validateDates(createForm.dt_ini, createForm.dt_fim);
    if (dateErr) {
      setCreateErr(dateErr);
      return;
    }

    setCreateErr(null);
    setSaving(true);
    try {
      await api.post("/event/eventos", {
        ...createForm,
        dt_ini: normalizeDateInput(createForm.dt_ini),
        dt_fim: normalizeDateInput(createForm.dt_fim),
      });

      setCreateForm(emptyForm);
      setOpenCreate(false);
      await load();
    } catch (e: any) {
      const msg = e?.response?.data?.detail || "Falha ao criar evento.";
      setCreateErr(String(msg));
    } finally {
      setSaving(false);
    }
  }

  function startEdit(ev: Evento) {
    setEditErr(null);
    setEditId(ev.id);
    setEditForm({
      nome_evento: ev.nome_evento || "",
      local: ev.local || "",
      dt_ini: (ev.dt_ini || "").slice(0, 10),
      dt_fim: (ev.dt_fim || "").slice(0, 10),
      hr_ini: (ev.hr_ini || "").slice(0, 5),
      hr_fim: (ev.hr_fim || "").slice(0, 5),
    });
    setOpenEdit(true);
  }

  async function saveEdit() {
    if (!canSaveEdit || saving || !editId) return;

    const dateErr = validateDates(editForm.dt_ini, editForm.dt_fim);
    if (dateErr) {
      setEditErr(dateErr);
      return;
    }

    setEditErr(null);
    setSaving(true);
    try {
      await api.put(`/event/eventos/${editId}`, {
        ...editForm,
        dt_ini: normalizeDateInput(editForm.dt_ini),
        dt_fim: normalizeDateInput(editForm.dt_fim),
      });

      setOpenEdit(false);
      setEditId(null);
      await load();
    } catch (e: any) {
      const msg = e?.response?.data?.detail || "Falha ao atualizar evento.";
      setEditErr(String(msg));
    } finally {
      setSaving(false);
    }
  }

  // ✅ agora remove não confirma com confirm(); ele dispara um toast de confirmação
  async function remove(id: number) {
    const ev = items.find((x) => x.id === id);

    toast.warning("Confirmar exclusão", {
      description: ev
        ? `Excluir "${ev.nome_evento}"? Isso remove lotes/produtos vinculados.`
        : "Excluir este evento? Isso remove lotes/produtos vinculados.",
      action: {
        label: "Excluir",
        onClick: async () => {
          const tId = toast.loading("Excluindo evento...");
          try {
            await api.delete(`/event/eventos/${id}`);
            await load();
            toast.success("Evento excluído com sucesso.", { id: tId });
          } catch (e: any) {
            const msg = e?.response?.data?.detail || "Falha ao excluir evento.";
            toast.error(String(msg), { id: tId });
            setCreateErr(String(msg)); // mantém teu comportamento “global”
          }
        },
      },
      cancel: {
        label: "Cancelar",
        onClick: () => {},
      },
    });
  }

  const createDateErr = validateDates(createForm.dt_ini, createForm.dt_fim);
  const editDateErr = validateDates(editForm.dt_ini, editForm.dt_fim);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Eventos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Crie, edite e organize os eventos do congresso.
          </p>
        </div>

        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogTrigger asChild>
            <Button variant="outline" className="border hover:cursor-pointer">
              <Plus className="mr-2 h-4 w-4" />
              Novo evento
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Criar evento</DialogTitle>
            </DialogHeader>

            {createErr ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {createErr}
              </div>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label className="pb-2">Nome do evento</Label>
                <Input
                  value={createForm.nome_evento}
                  onChange={(e) =>
                    setCreateForm((p) => ({
                      ...p,
                      nome_evento: e.target.value,
                    }))
                  }
                  placeholder="Congresso Identidade e Santidade"
                />
              </div>

              <div className="sm:col-span-2">
                <Label className="pb-2">Local</Label>
                <Input
                  value={createForm.local}
                  onChange={(e) =>
                    setCreateForm((p) => ({ ...p, local: e.target.value }))
                  }
                  placeholder="Igreja / Centro de eventos / Cidade"
                />
              </div>

              <div>
                <Label className="pb-2">Data início</Label>
                <Input
                  type="date"
                  value={createForm.dt_ini}
                  onChange={(e) => {
                    const v = e.target.value;
                    setCreateForm((p) => {
                      const next = { ...p, dt_ini: v };
                      setCreateErr(validateDates(next.dt_ini, next.dt_fim));
                      return next;
                    });
                  }}
                  className={cn(createDateErr && "border-destructive")}
                />
              </div>

              <div>
                <Label className="pb-2">Data fim</Label>
                <Input
                  type="date"
                  value={createForm.dt_fim}
                  onChange={(e) => {
                    const v = e.target.value;
                    setCreateForm((p) => {
                      const next = { ...p, dt_fim: v };
                      setCreateErr(validateDates(next.dt_ini, next.dt_fim));
                      return next;
                    });
                  }}
                  className={cn(createDateErr && "border-destructive")}
                />
              </div>

              <div>
                <Label className="pb-2">Hora início</Label>
                <Input
                  type="time"
                  value={createForm.hr_ini}
                  onChange={(e) =>
                    setCreateForm((p) => ({ ...p, hr_ini: e.target.value }))
                  }
                />
              </div>

              <div>
                <Label className="pb-2">Hora fim</Label>
                <Input
                  type="time"
                  value={createForm.hr_fim}
                  onChange={(e) =>
                    setCreateForm((p) => ({ ...p, hr_fim: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button
                className="hover:cursor-pointer"
                variant="outline"
                onClick={() => {
                  setOpenCreate(false);
                  setCreateErr(null);
                }}
              >
                Cancelar
              </Button>
              <Button variant="outline" className="hover:cursor-pointer border bg-gray-500/40 text-white hover:bg-accent"  disabled={!canSaveCreate || saving} onClick={create}>
                {saving ? "Salvando..." : "Criar evento"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Lista de eventos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {createErr ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {createErr}
            </div>
          ) : null}

          <div className="rounded-xl border p-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Evento</TableHead>
                  <TableHead className="hidden md:table-cell">Local</TableHead>
                  <TableHead className="hidden lg:table-cell">Datas</TableHead>
                  <TableHead className="hidden lg:table-cell">Horário</TableHead>
                  <TableHead className="w-35 pr-6 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-10 text-center text-sm text-muted-foreground"
                    >
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : items.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-10 text-center text-sm text-muted-foreground"
                    >
                      Nenhum evento cadastrado ainda.
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((ev) => (
                    <TableRow key={ev.id}>
                      <TableCell>
                        <div className="font-medium">{ev.nome_evento}</div>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground md:hidden">
                          <Badge variant="secondary">{ev.local}</Badge>
                          <Badge variant="outline">
                            {String(ev.dt_ini).slice(0, 10)} →{" "}
                            {String(ev.dt_fim).slice(0, 10)}
                          </Badge>
                          <Badge variant="outline">
                            {String(ev.hr_ini).slice(0, 5)}–{" "}
                            {String(ev.hr_fim).slice(0, 5)}
                          </Badge>
                        </div>
                      </TableCell>

                      <TableCell className="hidden md:table-cell">
                        {ev.local}
                      </TableCell>

                      <TableCell className="hidden lg:table-cell">
                        {String(ev.dt_ini).slice(0, 10)} →{" "}
                        {String(ev.dt_fim).slice(0, 10)}
                      </TableCell>

                      <TableCell className="hidden lg:table-cell">
                        {String(ev.hr_ini).slice(0, 5)}–{" "}
                        {String(ev.hr_fim).slice(0, 5)}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="inline-flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => startEdit(ev)}
                            title="Editar"
                            className="hover:cursor-pointer"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => remove(ev.id)}
                            title="Excluir"
                            className="hover:cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <Separator />

          <div className="text-xs text-muted-foreground">
            Ao excluir um evento, irá remover lotes e produtos vinculados.
          </div>
        </CardContent>
      </Card>

      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Editar evento</DialogTitle>
          </DialogHeader>

          {editErr ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {editErr}
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label className="pb-2">Nome do evento</Label>
              <Input
                value={editForm.nome_evento}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, nome_evento: e.target.value }))
                }
              />
            </div>

            <div className="sm:col-span-2">
              <Label className="pb-2">Local</Label>
              <Input
                value={editForm.local}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, local: e.target.value }))
                }
              />
            </div>

            <div>
              <Label className="pb-2">Data início</Label>
              <Input
                type="date"
                value={editForm.dt_ini}
                onChange={(e) => {
                  const v = e.target.value;
                  setEditForm((p) => {
                    const next = { ...p, dt_ini: v };
                    setEditErr(validateDates(next.dt_ini, next.dt_fim));
                    return next;
                  });
                }}
                className={cn(editDateErr && "border-destructive")}
              />
            </div>

            <div>
              <Label className="pb-2">Data fim</Label>
              <Input
                type="date"
                value={editForm.dt_fim}
                onChange={(e) => {
                  const v = e.target.value;
                  setEditForm((p) => {
                    const next = { ...p, dt_fim: v };
                    setEditErr(validateDates(next.dt_ini, next.dt_fim));
                    return next;
                  });
                }}
                className={cn(editDateErr && "border-destructive")}
              />
            </div>

            <div>
              <Label className="pb-2">Hora início</Label>
              <Input
                type="time"
                value={editForm.hr_ini}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, hr_ini: e.target.value }))
                }
              />
            </div>

            <div>
              <Label className="pb-2">Hora fim</Label>
              <Input
                type="time"
                value={editForm.hr_fim}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, hr_fim: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setOpenEdit(false);
                setEditErr(null);
              }}
              className="hover:cursor-pointer"
            >
              Cancelar
            </Button>

            <Button
              variant="outline"
              disabled={!canSaveEdit || saving}
              onClick={saveEdit}
              className="hover:cursor-pointer border bg-gray-500/40 text-white hover:bg-accent"
            >
              {saving ? "Salvando..." : "Salvar alterações"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}