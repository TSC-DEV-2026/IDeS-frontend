import { useEffect, useMemo, useRef, useState } from "react";
import { ShoppingCart, Package, BookOpen, Shirt, Heart, Loader2 } from "lucide-react";

import type { CartItem } from "@/types/cart";

export type ShopItemVM = {
  id: number | string;
  name: string;
  price: number;
  description?: string;
  image?: string | null;
};

const fallbackProducts: ShopItemVM[] = [
  {
    id: "camiseta",
    name: "Camiseta Oficial",
    price: 79.9,
    description: "Camiseta premium do congresso em algodao organico",
  },
  {
    id: "kit",
    name: "Kit Congresso",
    price: 149.9,
    description: "Bolsa, caneta, caderno e adesivos exclusivos do evento",
  },
  {
    id: "livro",
    name: "Livro: Identidade em Cristo",
    price: 59.9,
    description: "Livro escrito pelo Pr. Daniel Oliveira sobre identidade crista",
  },
  {
    id: "devocional",
    name: "Devocional 30 Dias",
    price: 39.9,
    description: "Devocional exclusivo para aprofundar os temas do congresso",
  },
];

function formatBRL(v: number): string {
  try {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
  } catch {
    return `R$ ${v.toFixed(2)}`.replace(".", ",");
  }
}

interface ShopSectionProps {
  onAddToCart: (item: CartItem) => void;
  loading?: boolean;
  items?: ShopItemVM[];
}

export function ShopSection({ onAddToCart, loading, items }: ShopSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [addedIndex, setAddedIndex] = useState<number | null>(null);

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

  const list = useMemo(() => {
    const src = items && items.length ? items : fallbackProducts;
    return src.slice();
  }, [items]);

  function handleAdd(product: ShopItemVM, index: number) {
    onAddToCart({ name: product.name, price: product.price });
    setAddedIndex(index);
    setTimeout(() => setAddedIndex(null), 1500);
  }

  function pickIcon(i: number) {
    const icons = [Shirt, Package, BookOpen, Heart];
    return icons[i % icons.length] || ShoppingCart;
  }

  return (
    <section id="loja" ref={ref} className="py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-4 text-center font-mono text-sm font-semibold tracking-[0.3em] text-gold uppercase">
          Loja Oficial
        </p>
        <h2 className="mb-16 text-center font-sans text-4xl font-bold text-foreground md:text-5xl text-balance">
          Produtos <span className="text-gold">exclusivos</span>
        </h2>

        {loading ? (
          <div className="flex items-center justify-center gap-3 py-16 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="font-mono text-sm">Carregando produtos...</span>
          </div>
        ) : (
          <div
            className={`grid gap-8 transition-all duration-1000 sm:grid-cols-2 lg:grid-cols-4 ${
              visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            {list.map((product, i) => {
              const Icon = pickIcon(i);
              return (
                <div
                  key={String(product.id)}
                  className="group flex flex-col rounded-sm border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gold/5"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex items-center justify-center">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-20 w-20 rounded-sm object-cover border border-border"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-sm border border-border bg-secondary">
                        <Icon className="h-10 w-10 text-gold" />
                      </div>
                    )}
                  </div>

                  <h3 className="mt-6 text-center font-sans text-xl font-bold text-foreground">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-center font-sans text-2xl font-bold text-gold">
                    {formatBRL(product.price)}
                  </p>
                  {product.description ? (
                    <p className="mt-4 text-center font-mono text-sm text-muted-foreground">
                      {product.description}
                    </p>
                  ) : (
                    <div className="mt-4" />
                  )}

                  <button
                    onClick={() => handleAdd(product, i)}
                    className="mt-8 flex w-full items-center justify-center gap-2 rounded-sm border border-gold py-3 font-mono text-sm font-semibold text-gold transition-all hover:bg-gold hover:text-deep-blue"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {addedIndex === i ? "Adicionado!" : "Adicionar ao carrinho"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
