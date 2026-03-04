import { Link } from "react-router-dom";
import { listEventos } from "@/services/event";

const eventos = await listEventos();

let evento_name = eventos.length ? eventos[0].nome_evento : "Evento";
let data = eventos.length ? eventos[0].dt_ini.split("-")[0] : "Evento";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background py-16 max-lg:mb-16">
      <div className="mx-auto max-w-7xl pr-2 pl-3 ">
        <div className="flex gap-12 justify-center">
          <div>
            <p className="font-sans text-2xl font-bold tracking-wide">
              {evento_name}
            </p>
            <p className="mt-4 font-mono text-sm leading-relaxed text-muted-foreground">
              Um congresso transformador para fortalecer sua identidade em Cristo e
              viver santidade com constância.
            </p>
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
