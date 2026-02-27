import { X, Trash2, ShoppingBag } from "lucide-react"
import type { CartItem } from "@/types/cart"

interface CartSidebarProps {
  open: boolean
  onClose: () => void
  items: CartItem[]
  onRemove: (index: number) => void
}

export function CartSidebar({ open, onClose, items, onRemove }: CartSidebarProps) {
  const total = items.reduce((sum, item) => sum + item.price, 0)

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-90 bg-deep-blue/50 backdrop-blur-sm animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 z-95 flex h-full w-full max-w-md flex-col border-l border-border bg-card shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h3 className="flex items-center gap-2 font-sans text-xl font-bold text-foreground">
            <ShoppingBag className="h-5 w-5 text-gold" />
            Carrinho
          </h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Fechar carrinho"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ShoppingBag className="mb-4 h-12 w-12 text-muted-foreground/30" />
              <p className="font-mono text-sm text-muted-foreground">
                Seu carrinho esta vazio
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item, i) => (
                <div
                  key={`${item.name}-${i}`}
                  className="flex items-center justify-between rounded-sm border border-border bg-secondary p-4"
                >
                  <div>
                    <p className="font-mono text-sm font-medium text-foreground">{item.name}</p>
                    <p className="mt-1 font-mono text-sm text-gold">
                      R$ {item.price.toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemove(i)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    aria-label={`Remover ${item.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border px-6 py-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-sm font-medium text-muted-foreground">Total</span>
              <span className="font-sans text-xl font-bold text-gold">
                R$ {total.toFixed(2).replace(".", ",")}
              </span>
            </div>
            <button className="w-full rounded-sm bg-gold py-3 font-mono text-sm font-semibold text-deep-blue transition-all hover:bg-gold-light hover:shadow-lg">
              Finalizar Compra (simulacao)
            </button>
          </div>
        )}
      </div>
    </>
  )
}
