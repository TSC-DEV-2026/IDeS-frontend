import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function HomePublicaPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Identidade e Santidade
        </h1>
        <p className="mt-3 text-muted-foreground">
          Faça login para acessar o site e as funcionalidades.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link to="/login">Entrar</Link>
          </Button>

          <Button asChild variant="outline">
            <Link to="/register">Criar conta</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}