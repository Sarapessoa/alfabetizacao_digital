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
import { markSimulationCompleted } from "../lib/simulationProgress";
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
        <p
          className={`font-medium ${
            a11y ? "text-sm text-foreground" : "text-xs text-muted-foreground"
          }`}
        >
          {isDone ? "100%" : `${Math.round((currentStep / steps.length) * 100)}%`}
        </p>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={steps.length}
        aria-valuenow={isDone ? steps.length : currentStep}
        aria-label="Progresso da simulação"
        className={`h-2 w-full rounded-full overflow-hidden ${
          a11y ? "bg-background border border-foreground" : "bg-muted"
        }`}
      >
        <div
          className={`h-full transition-all duration-500 ${a11y ? "bg-foreground" : "bg-info"}`}
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

  useEffect(() => {
    if (stage === "done") markSimulationCompleted("google");
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
      <main
        className={`min-h-screen flex flex-col items-center justify-center ${
          a11y ? "bg-foreground text-background" : "bg-info text-info-foreground"
        }`}
      >
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div
            className={`size-24 rounded-full flex items-center justify-center shadow-2xl ${
              a11y
                ? "bg-background text-foreground border-4 border-background"
                : "bg-info-foreground text-info"
            }`}
          >
            <Search className="size-12" strokeWidth={2.8} />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Google</h1>
        </div>
      </main>
    );
  }

  // ----- Header bar (shared) -----
  const headerBar = (
    <header
      className={`${a11y ? "bg-foreground text-background" : "bg-info text-info-foreground"} px-5 pt-5 pb-6`}
    >
      <div className="w-full max-w-md mx-auto flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <Link
            to="/apps"
            aria-label="Voltar para aplicativos"
            className={`inline-flex items-center gap-2 px-3 rounded-2xl font-bold transition ${
              a11y
                ? "h-12 bg-background text-foreground border-2 border-background text-lg"
                : "h-11 text-base hover:bg-info-foreground/10"
            }`}
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
              className={`inline-flex items-center gap-2 px-3 rounded-full font-bold hover:opacity-90 transition ${
                a11y
                  ? "h-12 bg-background text-foreground border-2 border-background text-lg"
                  : "h-11 bg-info-foreground text-info text-base"
              }`}
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
      <main className={`min-h-screen flex flex-col ${a11y ? "bg-background" : "bg-muted/40"}`}>
        {headerBar}
        <div className="w-full max-w-md mx-auto flex-1 flex flex-col gap-6 px-5 py-6">
          <section
            className={`rounded-2xl bg-card p-5 shadow-md ${
              a11y ? "border-4 border-foreground" : "border border-border border-l-8 border-l-info"
            }`}
          >
            <h2 className={`font-extrabold ${a11y ? "text-2xl text-foreground" : "text-xl text-info"}`}>
              O que é parecido?
            </h2>
            <div
              className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-extrabold ${
                a11y ? "text-lg bg-foreground text-background" : "text-base bg-info/10 text-info"
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
              a11y ? "border-4 border-foreground" : "border border-border"
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <h2 className={`font-extrabold ${a11y ? "text-2xl" : "text-xl"}`}>Passo a Passo</h2>
              <p className={`font-bold ${a11y ? "text-base text-foreground" : "text-xs text-muted-foreground"}`}>
                Etapa {currentStep} de {steps.length}
              </p>
            </div>
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={steps.length}
              aria-valuenow={currentStep}
              aria-label="Progresso da simulação"
              className={`h-2.5 w-full rounded-full overflow-hidden mb-4 ${
                a11y ? "bg-background border border-foreground" : "bg-muted"
              }`}
            >
              <div
                className={`h-full transition-all duration-500 ${a11y ? "bg-foreground" : "bg-info"}`}
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
                      a11y
                        ? "bg-card border-4 border-foreground"
                        : active
                          ? "bg-info/5 border-2 border-info"
                          : done
                            ? "bg-success/5 border border-success/40"
                            : "bg-card border border-border"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`size-8 rounded-full inline-flex items-center justify-center font-extrabold ${
                          a11y
                            ? "bg-foreground text-background"
                            : done
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
            className={`inline-flex items-center justify-center gap-2 w-full h-16 rounded-2xl text-xl font-extrabold active:scale-[0.99] transition ${
              a11y
                ? "bg-foreground text-background border-4 border-foreground"
                : "bg-info text-info-foreground shadow-lg shadow-info/30 hover:bg-info/90"
            }`}
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
          <div
            className={`size-24 rounded-full flex items-center justify-center ${
              a11y
                ? "bg-background text-foreground border-4 border-foreground"
                : "bg-success/15 text-success"
            }`}
          >
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
              className={`h-14 rounded-2xl text-lg font-bold transition ${
                a11y
                  ? "border-4 border-foreground bg-background text-foreground"
                  : "border-2 border-border bg-card text-foreground hover:bg-muted"
              }`}
            >
              Repetir simulação
            </button>
            <button
              type="button"
              onClick={() => navigate({ to: "/apps" })}
              className={`h-14 rounded-2xl text-lg font-extrabold transition ${
                a11y
                  ? "bg-foreground text-background border-4 border-foreground"
                  : "bg-info text-info-foreground hover:bg-info/90"
              }`}
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
      className={`${a11y ? "bg-background" : "bg-[#f4f5f4]"} flex flex-col ${
        stage === "sim-page" ? "h-screen overflow-hidden" : "min-h-screen"
      }`}
    >
      {/* Instruction bar */}
      <div className="sticky top-0 z-30 shrink-0 shadow-md">
        <div className={a11y ? "bg-foreground text-background" : "bg-info text-white"}>
          <div className="w-full max-w-md mx-auto px-4 py-2.5 flex items-center gap-2">
            <p className={`flex-1 leading-snug font-semibold min-w-0 ${a11y ? "text-base" : "text-sm"}`}>
              {tip}
            </p>
            <Link
              to="/apps"
              aria-label="Sair da simulação"
              className={`shrink-0 inline-flex items-center gap-1 px-3 rounded-full font-bold transition ${
                a11y
                  ? "h-10 bg-background text-foreground border-2 border-background text-base"
                  : "h-8 bg-white/20 hover:bg-white/30 text-sm"
              }`}
            >
              <X className="size-4" /> Sair
            </Link>
          </div>
        </div>
        <div className={`bg-white ${a11y ? "border-b-4 border-foreground" : "border-b border-[#dfe4e0]"}`}>
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
                    <span className={`rounded-full inline-flex items-center justify-center font-extrabold transition ${
                      a11y
                        ? "size-8 bg-foreground text-background text-sm"
                        : `size-6 text-xs ${done ? "bg-success text-white" : active ? "bg-info text-white" : "bg-muted text-muted-foreground"}`
                    }`}>
                      {done ? <CheckCircle2 className="size-3.5" /> : s.n}
                    </span>
                    <span className={`font-bold leading-none ${
                      a11y ? "text-sm text-foreground" : `text-xs ${active ? "text-foreground" : "text-muted-foreground"}`
                    }`}>
                      {s.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`flex-1 h-1 rounded-full overflow-hidden ${a11y ? "bg-background border border-foreground" : "bg-muted"}`}>
                      <div className={`h-full transition-all duration-500 ${a11y ? "bg-foreground" : "bg-success"}`} style={{ width: done ? "100%" : "0%" }} />
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
            className={`w-full max-w-md rounded-3xl bg-card shadow-2xl p-6 flex flex-col gap-3 ${
              a11y ? "border-4 border-foreground" : "border-2 border-border"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`flex items-center gap-2 ${a11y ? "text-foreground" : "text-info"}`}>
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
              className={`mt-2 h-12 rounded-full text-base font-extrabold transition ${
                a11y
                  ? "bg-foreground text-background border-4 border-foreground"
                  : "bg-info text-info-foreground hover:bg-info/90"
              }`}
            >
              OK, entendi
            </button>
          </div>
        </div>
      )}

      <div className="fixed right-4 bottom-4 z-30">
        <A11yToggle compact className={a11y ? "shadow-xl" : "shadow-lg shadow-foreground/20"} />
      </div>
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
  const { enabled: a11y } = useA11y();
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
    <div
      className={`flex flex-col flex-1 px-4 pt-5 pb-5 overflow-y-auto ${
        a11y ? "bg-background" : "bg-[#f4f5f4]"
      }`}
    >
      {/* Google app top bar */}
      <div className={`flex items-center justify-between ${a11y ? "text-foreground" : "text-[#343a38]"}`}>
        <Home className="size-7" strokeWidth={2.6} />
        <div className="flex items-center gap-5">
          <span
            className={`size-9 rounded-full flex items-center justify-center text-lg font-bold ${
              a11y ? "bg-foreground text-background" : "bg-[#607d6b] text-white"
            }`}
          >
            A
          </span>
          <span
            className={`size-7 rounded-lg border-2 flex items-center justify-center text-base font-extrabold ${
              a11y ? "border-foreground text-foreground" : "border-[#343a38]"
            }`}
          >
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
            className={`w-full h-16 pl-16 pr-24 rounded-full text-lg focus:outline-none animate-pulse-ring cursor-text shadow-sm ${
              a11y
                ? "bg-background text-foreground placeholder:text-foreground border-4 border-foreground"
                : "bg-[#e4e8e5] text-[#343a38] placeholder:text-[#69716d]"
            }`}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                runTutorialSearch();
              }
            }}
          />
          <div
            className={`absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-4 ${
              a11y ? "text-foreground" : "text-[#343a38]"
            }`}
          >
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
          className={`h-12 rounded-full flex items-center justify-center gap-2 font-bold ${
            a11y
              ? "bg-background text-foreground border-4 border-foreground text-lg"
              : "bg-[#e4e8e5] text-[#343a38] text-base"
          }`}
        >
          <Sparkles className="size-5" />
          Modo IA
        </button>
        <button
          type="button"
          onClick={runTutorialSearch}
          className={`h-12 rounded-full flex items-center justify-center gap-2 font-bold ${
            a11y
              ? "bg-background text-foreground border-4 border-foreground text-lg"
              : "bg-[#e4e8e5] text-[#343a38] text-base"
          }`}
        >
          <Lock className="size-5" />
          Modo anônimo
        </button>
      </div>

      {/* Guided shortcuts */}
      <section
        className={`mt-6 rounded-3xl bg-white px-4 py-4 overflow-hidden ${
          a11y ? "border-4 border-foreground" : "border border-[#dfe4e0]"
        }`}
      >
        <div className="flex justify-between gap-5 overflow-x-auto pb-1">
          {shortcuts.map(({ label, icon: Icon, tone }) => (
            <button
              type="button"
              key={label}
              onClick={runTutorialSearch}
              className="shrink-0 flex flex-col items-center gap-2 min-w-14"
            >
              <span
                className={`size-12 rounded-full flex items-center justify-center ${
                  a11y ? "bg-foreground text-background" : "bg-[#f4f5f4]"
                }`}
              >
                <Icon className={`size-6 ${a11y ? "" : tone}`} />
              </span>
              <span className={`font-semibold ${a11y ? "text-sm text-foreground" : "text-xs text-[#4c5550]"}`}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </section>

      <p className={`mt-3 text-center ${a11y ? "text-base text-foreground" : "text-xs text-[#69716d]"}`}>
        Toque na barra para aparecer{" "}
        <button
          type="button"
          onClick={runTutorialSearch}
          className={`font-extrabold underline underline-offset-2 ${a11y ? "text-foreground" : "text-info"}`}
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
            className={`rounded-3xl bg-white overflow-hidden shadow-sm ${
              a11y ? "border-4 border-foreground" : "border border-[#dfe4e0]"
            }`}
          >
            <div className="p-4">
              <div className="grid grid-cols-[1fr_88px] gap-3 items-start">
                <h3 className={`${a11y ? "text-2xl" : "text-xl"} leading-snug font-normal text-[#343a38]`}>
                  {item.title}
                </h3>
                <div
                  aria-hidden="true"
                  className={`h-20 rounded-2xl flex items-center justify-center ${
                    a11y
                      ? "bg-background border-4 border-foreground"
                      : `border border-[#dfe4e0] ${
                          item.kind === "tea"
                            ? "bg-gradient-to-br from-[#f4ead6] to-[#dce9df]"
                            : "bg-gradient-to-br from-[#e3ebef] to-[#e7e2da]"
                        }`
                  }`}
                >
                  {item.kind === "tea" ? (
                    <BookOpen className={`size-8 ${a11y ? "text-foreground" : "text-success"}`} />
                  ) : (
                    <Sparkles className={`size-8 ${a11y ? "text-foreground" : "text-info"}`} />
                  )}
                </div>
              </div>
              <div className={`mt-4 flex items-center gap-2 ${a11y ? "text-foreground" : "text-[#69716d]"}`}>
                <span
                  className={`size-6 rounded-full text-xs font-bold flex items-center justify-center ${
                    a11y ? "bg-foreground text-background" : "bg-[#607d6b] text-white"
                  }`}
                >
                  {item.source.charAt(0)}
                </span>
                <span className={`${a11y ? "text-base" : "text-sm"} font-medium`}>{item.source}</span>
                <span className="text-sm">· {item.age}</span>
                <div className={`ml-auto flex items-center gap-4 ${a11y ? "text-foreground" : "text-[#343a38]"}`}>
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
  const { enabled: a11y } = useA11y();
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
    <div className={`flex flex-col flex-1 overflow-y-auto ${a11y ? "bg-background" : "bg-[#f4f5f4]"}`}>
      {/* Browser-like top bar */}
      <div
        className={`sticky top-0 z-10 ${
          a11y ? "bg-background border-b-4 border-foreground" : "bg-[#f4f5f4] border-b border-[#dfe4e0]"
        }`}
      >
        <div className="px-4 pt-4 pb-3 flex items-center gap-3">
          <Home className={`size-6 shrink-0 ${a11y ? "text-foreground" : "text-[#343a38]"}`} strokeWidth={2.6} />
          <div
            className={`flex-1 h-10 rounded-full px-3 flex items-center gap-2 min-w-0 ${
              a11y ? "bg-background text-foreground border-4 border-foreground" : "bg-[#e4e8e5] text-[#4d5551]"
            }`}
          >
            <span className="text-base leading-none">⌘</span>
            <span className="text-sm truncate">google.com/search?q=Como+fazer+chá</span>
          </div>
          <span
            className={`size-7 rounded-lg border-2 flex items-center justify-center text-sm font-extrabold ${
              a11y ? "border-foreground text-foreground" : "border-[#343a38] text-[#343a38]"
            }`}
          >
            9
          </span>
          <MoreVertical className={`size-6 shrink-0 ${a11y ? "text-foreground" : "text-[#343a38]"}`} strokeWidth={2.6} />
        </div>

        <div className="px-4 pb-3">
          <div className="flex items-center justify-between px-1">
            <Sparkles className={`size-6 ${a11y ? "text-foreground" : "text-[#56635d]"}`} />
            <GoogleLogo className="text-3xl" />
            <span
              className={`size-9 rounded-full flex items-center justify-center text-lg font-bold ${
                a11y
                  ? "bg-foreground text-background border-2 border-foreground"
                  : "bg-[#607d6b] text-white ring-4 ring-[#d8e2dc]"
              }`}
            >
              A
            </span>
          </div>

          <div
            className={`mt-3 h-12 rounded-full bg-white px-4 flex items-center gap-3 ${
              a11y ? "border-4 border-foreground" : "shadow-md"
            }`}
          >
            <Search className={`size-5 ${a11y ? "text-foreground" : "text-[#69716d]"}`} />
            <span className={`flex-1 truncate ${a11y ? "text-lg text-foreground" : "text-base text-[#1f2422]"}`}>
              {query}
            </span>
            <X className={`size-5 ${a11y ? "text-foreground" : "text-[#343a38]"}`} />
            <span className={`h-7 w-px ${a11y ? "bg-foreground" : "bg-[#dfe4e0]"}`} />
            <Mic className={`size-5 ${a11y ? "text-foreground" : "text-[#343a38]"}`} />
          </div>
        </div>
      </div>

      <div className="bg-white pt-3">
        <button
          type="button"
          onClick={onPickResult}
          className={`mx-3 mb-3 block w-[calc(100%-1.5rem)] rounded-2xl text-left px-3 py-4 bg-white animate-pulse-ring ${
            a11y ? "border-4 border-foreground" : "border border-[#dfe4e0]"
          }`}
        >
          <div className="flex items-start gap-3">
            <span
              className={`size-10 rounded-full flex items-center justify-center ${
                a11y
                  ? "bg-foreground text-background border-2 border-foreground"
                  : "bg-[#f4f5f4] border border-[#dfe4e0] text-success"
              }`}
            >
              <BookOpen className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <p className={`${a11y ? "text-lg" : "text-base"} text-[#1f2422]`}>{results[0].name}</p>
                  <p className={`${a11y ? "text-base text-foreground" : "text-sm text-[#5f6763]"} truncate`}>
                    https://www.{results[0].site}
                  </p>
                </div>
                <MoreVertical className={`size-5 shrink-0 ${a11y ? "text-foreground" : "text-[#69716d]"}`} />
              </div>
              <h3 className={`mt-3 leading-tight font-normal ${a11y ? "text-2xl text-foreground underline" : "text-xl text-[#1558c8]"}`}>
                {results[0].title}
              </h3>
              <p className={`mt-2 leading-snug ${a11y ? "text-base text-foreground" : "text-sm text-[#5f6763]"}`}>
                <span>{results[0].date} - </span>
                {results[0].desc}
              </p>
              <span
                className={`mt-3 inline-flex items-center gap-1 font-extrabold px-2 py-1 rounded-full shadow animate-bounce ${
                  a11y ? "bg-foreground text-background text-base" : "bg-yellow-500 text-black text-sm"
                }`}
              >
                Toque aqui
              </span>
            </div>
          </div>
        </button>

        <div className={`h-3 ${a11y ? "bg-foreground" : "bg-[#eef0f1]"}`} />

        <section className="px-4 py-5 bg-white">
          <h3 className={`${a11y ? "text-3xl" : "text-2xl"} leading-tight font-semibold text-[#1f2422]`}>
            As pessoas também perguntam
          </h3>
          <div className={`mt-4 ${a11y ? "border-t-4 border-foreground" : "border-t border-[#d7dcda]"}`}>
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
                className={`w-full py-3.5 flex items-center gap-3 text-left ${
                  a11y ? "border-b-4 border-foreground" : "border-b border-[#d7dcda]"
                }`}
              >
                <span className={`flex-1 leading-snug text-[#1f2422] ${a11y ? "text-xl" : "text-lg"}`}>{question}</span>
                <span
                  className={`size-9 rounded-full flex items-center justify-center shrink-0 ${
                    a11y ? "bg-foreground text-background" : "bg-[#f1f3f2] text-[#69716d]"
                  }`}
                >
                  <ChevronDown className="size-5" />
                </span>
              </button>
            ))}
          </div>
        </section>

        <div className={`h-3 ${a11y ? "bg-foreground" : "bg-[#eef0f1]"}`} />

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
            className={`w-full text-left px-4 py-5 bg-white ${
              a11y ? "border-b-4 border-foreground" : "border-b border-[#dfe4e0]"
            }`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`size-10 rounded-full flex items-center justify-center font-extrabold ${
                  a11y ? "bg-foreground text-background" : "bg-[#607d6b] text-white"
                }`}
              >
                {r.name.charAt(0)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <p className={`${a11y ? "text-lg" : "text-base"} text-[#1f2422]`}>{r.name}</p>
                    <p className={`${a11y ? "text-base text-foreground" : "text-sm text-[#5f6763]"} truncate`}>
                      https://{r.site}
                    </p>
                  </div>
                  <MoreVertical className={`size-5 shrink-0 ${a11y ? "text-foreground" : "text-[#69716d]"}`} />
                </div>
                <h3 className={`mt-3 leading-tight font-normal ${a11y ? "text-2xl text-foreground underline" : "text-xl text-[#1558c8]"}`}>
                  {r.title}
                </h3>
                <p className={`mt-2 leading-snug ${a11y ? "text-base text-foreground" : "text-sm text-[#5f6763]"}`}>
                  <span>{r.date} - </span>
                  {r.desc}
                </p>
              </div>
            </div>
          </button>
        ))}

        <section className="px-4 py-5 bg-white">
          <h3 className={`${a11y ? "text-3xl" : "text-2xl"} leading-tight font-semibold text-[#1f2422]`}>
            Outras pessoas pesquisaram
          </h3>
          <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
            {["chá de camomila para dormir", "como preparar chá", "benefícios da camomila"].map(
              (q) => (
                <span
                  key={q}
                  className={`shrink-0 px-3 py-2 rounded-full font-semibold ${
                    a11y
                      ? "border-4 border-foreground text-foreground text-base"
                      : "border border-[#d7dcda] text-[#1558c8] text-sm"
                  }`}
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
  const { enabled: a11y } = useA11y();

  return (
    <div className="flex flex-col bg-white flex-1 overflow-y-auto">
      <div className="sticky top-0 z-20">
        {/* Browser bar */}
        <div
          className={`px-4 py-3 flex items-center gap-3 ${
            a11y ? "bg-foreground text-background" : "bg-[#f26a21] text-[#25211f]"
          }`}
        >
          <button
            type="button"
            onClick={onBack}
            className={`inline-flex items-center justify-center size-8 rounded-md transition ${
              a11y ? "bg-background text-foreground border-2 border-background" : "hover:bg-white/15"
            }`}
            aria-label="Voltar para os resultados"
          >
            <Home className="size-6" strokeWidth={2.6} />
          </button>
          <div
            className={`flex-1 h-10 px-3 rounded-full flex items-center gap-2 min-w-0 ${
              a11y ? "bg-background text-foreground border-2 border-background" : "bg-white/25 text-[#4a352d]"
            }`}
          >
            <Lock className="size-4 shrink-0" />
            <span className="truncate text-sm">receitasdadonarosa.com.br</span>
          </div>
          <span
            className={`size-8 rounded-lg border-2 flex items-center justify-center text-sm font-extrabold ${
              a11y ? "border-background text-background" : "border-[#25211f]"
            }`}
          >
            9
          </span>
          <MoreVertical className="size-6 shrink-0" strokeWidth={2.6} />
        </div>

        {/* Site header */}
        <div
          className={`h-20 px-4 bg-white shadow-md flex items-center justify-between ${
            a11y ? "border-b-4 border-foreground" : ""
          }`}
        >
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
            <span
              className={`size-11 rounded-full bg-white shadow-md flex items-center justify-center ${
                a11y ? "text-foreground border-2 border-foreground" : "text-[#f26a21]"
              }`}
            >
              <Search className="size-6" />
            </span>
            <span className={`text-2xl font-extrabold tracking-tight ${a11y ? "text-foreground" : "text-[#f26a21]"}`}>
              RECEITAS DA ROSA
            </span>
          </div>
          <span
            className={`size-11 rounded-full bg-white shadow-md flex items-center justify-center ${
              a11y ? "text-foreground border-2 border-foreground" : "text-[#f26a21]"
            }`}
          >
            <User className="size-6" />
          </span>
        </div>
      </div>

      {/* Page content */}
      <article className="bg-white flex-1">
        <div className="px-5 pt-6 pb-4">
          <p className={`${a11y ? "text-base text-foreground" : "text-xs text-muted-foreground"} font-bold`}>
            Receitas &gt; Chás e bebidas
          </p>
          <h2 className={`mt-8 text-center font-extrabold leading-tight text-[#3a3a3a] ${a11y ? "text-4xl" : "text-3xl"}`}>
            Chá de camomila: veja como fazer do jeito certo e aproveitar seus benefícios
          </h2>
          <p className={`mt-8 text-center ${a11y ? "text-lg text-foreground" : "text-base text-[#4d5551]"}`}>
            Atualizado em 23/05/2024 às 15:57
          </p>
          <button
            type="button"
            className={`mx-auto mt-4 flex items-center gap-2 ${a11y ? "text-foreground text-lg" : "text-[#4d5551] text-base"}`}
          >
            <Share2 className="size-5" />
            Compartilhar
          </button>

          <div
            className={`mt-6 rounded-lg bg-white shadow-lg p-4 ${
              a11y ? "border-4 border-foreground" : "border border-[#eef0f1]"
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`size-14 rounded-full flex items-center justify-center font-extrabold ${
                  a11y ? "bg-foreground text-background" : "bg-[#d8e2dc] text-[#607d6b]"
                }`}
              >
                DR
              </span>
              <p className={`${a11y ? "text-lg" : "text-base"} text-[#3a3a3a]`}>
                Por <span className="underline">Dona Rosa</span>
              </p>
            </div>
            <p className={`mt-3 leading-relaxed ${a11y ? "text-lg text-foreground" : "text-base text-[#4d5551]"}`}>
              Uma explicação simples para preparar o chá com calma e segurança.
            </p>
          </div>
        </div>

        <section className="px-5 py-5">
          <p className={`${a11y ? "text-3xl" : "text-2xl"} leading-snug font-extrabold text-[#3a3a3a]`}>
            O chá de camomila é conhecido por ajudar no bem-estar, mas o preparo
            correto deixa a bebida mais agradável.
          </p>

          <div
            className={`mt-6 aspect-[4/3] rounded-sm flex items-center justify-center overflow-hidden ${
              a11y
                ? "bg-background border-4 border-foreground"
                : "bg-gradient-to-br from-[#f4ead6] to-[#dce9df] border border-[#dfe4e0]"
            }`}
          >
            <div className="text-center">
              <BookOpen className="mx-auto size-16 text-[#607d6b]" />
              <p className="mt-2 text-sm font-bold text-[#607d6b]">Foto do chá de camomila</p>
            </div>
          </div>

          <p className={`${a11y ? "text-2xl" : "text-xl"} mt-6 leading-relaxed text-[#3a3a3a]`}>
            A camomila é uma planta delicada. Para preparar o chá, aqueça a água
            e desligue o fogo antes de colocar as flores. Assim, o sabor fica
            suave e a bebida pode ser tomada com mais tranquilidade.
          </p>

          <h3 className={`${a11y ? "text-3xl" : "text-2xl"} mt-8 font-extrabold text-[#3a3a3a]`}>
            Como preparar o chá de camomila
          </h3>
          <p className={`${a11y ? "text-2xl" : "text-xl"} mt-4 leading-relaxed text-[#3a3a3a]`}>
            Coloque uma xícara de água para aquecer. Quando começar a ferver,
            desligue o fogo. Acrescente uma colher de chá de flores de camomila,
            tampe a xícara e espere de 5 a 10 minutos. Depois, coe e beba morno.
          </p>

          <h3 className={`${a11y ? "text-3xl" : "text-2xl"} mt-8 font-extrabold text-[#3a3a3a]`}>
            Benefícios do chá de camomila
          </h3>
          <p className={`${a11y ? "text-2xl" : "text-xl"} mt-4 leading-relaxed text-[#3a3a3a]`}>
            O chá de camomila pode ajudar a relaxar e trazer uma sensação de
            conforto. Se você usa remédios ou tem alguma dúvida de saúde, converse
            com a equipe do lar antes de tomar com frequência.
          </p>

          <div
            className={`mt-8 rounded-2xl p-4 ${
              a11y ? "bg-background border-4 border-foreground" : "bg-info/5 border-2 border-info"
            }`}
          >
            <p className={`font-bold ${a11y ? "text-base text-foreground" : "text-sm text-info"}`}>
              Você pesquisou: <span className="font-extrabold">"{query}"</span>
            </p>
            <p className={`mt-1 leading-snug ${a11y ? "text-base text-foreground" : "text-sm text-muted-foreground"}`}>
              Encontrou a resposta no site. Quando terminar de ler, toque no botão abaixo.
            </p>
          </div>
        </section>
      </article>

      {/* Finish bar */}
      <div
        className={`mt-auto p-4 sticky bottom-0 ${
          a11y ? "bg-background border-t-4 border-foreground" : "border-t border-[#dfe4e0] bg-[#f4f5f4]"
        }`}
      >
        <button
          type="button"
          onClick={onFinish}
          className={`w-full h-14 rounded-2xl text-lg font-extrabold hover:opacity-90 transition ${
            a11y
              ? "bg-foreground text-background border-4 border-foreground"
              : "bg-success text-white"
          }`}
        >
          Concluir simulação
        </button>
      </div>
    </div>
  );
}
