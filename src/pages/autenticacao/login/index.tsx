import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/axiosInstance";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const nav = useNavigate();

  const [usuario, setUsuario] = useState(""); // cpf OU email
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false); // NOVO
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    const u = usuario.trim();
    const s = senha.trim();

    if (!u || !s) {
      setErr("Preencha usuário (CPF ou e-mail) e senha.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/user/login", {
        usuario: u,
        senha: s,
      });

      nav("/", { replace: true });
    } catch (e: any) {
      const msg =
        e?.response?.data?.detail ||
        e?.response?.data?.message ||
        "Falha no login. Verifique os dados.";
      setErr(String(msg));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-[0.18] bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-size-[56px_56px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.18),transparent_70%),radial-gradient(ellipse_at_bottom,rgba(0,0,0,0.8),rgba(0,0,0,1))]" />
      </div>

      <div className="relative z-10 flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-10">
        <div
          className="w-full max-w-md rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur
                     hover:shadow-[0px_0px_30px_3px_rgba(212,175,55,0.2)]
                     hover:-translate-y-1"
          style={{
            transitionProperty: "translate, box-shadow",
            transitionDuration: "1000ms, 300ms",
            transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          <h1 className="flex justify-center text-4xl font-bold text-white">
            Entrar
          </h1>

          {err ? (
            <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {err}
            </div>
          ) : null}

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm text-white/80">
                CPF ou e-mail
              </label>
              <input
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none
                           focus:border-[#d4af37] focus:shadow-[0_0_10px_3px_rgba(212,175,55,0.7)]
                           transition-shadow duration-300 hover:cursor-pointer"
                placeholder="01735205028 ou joao@gmail.com"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm text-white/80">Senha</label>

              {/* NOVO: wrapper + botão do olhinho */}
              <div className="relative">
                <input
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  type={showPassword ? "text" : "password"} // NOVO
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 pr-12 text-sm text-white outline-none
                             focus:border-[#d4af37] focus:shadow-[0_0_10px_3px_rgba(212,175,55,0.7)]
                             transition-shadow duration-300 hover:cursor-pointer"
                  placeholder="Sua senha"
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white
                             focus:outline-none hover:cursor-pointer"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff className="mt-2" size={20} /> : <Eye className="mt-2" size={20} />}
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full rounded-xl bg-[#d4af37] px-4 py-3 text-sm font-semibold text-black
                         hover:bg-[#eaba1e] disabled:opacity-60 hover:cursor-pointer"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>

            <div className="text-center text-sm text-white/70">
              Não tem conta?{" "}
              <Link to="/register" className="text-[#d4af37] hover:underline">
                Criar conta
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}