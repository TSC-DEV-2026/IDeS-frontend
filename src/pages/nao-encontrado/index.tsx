import { Link } from "react-router-dom";
export default function NotFoundPage(){
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="font-sans text-3xl font-semibold">Página não encontrada</h1>
      <p className="mt-3 text-muted-foreground">O endereço acessado não existe.</p>
      <Link to="/" className="mt-8 inline-flex rounded-xl bg-gold px-5 py-3 font-mono text-sm font-semibold text-deep-blue transition hover:opacity-90">Voltar para início</Link>
    </div>
  );
}