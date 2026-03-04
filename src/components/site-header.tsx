import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  CalendarDays,
  Ticket,
  Store,
  HelpCircle,
  ShoppingCart,
  User,
  LogOut,
  Info,
  Mic,
} from "lucide-react";

import api from "@/utils/axiosInstance";
import { listEventos } from "@/services/event";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface SiteHeaderProps {
  cartCount: number;
  onCartClick: () => void;
}

const navLinksDesktop = [
  { label: "Início", to: "/" },
  { label: "Sobre", to: "/sobre" },
  { label: "Preletores", to: "/preletores" },
  { label: "Programação", to: "/programacao" },
  { label: "Ingressos", to: "/ingressos" },
  { label: "Loja", to: "/loja" },
  { label: "FAQ", to: "/faq" },
];

// ✅ agora com 7 itens (adicionados "Sobre" e "Preletores")
const dockLinksMobile = [
  { label: "Início", to: "/", icon: Home },
  { label: "Sobre", to: "/sobre", icon: Info },
  { label: "Preletores", to: "/preletores", icon: Mic },
  { label: "Agenda", to: "/programacao", icon: CalendarDays },
  { label: "Ingressos", to: "/ingressos", icon: Ticket },
  { label: "Loja", to: "/loja", icon: Store },
  { label: "FAQ", to: "/faq", icon: HelpCircle },
];

function safeYearFromISODate(iso?: string): string {
  if (!iso) return "";
  const y = iso.split("-")[0];
  return /^\d{4}$/.test(y) ? y : "";
}

type MePayload = {
  usuario?: { id: number; email: string };
  pessoa?: {
    id: number;
    nome: string;
    cpf: string;
    data_nascimento: string;
    adm?: boolean;
  };
};

export function SiteHeader({ cartCount, onCartClick }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [eventos, setEventos] = useState<any[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  // ---- AUTH (sem Context, direto nas rotas que você passou) ----
  const [me, setMe] = useState<MePayload | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const isAuthenticated = !!me?.usuario?.id;
  const initialFromName = (name?: string) => {
    const n = (name || "").trim();
    return (n[0] || "?").toUpperCase();
  };

  const fullName = me?.pessoa?.nome || me?.usuario?.email || "Usuário";
  const userInitial = initialFromName(fullName);
  const userEmail = me?.usuario?.email || "";

  const loadMe = async () => {
    setAuthLoading(true);
    try {
      const { data } = await api.get("/user/me");
      setMe(data || null);
    } catch {
      setMe(null);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/user/logout"); // sem payload
    } finally {
      setMe(null);
      navigate("/", { replace: true });
    }
  };

  const handleGoToLogin = () => {
    navigate("/login", { replace: false });
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const data = await listEventos();
        setEventos(Array.isArray(data) ? data : []);
      } catch {
        setEventos([]);
      }
    };
    fetchEventos();
  }, []);

  useEffect(() => {
    loadMe();
    // opcional: se você quiser tentar refresh antes do /me, dá pra fazer:
    // (async () => { try { await api.post("/user/refresh"); } catch {} finally { loadMe(); } })();
  }, []);

  const evento_name = eventos.length ? eventos[0].nome_evento : "Evento";
  const year = eventos.length ? safeYearFromISODate(eventos[0].dt_ini) : "";

  const activeIndex = useMemo(() => {
    const p = location.pathname;
    const idx = dockLinksMobile.findIndex((l) =>
      l.to === "/" ? p === "/" : p.startsWith(l.to),
    );
    return idx >= 0 ? idx : 0;
  }, [location.pathname]);

  return (
    <>
      {/* TOP BAR */}
      <header
        className={[
          "sticky top-0 z-50 border-b border-border backdrop-blur",
          scrolled ? "bg-background/85" : "bg-background/55",
        ].join(" ")}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-6 md:py-4">
          {/* Brand */}
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <div className="relative grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-border bg-card shadow-sm">
              <span className="font-mono text-sm font-bold tracking-wider text-gold">
                I&S
              </span>
              <span className="pointer-events-none absolute -inset-px rounded-2xl ring-1 ring-gold/10" />
            </div>

            <div className="min-w-0 leading-tight">
              <div className="truncate font-sans text-base font-semibold tracking-tight md:text-lg">
                {evento_name}
              </div>
              <div className="truncate font-mono text-[10px] tracking-[0.28em] text-muted-foreground uppercase md:text-xs">
                Congresso {year || "—"}
              </div>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden items-center gap-6 lg:flex">
            {navLinksDesktop.map((l) => {
              const active = location.pathname === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={[
                    "font-mono text-xs font-semibold tracking-[0.25em] uppercase transition",
                    active
                      ? "text-gold"
                      : "text-muted-foreground hover:text-foreground",
                  ].join(" ")}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT SIDE: Cart + Auth */}
          <div className="flex items-center gap-2">
            {/* CART */}
            <button
              type="button"
              onClick={onCartClick}
              className="relative inline-flex shrink-0 items-center justify-center rounded-2xl border border-border bg-card p-2 shadow-sm transition text-gold  hover:bg-gold/60 focus:bg-gold/10 hover:cursor-pointer"
              aria-label="Abrir carrinho"
              title="Carrinho"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[11px] font-bold text-deep-blue">
                  {cartCount}
                </span>
              )}
            </button>

            {/* AUTH (desktop) */}
            <div className="hidden sm:flex">
              {authLoading ? (
                <div className="h-9 w-28 animate-pulse rounded-2xl border border-border bg-card/50" />
              ) : isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="grid h-10 w-10 rounded-full font-mono text-sm font-bold text-gold hover:cursor-pointer hover:bg-gold/60 focus:bg-gold/10"
                    >
                      {userInitial}
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    className="
    w-64
    border border-border
    bg-background/95 backdrop-blur
    shadow-xl
  "
                  >
                    <div className="px-3 py-2">
                      <div className="text-sm font-semibold truncate">
                        {fullName}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {userEmail}
                      </div>
                    </div>

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="
      cursor-pointer
      text-red-500
      focus:text-red-500
      focus:bg-red-500/10
      hover:bg-red-500/10
    "
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  onClick={handleGoToLogin}
                  className="rounded-2xl bg-gold text-deep-blue hover:bg-gold/90"
                >
                  Entrar
                </Button>
              )}
            </div>

            {/* MOBILE MENU (Sheet) */}
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-2xl border-border bg-card shadow-sm"
                >
                  <span className="sr-only">Abrir menu</span>
                  <div className="grid place-items-center">
                    <span className="block h-0.5 w-5 bg-foreground/80 mb-1" />
                    <span className="block h-0.5 w-5 bg-foreground/80 mb-1" />
                    <span className="block h-0.5 w-5 bg-foreground/80" />
                  </div>
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-[320px] sm:w-95">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>

                <div className="mt-6 space-y-4 ml-2 mr-2">
                  {isAuthenticated ? (
                    <div className="rounded-2xl border border-border bg-card p-4 ">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-2xl border border-border bg-background">
                          <User className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold">
                            {fullName}
                          </div>
                          <div className="truncate text-xs text-muted-foreground">
                            {userEmail}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={handleGoToLogin}
                      className="w-full rounded-2xl bg-gold text-deep-blue hover:bg-gold/90"
                    >
                      Entrar
                    </Button>
                  )}

                  <div className="space-y-2 ">
                    {navLinksDesktop.map((l) => {
                      const active = location.pathname === l.to;
                      return (
                        <Link
                          key={l.to}
                          to={l.to}
                          className={[
                            "flex items-center justify-between rounded-2xl border px-3 py-2 text-sm transition",
                            active
                              ? "border-gold/30 bg-gold/10 text-gold"
                              : "border-border bg-card hover:bg-background",
                          ].join(" ")}
                        >
                          <span className="font-mono tracking-[0.18em] uppercase text-xs">
                            {l.label}
                          </span>
                          <span className="text-muted-foreground">›</span>
                        </Link>
                      );
                    })}
                  </div>

                  {isAuthenticated ? (
                    <Button
                      onClick={handleLogout}
                      variant="destructive"
                      className="w-full "
                    >
                      <LogOut className="mr-2 h-4 w-4 " />
                      Sair
                    </Button>
                  ) : null}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* MOBILE DOCK (agora com 7) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        <div className="mx-auto max-w-7xl px-4 pb-4">
          <div className="rounded-3xl border border-border bg-background/80 backdrop-blur-xl shadow-2xl">
            <div className="relative grid grid-cols-7 items-center px-2 py-2">
              <span
                className="absolute top-2 bottom-2 w-[calc((100%-16px)/7)] rounded-2xl bg-gold/15 ring-1 ring-gold/25 shadow-[0_0_26px_rgba(212,175,55,0.15)] transition-all duration-400 ease-out"
                style={{
                  left: `calc(8px + ${activeIndex} * ( (100% - 16px) / 7 ))`,
                }}
              />

              {dockLinksMobile.map((l) => {
                const Icon = l.icon;
                const active =
                  l.to === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(l.to);
                const isCenter = l.to === "/ingressos";

                return (
                  <Link
                    key={l.to}
                    to={l.to}
                    aria-label={l.label}
                    title={l.label}
                    className={[
                      "relative z-10 flex items-center justify-center py-2 transition-colors",
                      active ? "text-gold" : "text-muted-foreground",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "grid place-items-center rounded-2xl transition-transform duration-200",
                        isCenter ? "h-11 w-11" : "h-10 w-10",
                        active ? "scale-105" : "scale-100",
                      ].join(" ")}
                    >
                      <Icon className={isCenter ? "h-6 w-6" : "h-5 w-5"} />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}