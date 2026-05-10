import { useCallback, useEffect, useMemo, useState } from "react";
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
  Image as ImageIcon,
  MapPin,
  Newspaper,
  ChevronLeft,
  MoreVertical,
  Lock,
  RotateCw,
  Star,
  Share2,
  ArrowUpRight,
} from "lucide-react";
import { A11yToggle, useA11y } from "../lib/a11y";

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

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "pt-BR";
    utter.rate = 0.9;
    const ptVoice = window.speechSynthesis
      .getVoices()
      .find((v) => v.lang.toLowerCase().startsWith("pt"));
    if (ptVoice) utter.voice = ptVoice;
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utter);
  }, []);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  }, []);

  const screenText = useMemo(() => {
    switch (stage) {
      case "overview":
        return "Pesquisa Google. É como uma enciclopédia gigante que responde qualquer pergunta. Toque em iniciar simulação prática para começar.";
      case "sim-search":
        return "Passo 1. Toque na barra de pesquisa, digite a sua pergunta e toque em pesquisar.";
      case "sim-results":
        return "Passo 2. Estes são os resultados. Toque em um link azul para abrir e ler a resposta.";
      case "sim-page":
        return "Passo 3. Você abriu um site com a resposta. Quando terminar, toque em concluir.";
      case "done":
        return "Parabéns! Você aprendeu a pesquisar no Google. Agora pode procurar respostas para qualquer pergunta.";
      default:
        return "Pesquisa Google";
    }
  }, [stage]);

  const handleSpeak = () => (speaking ? stopSpeaking() : speak(screenText));

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
                  t: "Faça a sua Pergunta",
                  d: "Toque na barra de pesquisa e digite o que você quer saber.",
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
            Você aprendeu a pesquisar no Google. Agora pode procurar respostas para qualquer
            pergunta, igual folhear uma enciclopédia.
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
      ? "Toque na barra de pesquisa e digite a sua pergunta."
      : stage === "sim-results"
        ? "Toque em um link azul para abrir o site com a resposta."
        : "Pronto! Esta é a resposta. Toque em concluir quando terminar.";

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Instruction bar */}
      <div className="sticky top-0 z-20 shadow-md">
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
        <div className="bg-card border-b border-border">
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
              if (!query.trim()) setQuery(SUGGESTED_QUERY);
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
  query,
  setQuery,
  onSearch,
  suggested,
}: {
  query: string;
  setQuery: (v: string) => void;
  onSearch: () => void;
  suggested: string;
}) {
  const recent = [
    "Receita de bolo de cenoura",
    "Previsão do tempo amanhã",
    "Telefone da farmácia",
  ];
  return (
    <div className="flex flex-col bg-background flex-1 px-5 pt-8 pb-6">
      {/* Top right small avatar */}
      <div className="flex items-center justify-end gap-3 text-muted-foreground">
        <span className="text-sm font-bold">Conta</span>
        <span className="size-8 rounded-full bg-info/30 flex items-center justify-center text-xs font-extrabold text-info">
          M
        </span>
      </div>

      {/* Logo */}
      <div className="mt-10 flex justify-center">
        <GoogleLogo className="text-6xl" />
      </div>

      {/* Search bar */}
      <div className="mt-8">
        <label htmlFor="g-search" className="sr-only">
          Pesquisar no Google
        </label>
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground"
            strokeWidth={2.4}
          />
          <input
            id="g-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar no Google"
            className="w-full h-14 pl-12 pr-20 rounded-full bg-card border-2 border-info text-foreground text-base focus:outline-none animate-pulse-ring"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onSearch();
              }
            }}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-3 text-info">
            <Mic className="size-5" />
            <Camera className="size-5" />
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground text-center">
          Dica: digite{" "}
          <button
            type="button"
            onClick={() => setQuery(suggested)}
            className="font-extrabold text-info underline underline-offset-2"
          >
            "{suggested}"
          </button>{" "}
          ou qualquer pergunta.
        </p>
      </div>

      {/* Recent searches */}
      <div className="mt-6 rounded-2xl bg-card border border-border overflow-hidden">
        <p className="px-4 pt-3 text-xs font-extrabold text-muted-foreground uppercase tracking-wide">
          Pesquisas recentes
        </p>
        <ul>
          {recent.map((r) => (
            <li key={r}>
              <button
                type="button"
                onClick={() => setQuery(r)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted transition"
              >
                <Search className="size-4 text-muted-foreground" />
                <span className="text-sm text-foreground flex-1 truncate">{r}</span>
                <ArrowUpRight className="size-4 text-muted-foreground" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Search button */}
      <button
        type="button"
        onClick={onSearch}
        className="mt-6 w-full h-14 rounded-2xl bg-info text-info-foreground text-lg font-extrabold shadow-lg shadow-info/30 hover:bg-info/90 active:scale-[0.99] transition"
      >
        Pesquisar
      </button>

      {/* Bottom shortcut bar (decorative) */}
      <div className="mt-auto pt-8 grid grid-cols-4 gap-2 text-[11px] font-bold text-muted-foreground">
        {[
          { I: Globe, l: "Tudo" },
          { I: ImageIcon, l: "Imagens" },
          { I: MapPin, l: "Mapas" },
          { I: Newspaper, l: "Notícias" },
        ].map(({ I, l }) => (
          <div key={l} className="flex flex-col items-center gap-1">
            <I className="size-5" />
            <span>{l}</span>
          </div>
        ))}
      </div>
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
      site: "receitasdavovo.com.br",
      title: "Chá de camomila: como preparar e benefícios",
      desc:
        "Aprenda passo a passo como fazer um chá de camomila perfeito para relaxar e dormir melhor. Receita simples com 3 ingredientes...",
      featured: true,
    },
    {
      site: "saude.gov.br",
      title: "Plantas medicinais — Camomila",
      desc:
        "A camomila é uma planta usada há séculos para acalmar e ajudar na digestão. Veja como preparar e cuidados ao consumir...",
    },
    {
      site: "vidasaudavel.com",
      title: "10 benefícios do chá de camomila para a saúde",
      desc:
        "Descubra por que o chá de camomila é tão indicado: relaxamento, sono, digestão e cuidados com a pele. Guia completo...",
    },
  ];
  return (
    <div className="flex flex-col bg-background flex-1">
      {/* Compact top search bar */}
      <div className="px-4 pt-3 pb-3 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <ChevronLeft className="size-5 text-muted-foreground shrink-0" />
          <div className="flex-1 h-11 px-4 rounded-full bg-muted flex items-center gap-2 border border-border">
            <Search className="size-4 text-muted-foreground" />
            <span className="text-sm text-foreground truncate flex-1">{query}</span>
            <Mic className="size-4 text-info" />
          </div>
          <span className="size-8 shrink-0 rounded-full bg-info/30 flex items-center justify-center text-xs font-extrabold text-info">
            M
          </span>
        </div>
        {/* Tabs */}
        <div className="mt-3 flex gap-5 overflow-x-auto text-sm font-bold">
          {[
            { l: "Tudo", on: true },
            { l: "Imagens" },
            { l: "Vídeos" },
            { l: "Notícias" },
            { l: "Mapas" },
          ].map((t) => (
            <span
              key={t.l}
              className={`shrink-0 pb-2 ${
                t.on
                  ? "text-info border-b-2 border-info"
                  : "text-muted-foreground border-b-2 border-transparent"
              }`}
            >
              {t.l}
            </span>
          ))}
        </div>
      </div>

      {/* Results meta */}
      <p className="px-4 pt-3 text-xs text-muted-foreground">
        Cerca de 1.240.000 resultados (0,38 segundos)
      </p>

      {/* Results list */}
      <ul className="flex flex-col">
        {results.map((r, idx) => {
          const isFirst = idx === 0;
          return (
            <li key={r.site}>
              <button
                type="button"
                onClick={() => {
                  if (isFirst) onPickResult();
                  else
                    onExplain({
                      title: "Outro resultado",
                      body:
                        "Você pode tocar em qualquer link azul para abrir. Para essa simulação, vamos usar o primeiro resultado, que está destacado.",
                    });
                }}
                className={`w-full text-left px-4 py-4 transition ${
                  isFirst
                    ? "bg-info/5 animate-pulse-ring"
                    : "hover:bg-muted/60 border-b border-border"
                }`}
              >
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="size-5 rounded-full bg-muted flex items-center justify-center">
                    <Globe className="size-3" />
                  </span>
                  <span className="font-bold text-foreground">{r.site.split(".")[0]}</span>
                  <span className="truncate">https://{r.site}</span>
                </div>
                <h3 className="mt-1 text-info text-lg font-extrabold leading-snug underline underline-offset-2">
                  {r.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground leading-snug line-clamp-3">
                  {r.desc}
                </p>
                {isFirst && (
                  <span className="mt-2 inline-flex items-center gap-1 bg-info text-white text-xs font-extrabold px-2 py-1 rounded-full">
                    Toque aqui
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Related searches */}
      <div className="mt-2 px-4 py-4 border-t border-border">
        <p className="text-xs font-extrabold text-muted-foreground uppercase tracking-wide mb-2">
          Pesquisas relacionadas
        </p>
        <div className="flex flex-wrap gap-2">
          {["camomila para dormir", "chá calmante natural", "como secar camomila"].map((q) => (
            <span
              key={q}
              className="px-3 py-1.5 rounded-full bg-muted text-foreground text-xs font-bold"
            >
              {q}
            </span>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-auto px-4 py-5 flex items-center justify-center gap-2 text-info text-sm font-bold border-t border-border">
        <GoogleLogo className="text-2xl" />
        <span className="ml-3">1 2 3 4 5</span>
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
    <div className="flex flex-col bg-background flex-1">
      {/* Browser bar */}
      <div className="px-4 py-2 bg-muted border-b border-border flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 h-8 px-2 rounded-md text-foreground hover:bg-card transition text-sm font-bold"
          aria-label="Voltar para os resultados"
        >
          <ChevronLeft className="size-4" />
        </button>
        <div className="flex-1 h-8 px-3 rounded-md bg-card border border-border flex items-center gap-2 text-xs text-muted-foreground">
          <Lock className="size-3 text-success" />
          <span className="truncate">receitasdavovo.com.br</span>
        </div>
        <RotateCw className="size-4 text-muted-foreground" />
        <Star className="size-4 text-muted-foreground" />
        <Share2 className="size-4 text-muted-foreground" />
        <MoreVertical className="size-4 text-muted-foreground" />
      </div>

      {/* Page content */}
      <article className="px-5 py-5 flex-1">
        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wide">
          Receitas da Vovó
        </p>
        <h2 className="mt-1 text-2xl font-extrabold leading-tight">
          Chá de camomila: como preparar
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Por Maria Helena · Atualizado há 2 dias
        </p>

        <div className="mt-4 aspect-video rounded-xl bg-gradient-to-br from-warning/30 to-success/30 border border-border flex items-center justify-center">
          <span className="text-foreground/60 text-sm font-bold">Foto do chá</span>
        </div>

        <p className="mt-4 text-base leading-relaxed text-foreground">
          O chá de camomila é uma das bebidas mais antigas e queridas para
          relaxar antes de dormir. Veja como preparar em poucos minutos:
        </p>

        <h3 className="mt-4 text-lg font-extrabold">Ingredientes</h3>
        <ul className="mt-2 list-disc pl-6 text-base text-foreground space-y-1">
          <li>1 colher de sopa de flores de camomila secas</li>
          <li>1 xícara de água quente</li>
          <li>Mel a gosto (opcional)</li>
        </ul>

        <h3 className="mt-4 text-lg font-extrabold">Modo de preparo</h3>
        <ol className="mt-2 list-decimal pl-6 text-base text-foreground space-y-1">
          <li>Ferva a água em uma chaleira ou panela.</li>
          <li>Coloque as flores de camomila em uma xícara.</li>
          <li>Despeje a água quente e tampe por 5 minutos.</li>
          <li>Coe, adoce com mel se quiser e beba ainda morno.</li>
        </ol>

        <p className="mt-4 text-sm text-muted-foreground italic">
          Dica: tome 30 minutos antes de dormir para ajudar a relaxar.
        </p>

        <div className="mt-6 rounded-2xl bg-info/5 border-2 border-info p-4">
          <p className="text-sm font-bold text-info">
            Você pesquisou: <span className="font-extrabold">"{query}"</span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground leading-snug">
            Encontrou a resposta no site! Quando terminar de ler, toque no
            botão abaixo para concluir.
          </p>
        </div>
      </article>

      {/* Finish bar */}
      <div className="mt-auto p-4 border-t border-border bg-card sticky bottom-0">
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