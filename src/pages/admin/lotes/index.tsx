import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

import api from "@/utils/axiosInstance";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type Evento = { id: number; nome_evento: string };
type Lote = { id: number; id_evento: number; preco: number; num_lote: number; total_vagas: number };

type FormState = { preco: string; num_lote: string; total_vagas: string };
const emptyForm: FormState = { preco: "", num_lote: "", total_vagas: "" };

export default function AdminLotesPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [eventoId, setEventoId] = useState<string>("");
  const [items, setItems] = useState<Lote[]>([]);
  const [loading, setLoading] = useState(false);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [createForm, setCreateForm] = useState<FormState>(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<FormState>(emptyForm);

  async function loadEventos() {
    const { data } = await api.get("/event/eventos");
    setEventos(data || []);
  }

  async function loadLotes(evId: string) {
    if (!evId) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get("/event/lotes", { params: { id_evento: Number(evId) } });
      setItems(data || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEventos();
  }, []);

  useEffect(() => {
    loadLotes(eventoId);
  }, [eventoId]);

  const selectedEvento = useMemo(() => eventos.find((e) => String(e.id) === eventoId), [eventos, eventoId]);

  const canSaveCreate = useMemo(() => {
    return (
      Boolean(eventoId) &&
      createForm.preco.trim() &&
      createForm.num_lote.trim() &&
      createForm.total_vagas.trim()
    );
  }, [eventoId, createForm]);

  const canSaveEdit = useMemo(() => {
    return (
      Boolean(eventoId) &&
      Boolean(editId) &&
      editForm.preco.trim() &&
      editForm.num_lote.trim() &&
      editForm.total_vagas.trim()
    );
  }, [eventoId, editForm, editId]);

  async function create() {
    if (!canSaveCreate || saving) return;
    setErr(null);
    setSaving(true);
    try {
      await api.post("/event/lotes", {
        id_evento: Number(eventoId),
        preco: Number(createForm.preco),
        num_lote: Number(createForm.num_lote),
        total_vagas: Number(createForm.total_vagas),
      });

      setCreateForm(emptyForm);
      setOpenCreate(false);
      await loadLotes(eventoId);
    } catch (e: any) {
      const msg = e?.response?.data?.detail || "Falha ao criar lote.";
      setErr(String(msg));
    } finally {
      setSaving(false);
    }
  }

  function startEdit(l: Lote) {
    setErr(null);
    setEditId(l.id);
    setEditForm({
      preco: String(l.preco ?? ""),
      num_lote: String(l.num_lote ?? ""),
      total_vagas: String(l.total_vagas ?? ""),
    });
    setOpenEdit(true);
  }

  async function saveEdit() {
    if (!canSaveEdit || saving || !editId) return;
    setErr(null);
    setSaving(true);
    try {
      await api.put(`/event/lotes/${editId}`, {
        id_evento: Number(eventoId),
        preco: Number(editForm.preco),
        num_lote: Number(editForm.num_lote),
        total_vagas: Number(editForm.total_vagas),
      });

      setOpenEdit(false);
      setEditId(null);
      await loadLotes(eventoId);
    } catch (e: any) {
      const msg = e?.response?.data?.detail || "Falha ao atualizar lote.";
      setErr(String(msg));
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: number) {
    if (!confirm("Excluir este lote?")) return;
    setErr(null);
    try {
      await api.delete(`/event/lotes/${id}`);
      await loadLotes(eventoId);
    } catch (e: any) {
      const msg = e?.response?.data?.detail || "Falha ao excluir lote.";
      setErr(String(msg));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Lotes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure os lotes de ingresso por evento.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="min-w-65">
            <Select value={eventoId} onValueChange={setEventoId}>
              <SelectTrigger className="hover:cursor-pointer">
                <SelectValue placeholder="Selecione um evento" />
              </SelectTrigger>
              <SelectContent>
                {eventos.map((e) => (
                  <SelectItem className="hover:cursor-pointer" key={e.id} value={String(e.id)}>
                    {e.nome_evento}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogTrigger asChild>
              <Button variant="outline" className="hover:cursor-pointer border" disabled={!eventoId}>
                <Plus className="mr-2 h-4 w-4" />
                Novo lote
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Criar lote</DialogTitle>
              </DialogHeader>

              {selectedEvento ? (
                <div className="rounded-lg border bg-muted/30 px-3 py-2 text-sm">
                  <div className="text-muted-foreground">Evento</div>
                  <div className="font-medium">{selectedEvento.nome_evento}</div>
                </div>
              ) : null}

              {err ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {err}
                </div>
              ) : null}

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label className="pb-2">Preço</Label>
                  <Input
                    value={createForm.preco}
                    onChange={(e) => setCreateForm((p) => ({ ...p, preco: e.target.value }))}
                    placeholder="99.90"
                  />
                </div>

                <div>
                  <Label className="pb-2">Nº do lote</Label>
                  <Input
                    value={createForm.num_lote}
                    onChange={(e) => setCreateForm((p) => ({ ...p, num_lote: e.target.value }))}
                    placeholder="1"
                  />
                </div>

                <div>
                  <Label className="pb-2">Vagas</Label>
                  <Input
                    value={createForm.total_vagas}
                    onChange={(e) => setCreateForm((p) => ({ ...p, total_vagas: e.target.value }))}
                    placeholder="300"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 ">
                <Button className="hover:cursor-pointer" variant="outline" onClick={() => setOpenCreate(false)}>
                  Cancelar
                </Button>
                <Button className="hover:cursor-pointer border bg-gray-500/40 text-white hover:bg-accent" disabled={!canSaveCreate || saving} onClick={create}>
                  {saving ? "Salvando..." : "Criar lote"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Lotes do evento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {err ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {err}
            </div>
          ) : null}

          {!eventoId ? (
            <div className="rounded-xl border bg-muted/20 p-6 text-center text-sm text-muted-foreground">
              Selecione um evento para ver e cadastrar lotes.
            </div>
          ) : (
            <div className="rounded-xl border p-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lote</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead className="hidden md:table-cell">Vagas</TableHead>
                    <TableHead className="w-35 pr-6 text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-10 text-center text-sm text-muted-foreground">
                        Carregando...
                      </TableCell>
                    </TableRow>
                  ) : items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-10 text-center text-sm text-muted-foreground">
                        Nenhum lote cadastrado ainda.
                      </TableCell>
                    </TableRow>
                  ) : (
                    items
                      .slice()
                      .sort((a, b) => (a.num_lote ?? 0) - (b.num_lote ?? 0))
                      .map((l) => (
                        <TableRow key={l.id}>
                          <TableCell>
                            <div className="font-medium">Lote {l.num_lote}</div>
                            <div className="mt-1 md:hidden">
                              <Badge variant="secondary">Vagas: {l.total_vagas}</Badge>
                            </div>
                          </TableCell>
                          <TableCell>R$ {Number(l.preco).toFixed(2)}</TableCell>
                          <TableCell className="hidden md:table-cell">{l.total_vagas}</TableCell>
                          <TableCell className="text-right">
                            <div className="inline-flex items-center gap-1">
                              <Button variant="outline" size="icon" onClick={() => startEdit(l)} title="Editar" className="hover:cursor-pointer">
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="icon" onClick={() => remove(l.id)} title="Excluir" className="hover:cursor-pointer">
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
          )}
        </CardContent>
      </Card>

      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar lote</DialogTitle>
          </DialogHeader>

          {err ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {err}
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label className="pb-2">Preço</Label>
              <Input value={editForm.preco} onChange={(e) => setEditForm((p) => ({ ...p, preco: e.target.value }))} />
            </div>
            <div>
              <Label className="pb-2">Nº do lote</Label>
              <Input value={editForm.num_lote} onChange={(e) => setEditForm((p) => ({ ...p, num_lote: e.target.value }))} />
            </div>
            <div>
              <Label className="pb-2">Vagas</Label>
              <Input value={editForm.total_vagas} onChange={(e) => setEditForm((p) => ({ ...p, total_vagas: e.target.value }))} />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" className="hover:cursor-pointer" onClick={() => setOpenEdit(false)}>
              Cancelar
            </Button>
            <Button variant="outline" className="hover:cursor-pointer border bg-gray-500/40 text-white hover:bg-accent" disabled={!canSaveEdit || saving} onClick={saveEdit}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
