import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/axiosInstance";

function onlyDigits(s: string) {
  return (s || "").replace(/\D+/g, "");
}

function normalizeEmail(s: string) {
  return (s || "").trim().toLowerCase();
}

function isValidEmail(email: string) {
  const e = normalizeEmail(email);
  if (e.length < 6 || e.length > 254) return false;
  if (/\s/.test(e)) return false;
  const re =
    /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;
  return re.test(e);
}

function isValidCPF(cpfRaw: string) {
  const cpf = onlyDigits(cpfRaw);
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(cpf[i]) * (10 - i);
  let dv1 = (sum * 10) % 11;
  if (dv1 === 10) dv1 = 0;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += Number(cpf[i]) * (11 - i);
  let dv2 = (sum * 10) % 11;
  if (dv2 === 10) dv2 = 0;

  return dv1 === Number(cpf[9]) && dv2 === Number(cpf[10]);
}

function isValidBirthDateISO(dateISO: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateISO)) return false;

  const d = new Date(dateISO + "T00:00:00");
  if (Number.isNaN(d.getTime())) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (d > today) return false;

  const oldest = new Date();
  oldest.setFullYear(oldest.getFullYear() - 120);
  oldest.setHours(0, 0, 0, 0);
  if (d < oldest) return false;

  return true;
}

function isStrongEnoughPassword(pw: string) {
  const p = (pw || "").trim();
  if (p.length < 6) return false;
  return true;
}

type TouchedState = {
  nome: boolean;
  cpf: boolean;
  dataNascimento: boolean;
  email: boolean;
  senha: boolean;
};

export default function RegisterPage() {
  const nav = useNavigate();

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState("2008-01-15");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const [touched, setTouched] = useState<TouchedState>({
    nome: false,
    cpf: false,
    dataNascimento: false,
    email: false,
    senha: false,
  });

  const [submitted, setSubmitted] = useState(false);

  const nomeTrim = nome.trim();
  const cpfDigits = useMemo(() => onlyDigits(cpf), [cpf]);
  const emailNorm = useMemo(() => normalizeEmail(email), [email]);
  const senhaTrim = senha.trim();

  const fieldErrors = useMemo(() => {
    const errors: Record<string, string> = {};

    if (!nomeTrim) errors.nome = "Informe o nome.";
    else if (nomeTrim.length < 3) errors.nome = "Nome muito curto.";

    if (!cpfDigits) errors.cpf = "Informe o CPF.";
    else if (cpfDigits.length !== 11) errors.cpf = "CPF deve ter 11 dígitos.";
    else if (!isValidCPF(cpfDigits)) errors.cpf = "CPF inválido.";

    if (!dataNascimento) errors.dataNascimento = "Informe a data de nascimento.";
    else if (!isValidBirthDateISO(dataNascimento))
      errors.dataNascimento = "Data de nascimento inválida.";

    if (!emailNorm) errors.email = "Informe o e-mail.";
    else if (!isValidEmail(emailNorm)) errors.email = "E-mail inválido.";

    if (!senhaTrim) errors.senha = "Informe a senha.";
    else if (!isStrongEnoughPassword(senhaTrim))
      errors.senha = "Senha fraca (mínimo 6 caracteres).";

    return errors;
  }, [nomeTrim, cpfDigits, dataNascimento, emailNorm, senhaTrim]);

  const canSubmit = Object.keys(fieldErrors).length === 0 && !loading;

  function showError(field: keyof TouchedState) {
    return Boolean(fieldErrors[field]) && (touched[field] || submitted);
  }

  function markTouched(field: keyof TouchedState) {
    setTouched((t) => (t[field] ? t : { ...t, [field]: true }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setOk(null);

    setSubmitted(true);
    setTouched({
      nome: true,
      cpf: true,
      dataNascimento: true,
      email: true,
      senha: true,
    });

    const firstError = Object.values(fieldErrors)[0];
    if (firstError) return setErr(firstError);

    setLoading(true);
    try {
      await api.post("/user/register", {
        pessoa: {
          nome: nomeTrim,
          cpf: cpfDigits,
          data_nascimento: dataNascimento,
          adm: false,
        },
        usuario: {
          email: emailNorm,
          senha: senhaTrim,
        },
      });

      setOk("Cadastro realizado! Agora faça login.");
      setTimeout(() => nav("/login", { replace: true }), 600);
    } catch (e: any) {
      const msg =
        e?.response?.data?.detail ||
        e?.response?.data?.message ||
        "Falha no cadastro. Verifique os dados.";
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
            Criar conta
          </h1>

          {err ? (
            <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {err}
            </div>
          ) : null}

          {ok ? (
            <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {ok}
            </div>
          ) : null}

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm text-white/80">Nome</label>
                <input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  onBlur={() => markTouched("nome")}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none
                             focus:border-[#d4af37] focus:shadow-[0_0_10px_3px_rgba(212,175,55,0.7)]
                             transition-shadow duration-300 hover:cursor-pointer"
                  placeholder="joão da silva"
                  autoComplete="name"
                />
                {showError("nome") ? (
                  <p className="mt-2 text-xs text-red-200">
                    {fieldErrors.nome}
                  </p>
                ) : null}
              </div>

              <div>
                <label className="block text-sm text-white/80">CPF</label>
                <input
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  onBlur={() => markTouched("cpf")}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none
                             focus:border-[#d4af37] focus:shadow-[0_0_10px_3px_rgba(212,175,55,0.7)]
                             transition-shadow duration-300 hover:cursor-pointer"
                  placeholder="01735205028"
                  inputMode="numeric"
                />
                {showError("cpf") ? (
                  <p className="mt-2 text-xs text-red-200">{fieldErrors.cpf}</p>
                ) : null}
              </div>

              <div>
                <label className="block text-sm text-white/80">
                  Data de nascimento
                </label>
                <input
                  value={dataNascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
                  onBlur={() => markTouched("dataNascimento")}
                  type="date"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none
                             focus:border-[#d4af37] focus:shadow-[0_0_10px_3px_rgba(212,175,55,0.7)]
                             transition-shadow duration-300 hover:cursor-pointer"
                />
                {showError("dataNascimento") ? (
                  <p className="mt-2 text-xs text-red-200">
                    {fieldErrors.dataNascimento}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm text-white/80">E-mail</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => markTouched("email")}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none
                               focus:border-[#d4af37] focus:shadow-[0_0_10px_3px_rgba(212,175,55,0.7)]
                               transition-shadow duration-300 hover:cursor-pointer"
                  placeholder="joao@gmail.com"
                  autoComplete="email"
                  inputMode="email"
                />
                {showError("email") ? (
                  <p className="mt-2 text-xs text-red-200">
                    {fieldErrors.email}
                  </p>
                ) : null}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-white/80">Senha</label>
                <input
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  onBlur={() => markTouched("senha")}
                  type="password"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none
                               focus:border-[#d4af37] focus:shadow-[0_0_10px_3px_rgba(212,175,55,0.7)]
                               transition-shadow duration-300 hover:cursor-pointer"
                  placeholder="123456"
                  autoComplete="new-password"
                />
                {showError("senha") ? (
                  <p className="mt-2 text-xs text-red-200">
                    {fieldErrors.senha}
                  </p>
                ) : null}
              </div>
            </div>

            <button
              disabled={!canSubmit}
              className="w-full rounded-xl bg-[#d4af37] px-4 py-3 text-sm font-semibold text-black hover:bg-[#eaba1e] disabled:opacity-60 hover:cursor-pointer"
              title={!canSubmit ? "Corrija os campos para continuar" : undefined}
            >
              {loading ? "Criando..." : "Criar conta"}
            </button>

            <div className="text-center text-sm text-white/70">
              Já tem conta?{" "}
              <Link to="/login" className="text-[#d4af37] hover:underline">
                Entrar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}