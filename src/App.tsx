import { useCallback, useMemo, useState } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartSidebar } from "@/components/cart-sidebar";
import { FloatingCTA } from "@/components/floating-cta";

// ✅ toaster
import { Toaster } from "@/components/ui/sonner";

import InicioPage from "@/pages/inicio";
import SobrePage from "@/pages/sobre";
import PreletoresPage from "@/pages/preletores";
import ProgramacaoPage from "@/pages/programacao";
import IngressosPage from "@/pages/ingressos";
import LojaPage from "@/pages/loja";
import FaqPage from "@/pages/faq";
import NotFoundPage from "@/pages/nao-encontrado";
import LoginPage from "@/pages/autenticacao/login";
import RegisterPage from "@/pages/autenticacao/cadastro";

import HomePublicaPage from "@/pages/home-publica";

import AdminLayout from "@/pages/admin/layout";
import AdminDashboardPage from "@/pages/admin/dashboard";
import AdminEventosPage from "@/pages/admin/eventos";
import AdminLotesPage from "@/pages/admin/lotes";
import AdminProdutosPage from "@/pages/admin/produtos";

import AdminRoute from "@/lib/AdminRoute";
import PublicOnlyRoute from "@/lib/PublicOnlyRoute";
import AuthGate from "@/lib/AuthGate";

import type { CartItem } from "@/types/cart";

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const isAuthRoute = useMemo(() => {
    const p = location.pathname;
    return p === "/login" || p === "/register";
  }, [location.pathname]);

  const isAdminRoute = useMemo(() => {
    return location.pathname.startsWith("/admin");
  }, [location.pathname]);

  const isPublicHome = useMemo(() => {
    return location.pathname === "/home";
  }, [location.pathname]);

  const hideSiteChrome = isAuthRoute || isAdminRoute || isPublicHome;

  const addToCart = useCallback((item: CartItem) => {
    setCart((prev) => [...prev, item]);
  }, []);

  const removeFromCart = useCallback((index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster />

      {!hideSiteChrome && (
        <SiteHeader cartCount={cart.length} onCartClick={() => setCartOpen(true)} />
      )}

      <main className={hideSiteChrome ? "" : "lg:pb-0"}>
        <Routes>
          {/* ✅ HOME pública: única tela liberada quando não logado */}
          <Route path="/home" element={<HomePublicaPage />} />

          {/* AUTH */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ✅ Tudo que for “normal” fica atrás do login */}
          <Route element={<AuthGate />}>
            {/* ADMIN */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="eventos" element={<AdminEventosPage />} />
                <Route path="lotes" element={<AdminLotesPage />} />
                <Route path="produtos" element={<AdminProdutosPage />} />
              </Route>
            </Route>

            {/* ROTAS NORMAIS */}
            <Route element={<PublicOnlyRoute />}>
              <Route path="/" element={<InicioPage />} />
              <Route path="/sobre" element={<SobrePage />} />
              <Route path="/preletores" element={<PreletoresPage />} />
              <Route path="/programacao" element={<ProgramacaoPage />} />
              <Route path="/ingressos" element={<IngressosPage onCheckoutAdd={addToCart} />} />
              <Route path="/loja" element={<LojaPage onAddToCart={addToCart} />} />
              <Route path="/faq" element={<FaqPage />} />
            </Route>
          </Route>

          {/* ✅ qualquer rota desconhecida cai na Home pública */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </main>

      {!hideSiteChrome && <SiteFooter />}

      {!hideSiteChrome && (
        <FloatingCTA
          onClick={() => {
            navigate("/ingressos");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}

      {!hideSiteChrome && (
        <CartSidebar
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          items={cart}
          onRemove={removeFromCart}
        />
      )}
    </div>
  );
}