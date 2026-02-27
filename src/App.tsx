import { useCallback, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartSidebar } from "@/components/cart-sidebar";
import { FloatingCTA } from "@/components/floating-cta";

import HomePage from "@/pages/HomePage";
import SobrePage from "@/pages/SobrePage";
import PreletoresPage from "@/pages/PreletoresPage";
import ProgramacaoPage from "@/pages/ProgramacaoPage";
import IngressosPage from "@/pages/IngressosPage";
import LojaPage from "@/pages/LojaPage";
import FaqPage from "@/pages/FaqPage";
import NotFoundPage from "@/pages/NotFoundPage";

import type { CartItem } from "@/types/cart";

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const navigate = useNavigate();

  const addToCart = useCallback((item: CartItem) => {
    setCart((prev) => [...prev, item]);
  }, []);

  const removeFromCart = useCallback((index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader cartCount={cart.length} onCartClick={() => setCartOpen(true)} />

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sobre" element={<SobrePage />} />
          <Route path="/preletores" element={<PreletoresPage />} />
          <Route path="/programacao" element={<ProgramacaoPage />} />
          <Route
            path="/ingressos"
            element={<IngressosPage onCheckoutAdd={addToCart} />}
          />
          <Route path="/loja" element={<LojaPage onAddToCart={addToCart} />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <SiteFooter />

      <FloatingCTA
        onClick={() => {
          navigate("/ingressos");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      <CartSidebar
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        onRemove={removeFromCart}
      />
    </div>
  );
}
