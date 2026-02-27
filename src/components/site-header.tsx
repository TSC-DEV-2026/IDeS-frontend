import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, ShoppingCart, X } from "lucide-react";

interface SiteHeaderProps {
  cartCount: number;
  onCartClick: () => void;
}

const navLinks = [
  { label: "Início", to: "/" },
  { label: "Sobre", to: "/sobre" },
  { label: "Preletores", to: "/preletores" },
  { label: "Programação", to: "/programacao" },
  { label: "Ingressos", to: "/ingressos" },
  { label: "Loja", to: "/loja" },
  { label: "FAQ", to: "/faq" },
];

export function SiteHeader({ cartCount, onCartClick }: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // fecha menu ao trocar de rota
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={[
        "sticky top-0 z-50 border-b border-border backdrop-blur",
        scrolled ? "bg-background/80" : "bg-background/50",
      ].join(" ")}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card shadow-sm">
            <span className="font-mono text-sm font-bold tracking-wider text-gold">I&S</span>
          </div>
          <div className="leading-tight">
            <div className="font-sans text-lg font-semibold tracking-tight">Identidade &amp; Santidade</div>
            <div className="font-mono text-xs tracking-[0.28em] text-muted-foreground uppercase">Congresso 2026</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((l) => {
            const active = location.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={[
                  "font-mono text-xs font-semibold tracking-[0.25em] uppercase transition",
                  active ? "text-gold" : "text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCartClick}
            className="relative inline-flex items-center justify-center rounded-xl border border-border bg-card p-2 shadow-sm transition hover:bg-background"
            aria-label="Abrir carrinho"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[11px] font-bold text-deep-blue">
                {cartCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-xl border border-border bg-card p-2 shadow-sm transition hover:bg-background md:hidden"
            aria-label="Abrir menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background/95 px-6 py-6 md:hidden">
          <div className="grid gap-3">
            {navLinks.map((l) => {
              const active = location.pathname === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={[
                    "rounded-xl border border-border bg-card px-4 py-3 font-mono text-sm font-semibold transition",
                    active ? "text-gold" : "text-foreground",
                  ].join(" ")}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
