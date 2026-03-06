import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Trash2, Image as ImageIcon } from "lucide-react";

import api from "@/utils/axiosInstance";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";

type Evento = { id: number; nome_evento: string };
type Produto = { id: number; id_evento: number; preco: number; descricao: string; img?: string | null };

type FormState = { preco: string; descricao: string; img: string };
const emptyForm: FormState = { preco: "", descricao: "", img: "" };

export default function AdminProdutosPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [eventoId, setEventoId] = useState<string>("");
  const [items, setItems] = useState<Produto[]>([]);
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

  async function loadProdutos(evId: string) {
    if (!evId) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get("/event/produtos", { params: { id_evento: Number(evId) } });
      setItems(data || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEventos();
  }, []);

  useEffect(() => {
    loadProdutos(eventoId);
  }, [eventoId]);

  const selectedEvento = useMemo(() => eventos.find((e) => String(e.id) === eventoId), [eventos, eventoId]);

  const canSaveCreate = useMemo(() => {
    return Boolean(eventoId) && createForm.preco.trim() && createForm.descricao.trim();
  }, [eventoId, createForm]);

  const canSaveEdit = useMemo(() => {
    return Boolean(eventoId) && Boolean(editId) && editForm.preco.trim() && editForm.descricao.trim();
  }, [eventoId, editForm, editId]);

  async function create() {
    if (!canSaveCreate || saving) return;
    setErr(null);
    setSaving(true);
    try {
      await api.post("/event/produtos", {
        id_evento: Number(eventoId),
        preco: Number(createForm.preco),
        descricao: createForm.descricao,
        img: createForm.img ? createForm.img : null,
      });

      setCreateForm(emptyForm);
      setOpenCreate(false);
      await loadProdutos(eventoId);
    } catch (e: any) {
      const msg = e?.response?.data?.detail || "Falha ao criar produto.";
      setErr(String(msg));
    } finally {
      setSaving(false);
    }
  }

  function startEdit(p: Produto) {
    setErr(null);
    setEditId(p.id);
    setEditForm({
      preco: String(p.preco ?? ""),
      descricao: String(p.descricao ?? ""),
      img: p.img ? String(p.img) : "",
    });
    setOpenEdit(true);
  }

  async function saveEdit() {
    if (!canSaveEdit || saving || !editId) return;
    setErr(null);
    setSaving(true);
    try {
      await api.put(`/event/produtos/${editId}`, {
        id_evento: Number(eventoId),
        preco: Number(editForm.preco),
        descricao: editForm.descricao,
        img: editForm.img ? editForm.img : null,
      });

      setOpenEdit(false);
      setEditId(null);
      await loadProdutos(eventoId);
    } catch (e: any) {
      const msg = e?.response?.data?.detail || "Falha ao atualizar produto.";
      setErr(String(msg));
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: number) {
    if (!confirm("Excluir este produto?")) return;
    setErr(null);
    try {
      await api.delete(`/event/produtos/${id}`);
      await loadProdutos(eventoId);
    } catch (e: any) {
      const msg = e?.response?.data?.detail || "Falha ao excluir produto.";
      setErr(String(msg));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Produtos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Cadastre itens da loja vinculados a um evento (com imagem opcional).
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
                  <SelectItem key={e.id} value={String(e.id)}>
                    {e.nome_evento}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border hover:cursor-pointer" disabled={!eventoId}>
                <Plus className="mr-2 h-4 w-4" />
                Novo produto
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>Criar produto</DialogTitle>
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

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="pb-2">Preço</Label>
                  <Input
                    value={createForm.preco}
                    onChange={(e) => setCreateForm((p) => ({ ...p, preco: e.target.value }))}
                    placeholder="59.90"
                  />
                </div>

                <div>
                  <Label className="pb-2">Imagem (URL S3) opcional</Label>
                  <Input
                    value={createForm.img}
                    onChange={(e) => setCreateForm((p) => ({ ...p, img: e.target.value }))}
                    placeholder="https://.../produto.png"
                  />
                </div>

                <div className="sm:col-span-2">
                  <Label className="pb-2">Descrição</Label>
                  <Textarea
                    value={createForm.descricao}
                    onChange={(e) => setCreateForm((p) => ({ ...p, descricao: e.target.value }))}
                    placeholder="Camiseta oficial IDeS..."
                    rows={4}
                  />
                </div>

                {createForm.img ? (
                  <div className="sm:col-span-2">
                    <div className="mb-2 text-xs text-muted-foreground">Pré-visualização</div>
                    <div className="overflow-hidden rounded-xl border bg-card">
                      <AspectRatio ratio={16 / 9}>
                                                <img
                          src={createForm.img}
                          alt="Pré-visualização"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = "none";
                          }}
                        />
                        <div className="grid h-full w-full place-items-center text-sm text-muted-foreground">
                          <div className="inline-flex items-center gap-2">
                            <ImageIcon className="h-4 w-4" />
                            Se a imagem não aparecer, verifique a URL.
                          </div>
                        </div>
                      </AspectRatio>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpenCreate(false)}>
                  Cancelar
                </Button>
                <Button className="hover:cursor-pointer border bg-gray-500/40 text-white hover:bg-accent" disabled={!canSaveCreate || saving} onClick={create}>
                  {saving ? "Salvando..." : "Criar produto"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Produtos do evento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {err ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {err}
            </div>
          ) : null}

          {!eventoId ? (
            <div className="rounded-xl border bg-muted/20 p-6 text-center text-sm text-muted-foreground">
              Selecione um evento para ver e cadastrar produtos.
            </div>
          ) : (
            <div className="rounded-xl border p-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead className="hidden md:table-cell">Preço</TableHead>
                    <TableHead className="hidden lg:table-cell">Imagem</TableHead>
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
                        Nenhum produto cadastrado ainda.
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>
                          <div className="font-medium">{p.descricao}</div>
                          <div className="mt-1 flex flex-wrap gap-2 md:hidden">
                            <Badge variant="secondary">R$ {Number(p.preco).toFixed(2)}</Badge>
                            {p.img ? <Badge variant="outline">com imagem</Badge> : <Badge variant="outline">sem imagem</Badge>}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">R$ {Number(p.preco).toFixed(2)}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {p.img ? (
                            <div className="h-10 w-16 overflow-hidden rounded-md border bg-card">
                                                            <img src={p.img} alt="img" className="h-full w-full object-cover" />
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="inline-flex items-center gap-1">
                            <Button variant="outline" size="icon" onClick={() => startEdit(p)} title="Editar" className="hover:cursor-pointer">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="icon" onClick={() => remove(p.id)} title="Excluir" className="hover:cursor-pointer">
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
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Editar produto</DialogTitle>
          </DialogHeader>

          {err ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {err}
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="pb-2">Preço</Label>
              <Input value={editForm.preco} onChange={(e) => setEditForm((p) => ({ ...p, preco: e.target.value }))} />
            </div>

            <div>
              <Label className="pb-2">Imagem (URL S3) opcional</Label>
              <Input value={editForm.img} onChange={(e) => setEditForm((p) => ({ ...p, img: e.target.value }))} />
            </div>

            <div className="sm:col-span-2">
              <Label className="pb-2">Descrição</Label>
              <Textarea value={editForm.descricao} onChange={(e) => setEditForm((p) => ({ ...p, descricao: e.target.value }))} rows={4} />
            </div>

            {editForm.img ? (
              <div className="sm:col-span-2">
                <div className="mb-2 text-xs text-muted-foreground">Pré-visualização</div>
                <div className="overflow-hidden rounded-xl border bg-card">
                  <AspectRatio ratio={16 / 9}>
                                        <img
                      src={editForm.img}
                      alt="Pré-visualização"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <div className="grid h-full w-full place-items-center text-sm text-muted-foreground">
                      <div className="inline-flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        Se a imagem não aparecer, verifique a URL.
                      </div>
                    </div>
                  </AspectRatio>
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpenEdit(false)}>
              Cancelar
            </Button>
            <Button className="hover:cursor-pointer border bg-gray-500/40 text-white hover:bg-accent" disabled={!canSaveEdit || saving} onClick={saveEdit}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
