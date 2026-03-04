// src/pages/Home.tsx
import { ArrowRight, Calendar, ShoppingBag, Ticket, Users } from "lucide-react";
import { getEventoInfo, listEventos, toNumber, type Evento } from "@/services/event";
import { Link } from "react-router-dom";
import { env } from "process";

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-14 md:py-20">
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-2 text-sm md:text-base text-white/70 max-w-2xl">
              {subtitle}
            </p>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}

function Card({
  icon,
  title,
  desc,
  to,
  cta,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  to: string;
  cta: string;
}) {
  return (
    <Link
      to={to}
      className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/7 hover:border-white/20"
    >
      <div className="flex items-start gap-4">
        <div className="rounded-xl border border-white/10 bg-black/40 p-3 text-[#d4af37]">
          {icon}
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="mt-1 text-sm text-white/70">{desc}</p>
          <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#d4af37]">
            {cta}
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>

      {/* glow sutil */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition group-hover:opacity-100">
        <div className="absolute -inset-px rounded-2xl bg-linear-to-r from-[#d4af37]/15 via-transparent to-[#d4af37]/10" />
      </div>
    </Link>
  );
}


const eventos = await listEventos();

let evento_name = eventos.length ? eventos[0].nome_evento : "Evento";
let data = eventos.length ? eventos[0].dt_ini.split("-")[0] : "Evento";



export default function Home() {
  return (
    <div className="min-h-[calc(100vh-64px)]">
      
      {/* HERO */}
      <section className="relative overflow-hidden pt-16 md:pt-20">
        <div className="absolute inset-0">
          {/* grid tech sutil */}
          <div className="absolute inset-0 opacity-[0.18] bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-size-[56px_56px]" />
          {/* vinheta */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.18),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(0,0,0,0.8),rgba(0,0,0,1))]" />
        </div>

        <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 md:pb-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d4af37]" />
              Congresso {data} • Experiência imersiva
            </div>

            <h1 className="mt-5 text-4xl md:text-5xl font-semibold tracking-tight text-white">
              {evento_name}
              <span className="text-[#d4af37]"></span>
            </h1>

            <p className="mt-4 text-base md:text-lg text-white/70 leading-relaxed">
              Um encontro para fortalecer fé, propósito e vida prática — com mensagens,
              momentos de adoração e conteúdo aplicado. Visual elegante, direto ao ponto,
              e uma programação pensada para marcar sua caminhada.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Link
                to="/ingressos"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d4af37] px-5 py-3 text-sm font-semibold text-black hover:brightness-110 transition"
              >
                Comprar ingressos
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/programacao"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/7 transition"
              >
                Ver programação
                <Calendar className="h-4 w-4 text-white/80" />
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <div className="text-xs text-white/60">Formato</div>
                <div className="mt-1 text-sm font-semibold text-white">
                  Presencial + experiências
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <div className="text-xs text-white/60">Conteúdo</div>
                <div className="mt-1 text-sm font-semibold text-white">
                  Mensagens • Louvor • Comunhão
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <div className="text-xs text-white/60">Destaque</div>
                <div className="mt-1 text-sm font-semibold text-white">
                  Trilha clara: do “porquê” ao “como”
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* O QUE É */}
      <Section
        title="O que é o Congresso?"
        subtitle="Uma visão rápida do evento — sem enrolação."
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-white/70 leading-relaxed">
                O <span className="text-white font-semibold">{evento_name}</span>{" "}
              é um congresso com foco em transformação prática: entender quem você é em
              Deus, alinhar escolhas e viver com constância. Tudo com linguagem clara,
              estrutura bem definida e espaço para reflexão.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                <div className="text-sm font-semibold text-white">Ambiente</div>
                <div className="mt-1 text-sm text-white/70">
                  Acolhedor, intencional e organizado.
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                <div className="text-sm font-semibold text-white">Objetivo</div>
                <div className="mt-1 text-sm text-white/70">
                  Crescimento real e aplicável no dia a dia.
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
            <div className="text-sm font-semibold text-white">
              O que você vai encontrar
            </div>
            <ul className="mt-4 space-y-3 text-sm text-white/75">
              <li className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-[#d4af37]" />
                Mensagens com linha de raciocínio e aplicação prática.
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-[#d4af37]" />
                Momentos de adoração e comunhão.
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-[#d4af37]" />
                Programação organizada por dia e horários.
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-[#d4af37]" />
                Loja oficial com produtos do evento.
              </li>
            </ul>

            <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs text-white/60">Dica</div>
              <div className="mt-1 text-sm text-white/80">
                Se for a primeira vez, comece pela{" "}
                <Link to="/sobre" className="text-[#d4af37] hover:underline">
                  página Sobre
                </Link>{" "}
                e depois veja a{" "}
                <Link to="/programacao" className="text-[#d4af37] hover:underline">
                  Programação
                </Link>
                .
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ATALHOS / PRÓXIMOS PASSOS */}
      <Section
        title="Comece por aqui"
        subtitle="Atalhos rápidos para as partes mais importantes."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <Card
            icon={<Ticket className="h-5 w-5" />}
            title="Ingressos"
            desc="Escolha seu tipo de ingresso e finalize o checkout."
            to="/ingressos"
            cta="Ir para ingressos"
          />
          <Card
            icon={<Calendar className="h-5 w-5" />}
            title="Programação"
            desc="Veja os dias, horários e temas do congresso."
            to="/programacao"
            cta="Ver programação"
          />
          <Card
            icon={<Users className="h-5 w-5" />}
            title="Preletores"
            desc="Conheça quem vai ministrar e participar."
            to="/preletores"
            cta="Ver preletores"
          />
          <Card
            icon={<ShoppingBag className="h-5 w-5" />}
            title="Loja"
            desc="Produtos oficiais e itens do evento."
            to="/loja"
            cta="Abrir loja"
          />
          <Card
            icon={<ArrowRight className="h-5 w-5" />}
            title="Sobre"
            desc="Entenda a visão do congresso e o propósito."
            to="/sobre"
            cta="Ler sobre"
          />
        </div>
      </Section>

      {/* CTA FINAL */}
      <section className="py-14 md:py-20">
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className="rounded-3xl border border-white/10 bg-linear-to-b from-white/6 to-black/60 p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="text-sm text-white/70">
                  Pronto para garantir sua vaga?
                </div>
                <div className="mt-1 text-2xl md:text-3xl font-semibold text-white">
                  Faça sua inscrição hoje
                </div>
                <div className="mt-2 text-sm text-white/65 max-w-xl">
                  Em poucos cliques você escolhe o ingresso e já deixa tudo preparado.
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/ingressos"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d4af37] px-5 py-3 text-sm font-semibold text-black hover:brightness-110 transition"
                >
                  Comprar ingressos
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/faq"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/7 transition"
                >
                  Ver dúvidas (FAQ)
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}