import { useEffect, useMemo, useState } from "react";
import type React from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  LayoutDashboard,
  Package,
  Layers,
  LogOut,
  Menu,
} from "lucide-react";

import api from "@/utils/axiosInstance";
import { fetchMe, type MeResponse } from "@/lib/session";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type NavItem = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  end?: boolean;
};

const navItems: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/eventos", label: "Eventos", icon: CalendarDays },
  { to: "/admin/lotes", label: "Lotes", icon: Layers },
  { to: "/admin/produtos", label: "Produtos", icon: Package },
];

function initials(name?: string) {
  const n = (name || "").trim();
  if (!n) return "A";
  const parts = n.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] || "A";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="px-4 pt-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Layers className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">Admin</div>
            <div className="text-xs text-muted-foreground">
              Identidade & Santidade
            </div>
          </div>
          <Badge className="ml-auto" variant="secondary">
            painel
          </Badge>
        </div>
      </div>

      <Separator className="my-4" />

      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 pb-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                    "hover:bg-gray-600/20",
                    isActive && "bg-gray-600/20 font-medium"
                  )
                }
              >
                <Icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </ScrollArea>

      <div className="p-4">
        <div className="rounded-xl border bg-card p-3">
          <div className="text-xs text-muted-foreground">
            Dica rápida
          </div>
          <div className="mt-1 text-sm">
            Crie o evento e depois cadastre lotes e produtos vinculados.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [open, setOpen] = useState(false);

  const location = useLocation();
  const nav = useNavigate();

  const title = useMemo(() => {
    const p = location.pathname;
    if (p === "/admin") return "Dashboard";
    if (p.startsWith("/admin/eventos")) return "Eventos";
    if (p.startsWith("/admin/lotes")) return "Lotes";
    if (p.startsWith("/admin/produtos")) return "Produtos";
    return "Admin";
  }, [location.pathname]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const r = await fetchMe();
      if (!alive) return;
      setMe(r);
    })();
    return () => {
      alive = false;
    };
  }, []);

  async function handleLogout() {
    try {
      await api.post("/user/logout");
    } finally {
      nav("/login", { replace: true });
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-full">
        {/* Sidebar desktop */}
        <aside className="hidden w-72 border-r border-gold/55 bg-card/40 backdrop-blur lg:block">
          <Sidebar />
        </aside>

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Topbar */}
          <div className="sticky top-0 z-20 border-b border-gold/55 bg-background/70 backdrop-blur">
            <div className="flex items-center gap-3 px-4 py-3 lg:px-6">
              {/* Mobile menu */}
              <div className="lg:hidden">
                <Sheet open={open} onOpenChange={setOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Menu className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="p-0">
                    <Sidebar onNavigate={() => setOpen(false)} />
                  </SheetContent>
                </Sheet>
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-sm text-muted-foreground">Painel administrativo</div>
                <div className="truncate text-lg font-semibold">{title}</div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden text-right sm:block">
                  <div className="text-sm font-medium leading-tight">
                    {(me as any)?.pessoa?.nome || "Administrador"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {(me as any)?.usuario?.email || "—"}
                  </div>
                </div>

                <Avatar className="h-9 w-9">
                  <AvatarFallback>
                    {initials((me as any)?.pessoa?.nome)}
                  </AvatarFallback>
                </Avatar>

                <Button variant="outline" size="icon" onClick={handleLogout} title="Sair">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <main className="flex-1 px-4 py-6 lg:px-6">
            <Outlet />
          </main>

          <footer className="border-t  border-gold/55 px-4 py-4 text-xs text-muted-foreground lg:px-6">
            © {new Date().getFullYear()} IDeS — painel admin
          </footer>
        </div>
      </div>
    </div>
  );
}
