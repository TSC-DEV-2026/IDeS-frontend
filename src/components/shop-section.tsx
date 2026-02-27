import { useEffect, useRef, useState } from "react"
import { ShoppingCart, Package, BookOpen, Shirt, Heart } from "lucide-react"

import type { CartItem } from "@/types/cart"

const products = [
  {
    name: "Camiseta Oficial",
    price: 79.9,
    description: "Camiseta premium do congresso em algodao organico",
    icon: Shirt,
  },
  {
    name: "Kit Congresso",
    price: 149.9,
    description: "Bolsa, caneta, caderno e adesivos exclusivos do evento",
    icon: Package,
  },
  {
    name: "Livro: Identidade em Cristo",
    price: 59.9,
    description: "Livro escrito pelo Pr. Daniel Oliveira sobre identidade crista",
    icon: BookOpen,
  },
  {
    name: "Devocional 30 Dias",
    price: 39.9,
    description: "Devocional exclusivo para aprofundar os temas do congresso",
    icon: Heart,
  },
]

interface ShopSectionProps {
  onAddToCart: (item: CartItem) => void
}

export function ShopSection({ onAddToCart }: ShopSectionProps) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const [addedIndex, setAddedIndex] = useState<number | null>(null)

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

  function handleAdd(product: (typeof products)[0], index: number) {
    onAddToCart({ name: product.name, price: product.price })
    setAddedIndex(index)
    setTimeout(() => setAddedIndex(null), 1500)
  }

  return (
    <section id="loja" ref={ref} className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-4 text-center font-mono text-sm font-semibold tracking-[0.3em] text-gold uppercase">
          Loja Oficial
        </p>
        <h2 className="mb-16 text-center font-sans text-4xl font-bold text-foreground md:text-5xl text-balance">
          Produtos <span className="text-gold">exclusivos</span>
        </h2>

        <div
          className={`grid gap-8 transition-all duration-1000 sm:grid-cols-2 lg:grid-cols-4 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {products.map((product, i) => {
            const Icon = product.icon
            return (
              <div
                key={product.name}
                className="group flex flex-col rounded-sm border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gold/5"
              >
                {/* Product image placeholder */}
                <div
                  className="mb-6 flex aspect-square items-center justify-center rounded-sm"
                  style={{
                    background: "linear-gradient(135deg, #0F1C2E 0%, #1A2D45 100%)",
                  }}
                >
                  <Icon className="h-12 w-12 text-gold/50 transition-colors group-hover:text-gold" />
                </div>

                <h3 className="font-sans text-lg font-bold text-foreground">{product.name}</h3>
                <p className="mt-2 flex-1 font-mono text-sm leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
                <p className="mt-4 font-sans text-2xl font-bold text-gold">
                  R$ {product.price.toFixed(2).replace(".", ",")}
                </p>

                <button
                  onClick={() => handleAdd(product, i)}
                  className={`mt-4 flex w-full items-center justify-center gap-2 rounded-sm py-3 font-mono text-sm font-semibold transition-all ${
                    addedIndex === i
                      ? "bg-gold text-deep-blue"
                      : "border border-gold text-gold hover:bg-gold hover:text-deep-blue"
                  }`}
                >
                  <ShoppingCart className="h-4 w-4" />
                  {addedIndex === i ? "Adicionado!" : "Adicionar ao carrinho"}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
