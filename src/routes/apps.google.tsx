import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Volume2,
  Square,
  X,
  Search,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Mic,
  Camera,
  Globe,
  Home,
  Newspaper,
  ChevronLeft,
  ChevronDown,
  MoreVertical,
  Lock,
  RotateCw,
  Star,
  Share2,
  User,
} from "lucide-react";
import { A11yToggle, useA11y } from "../lib/a11y";
import { useAudioTts } from "../lib/tts";

export const Route = createFileRoute("/apps/google")({
  component: GoogleSimulation,
  head: () => ({
    meta: [
      { title: "Pesquisa Google — Ajudante Tech" },
      {
        name: "description",
        content:
          "Aprenda a usar a Pesquisa Google com uma simulação prática passo a passo, comparando com uma enciclopédia.",
      },
    ],
  }),
});

type Stage = "intro" | "overview" | "sim-search" | "sim-results" | "sim-page" | "done";

const SUGGESTED_QUERY = "Como fazer chá de camomila";

function GoogleSimulation() {
  const [stage, setStage] = useState<Stage>("overview");
  const [speaking, setSpeaking] = useState(false);
  const [query, setQuery] = useState("");
  const [dialog, setDialog] = useState<null | { title: string; body: string }>(null);
  const { enabled: a11y } = useA11y();
  const navigate = useNavigate();

  const steps = [
    { n: 1, label: "Pesquisar" },
    { n: 2, label: "Escolher link" },
    { n: 3, label: "Ler resposta" },
  ];
  const currentStep =
    stage === "overview"
      ? 1
      : stage === "sim-search"
        ? 1
        : stage === "sim-results"
          ? 2
          : 3;
  const isDone = stage === "done";

  const Stepper = (
    <div className="w-full max-w-md mx-auto px-5 py-3">
      <div className="flex items-center justify-between mb-1.5">
        <p className={`font-extrabold ${a11y ? "text-sm" : "text-xs"}`}>
          {isDone ? "Simulação concluída! 🎉" : `Etapa ${currentStep} de ${steps.length}`}
        </p>
        <p className={`text-muted-foreground font-medium ${a11y ? "text-sm" : "text-xs"}`}>
          {isDone ? "100%" : `${Math.round((currentStep / steps.length) * 100)}%`}
        </p>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={steps.length}
        aria-valuenow={isDone ? steps.length : currentStep}
        aria-label="Progresso da simulação"
        className="h-2 w-full rounded-full bg-muted overflow-hidden"
      >
        <div
          className="h-full bg-info transition-all duration-500"
          style={{ width: `${((isDone ? steps.length : currentStep) / steps.length) * 100}%` }}
        />
      </div>
    </div>
  );

  // Auto-advance from intro splash to the simulation
  useEffect(() => {
    if (stage !== "intro") return;
    const t = setTimeout(() => setStage("sim-search"), 1800);
    return () => clearTimeout(t);
  }, [stage]);

  const { speak, stopSpeaking } = useAudioTts({ setSpeaking });

  const screenText = useMemo(() => {
    switch (stage) {
      case "overview":
        return "Pesquisa Google. É como uma enciclopédia gigante que ajuda a encontrar respostas. Toque em iniciar simulação prática para começar.";
      case "sim-search":
        return "Passo 1. Toque na barra de pesquisa para ver onde digitar. Nesta simulação, a pergunta do tutorial já aparece pronta. Depois, toque em pesquisar.";
      case "sim-results":
        return "Passo 2. Estes são os resultados. Toque em um link azul para abrir e ler a resposta.";
      case "sim-page":
        return "Passo 3. Você abriu um site com a resposta. Quando terminar, toque em concluir.";
      case "done":
        return "Parabéns! Você aprendeu onde tocar para pesquisar no Google e como abrir uma resposta com calma.";
      default:
        return "Pesquisa Google";
    }
  }, [stage]);

  const screenAudioFile = useMemo(() => {
    switch (stage) {
      case "overview":
        return "google-overview.mp3";
      case "sim-search":
        return "google-passo-pesquisar.mp3";
      case "sim-results":
        return "google-passo-resultados.mp3";
      case "sim-page":
        return "google-passo-site.mp3";
      case "done":
        return "google-concluido.mp3";
      default:
        return "google-overview.mp3";
    }
  }, [stage]);

  const handleSpeak = () =>
    speaking ? stopSpeaking() : speak({ file: screenAudioFile, text: screenText });

  // ----- Intro splash -----
  if (stage === "intro") {
    return (
      <main className="min-h-screen bg-info flex flex-col items-center justify-center text-info-foreground">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="size-24 rounded-full bg-info-foreground text-info flex items-center justify-center shadow-2xl">
            <Search className="size-12" strokeWidth={2.8} />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Google</h1>
        </div>
      </main>
    );
  }

  // ----- Header bar (shared) -----
  const headerBar = (
    <header className="bg-info text-info-foreground px-5 pt-5 pb-6">
      <div className="w-full max-w-md mx-auto flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <Link
            to="/apps"
            aria-label="Voltar para aplicativos"
            className="inline-flex items-center gap-2 h-11 px-3 rounded-2xl text-base font-bold hover:bg-info-foreground/10 transition"
          >
            <ArrowLeft className="size-5" />
            Voltar
          </Link>
          <div className="flex items-center gap-2">
            <A11yToggle />
            <button
              type="button"
              onClick={handleSpeak}
              aria-label={speaking ? "Parar leitura" : "Ouvir"}
              className="inline-flex items-center gap-2 h-11 px-3 rounded-full bg-info-foreground text-info text-base font-bold hover:opacity-90 transition"
            >
              {speaking ? <Square className="size-5" /> : <Volume2 className="size-5" />}
              {speaking ? "Parar" : "Ouvir"}
            </button>
          </div>
        </div>
        <h1
          className={`font-extrabold text-center tracking-tight ${
            a11y ? "text-5xl" : "text-4xl"
          }`}
        >
          Pesquisa Google
        </h1>
      </div>
    </header>
  );

  // ----- Overview screen -----
  if (stage === "overview") {
    return (
      <main className="min-h-screen bg-muted/40 flex flex-col">
        {headerBar}
        <div className="w-full max-w-md mx-auto flex-1 flex flex-col gap-6 px-5 py-6">
          <section
            className={`rounded-2xl bg-card p-5 border-l-8 border-l-info shadow-md ${
              a11y ? "border-2 border-foreground" : "border border-border"
            }`}
          >
            <h2 className={`font-extrabold text-info ${a11y ? "text-2xl" : "text-xl"}`}>
              O que é parecido?
            </h2>
            <div
              className={`mt-3 inline-flex items-center gap-2 rounded-full bg-info/10 text-info px-3 py-1.5 font-extrabold ${
                a11y ? "text-lg" : "text-base"
              }`}
            >
              <BookOpen className="size-5" />
              Enciclopédia
            </div>
            <p
              className={`mt-3 leading-snug ${
                a11y ? "text-xl text-foreground" : "text-lg text-muted-foreground"
              }`}
            >
              O Google é como ter uma <strong className="text-info">enciclopédia gigante</strong>{" "}
              no celular. Você pergunta, ele responde.
            </p>
          </section>

          <section
            className={`rounded-2xl bg-card p-5 ${
              a11y ? "border-2 border-foreground" : "border border-border"
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <h2 className={`font-extrabold ${a11y ? "text-2xl" : "text-xl"}`}>Passo a Passo</h2>
              <p className={`text-muted-foreground font-bold ${a11y ? "text-base" : "text-xs"}`}>
                Etapa {currentStep} de {steps.length}
              </p>
            </div>
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={steps.length}
              aria-valuenow={currentStep}
              aria-label="Progresso da simulação"
              className="h-2.5 w-full rounded-full bg-muted overflow-hidden mb-4"
            >
              <div
                className="h-full bg-info transition-all duration-500"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
            </div>
            <ol className="flex flex-col gap-3">
              {[
                {
                  n: 1,
                  t: "Toque na barra de pesquisa",
                  d: "Ela é o lugar onde a pergunta aparece. Nesta simulação, vamos usar uma pergunta pronta.",
                },
                {
                  n: 2,
                  t: "Escolha um Resultado",
                  d: "O Google mostra vários sites. Toque em um link azul para abrir.",
                },
                {
                  n: 3,
                  t: "Leia a Resposta",
                  d: "O site abre com o conteúdo. Leia com calma e volte quando quiser.",
                },
              ].map((s) => {
                const done = s.n < currentStep;
                const active = s.n === currentStep;
                return (
                  <li
                    key={s.n}
                    className={`rounded-2xl p-4 transition ${
                      active
                        ? "bg-info/5 border-2 border-info"
                        : done
                          ? "bg-success/5 border border-success/40"
                          : a11y
                            ? "bg-card border-2 border-foreground"
                            : "bg-card border border-border"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`size-8 rounded-full inline-flex items-center justify-center font-extrabold ${
                          done
                            ? "bg-success text-white"
                            : active
                              ? "bg-info text-info-foreground ring-4 ring-info/25"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {done ? <CheckCircle2 className="size-4" /> : s.n}
                      </span>
                      <h3 className={`font-extrabold ${a11y ? "text-xl" : "text-lg"}`}>{s.t}</h3>
                    </div>
                    <p
                      className={`mt-2 leading-snug ${
                        a11y ? "text-lg text-foreground" : "text-base text-muted-foreground"
                      }`}
                    >
                      {s.d}
                    </p>
                  </li>
                );
              })}
            </ol>
          </section>

          <button
            type="button"
            onClick={() => setStage("intro")}
            className="inline-flex items-center justify-center gap-2 w-full h-16 rounded-2xl bg-info text-info-foreground text-xl font-extrabold shadow-lg shadow-info/30 hover:bg-info/90 active:scale-[0.99] transition"
          >
            <Search className="size-6" />
            Iniciar Simulação Prática
          </button>
        </div>
      </main>
    );
  }

  // ----- Done screen -----
  if (stage === "done") {
    return (
      <main className="min-h-screen bg-background flex flex-col">
        {headerBar}
        {Stepper}
        <div className="w-full max-w-md mx-auto flex-1 flex flex-col items-center justify-center gap-6 px-5 py-10 text-center">
          <div className="size-24 rounded-full bg-success/15 text-success flex items-center justify-center">
            <CheckCircle2 className="size-14" strokeWidth={2.4} />
          </div>
          <h2 className={`font-extrabold ${a11y ? "text-3xl" : "text-2xl"}`}>
            Muito bem! Você conseguiu!
          </h2>
          <p className={`leading-snug ${a11y ? "text-xl" : "text-lg text-muted-foreground"}`}>
            Você aprendeu onde tocar para pesquisar no Google e como abrir uma resposta, igual
            folhear uma enciclopédia.
          </p>
          <div className="flex flex-col gap-3 w-full">
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setStage("overview");
              }}
              className="h-14 rounded-2xl border-2 border-border bg-card text-foreground text-lg font-bold hover:bg-muted transition"
            >
              Repetir simulação
            </button>
            <button
              type="button"
              onClick={() => navigate({ to: "/apps" })}
              className="h-14 rounded-2xl bg-info text-info-foreground text-lg font-extrabold hover:bg-info/90 transition"
            >
              Ver outros aplicativos
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ----- Simulation screens -----
  const tip =
    stage === "sim-search"
      ? "Toque na barra de pesquisa. A pergunta do tutorial vai aparecer pronta."
      : stage === "sim-results"
        ? "Toque em um link azul para abrir o site com a resposta."
        : "Pronto! Esta é a resposta. Toque em concluir quando terminar.";

  return (
    <main
      className={`bg-[#f4f5f4] flex flex-col ${
        stage === "sim-page" ? "h-screen overflow-hidden" : "min-h-screen"
      }`}
    >
      {/* Instruction bar */}
      <div className="sticky top-0 z-30 shrink-0 shadow-md">
        <div className="bg-info text-white">
          <div className="w-full max-w-md mx-auto px-4 py-2.5 flex items-center gap-2">
            <p className={`flex-1 leading-snug font-semibold min-w-0 ${a11y ? "text-base" : "text-sm"}`}>
              {tip}
            </p>
            <Link
              to="/apps"
              aria-label="Sair da simulação"
              className="shrink-0 inline-flex items-center gap-1 h-8 px-3 rounded-full bg-white/20 hover:bg-white/30 text-sm font-bold transition"
            >
              <X className="size-4" /> Sair
            </Link>
          </div>
        </div>
        <div className="bg-white border-b border-[#dfe4e0]">
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={steps.length}
            aria-valuenow={currentStep}
            aria-label="Progresso da simulação"
            className="w-full max-w-md mx-auto px-4 py-2.5 flex items-center gap-3"
          >
            {steps.map((s, i) => {
              const done = s.n < currentStep;
              const active = s.n === currentStep;
              return (
                <div key={s.n} className="flex items-center gap-3 flex-1 last:flex-none">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`size-6 rounded-full inline-flex items-center justify-center text-xs font-extrabold transition ${
                      done ? "bg-success text-white" : active ? "bg-info text-white" : "bg-muted text-muted-foreground"
                    }`}>
                      {done ? <CheckCircle2 className="size-3.5" /> : s.n}
                    </span>
                    <span className={`text-xs font-bold leading-none ${active ? "text-foreground" : "text-muted-foreground"}`}>
                      {s.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-success transition-all duration-500" style={{ width: done ? "100%" : "0%" }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="w-full max-w-md mx-auto flex-1 flex flex-col min-h-0">
        {stage === "sim-search" ? (
          <SimSearch
            query={query}
            setQuery={setQuery}
            onSearch={() => {
              setQuery(SUGGESTED_QUERY);
              setStage("sim-results");
            }}
            suggested={SUGGESTED_QUERY}
          />
        ) : stage === "sim-results" ? (
          <SimResults
            query={query || SUGGESTED_QUERY}
            onPickResult={() => setStage("sim-page")}
            onExplain={(d) => setDialog(d)}
          />
        ) : (
          <SimPage
            query={query || SUGGESTED_QUERY}
            onBack={() => setStage("sim-results")}
            onFinish={() => setStage("done")}
          />
        )}
      </div>

      {/* Explanation dialog */}
      {dialog && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="exp-title"
          className="fixed inset-0 bg-foreground/60 flex items-end sm:items-center justify-center z-30 px-4 pb-6 pt-20"
          onClick={() => setDialog(null)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-card border-2 border-border shadow-2xl p-6 flex flex-col gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 text-info">
              <Sparkles className="size-6" />
              <h3 id="exp-title" className={`font-extrabold ${a11y ? "text-2xl" : "text-xl"}`}>
                {dialog.title}
              </h3>
            </div>
            <p className={`leading-snug ${a11y ? "text-lg" : "text-base text-muted-foreground"}`}>
              {dialog.body}
            </p>
            <button
              type="button"
              onClick={() => setDialog(null)}
              className="mt-2 h-12 rounded-full bg-info text-info-foreground text-base font-extrabold hover:bg-info/90 transition"
            >
              OK, entendi
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

/* ---------- Simulated Google Home (search) ---------- */
function GoogleLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`font-extrabold tracking-tight ${className}`} aria-label="Google">
      <span className="text-info">G</span>
      <span className="text-destructive">o</span>
      <span className="text-warning" style={{ color: "oklch(0.78 0.16 75)" }}>
        o
      </span>
      <span className="text-info">g</span>
      <span className="text-success">l</span>
      <span className="text-destructive">e</span>
    </span>
  );
}

function SimSearch({
  setQuery,
  onSearch,
  suggested,
}: {
  query: string;
  setQuery: (v: string) => void;
  onSearch: () => void;
  suggested: string;
}) {
  const runTutorialSearch = () => {
    setQuery(suggested);
    onSearch();
  };
  const shortcuts = [
    { label: "Receitas", icon: BookOpen, tone: "text-success" },
    { label: "Saúde", icon: Sparkles, tone: "text-info" },
    { label: "Farmácia", icon: Star, tone: "text-warning" },
    { label: "Músicas", icon: Newspaper, tone: "text-destructive" },
  ];
  const news = [
    {
      title: "Chá de camomila: como preparar uma bebida tranquila para a noite",
      source: "Receitas da Dona Rosa",
      age: "Hoje",
      kind: "tea",
    },
    {
      title: "Alongamentos simples para fazer sentada com segurança",
      source: "Bem-estar Diário",
      age: "Ontem",
      kind: "stretch",
    },
  ];

  return (
    <div className="flex flex-col bg-[#f4f5f4] flex-1 px-4 pt-5 pb-5 overflow-y-auto">
      {/* Google app top bar */}
      <div className="flex items-center justify-between text-[#343a38]">
        <Home className="size-7" strokeWidth={2.6} />
        <div className="flex items-center gap-5">
          <span className="size-9 rounded-full bg-[#607d6b] text-white flex items-center justify-center text-lg font-bold">
            A
          </span>
          <span className="size-7 rounded-lg border-2 border-[#343a38] flex items-center justify-center text-base font-extrabold">
            9
          </span>
          <MoreVertical className="size-7" strokeWidth={2.6} />
        </div>
      </div>

      {/* Logo */}
      <div className="mt-8 flex justify-center">
        <GoogleLogo className="text-5xl" />
      </div>

      {/* Search bar */}
      <div className="mt-7">
        <label htmlFor="g-search" className="sr-only">
          Pesquisar no Google
        </label>
        <div className="relative">
          <span
            aria-hidden="true"
            className="absolute left-5 top-1/2 -translate-y-1/2 font-extrabold text-3xl"
          >
            <span className="text-info">G</span>
          </span>
          <input
            id="g-search"
            type="text"
            value=""
            readOnly
            onClick={runTutorialSearch}
            onFocus={() => undefined}
            placeholder="Pesquise no Google..."
            className="w-full h-16 pl-16 pr-24 rounded-full bg-[#e4e8e5] text-[#343a38] placeholder:text-[#69716d] text-lg focus:outline-none animate-pulse-ring cursor-text shadow-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                runTutorialSearch();
              }
            }}
          />
          <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-4 text-[#343a38]">
            <Mic className="size-7" strokeWidth={2.4} />
            <Camera className="size-7" strokeWidth={2.4} />
          </div>
        </div>
      </div>

      {/* Mode chips */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={runTutorialSearch}
          className="h-12 rounded-full bg-[#e4e8e5] text-[#343a38] flex items-center justify-center gap-2 text-base font-bold"
        >
          <Sparkles className="size-5" />
          Modo IA
        </button>
        <button
          type="button"
          onClick={runTutorialSearch}
          className="h-12 rounded-full bg-[#e4e8e5] text-[#343a38] flex items-center justify-center gap-2 text-base font-bold"
        >
          <Lock className="size-5" />
          Modo anônimo
        </button>
      </div>

      {/* Guided shortcuts */}
      <section className="mt-6 rounded-3xl bg-white px-4 py-4 overflow-hidden border border-[#dfe4e0]">
        <div className="flex justify-between gap-5 overflow-x-auto pb-1">
          {shortcuts.map(({ label, icon: Icon, tone }) => (
            <button
              type="button"
              key={label}
              onClick={runTutorialSearch}
              className="shrink-0 flex flex-col items-center gap-2 min-w-14"
            >
              <span className="size-12 rounded-full bg-[#f4f5f4] flex items-center justify-center">
                <Icon className={`size-6 ${tone}`} />
              </span>
              <span className="text-xs text-[#4c5550] font-semibold">{label}</span>
            </button>
          ))}
        </div>
      </section>

      <p className="mt-3 text-xs text-[#69716d] text-center">
        Toque na barra para aparecer{" "}
        <button
          type="button"
          onClick={runTutorialSearch}
          className="font-extrabold text-info underline underline-offset-2"
        >
          "{suggested}"
        </button>
        .
      </p>

      {/* Discover feed */}
      <div className="mt-6 flex flex-col gap-3">
        {news.map((item) => (
          <article
            key={item.title}
            className="rounded-3xl bg-white overflow-hidden shadow-sm border border-[#dfe4e0]"
          >
            <div className="p-4">
              <div className="grid grid-cols-[1fr_88px] gap-3 items-start">
                <h3 className="text-xl leading-snug font-normal text-[#343a38]">{item.title}</h3>
                <div
                  aria-hidden="true"
                  className={`h-20 rounded-2xl border border-[#dfe4e0] flex items-center justify-center ${
                    item.kind === "tea"
                      ? "bg-gradient-to-br from-[#f4ead6] to-[#dce9df]"
                      : "bg-gradient-to-br from-[#e3ebef] to-[#e7e2da]"
                  }`}
                >
                  {item.kind === "tea" ? (
                    <BookOpen className="size-8 text-success" />
                  ) : (
                    <Sparkles className="size-8 text-info" />
                  )}
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-[#69716d]">
                <span className="size-6 rounded-full bg-[#607d6b] text-white text-xs font-bold flex items-center justify-center">
                  {item.source.charAt(0)}
                </span>
                <span className="text-sm font-medium">{item.source}</span>
                <span className="text-sm">· {item.age}</span>
                <div className="ml-auto flex items-center gap-4 text-[#343a38]">
                  <Share2 className="size-5" />
                  <MoreVertical className="size-5" />
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="h-4" />
    </div>
  );
}

/* ---------- Simulated Google Results ---------- */
function SimResults({
  query,
  onPickResult,
  onExplain,
}: {
  query: string;
  onPickResult: () => void;
  onExplain: (d: { title: string; body: string }) => void;
}) {
  const results = [
    {
      site: "receitasdadonarosa.com.br",
      name: "Receitas da Dona Rosa",
      title: "Chá de camomila: veja como fazer do jeito certo",
      desc:
        "Para preparar o chá, ferva 1 xícara de água, desligue o fogo e coloque as flores de camomila. Tampe por alguns minutos, coe e beba morno.",
      date: "23 de mai. de 2024",
    },
    {
      site: "bemestardiario.com.br",
      name: "Bem-estar Diário",
      title: "Chá de camomila: para que serve e como preparar",
      desc:
        "Veja uma forma simples de fazer chá de camomila e alguns cuidados importantes para tomar a bebida com tranquilidade.",
      date: "13 de jan. de 2025",
    },
    {
      site: "saude.gov.br",
      name: "Saúde Brasil",
      title: "Plantas medicinais: orientações para usar com segurança",
      desc:
        "Informações gerais sobre plantas medicinais, preparo correto e quando procurar orientação de um profissional de saúde.",
      date: "Atualizado recentemente",
    },
  ];
  const questions = [
    "Como preparar corretamente o chá de camomila?",
    "Pode ferver a camomila junto com a água?",
    "Qual é o melhor horário para tomar chá de camomila?",
    "Chá de camomila ajuda a relaxar?",
  ];

  return (
    <div className="flex flex-col bg-[#f4f5f4] flex-1 overflow-y-auto">
      {/* Browser-like top bar */}
      <div className="sticky top-0 z-10 bg-[#f4f5f4] border-b border-[#dfe4e0]">
        <div className="px-4 pt-4 pb-3 flex items-center gap-3">
          <Home className="size-6 shrink-0 text-[#343a38]" strokeWidth={2.6} />
          <div className="flex-1 h-10 rounded-full bg-[#e4e8e5] px-3 flex items-center gap-2 text-[#4d5551] min-w-0">
            <span className="text-base leading-none">⌘</span>
            <span className="text-sm truncate">google.com/search?q=Como+fazer+chá</span>
          </div>
          <span className="size-7 rounded-lg border-2 border-[#343a38] flex items-center justify-center text-sm font-extrabold text-[#343a38]">
            9
          </span>
          <MoreVertical className="size-6 shrink-0 text-[#343a38]" strokeWidth={2.6} />
        </div>

        <div className="px-4 pb-3">
          <div className="flex items-center justify-between px-1">
            <Sparkles className="size-6 text-[#56635d]" />
            <GoogleLogo className="text-3xl" />
            <span className="size-9 rounded-full bg-[#607d6b] text-white flex items-center justify-center text-lg font-bold ring-4 ring-[#d8e2dc]">
              A
            </span>
          </div>

          <div className="mt-3 h-12 rounded-full bg-white shadow-md px-4 flex items-center gap-3">
            <Search className="size-5 text-[#69716d]" />
            <span className="flex-1 text-base text-[#1f2422] truncate">{query}</span>
            <X className="size-5 text-[#343a38]" />
            <span className="h-7 w-px bg-[#dfe4e0]" />
            <Mic className="size-5 text-[#343a38]" />
          </div>
        </div>
      </div>

      <div className="bg-white pt-3">
        <button
          type="button"
          onClick={onPickResult}
          className="mx-3 mb-3 block w-[calc(100%-1.5rem)] rounded-2xl text-left px-3 py-4 bg-white border border-[#dfe4e0] animate-pulse-ring"
        >
          <div className="flex items-start gap-3">
            <span className="size-10 rounded-full bg-[#f4f5f4] border border-[#dfe4e0] flex items-center justify-center text-success">
              <BookOpen className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-base text-[#1f2422]">{results[0].name}</p>
                  <p className="text-sm text-[#5f6763] truncate">https://www.{results[0].site}</p>
                </div>
                <MoreVertical className="size-5 text-[#69716d] shrink-0" />
              </div>
              <h3 className="mt-3 text-xl leading-tight font-normal text-[#1558c8]">
                {results[0].title}
              </h3>
              <p className="mt-2 text-sm leading-snug text-[#5f6763]">
                <span>{results[0].date} - </span>
                {results[0].desc}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 bg-yellow-500 text-black text-sm font-extrabold px-2 py-1 rounded-full shadow animate-bounce">
                Toque aqui
              </span>
            </div>
          </div>
        </button>

        <div className="h-3 bg-[#eef0f1]" />

        <section className="px-4 py-5 bg-white">
          <h3 className="text-2xl leading-tight font-semibold text-[#1f2422]">
            As pessoas também perguntam
          </h3>
          <div className="mt-4 border-t border-[#d7dcda]">
            {questions.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() =>
                  onExplain({
                    title: "Pergunta relacionada",
                    body:
                      "No Google real, tocar aqui abre uma resposta curta. Nesta simulação, vamos continuar usando o primeiro link destacado.",
                  })
                }
                className="w-full py-3.5 border-b border-[#d7dcda] flex items-center gap-3 text-left"
              >
                <span className="flex-1 text-lg leading-snug text-[#1f2422]">{question}</span>
                <span className="size-9 rounded-full bg-[#f1f3f2] flex items-center justify-center text-[#69716d] shrink-0">
                  <ChevronDown className="size-5" />
                </span>
              </button>
            ))}
          </div>
        </section>

        <div className="h-3 bg-[#eef0f1]" />

        {results.slice(1).map((r) => (
          <button
            key={r.site}
            type="button"
            onClick={() =>
              onExplain({
                title: "Outro resultado",
                body:
                  "Você pode tocar em outros links azuis no Google. Para esta simulação, vamos usar o primeiro resultado, que está destacado.",
              })
            }
            className="w-full text-left px-4 py-5 bg-white border-b border-[#dfe4e0]"
          >
            <div className="flex items-start gap-3">
              <span className="size-10 rounded-full bg-[#607d6b] text-white flex items-center justify-center font-extrabold">
                {r.name.charAt(0)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-base text-[#1f2422]">{r.name}</p>
                    <p className="text-sm text-[#5f6763] truncate">https://{r.site}</p>
                  </div>
                  <MoreVertical className="size-5 text-[#69716d] shrink-0" />
                </div>
                <h3 className="mt-3 text-xl leading-tight font-normal text-[#1558c8]">
                  {r.title}
                </h3>
                <p className="mt-2 text-sm leading-snug text-[#5f6763]">
                  <span>{r.date} - </span>
                  {r.desc}
                </p>
              </div>
            </div>
          </button>
        ))}

        <section className="px-4 py-5 bg-white">
          <h3 className="text-2xl leading-tight font-semibold text-[#1f2422]">
            Outras pessoas pesquisaram
          </h3>
          <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
            {["chá de camomila para dormir", "como preparar chá", "benefícios da camomila"].map(
              (q) => (
                <span
                  key={q}
                  className="shrink-0 px-3 py-2 rounded-full border border-[#d7dcda] text-[#1558c8] text-sm font-semibold"
                >
                  {q}
                </span>
              ),
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

/* ---------- Simulated opened page ---------- */
function SimPage({
  query,
  onBack,
  onFinish,
}: {
  query: string;
  onBack: () => void;
  onFinish: () => void;
}) {
  return (
    <div className="flex flex-col bg-white flex-1 overflow-y-auto">
      <div className="sticky top-0 z-20">
        {/* Browser bar */}
        <div className="px-4 py-3 bg-[#f26a21] flex items-center gap-3 text-[#25211f]">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center justify-center size-8 rounded-md hover:bg-white/15 transition"
            aria-label="Voltar para os resultados"
          >
            <Home className="size-6" strokeWidth={2.6} />
          </button>
          <div className="flex-1 h-10 px-3 rounded-full bg-white/25 flex items-center gap-2 min-w-0 text-[#4a352d]">
            <Lock className="size-4 shrink-0" />
            <span className="truncate text-sm">receitasdadonarosa.com.br</span>
          </div>
          <span className="size-8 rounded-lg border-2 border-[#25211f] flex items-center justify-center text-sm font-extrabold">
            9
          </span>
          <MoreVertical className="size-6 shrink-0" strokeWidth={2.6} />
        </div>

        {/* Site header */}
        <div className="h-20 px-4 bg-white shadow-md flex items-center justify-between">
          <button
            type="button"
            className="size-10 flex flex-col justify-center gap-1.5"
            aria-label="Menu do site"
          >
            <span className="h-1 w-8 rounded-full bg-[#343a38]" />
            <span className="h-1 w-8 rounded-full bg-[#343a38]" />
            <span className="h-1 w-8 rounded-full bg-[#343a38]" />
          </button>
          <div className="flex items-center gap-3">
            <span className="size-11 rounded-full bg-white shadow-md flex items-center justify-center text-[#f26a21]">
              <Search className="size-6" />
            </span>
            <span className="text-2xl font-extrabold tracking-tight text-[#f26a21]">
              RECEITAS DA ROSA
            </span>
          </div>
          <span className="size-11 rounded-full bg-white shadow-md flex items-center justify-center text-[#f26a21]">
            <User className="size-6" />
          </span>
        </div>
      </div>

      {/* Page content */}
      <article className="bg-white flex-1">
        <div className="px-5 pt-6 pb-4">
          <p className="text-xs text-muted-foreground font-bold">
            Receitas &gt; Chás e bebidas
          </p>
          <h2 className="mt-8 text-center text-3xl font-extrabold leading-tight text-[#3a3a3a]">
            Chá de camomila: veja como fazer do jeito certo e aproveitar seus benefícios
          </h2>
          <p className="mt-8 text-center text-base text-[#4d5551]">
            Atualizado em 23/05/2024 às 15:57
          </p>
          <button
            type="button"
            className="mx-auto mt-4 flex items-center gap-2 text-[#4d5551] text-base"
          >
            <Share2 className="size-5" />
            Compartilhar
          </button>

          <div className="mt-6 rounded-lg bg-white shadow-lg border border-[#eef0f1] p-4">
            <div className="flex items-center gap-3">
              <span className="size-14 rounded-full bg-[#d8e2dc] flex items-center justify-center text-[#607d6b] font-extrabold">
                DR
              </span>
              <p className="text-base text-[#3a3a3a]">
                Por <span className="underline">Dona Rosa</span>
              </p>
            </div>
            <p className="mt-3 text-base leading-relaxed text-[#4d5551]">
              Uma explicação simples para preparar o chá com calma e segurança.
            </p>
          </div>
        </div>

        <section className="px-5 py-5">
          <p className="text-2xl leading-snug font-extrabold text-[#3a3a3a]">
            O chá de camomila é conhecido por ajudar no bem-estar, mas o preparo
            correto deixa a bebida mais agradável.
          </p>

          <div className="mt-6 aspect-[4/3] rounded-sm bg-gradient-to-br from-[#f4ead6] to-[#dce9df] border border-[#dfe4e0] flex items-center justify-center overflow-hidden">
            <div className="text-center">
              <BookOpen className="mx-auto size-16 text-[#607d6b]" />
              <p className="mt-2 text-sm font-bold text-[#607d6b]">Foto do chá de camomila</p>
            </div>
          </div>

          <p className="mt-6 text-xl leading-relaxed text-[#3a3a3a]">
            A camomila é uma planta delicada. Para preparar o chá, aqueça a água
            e desligue o fogo antes de colocar as flores. Assim, o sabor fica
            suave e a bebida pode ser tomada com mais tranquilidade.
          </p>

          <h3 className="mt-8 text-2xl font-extrabold text-[#3a3a3a]">
            Como preparar o chá de camomila
          </h3>
          <p className="mt-4 text-xl leading-relaxed text-[#3a3a3a]">
            Coloque uma xícara de água para aquecer. Quando começar a ferver,
            desligue o fogo. Acrescente uma colher de chá de flores de camomila,
            tampe a xícara e espere de 5 a 10 minutos. Depois, coe e beba morno.
          </p>

          <h3 className="mt-8 text-2xl font-extrabold text-[#3a3a3a]">
            Benefícios do chá de camomila
          </h3>
          <p className="mt-4 text-xl leading-relaxed text-[#3a3a3a]">
            O chá de camomila pode ajudar a relaxar e trazer uma sensação de
            conforto. Se você usa remédios ou tem alguma dúvida de saúde, converse
            com a equipe do lar antes de tomar com frequência.
          </p>

          <div className="mt-8 rounded-2xl bg-info/5 border-2 border-info p-4">
            <p className="text-sm font-bold text-info">
              Você pesquisou: <span className="font-extrabold">"{query}"</span>
            </p>
            <p className="mt-1 text-sm text-muted-foreground leading-snug">
              Encontrou a resposta no site. Quando terminar de ler, toque no botão abaixo.
            </p>
          </div>
        </section>
      </article>

      {/* Finish bar */}
      <div className="mt-auto p-4 border-t border-[#dfe4e0] bg-[#f4f5f4] sticky bottom-0">
        <button
          type="button"
          onClick={onFinish}
          className="w-full h-14 rounded-2xl bg-success text-white text-lg font-extrabold hover:opacity-90 transition"
        >
          Concluir simulação
        </button>
      </div>
    </div>
  );
}
