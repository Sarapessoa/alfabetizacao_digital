import { type SVGProps, useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Play,
  Tv,
  Volume2,
  Square,
  X,
  Cast,
  Bell,
  Search,
  PlaySquare,
  PlusCircle,
  ListVideo,
  User as UserIcon,
  ThumbsUp,
  ThumbsDown,
  Scissors,
  Share2,
  Download,
  ChevronDown,
  MoreVertical,
  CheckCircle2,
  Sparkles,
  Compass,
  VolumeX,
} from "lucide-react";
import { A11yToggle, useA11y } from "../lib/a11y";
import boloImg from "../assets/yt-bolo.jpg";
import croceImg from "../assets/yt-croche.jpg";
import avatarImg from "../assets/yt-avatar.jpg";
import jardimImg from "../assets/yt-jardim.jpg";
import oracaoImg from "../assets/yt-oracao.jpg";
import novelaImg from "../assets/yt-novela.jpg";

export const Route = createFileRoute("/apps/youtube")({
  component: YouTubeSimulation,
  head: () => ({
    meta: [
      { title: "YouTube — Ajudante Tech" },
      {
        name: "description",
        content:
          "Aprenda a usar o YouTube com uma simulação prática passo a passo, comparando com a televisão.",
      },
    ],
  }),
});

type Stage = "intro" | "overview" | "sim-home" | "sim-video" | "done";

function HomeFilledIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M3 10.25 12 3l9 7.25v9.25A1.5 1.5 0 0 1 19.5 21h-4.75a.75.75 0 0 1-.75-.75V15a2 2 0 0 0-4 0v5.25a.75.75 0 0 1-.75.75H4.5A1.5 1.5 0 0 1 3 19.5z" />
    </svg>
  );
}

function YouTubeSimulation() {
  const [stage, setStage] = useState<Stage>("overview");
  const [speaking, setSpeaking] = useState(false);
  const [liked, setLiked] = useState(false);
  const [dialog, setDialog] = useState<null | { title: string; body: string }>(null);
  const { enabled: a11y } = useA11y();
  const navigate = useNavigate();

  // Step indicator (1..3) for the practical simulation
  const steps = [
    { n: 1, label: "Apresentação" },
    { n: 2, label: "Escolher vídeo" },
    { n: 3, label: "Interagir" },
  ];
  const currentStep =
    stage === "overview" ? 1 : stage === "sim-home" ? 2 : stage === "sim-video" ? 3 : 3;
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
          className="h-full bg-destructive transition-all duration-500"
          style={{ width: `${((isDone ? steps.length : currentStep) / steps.length) * 100}%` }}
        />
      </div>
    </div>
  );

  // Auto-advance from intro splash to the simulation
  useEffect(() => {
    if (stage !== "intro") return;
    const t = setTimeout(() => setStage("sim-home"), 1800);
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
        return "YouTube. Conectando ao que você conhece. O YouTube é como ter uma televisão ilimitada. Você escolhe o que assistir e quando. Toque em iniciar simulação prática para começar.";
      case "sim-home":
        return "Passo 1. Toque na imagem do vídeo para começar a assistir.";
      case "sim-video":
        return "Passo 2. Você está assistindo. Experimente dar um joinha ou compartilhar abaixo.";
      case "done":
        return "Parabéns! Você aprendeu o básico do YouTube. Agora você pode escolher e assistir vídeos sozinho.";
      default:
        return "YouTube";
    }
  }, [stage]);

  const handleSpeak = () => (speaking ? stopSpeaking() : speak(screenText));

  // ----- Intro splash -----
  if (stage === "intro") {
    return (
      <main className="min-h-screen bg-destructive flex flex-col items-center justify-center text-destructive-foreground">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="size-24 rounded-full bg-destructive-foreground text-destructive flex items-center justify-center shadow-2xl">
            <Play className="size-12 ml-1" strokeWidth={2.5} fill="currentColor" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">YouTube</h1>
        </div>
      </main>
    );
  }

  // ----- Header bar (shared) -----
  const headerBar = (
    <header className="bg-destructive text-destructive-foreground px-5 pt-5 pb-6">
      <div className="w-full max-w-md mx-auto flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <Link
            to="/apps"
            aria-label="Voltar para aplicativos"
            className="inline-flex items-center gap-2 h-11 px-3 rounded-2xl text-base font-bold hover:bg-destructive-foreground/10 transition"
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
              className="inline-flex items-center gap-2 h-11 px-3 rounded-full bg-destructive-foreground text-destructive text-base font-bold hover:opacity-90 transition"
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
          YouTube
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
            className={`rounded-2xl bg-card p-5 border-l-8 border-l-destructive shadow-md ${
              a11y ? "border-2 border-foreground" : "border border-border"
            }`}
          >
            <h2 className={`font-extrabold text-destructive ${a11y ? "text-2xl" : "text-xl"}`}>
              O que é parecido?
            </h2>
            <div
              className={`mt-3 inline-flex items-center gap-2 rounded-full bg-destructive/10 text-destructive px-3 py-1.5 font-extrabold ${
                a11y ? "text-lg" : "text-base"
              }`}
            >
              <Tv className="size-5" />
              Televisão
            </div>
            <p
              className={`mt-3 leading-snug ${
                a11y ? "text-xl text-foreground" : "text-lg text-muted-foreground"
              }`}
            >
              O YouTube é como ter uma <strong className="text-destructive">TV ilimitada</strong>.
              Você escolhe o que assistir e quando.
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
                className="h-full bg-destructive transition-all duration-500"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
            </div>
            <ol className="flex flex-col gap-3">
              {[
                { n: 1, t: "Abra o Aplicativo", d: "Procure o ícone vermelho na sua tela inicial e toque nele." },
                { n: 2, t: "Escolha um Vídeo", d: "Toque na imagem do vídeo que você quer assistir." },
                { n: 3, t: "Curta e Compartilhe", d: "Dê um joinha ou compartilhe com a família." },
              ].map((s) => {
                const done = s.n < currentStep;
                const active = s.n === currentStep;
                return (
                  <li
                    key={s.n}
                    className={`rounded-2xl p-4 transition ${
                      active
                        ? "bg-destructive/5 border-2 border-destructive"
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
                              ? "bg-destructive text-destructive-foreground ring-4 ring-destructive/25"
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
            className="inline-flex items-center justify-center gap-2 w-full h-16 rounded-2xl bg-destructive text-destructive-foreground text-xl font-extrabold shadow-lg shadow-destructive/30 hover:bg-destructive/90 active:scale-[0.99] transition"
          >
            <Play className="size-6" fill="currentColor" />
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
            Você aprendeu o básico do YouTube. Agora pode escolher e assistir vídeos
            sozinho, igual a uma televisão sob seu controle.
          </p>
          <div className="flex flex-col gap-3 w-full">
            <button
              type="button"
              onClick={() => {
                setLiked(false);
                setStage("overview");
              }}
              className="h-14 rounded-2xl border-2 border-border bg-card text-foreground text-lg font-bold hover:bg-muted transition"
            >
              Repetir simulação
            </button>
            <button
              type="button"
              onClick={() => navigate({ to: "/apps" })}
              className="h-14 rounded-2xl bg-destructive text-destructive-foreground text-lg font-extrabold hover:bg-destructive/90 transition"
            >
              Ver outros aplicativos
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ----- Simulation screens (sim-home / sim-video) -----
  const tip =
    stage === "sim-home"
      ? "Toque na imagem do vídeo para começar a assistir."
      : "Você está assistindo! Experimente dar um 'Joinha' ou 'Compartilhar' abaixo.";

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Instruction bar */}
      <div className="sticky top-0 z-20 shadow-md">
        <div className="bg-destructive text-destructive-foreground">
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
                      done ? "bg-success text-white" : active ? "bg-destructive text-white" : "bg-muted text-muted-foreground"
                    }`}>
                      {done ? <CheckCircle2 className="size-3.5" /> : s.n}
                    </span>
                    <span className={`text-xs font-bold leading-none ${active ? "text-foreground" : "text-muted-foreground"}`}>
                      {s.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-success transition-all duration-500"
                        style={{ width: done ? "100%" : "0%" }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Simulated YouTube UI */}
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col min-h-0">
        {stage === "sim-home" ? (
          <SimHome onPickVideo={() => setStage("sim-video")} />
        ) : (
          <SimVideo
            liked={liked}
            onLike={() => {
              setLiked(true);
              setDialog({
                title: "Você deu um 'Joinha'!",
                body:
                  "Isso é como dar um elogio ao criador do vídeo. Ajuda o YouTube a entender que esse vídeo é bom e deve ser mostrado para mais pessoas.",
              });
            }}
            onShare={() =>
              setDialog({
                title: "Compartilhar",
                body:
                  "Aqui você poderia enviar esse vídeo pelo WhatsApp para um amigo, igual mandar uma indicação de programa de TV.",
              })
            }
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
              className="mt-2 h-12 rounded-full bg-destructive text-destructive-foreground text-base font-extrabold hover:bg-destructive/90 transition"
            >
              OK, entendi
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

/* ---------- Simulated YouTube Home ---------- */
function SimHome({ onPickVideo }: { onPickVideo: () => void }) {
  const chips = ["Tudo", "Receitas", "Novelas", "Crochê", "Oração", "Música"];
  const shorts = [
    { title: "Bolo de fubá cremoso da vovó", badge: "Novo", img: boloImg },
    { title: "Ponto de crochê passo a passo", img: croceImg },
    { title: "Resumo da novela de ontem", badge: "Novo", img: novelaImg },
    { title: "Hino que acalma o coração", img: oracaoImg },
  ];
  const moreVideos = [
    {
      title: "Crochê passo a passo: toalhinha de mesa",
      channel: "Crochê com Dona Lúcia",
      meta: "892 mil visualizações · há 1 semana",
      duration: "22:14",
      img: croceImg,
    },
    {
      title: "Resumo da novela das 9 — capítulo de ontem",
      channel: "Resumo das Novelas",
      meta: "2,1 mi visualizações · há 1 dia",
      duration: "08:47",
      img: novelaImg,
    },
    {
      title: "Como cuidar das suas plantas em casa",
      channel: "Jardim Feliz",
      meta: "456 mil visualizações · há 4 dias",
      duration: "14:05",
      img: jardimImg,
    },
    {
      title: "Oração da manhã para começar o dia bem",
      channel: "Momento de Fé",
      meta: "1,5 mi visualizações · há 2 dias",
      duration: "06:32",
      img: oracaoImg,
    },
  ];

  // Hide bottom nav on scroll down (like the real YouTube app)
  const [navVisible, setNavVisible] = useState(true);
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const diff = y - lastY;
      if (Math.abs(diff) < 6) return;
      setNavVisible(diff < 0 || y < 80);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="flex flex-col bg-background flex-1">
      {/* Top bar — YouTube style */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="size-7 rounded-md bg-destructive flex items-center justify-center">
            <Play className="size-4 text-destructive-foreground ml-0.5" fill="currentColor" />
          </span>
          <span className="font-extrabold text-xl tracking-tight">
            YouTube
          </span>
        </div>
        <div className="flex items-center gap-4 text-foreground">
          <Cast className="size-5" />
          <div className="relative">
            <Bell className="size-5" />
            <span className="absolute -top-1.5 -right-2 bg-destructive text-destructive-foreground text-[9px] font-extrabold px-1 rounded-full leading-tight">
              9+
            </span>
          </div>
          <Search className="size-5" />
        </div>
      </div>

      {/* Chips */}
      <div className="flex gap-2 px-4 pb-3 overflow-x-auto items-center">
        <span className="shrink-0 size-9 rounded-full bg-muted flex items-center justify-center">
          <Compass className="size-4 text-foreground" />
        </span>
        {chips.map((c, i) => (
          <span
            key={c}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm font-bold border ${
              i === 0
                ? "bg-foreground text-background border-foreground"
                : "bg-muted text-foreground border-transparent"
            }`}
          >
            {c}
          </span>
        ))}
      </div>

      {/* Featured video (clickable) */}
      <button
        type="button"
        onClick={onPickVideo}
        className="text-left group focus:outline-none"
        aria-label="Vídeo: Detalhes que você nunca ouviu em Human Nature"
      >
        <div className="relative aspect-video bg-muted flex items-center justify-center animate-pulse-ring overflow-hidden">
          <img
            src={boloImg}
            alt="Bolo de cenoura com cobertura de chocolate"
            className="absolute inset-0 size-full object-cover"
          />
          {/* Mute icon */}
          <span className="absolute top-3 right-3 size-8 rounded-full bg-foreground/40 flex items-center justify-center z-10">
            <VolumeX className="size-4 text-white" />
          </span>
          {/* CC badge */}
          <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-white text-foreground text-[11px] font-extrabold px-1.5 py-0.5 rounded shadow z-10">
            CC
          </span>
          {/* Caption overlay */}
          <span className="absolute left-3 bottom-8 max-w-[70%] bg-foreground/70 text-white text-[11px] font-medium px-2 py-1 rounded leading-snug z-10">
            O segredo é bater bem os ovos com o açúcar antes de juntar a farinha.
          </span>
          {/* Time */}
          <span className="absolute bottom-2 right-2 text-white text-xs font-bold drop-shadow z-10">
            18:42
          </span>
          {/* Toque aqui hint */}
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-yellow-500 text-black text-sm font-extrabold px-2 py-1 rounded-full shadow z-10 animate-bounce">
            Toque aqui
          </span>
          {/* Progress bar with red dot */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/30 z-10">
            <div className="h-full w-[2%] bg-destructive relative">
              <span className="absolute -right-1 -top-1 size-2.5 rounded-full bg-destructive" />
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-4 pt-3">
          <img
            src={avatarImg}
            alt="Foto de perfil do canal Receitas da Vovó"
            className="size-10 shrink-0 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="font-extrabold leading-snug text-sm">
              BOLO DE CHOCOLATE FÁCIL E RÁPIDO FEITO A MÃO ( SUPER FOFINHO )
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Receitas da Vovó · 468 mil visualizações · há 5 dias
            </p>
          </div>
          <MoreVertical className="size-5 text-muted-foreground" />
        </div>

        {/* Product card */}
        <div className="mx-4 mt-3 flex items-center gap-3 bg-muted/70 rounded-xl px-3 py-2">
          <span className="size-8 shrink-0 rounded bg-info/30" />
          <span className="text-xs font-bold text-foreground">5 prod...</span>
          <span className="text-xs text-muted-foreground flex-1 truncate">
            Forma de bolo, batedeira e mais utensílios...
          </span>
          <ChevronDown className="size-4 text-muted-foreground shrink-0" />
        </div>

        {/* Comments preview */}
        <div className="mx-4 mt-3 bg-muted/70 rounded-xl p-3">
          <p className="text-sm font-extrabold">
            Comentários <span className="text-muted-foreground font-bold">324</span>
          </p>
          <div className="mt-2 flex items-start gap-2">
            <span className="size-7 shrink-0 rounded-full bg-success/40" />
            <p className="text-xs leading-snug">
              Consegui fazer e foi um sucesso! Ficou super fofinho, obrigada pela receita
            </p>
          </div>
        </div>
      </button>

      {/* Shorts grid */}
      <div className="mt-5 px-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="size-6 rounded-md bg-destructive flex items-center justify-center">
            <PlaySquare className="size-3.5 text-destructive-foreground" fill="currentColor" />
          </span>
          <h3 className="font-extrabold text-lg">Shorts</h3>
          <MoreVertical className="ml-auto size-5 text-muted-foreground" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {shorts.map((s) => (
            <div
              key={s.title}
              className="relative aspect-[9/14] rounded-xl overflow-hidden border border-border bg-muted"
            >
              <img
                src={s.img}
                alt={s.title}
                loading="lazy"
                className="absolute inset-0 size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
              {s.badge && (
                <span className="absolute top-2 left-2 bg-white text-foreground text-[10px] font-extrabold px-1.5 py-0.5 rounded z-10">
                  {s.badge}
                </span>
              )}
              <MoreVertical className="absolute top-2 right-1 size-4 text-white/90 z-10" />
              <p className="absolute bottom-2 left-2 right-2 text-xs font-extrabold text-white leading-tight line-clamp-2 z-10">
                {s.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* More videos below shorts */}
      <div className="mt-6 flex flex-col">
        {moreVideos.map((v) => (
          <div key={v.title} className="flex flex-col">
            <div className="relative aspect-video bg-muted overflow-hidden">
              <img
                src={v.img}
                alt={v.title}
                loading="lazy"
                className="absolute inset-0 size-full object-cover"
              />
              <span className="absolute bottom-2 right-2 bg-foreground/80 text-background text-xs font-bold px-1.5 py-0.5 rounded">
                {v.duration}
              </span>
            </div>
            <div className="flex gap-3 px-4 py-3">
              <img
                src={avatarImg}
                alt=""
                className="size-10 shrink-0 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="font-extrabold leading-snug text-sm">{v.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {v.channel} · {v.meta}
                </p>
              </div>
              <MoreVertical className="size-5 text-muted-foreground" />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom nav (auto-hides on scroll down, like the real app) */}
      <div
        className={`mt-5 border-t border-border grid grid-cols-5 py-2 text-[11px] font-medium bg-card sticky bottom-0 transition-transform duration-300 ${
          navVisible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {[
          { I: HomeFilledIcon, l: "Início", on: true },
          { I: PlaySquare, l: "Shorts" },
          { I: PlusCircle, l: "" },
          { I: ListVideo, l: "Inscrições", dot: true },
          { I: UserIcon, l: "Você" },
        ].map(({ I, l, on, dot }, i) => (
          <div key={i} className={`relative flex flex-col items-center gap-0.5 ${on ? "text-foreground" : "text-muted-foreground"}`}>
            <div className="relative">
              <I className={i === 2 ? "size-8" : "size-5"} strokeWidth={i === 0 ? 2.5 : 2} />
              {dot && <span className="absolute -top-0.5 -right-1 size-1.5 rounded-full bg-destructive" />}
            </div>
            {l && <span>{l}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Simulated YouTube Video ---------- */
function SimVideo({
  liked,
  onLike,
  onShare,
  onFinish,
}: {
  liked: boolean;
  onLike: () => void;
  onShare: () => void;
  onFinish: () => void;
}) {
  const upNext = [
    {
      title: "Bolo de fubá cremoso da vovó",
      channel: "Receitas da Vovó",
      meta: "1,1 mi · há 1 mês",
      duration: "12:08",
      gradient: "from-warning/40 to-destructive/30",
    },
    {
      title: "Pão caseiro fácil — sem sovar",
      channel: "Cozinha Simples",
      meta: "560 mil · há 2 semanas",
      duration: "09:42",
      gradient: "from-info/30 to-success/30",
    },
  ];
  return (
    <div className="flex flex-col bg-background flex-1">
      {/* Player */}
      <div className="relative aspect-video bg-black flex items-center justify-center">
        <ChevronDown className="absolute top-3 left-3 size-6 text-white/90" />
        <MoreVertical className="absolute top-3 right-3 size-6 text-white/90" />
        <Play className="size-16 text-white/90" fill="currentColor" />
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div className="h-full w-1/3 bg-destructive" />
        </div>
        <span className="absolute bottom-2 right-2 text-white/90 text-[11px] font-bold tabular-nums">
          9:08 / 27:32
        </span>
      </div>
      {/* Title */}
      <div className="px-4 pt-3">
        <h2 className="font-extrabold text-base leading-snug">
          BOLO DE CHOCOLATE FÁCIL E RÁPIDO FEITO A MÃO ( SUPER FOFINHO )
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          468 mil visualizações · há 5 dias · #receita #bolo
        </p>
      </div>
      {/* Channel */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="size-10 rounded-full bg-info/30" />
          <div>
            <p className="font-extrabold text-sm">Receitas da Vovó</p>
            <p className="text-xs text-muted-foreground">1,2 mi inscritos</p>
          </div>
        </div>
        <button className="h-9 px-4 rounded-full bg-foreground text-background text-sm font-extrabold">
          Inscrever-se
        </button>
      </div>
      {/* Action buttons (YouTube-style pill row) */}
      <div className="flex overflow-x-hidden gap-2 px-4 py-2 pb-3">
        {/* Like / Dislike combined pill */}
        <div
          className={`shrink-0 inline-flex items-center h-9 rounded-full bg-muted overflow-hidden transition ${
            liked ? "" : "animate-pulse-ring"
          }`}
        >
          <button
            type="button"
            onClick={onLike}
            className={`inline-flex items-center gap-1.5 h-full pl-3 pr-3 text-sm font-bold ${
              liked ? "text-info" : "text-foreground"
            }`}
          >
            <ThumbsUp className="size-4" fill={liked ? "currentColor" : "none"} />
            {liked ? "42 mil" : "42 mil"}
          </button>
          <span className="h-5 w-px bg-border" />
          <button
            type="button"
            className="inline-flex items-center h-full px-3 text-foreground"
            aria-label="Não gostei"
          >
            <ThumbsDown className="size-4" />
          </button>
        </div>
        <button
          type="button"
          onClick={onShare}
          className="shrink-0 inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-muted text-foreground text-sm font-bold animate-pulse-ring"
        >
          <Share2 className="size-4" />
          Compartilhar
        </button>
        <button
          type="button"
          className="shrink-0 inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-muted text-foreground text-sm font-bold"
        >
          <Download className="size-4" />
          Download
        </button>
        <button
          type="button"
          className="shrink-0 inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-muted text-foreground text-sm font-bold"
        >
          <Scissors className="size-4" />
          Cortar
        </button>
      </div>

      {/* Comments preview */}
      <div className="mx-4 rounded-xl bg-muted/60 p-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-extrabold">Comentários · 1.234</p>
          <ChevronDown className="size-4 text-muted-foreground" />
        </div>
        <div className="mt-2 flex items-start gap-2">
          <span className="size-7 shrink-0 rounded-full bg-success/40" />
          <p className="text-xs leading-snug">
            <span className="font-extrabold">@mariaclara</span> Ficou maravilhoso! Já fiz 3 vezes 🍰
          </p>
        </div>
      </div>

      {/* Up next */}
      <div className="mt-3">
        <p className="px-4 text-xs font-extrabold text-muted-foreground uppercase tracking-wide">
          A seguir
        </p>
        {upNext.map((v) => (
          <div key={v.title} className="flex gap-3 px-4 py-2">
            <div
              className={`relative w-32 aspect-video shrink-0 rounded-lg bg-gradient-to-br ${v.gradient} flex items-center justify-center overflow-hidden`}
            >
              <Play className="size-7 text-foreground/70" fill="currentColor" />
              <span className="absolute bottom-1 right-1 bg-foreground/80 text-background text-[10px] font-bold px-1 rounded">
                {v.duration}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-extrabold text-sm leading-snug line-clamp-2">{v.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{v.channel}</p>
              <p className="text-xs text-muted-foreground">{v.meta}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Finish bar */}
      <div className="mt-auto p-4 border-t border-border bg-card sticky bottom-0">
        <button
          type="button"
          onClick={onFinish}
          disabled={!liked}
          className="w-full h-14 rounded-2xl bg-success text-white text-lg font-extrabold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition"
        >
          {liked ? "Concluir simulação" : "Dê um 'Joinha' para concluir"}
        </button>
      </div>
    </div>
  );
}
