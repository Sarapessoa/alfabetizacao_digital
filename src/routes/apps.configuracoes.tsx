import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Volume2,
  Square,
  X,
  Settings,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Sun,
  Type,
  SlidersHorizontal,
  User,
  Volume1,
  VolumeX,
} from "lucide-react";
import { A11yToggle, useA11y } from "../lib/a11y";
import { markSimulationCompleted } from "../lib/simulationProgress";
import { useAudioTts } from "../lib/tts";

export const Route = createFileRoute("/apps/configuracoes")({
  component: ConfigSimulation,
  head: () => ({
    meta: [
      { title: "Configurações — Ajudante Tech" },
      {
        name: "description",
        content:
          "Aprenda a mexer nas Configurações do celular: ajustar som, brilho e tamanho da letra, com simulação prática passo a passo.",
      },
    ],
  }),
});

type Stage =
  | "intro"
  | "overview"
  | "sim-home"
  | "sim-sound"
  | "sim-brightness"
  | "sim-textsize"
  | "done";

type FuncKey = "sound" | "brightness" | "text";

const FUNC_ORDER: FuncKey[] = ["sound", "brightness", "text"];

function ConfigSimulation() {
  const [stage, setStage] = useState<Stage>("overview");
  const [speaking, setSpeaking] = useState(false);
  const { enabled: a11y } = useA11y();
  const navigate = useNavigate();

  // completion flags
  const [done, setDone] = useState<Record<FuncKey, boolean>>({
    sound: false,
    brightness: false,
    text: false,
  });

  // sound
  const [volume, setVolume] = useState(30);
  const [volumeTouched, setVolumeTouched] = useState(false);
  // brightness
  const [brightness, setBrightness] = useState(40);
  const [brightnessTouched, setBrightnessTouched] = useState(false);
  // text size
  const [textSize, setTextSize] = useState(2);
  const [textTouched, setTextTouched] = useState(false);

  const [dialog, setDialog] = useState<null | { title: string; body: string }>(null);

  const steps = [
    { n: 1, label: "Som", key: "sound" as FuncKey },
    { n: 2, label: "Brilho", key: "brightness" as FuncKey },
    { n: 3, label: "Letra", key: "text" as FuncKey },
  ];

  const completedCount = FUNC_ORDER.filter((k) => done[k]).length;
  const nextFunc: FuncKey | null =
    FUNC_ORDER.find((k) => !done[k]) ?? null;
  const isDone = stage === "done";
  const allDone = completedCount === FUNC_ORDER.length;

  const Stepper = (
    <div className="w-full max-w-md mx-auto px-5 py-3">
      <div className="flex items-center justify-between mb-1.5">
        <p className={`font-extrabold ${a11y ? "text-sm" : "text-xs"}`}>
          {isDone ? "Simulação concluída! 🎉" : `Etapa ${Math.min(completedCount + 1, steps.length)} de ${steps.length}`}
        </p>
        <p className={`font-medium ${a11y ? "text-sm text-foreground" : "text-xs text-muted-foreground"}`}>
          {isDone ? "100%" : `${Math.round((completedCount / steps.length) * 100)}%`}
        </p>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={steps.length}
        aria-valuenow={isDone ? steps.length : completedCount}
        aria-label="Progresso da simulação"
        className={`h-2 w-full rounded-full overflow-hidden ${a11y ? "bg-background border border-foreground" : "bg-muted"}`}
      >
        <div
          className={`h-full transition-all duration-500 ${a11y ? "bg-foreground" : "bg-primary"}`}
          style={{ width: `${(completedCount / steps.length) * 100}%` }}
        />
      </div>
    </div>
  );

  // Auto-advance from intro splash to the simulation home
  useEffect(() => {
    if (stage !== "intro") return;
    const t = setTimeout(() => setStage("sim-home"), 1800);
    return () => clearTimeout(t);
  }, [stage]);

  useEffect(() => {
    if (stage === "done") markSimulationCompleted("configuracoes");
  }, [stage]);

  const { speak, stopSpeaking } = useAudioTts({ setSpeaking });

  const screenText = useMemo(() => {
    switch (stage) {
      case "overview":
        return "Configurações. É como o painel de ajustes da casa, onde você liga e regula as coisas. Toque em iniciar simulação prática para começar.";
      case "sim-home":
        return allDone
          ? "Você concluiu todos os ajustes. Toque em concluir simulação."
          : "Esta é a tela de Ajustes. Toque na opção que está piscando para começar.";
      case "sim-sound":
        return "Som. Arraste a barrinha para ajustar o volume, depois toque em Continuar.";
      case "sim-brightness":
        return "Brilho. Arraste a barrinha para deixar a tela mais clara ou mais escura.";
      case "sim-textsize":
        return "Tamanho da letra. Toque em A menos ou A mais para mudar o tamanho.";
      case "done":
        return "Parabéns! Você aprendeu a mexer nas configurações principais do celular.";
      default:
        return "Configurações";
    }
  }, [stage, allDone]);

  const screenAudioFile = useMemo(() => {
    switch (stage) {
      case "overview":
        return "configuracoes-overview.mp3";
      case "sim-home":
        return allDone
          ? "configuracoes-home-concluiu-ajustes.mp3"
          : "configuracoes-home-ajustes.mp3";
      case "sim-sound":
        return "configuracoes-som.mp3";
      case "sim-brightness":
        return "configuracoes-brilho.mp3";
      case "sim-textsize":
        return "configuracoes-tamanho-letra.mp3";
      case "done":
        return "configuracoes-concluido.mp3";
      default:
        return "configuracoes-overview.mp3";
    }
  }, [stage, allDone]);

  const handleSpeak = () =>
    speaking ? stopSpeaking() : speak({ file: screenAudioFile, text: screenText });

  const goHome = () => setStage("sim-home");

  // ----- Intro splash -----
  if (stage === "intro") {
    return (
      <main className={`min-h-screen flex flex-col items-center justify-center ${a11y ? "bg-foreground text-background" : "bg-primary text-primary-foreground"}`}>
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className={`size-24 rounded-full flex items-center justify-center shadow-2xl ${a11y ? "bg-background text-foreground" : "bg-primary-foreground text-primary"}`}>
            <Settings className="size-12" strokeWidth={2.6} />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Configurações</h1>
        </div>
      </main>
    );
  }

  // ----- Header bar (shared) -----
  const headerBar = (
    <header className={`px-5 pt-5 pb-6 ${a11y ? "bg-foreground text-background" : "bg-primary text-primary-foreground"}`}>
      <div className="w-full max-w-md mx-auto flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <Link
            to="/apps"
            aria-label="Voltar para aplicativos"
            className={`inline-flex items-center gap-2 rounded-2xl font-bold transition ${
              a11y ? "h-14 px-4 text-lg bg-background text-foreground hover:opacity-90" : "h-11 px-3 text-base hover:bg-primary-foreground/10"
            }`}
          >
            <ArrowLeft className={a11y ? "size-6" : "size-5"} />
            Voltar
          </Link>
          <div className="flex items-center gap-2">
            <A11yToggle />
            <button
              type="button"
              onClick={handleSpeak}
              aria-label={speaking ? "Parar leitura" : "Ouvir"}
              className={`inline-flex items-center gap-2 rounded-full font-bold hover:opacity-90 transition ${
                a11y ? "h-14 px-4 bg-background text-foreground text-lg border-4 border-background" : "h-11 px-3 bg-primary-foreground text-primary text-base"
              }`}
            >
              {speaking ? <Square className={a11y ? "size-6" : "size-5"} /> : <Volume2 className={a11y ? "size-6" : "size-5"} />}
              {speaking ? "Parar" : "Ouvir"}
            </button>
          </div>
        </div>
        <h1
          className={`font-extrabold text-center tracking-tight ${
            a11y ? "text-5xl" : "text-4xl"
          }`}
        >
          Configurações
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
            className={`rounded-2xl bg-card p-5 ${
              a11y ? "border-4 border-foreground" : "border border-border border-l-8 border-l-primary shadow-md"
            }`}
          >
            <h2 className={`font-extrabold ${a11y ? "text-2xl text-foreground" : "text-xl text-primary"}`}>
              O que é parecido?
            </h2>
            <div
              className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-extrabold ${
                a11y ? "text-lg bg-foreground text-background" : "text-base bg-primary/10 text-primary"
              }`}
            >
              <SlidersHorizontal className="size-5" />
              Painel de ajustes da casa
            </div>
            <p
              className={`mt-3 leading-snug ${
                a11y ? "text-xl text-foreground" : "text-lg text-muted-foreground"
              }`}
            >
              É como os <strong className={a11y ? "text-foreground" : "text-primary"}>botões e ajustes</strong> da sua casa:
              acende a luz, regula o volume do rádio e arruma as coisas do jeito que você gosta.
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
                Etapa 1 de {steps.length}
              </p>
            </div>
            <div className={`h-2.5 w-full rounded-full overflow-hidden mb-4 ${a11y ? "bg-background border border-foreground" : "bg-muted"}`}>
              <div className={`h-full transition-all duration-500 ${a11y ? "bg-foreground" : "bg-primary"}`} style={{ width: "25%" }} />
            </div>
            <ol className="flex flex-col gap-3">
              {[
                { n: 1, t: "Ajustar o Som", d: "Arraste a barrinha para deixar o volume mais alto ou mais baixo, do jeito que você ouve melhor." },
                { n: 2, t: "Ajustar o Brilho", d: "Arraste a barrinha para deixar a tela mais clara ou mais escura, conforme a luz do ambiente." },
                { n: 3, t: "Aumentar a Letra", d: "Use os botões A menos e A mais para deixar as palavras maiores e mais fáceis de ler." },
              ].map((s) => {
                const active = s.n === 1;
                return (
                  <li
                    key={s.n}
                    className={`rounded-2xl p-4 transition ${
                      active
                        ? a11y
                          ? "bg-card border-4 border-foreground"
                          : "bg-primary/5 border-2 border-primary"
                        : a11y
                          ? "bg-card border-4 border-foreground"
                          : "bg-card border border-border"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`size-8 rounded-full inline-flex items-center justify-center font-extrabold ${
                          active
                            ? a11y
                              ? "bg-foreground text-background ring-4 ring-foreground/25"
                              : "bg-primary text-primary-foreground ring-4 ring-primary/25"
                            : a11y
                              ? "bg-foreground text-background"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {s.n}
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
              a11y ? "bg-foreground text-background border-4 border-foreground hover:opacity-90" : "bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90"
            }`}
          >
            <Settings className="size-6" />
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
          <div className={`size-24 rounded-full flex items-center justify-center ${a11y ? "bg-foreground text-background" : "bg-success/15 text-success"}`}>
            <CheckCircle2 className="size-14" strokeWidth={2.4} />
          </div>
          <h2 className={`font-extrabold ${a11y ? "text-3xl" : "text-2xl"}`}>
            Muito bem! Você conseguiu!
          </h2>
          <p className={`leading-snug ${a11y ? "text-xl" : "text-lg text-muted-foreground"}`}>
            Você aprendeu a ajustar o som, o brilho e o tamanho da letra. Agora pode
            deixar o celular do seu jeitinho.
          </p>
          <div className="flex flex-col gap-3 w-full">
            <button
              type="button"
              onClick={() => {
                setDone({ sound: false, brightness: false, text: false });
                setVolumeTouched(false);
                setBrightnessTouched(false);
                setTextTouched(false);
                setStage("overview");
              }}
              className={`h-14 rounded-2xl bg-card text-foreground text-lg font-bold hover:bg-muted transition ${a11y ? "border-4 border-foreground" : "border-2 border-border"}`}
            >
              Repetir simulação
            </button>
            <button
              type="button"
              onClick={() => navigate({ to: "/apps" })}
              className={`h-14 rounded-2xl text-lg font-extrabold transition ${a11y ? "bg-foreground text-background border-4 border-foreground hover:opacity-90" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
            >
              Ver outros aplicativos
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ----- Tip banner content -----
  const tip =
    stage === "sim-home"
      ? allDone
        ? "Você concluiu todos os ajustes! Toque em Concluir simulação."
        : nextFunc === "sound"
          ? "Toque em Som (está piscando) para ajustar o volume."
          : nextFunc === "brightness"
            ? "Agora toque em Tela e Brilho."
            : "Por último, toque em Tamanho da Letra."
      : stage === "sim-sound"
        ? volumeTouched
          ? "Quando estiver bom, toque em Voltar aos Ajustes."
            : "Arraste a barrinha do volume para a direita ou esquerda."
          : stage === "sim-brightness"
            ? brightnessTouched
              ? "Quando estiver bom, toque em Voltar aos Ajustes."
              : "Arraste a barrinha do brilho. Mais para a direita, mais clara fica a tela."
            : textTouched
              ? "Veja como o texto mudou. Toque em Voltar aos Ajustes."
              : "Toque em A− para diminuir ou A+ para aumentar a letra.";

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Instruction bar */}
      <div className="sticky top-0 z-20 shadow-md">
        <div className={a11y ? "bg-foreground text-background" : "bg-primary text-primary-foreground"}>
          <div className="w-full max-w-md mx-auto px-4 py-2.5 flex items-center gap-2">
            <p className={`flex-1 leading-snug font-semibold min-w-0 ${a11y ? "text-base" : "text-sm"}`}>
              {tip}
            </p>
            <Link
              to="/apps"
              aria-label="Sair da simulação"
              className={`shrink-0 inline-flex items-center gap-1 rounded-full font-bold transition ${
                a11y ? "h-10 px-4 bg-background text-foreground text-base" : "h-8 px-3 bg-white/20 hover:bg-white/30 text-sm"
              }`}
            >
              <X className={a11y ? "size-5" : "size-4"} /> Sair
            </Link>
          </div>
        </div>
        <div className={`bg-card ${a11y ? "border-b-4 border-foreground" : "border-b border-border"}`}>
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={steps.length}
            aria-valuenow={completedCount}
            aria-label="Progresso da simulação"
            className="w-full max-w-md mx-auto px-4 py-2.5 flex items-center gap-3"
          >
            {steps.map((s, i) => {
              const isStepDone = isDone || done[s.key];
              const active = !isDone && !done[s.key] && nextFunc === s.key;
              return (
                <div key={s.n} className="flex items-center gap-3 flex-1 last:flex-none">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`rounded-full inline-flex items-center justify-center font-extrabold transition ${
                      a11y ? "size-8 text-sm" : "size-6 text-xs"
                    } ${
                      a11y
                        ? isStepDone || active
                          ? "bg-foreground text-background"
                          : "bg-background text-foreground border-2 border-foreground"
                        : isStepDone ? "bg-success text-white" : active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}>
                      {isStepDone ? <CheckCircle2 className={a11y ? "size-5" : "size-3.5"} /> : s.n}
                    </span>
                    <span className={`font-bold leading-none ${a11y ? "text-sm text-foreground" : active ? "text-xs text-foreground" : "text-xs text-muted-foreground"}`}>
                      {s.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`flex-1 rounded-full overflow-hidden ${a11y ? "h-1.5 bg-background border border-foreground" : "h-1 bg-muted"}`}>
                      <div className={`h-full transition-all duration-500 ${a11y ? "bg-foreground" : "bg-success"}`} style={{ width: (isDone || done[steps[i].key]) ? "100%" : "0%" }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="w-full max-w-md mx-auto flex-1 flex flex-col min-h-0">
        {stage === "sim-home" ? (
          <SimHome
            done={done}
            nextFunc={nextFunc}
            allDone={allDone}
            onPick={(k) => {
              if (k === "sound") setStage("sim-sound");
              else if (k === "brightness") setStage("sim-brightness");
              else setStage("sim-textsize");
            }}
            onFinish={() => setStage("done")}
          />
        ) : stage === "sim-sound" ? (
          <SimSound
            volume={volume}
            touched={volumeTouched}
            onChange={(v) => {
              setVolume(v);
              setVolumeTouched(true);
            }}
            onBackToHome={() => {
              setDone((d) => ({ ...d, sound: true }));
              goHome();
            }}
          />
        ) : stage === "sim-brightness" ? (
          <SimBrightness
            brightness={brightness}
            touched={brightnessTouched}
            onChange={(v) => {
              setBrightness(v);
              setBrightnessTouched(true);
            }}
            onBackToHome={() => {
              setDone((d) => ({ ...d, brightness: true }));
              goHome();
            }}
          />
        ) : (
          <SimTextSize
            size={textSize}
            touched={textTouched}
            onChange={(v) => {
              setTextSize(v);
              setTextTouched(true);
            }}
            onBackToHome={() => {
              setDone((d) => ({ ...d, text: true }));
              goHome();
            }}
          />
        )}
      </div>

      <div className="fixed right-4 bottom-4 z-30">
        <A11yToggle
          compact
          className={a11y ? "shadow-xl" : "shadow-lg shadow-foreground/20"}
        />
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
            className={`w-full max-w-md rounded-3xl bg-card p-6 flex flex-col gap-3 ${
              a11y ? "border-4 border-foreground" : "border-2 border-border shadow-2xl"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`flex items-center gap-2 ${a11y ? "text-foreground" : "text-primary"}`}>
              <Sparkles className={a11y ? "size-7" : "size-6"} />
              <h3 id="exp-title" className={`font-extrabold ${a11y ? "text-2xl" : "text-xl"}`}>
                {dialog.title}
              </h3>
            </div>
            <p className={`leading-snug ${a11y ? "text-xl text-foreground" : "text-base text-muted-foreground"}`}>
              {dialog.body}
            </p>
            <button
              type="button"
              onClick={() => setDialog(null)}
              className={`mt-2 rounded-full font-extrabold transition ${
                a11y ? "h-14 bg-foreground text-background text-lg border-4 border-foreground hover:opacity-90" : "h-12 bg-primary text-primary-foreground text-base hover:bg-primary/90"
              }`}
            >
              OK, entendi
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

/* ---------- Settings home (list of functions) ---------- */
function SimHome({
  done,
  nextFunc,
  allDone,
  onPick,
  onFinish,
}: {
  done: Record<FuncKey, boolean>;
  nextFunc: FuncKey | null;
  allDone: boolean;
  onPick: (k: FuncKey) => void;
  onFinish: () => void;
}) {
  const { enabled: a11y } = useA11y();
  const items: {
    key: FuncKey;
    title: string;
    value: string;
    icon: React.ReactNode;
    iconBg: string;
  }[] = [
    {
      key: "sound",
      title: "Som",
      value: done.sound ? "Ajustado" : "Padrão",
      icon: <Volume2 className="size-6 text-white" />,
      iconBg: "bg-[oklch(0.62_0.20_25)]",
    },
    {
      key: "brightness",
      title: "Tela e Brilho",
      value: done.brightness ? "Ajustado" : "Automático",
      icon: <Sun className="size-6 text-white" />,
      iconBg: "bg-[oklch(0.78_0.16_75)]",
    },
    {
      key: "text",
      title: "Tamanho da Letra",
      value: done.text ? "Ajustado" : "Padrão",
      icon: <Type className="size-6 text-white" />,
      iconBg: "bg-[oklch(0.55_0.15_140)]",
    },
  ];

  return (
    <div className="flex flex-col flex-1 bg-background">
      <div className={`px-4 py-3 flex items-center justify-between ${a11y ? "border-b-4 border-foreground" : "border-b border-border"}`}>
        <h2 className={`font-extrabold ${a11y ? "text-2xl" : "text-xl"}`}>Ajustes</h2>
        <User className={a11y ? "size-7 text-foreground" : "size-6 text-foreground"} />
      </div>
      <ul className="flex flex-col">
        {items.map((it) => {
          const isDoneItem = done[it.key];
          const isNext = !isDoneItem && nextFunc === it.key;
          return (
            <li key={it.key}>
              <button
                type="button"
                onClick={() => onPick(it.key)}
                className={`w-full flex items-center gap-4 px-4 py-4 text-left transition ${
                  a11y ? "border-b-4 border-foreground" : "border-b border-border"
                } ${
                  a11y
                    ? isNext
                      ? "bg-card animate-pulse-ring"
                      : "hover:bg-muted"
                    : isNext
                      ? "bg-primary/5 animate-pulse-ring"
                      : isDoneItem
                        ? "bg-success/5 hover:bg-success/10"
                        : "hover:bg-muted"
                }`}
              >
                <span className={`rounded-xl flex items-center justify-center ${
                  a11y ? "size-14 bg-foreground text-background" : `size-10 ${it.iconBg}`
                }`}>
                  {it.icon}
                </span>
                <span className="flex-1 min-w-0">
                  <span className={`block font-bold ${a11y ? "text-2xl" : "text-lg"}`}>{it.title}</span>
                  <span
                    className={`block font-bold ${
                      a11y ? "text-lg text-foreground" : isDoneItem ? "text-sm text-success" : "text-sm text-muted-foreground"
                    }`}
                  >
                    {it.value}
                  </span>
                </span>
                {isDoneItem ? (
                  <span className={`inline-flex items-center gap-1 font-extrabold ${a11y ? "text-base text-foreground" : "text-sm text-success"}`}>
                    <CheckCircle2 className={a11y ? "size-6" : "size-5"} />
                    Feito
                  </span>
                ) : isNext ? (
                  <span className={`inline-flex items-center gap-1 font-extrabold ${a11y ? "text-base bg-foreground text-background rounded-full px-3 py-1.5" : "text-sm text-primary"}`}>
                    Toque aqui
                    <ChevronRight className={a11y ? "size-6" : "size-5"} />
                  </span>
                ) : (
                  <ChevronRight className={a11y ? "size-6 text-foreground" : "size-5 text-muted-foreground"} />
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {allDone && (
        <div className="p-5 mt-auto">
          <button
            type="button"
            onClick={onFinish}
            className={`w-full h-14 rounded-2xl text-lg font-extrabold hover:opacity-90 transition animate-pulse-ring ${
              a11y ? "bg-foreground text-background border-4 border-foreground" : "bg-success text-white shadow-md"
            }`}
          >
            Concluir simulação
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------- Sound ---------- */
function SimSound({
  volume,
  touched,
  onChange,
  onBackToHome,
}: {
  volume: number;
  touched: boolean;
  onChange: (v: number) => void;
  onBackToHome: () => void;
}) {
  const { enabled: a11y } = useA11y();
  const Icon = volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2;
  const sliderBg = a11y
    ? `linear-gradient(to right, var(--foreground) 0%, var(--foreground) ${volume}%, var(--background) ${volume}%, var(--background) 100%)`
    : `linear-gradient(to right, var(--primary) 0%, var(--primary) ${volume}%, var(--muted) ${volume}%, var(--muted) 100%)`;
  return (
    <div className="flex flex-col flex-1 bg-background">
      <div className={`px-4 py-3 flex items-center gap-3 ${a11y ? "border-b-4 border-foreground" : "border-b border-border"}`}>
        <h2 className={`font-extrabold ${a11y ? "text-2xl" : "text-xl"}`}>Som e Volume</h2>
      </div>
      <div className="p-6 flex flex-col gap-8">
        <div className={`rounded-3xl bg-card p-6 flex flex-col items-center gap-4 ${a11y ? "border-4 border-foreground" : "border-2 border-border shadow-md"}`}>
          <div className={`size-24 rounded-full flex items-center justify-center ${a11y ? "bg-foreground text-background" : "bg-primary/10 text-primary"}`}>
            <Icon className="size-14" strokeWidth={2.4} />
          </div>
          <p className="text-5xl font-extrabold tabular-nums">{volume}%</p>
          <p className={`font-bold ${a11y ? "text-xl text-foreground" : "text-base text-muted-foreground"}`}>Volume do Toque</p>
        </div>

        <div>
          <label htmlFor="vol-slider" className="text-lg font-extrabold mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2"><VolumeX className="size-5" /> Baixo</span>
            <span className="flex items-center gap-2">Alto <Volume2 className="size-5" /></span>
          </label>
          <input
            id="vol-slider"
            type="range"
            min={0}
            max={100}
            step={1}
            value={volume}
            onChange={(e) => onChange(Number(e.target.value))}
            aria-label="Ajustar volume"
            className={`w-full rounded-full appearance-none cursor-pointer ${a11y ? "h-5 border-2 border-foreground accent-foreground" : "h-4 bg-muted accent-primary"}`}
            style={{
              background: sliderBg,
            }}
          />
        </div>

        <button
          type="button"
          onClick={onBackToHome}
          disabled={!touched}
          className={`h-14 rounded-2xl text-lg font-extrabold disabled:opacity-50 disabled:cursor-not-allowed transition inline-flex items-center justify-center gap-2 ${
            a11y ? "bg-foreground text-background border-4 border-foreground hover:opacity-90" : "bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
          }`}
        >
          <ChevronLeft className="size-5" /> Voltar aos Ajustes
        </button>
      </div>
    </div>
  );
}

/* ---------- Brightness ---------- */
function SimBrightness({
  brightness,
  touched,
  onChange,
  onBackToHome,
}: {
  brightness: number;
  touched: boolean;
  onChange: (v: number) => void;
  onBackToHome: () => void;
}) {
  const { enabled: a11y } = useA11y();
  const previewBg = `oklch(${0.18 + (brightness / 100) * 0.78} 0.02 90)`;
  const previewFg = brightness > 55 ? "oklch(0.2 0 0)" : "oklch(0.95 0 0)";
  const sliderBg = a11y
    ? `linear-gradient(to right, var(--foreground) 0%, var(--foreground) ${brightness}%, var(--background) ${brightness}%, var(--background) 100%)`
    : `linear-gradient(to right, var(--primary) 0%, var(--primary) ${brightness}%, var(--muted) ${brightness}%, var(--muted) 100%)`;
  return (
    <div className="flex flex-col flex-1 bg-background">
      <div className={`px-4 py-3 flex items-center gap-3 ${a11y ? "border-b-4 border-foreground" : "border-b border-border"}`}>
        <h2 className={`font-extrabold ${a11y ? "text-2xl" : "text-xl"}`}>Tela e Brilho</h2>
      </div>
      <div className="p-6 flex flex-col gap-6">
        <div
          className={`rounded-3xl p-6 flex flex-col items-center gap-3 transition-colors ${a11y ? "border-4 border-foreground bg-card text-foreground" : "border-2 border-border shadow-md"}`}
          style={a11y ? undefined : { backgroundColor: previewBg, color: previewFg }}
        >
          <Sun className="size-14" strokeWidth={2.4} style={a11y ? undefined : { color: previewFg }} />
          <p className="text-5xl font-extrabold tabular-nums">{brightness}%</p>
          <p className="text-base font-bold opacity-80">Veja como a tela fica</p>
        </div>

        <div>
          <label htmlFor="bright-slider" className="text-lg font-extrabold mb-3 flex items-center justify-between">
            <span>Escuro</span>
            <span>Claro</span>
          </label>
          <input
            id="bright-slider"
            type="range"
            min={5}
            max={100}
            step={1}
            value={brightness}
            onChange={(e) => onChange(Number(e.target.value))}
            aria-label="Ajustar brilho"
            className={`w-full rounded-full appearance-none cursor-pointer ${a11y ? "h-5 border-2 border-foreground accent-foreground" : "h-4 accent-primary"}`}
            style={{
              background: sliderBg,
            }}
          />
        </div>

        <button
          type="button"
          onClick={onBackToHome}
          disabled={!touched}
          className={`h-14 rounded-2xl text-lg font-extrabold disabled:opacity-50 disabled:cursor-not-allowed transition inline-flex items-center justify-center gap-2 ${
            a11y ? "bg-foreground text-background border-4 border-foreground hover:opacity-90" : "bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
          }`}
        >
          <ChevronLeft className="size-5" /> Voltar aos Ajustes
        </button>
      </div>
    </div>
  );
}

/* ---------- Text Size ---------- */
function SimTextSize({
  size,
  touched,
  onChange,
  onBackToHome,
}: {
  size: number;
  touched: boolean;
  onChange: (v: number) => void;
  onBackToHome: () => void;
}) {
  const { enabled: a11y } = useA11y();
  const sizes = [14, 18, 22, 28, 34];
  const px = sizes[Math.max(0, Math.min(4, size - 1))];
  const labels = ["Pequena", "Padrão", "Média", "Grande", "Muito grande"];
  return (
    <div className="flex flex-col flex-1 bg-background">
      <div className={`px-4 py-3 flex items-center gap-3 ${a11y ? "border-b-4 border-foreground" : "border-b border-border"}`}>
        <h2 className={`font-extrabold ${a11y ? "text-2xl" : "text-xl"}`}>Tamanho da Letra</h2>
      </div>
      <div className="p-6 flex flex-col gap-6">
        <div className={`rounded-3xl bg-card p-6 ${a11y ? "border-4 border-foreground" : "border-2 border-border shadow-md"}`}>
          <p className={`font-bold uppercase tracking-wide mb-3 ${a11y ? "text-base text-foreground" : "text-sm text-muted-foreground"}`}>
            Veja como a letra fica
          </p>
          <p
            className="font-bold leading-snug text-foreground transition-all"
            style={{ fontSize: `${px}px` }}
          >
            Bom dia! Hoje é um lindo dia para aprender coisas novas no celular.
          </p>
          <p className={`mt-4 font-bold ${a11y ? "text-lg text-foreground" : "text-sm text-primary"}`}>
            Tamanho atual: {labels[size - 1]}
          </p>
        </div>

        <div className={`flex items-center justify-between gap-3 bg-card rounded-2xl p-3 ${a11y ? "border-4 border-foreground" : "border-2 border-border"}`}>
          <button
            type="button"
            onClick={() => onChange(Math.max(1, size - 1))}
            disabled={size <= 1}
            aria-label="Diminuir letra"
            className={`flex-1 h-16 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed font-extrabold inline-flex items-center justify-center gap-2 transition ${
              a11y ? "bg-background text-foreground border-4 border-foreground hover:bg-muted" : "bg-muted hover:bg-muted/70 text-foreground"
            }`}
          >
            <Type className="size-5" />
            <span className="text-2xl">A−</span>
          </button>
          <div className="px-3">
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className={`h-2 w-5 rounded-full transition ${
                    a11y
                      ? i <= size ? "bg-foreground" : "bg-background border border-foreground"
                      : i <= size ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onChange(Math.min(5, size + 1))}
            disabled={size >= 5}
            aria-label="Aumentar letra"
            className={`flex-1 h-16 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed font-extrabold inline-flex items-center justify-center gap-2 transition ${
              a11y ? "bg-foreground text-background border-4 border-foreground hover:opacity-90" : "bg-primary text-primary-foreground hover:bg-primary/90 ring-2 ring-primary/30"
            }`}
          >
            <Type className="size-6" />
            <span className="text-3xl">A+</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onBackToHome}
          disabled={!touched}
          className={`h-14 rounded-2xl text-lg font-extrabold disabled:opacity-50 disabled:cursor-not-allowed transition inline-flex items-center justify-center gap-2 ${
            a11y ? "bg-foreground text-background border-4 border-foreground hover:opacity-90" : "bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
          }`}
        >
          <ChevronLeft className="size-5" /> Voltar aos Ajustes
        </button>
      </div>
    </div>
  );
}
