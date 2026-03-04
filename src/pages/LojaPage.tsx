import { useEffect, useState } from "react";
import { ShopSection, type ShopItemVM } from "@/components/shop-section";
import type { CartItem } from "@/types/cart";
import { getEventoInfo, listEventos, toNumber } from "@/services/event";

type Props = { onAddToCart: (item: CartItem) => void };

export default function LojaPage({ onAddToCart }: Props) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ShopItemVM[]>([]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      try {
        const eventos = await listEventos();
        const envId = Number((import.meta as any).env?.VITE_EVENTO_ID || 0);
        const chosen = (envId ? eventos.find((e) => e.id === envId) : eventos[0]) || null;

        if (!chosen) {
          if (mounted) setItems([]);
          return;
        }

        const info = await getEventoInfo(chosen.id);
        if (!mounted) return;

        const vm: ShopItemVM[] = info.produtos.map((p) => ({
          id: p.id,
          name: p.descricao,
          price: toNumber(p.preco),
          image: p.img ?? null,
        }));

        setItems(vm);
      } catch {
        if (mounted) setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return <ShopSection loading={loading} items={items} onAddToCart={onAddToCart} />;
}
