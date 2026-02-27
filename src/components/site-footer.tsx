import { Link } from "react-router-dom";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <p className="font-sans text-2xl font-bold tracking-wide">
              <span className="text-gold">Identidade</span>{" "}
              <span className="font-light text-foreground">&amp; Santidade</span>
            </p>
            <p className="mt-4 font-mono text-sm leading-relaxed text-muted-foreground">
              Um congresso transformador para fortalecer sua identidade em Cristo e
              viver santidade com constância.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-mono text-sm font-semibold tracking-wider text-muted-foreground uppercase">
              Navegação
            </h4>
            <nav className="flex flex-col gap-2">
              {[
                ["Início", "/"],
                ["Sobre", "/sobre"],
                ["Preletores", "/preletores"],
                ["Programação", "/programacao"],
                ["Ingressos", "/ingressos"],
                ["Loja", "/loja"],
                ["FAQ", "/faq"],
              ].map(([label, to]) => (
                <Link
                  key={to}
                  to={to}
                  className="w-fit font-mono text-sm text-foreground/80 transition hover:text-gold"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="mb-4 font-mono text-sm font-semibold tracking-wider text-muted-foreground uppercase">
              Contato
            </h4>
            <div className="space-y-3 font-mono text-sm text-foreground/80">
              <p>Curitiba • PR</p>
              <p>contato@congressois.com.br</p>
              <p>(41) 99999-9999</p>
            </div>

            <div className="mt-6 flex gap-4">
              {[
                { label: "Instagram", href: "#" },
                { label: "YouTube", href: "#" },
                { label: "WhatsApp", href: "#" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="inline-flex items-center rounded-xl border border-border bg-card px-4 py-2 font-mono text-xs font-semibold text-foreground/80 transition hover:text-gold"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-border pt-8">
          <p className="text-center font-mono text-xs text-muted-foreground">
            © {new Date().getFullYear()} Identidade &amp; Santidade. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
