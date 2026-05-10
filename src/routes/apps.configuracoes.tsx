import { useCallback, useEffect, useMemo, useState } from "react";
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
  Wifi,
  Sun,
  Type,
  SlidersHorizontal,
  Lock,
  User,
  Volume1,
  VolumeX,
  Check,
} from "lucide-react";
import { A11yToggle, useA11y } from "../lib/a11y";

export const Route = createFileRoute("/apps/configuracoes")({
  component: ConfigSimulation,
  head: () => ({
    meta: [
      { title: "Configurações — Ajudante Tech" },
      {
        name: "description",
        content:
          "Aprenda a mexer nas Configurações do celular: conectar no Wi-Fi, ajustar som, brilho e tamanho da letra, com simulação prática passo a passo.",
      },
    ],
  }),
});

type Stage =
  | "intro"
  | "overview"
  | "sim-home"
  | "sim-wifi"
  | "sim-sound"
  | "sim-brightness"
  | "sim-textsize"
  | "done";

type FuncKey = "wifi" | "sound" | "brightness" | "text";

type WifiNetwork = { ssid: string; locked: boolean; bars: 1 | 2 | 3 };

const NETWORKS: WifiNetwork[] = [
  { ssid: "Casa_Maria", locked: true, bars: 3 },
  { ssid: "Vivo-Fibra-2G", locked: true, bars: 2 },
  { ssid: "NET_Vizinho", locked: true, bars: 1 },
];

const FUNC_ORDER: FuncKey[] = ["wifi", "sound", "brightness", "text"];

function ConfigSimulation() {
  const [stage, setStage] = useState<Stage>("overview");
  const [speaking, setSpeaking] = useState(false);
  const { enabled: a11y } = useA11y();
  const navigate = useNavigate();

  // completion flags
  const [done, setDone] = useState<Record<FuncKey, boolean>>({
    wifi: false,
    sound: false,
    brightness: false,
    text: false,
  });

  // wifi sub-state
  const [wifiOn, setWifiOn] = useState(false);
  const [wifiPicked, setWifiPicked] = useState<WifiNetwork | null>(null);
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiConnected, setWifiConnected] = useState(false);
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
    { n: 1, label: "Wi-Fi", key: "wifi" as FuncKey },
    { n: 2, label: "Som", key: "sound" as FuncKey },
    { n: 3, label: "Brilho", key: "brightness" as FuncKey },
    { n: 4, label: "Letra", key: "text" as FuncKey },
  ];

  const completedCount = FUNC_ORDER.filter((k) => done[k]).length;
  const nextFunc: FuncKey | null =
    FUNC_ORDER.find((k) => !done[k]) ?? null;
  const currentStep =
    stage === "overview"
      ? 1
      : stage === "sim-home"
        ? Math.min(completedCount + 1, steps.length)
        : stage === "sim-wifi"
          ? 1
          : stage === "sim-sound"
            ? 2
            : stage === "sim-brightness"
              ? 3
              : 4;
  const isDone = stage === "done";
  const allDone = completedCount === FUNC_ORDER.length;

  const Stepper = (
    <div className="w-full max-w-md mx-auto px-5 pt-4 pb-2">
      <div className="flex items-center justify-between gap-2 mb-2">
        <p className={`font-extrabold ${a11y ? "text-base" : "text-sm"}`}>
          {isDone ? "Simulação concluída" : `Etapa ${currentStep} de ${steps.length}`}
        </p>
        <p className={`text-muted-foreground font-medium ${a11y ? "text-base" : "text-xs"}`}>
          {isDone ? "100%" : `${Math.round((completedCount / steps.length) * 100)}%`}
        </p>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={steps.length}
        aria-valuenow={isDone ? steps.length : completedCount}
        aria-label="Progresso da simulação"
        className="h-2.5 w-full rounded-full bg-muted overflow-hidden"
      >
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{
            width: `${((isDone ? steps.length : completedCount) / steps.length) * 100}%`,
          }}
        />
      </div>
      <ol className="mt-3 grid grid-cols-4 gap-2">
        {steps.map((s) => {
          const isStepDone = isDone || done[s.key];
          const active = !isDone && !done[s.key] && nextFunc === s.key;
          return (
            <li key={s.n} className="flex flex-col items-center gap-1 text-center">
              <span
                className={`size-7 rounded-full inline-flex items-center justify-center text-xs font-extrabold transition ${
                  isStepDone
                    ? "bg-success text-white"
                    : active
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/25"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {isStepDone ? <CheckCircle2 className="size-4" /> : s.n}
              </span>
              <span
                className={`leading-tight font-bold ${
                  active ? "text-foreground" : "text-muted-foreground"
                } ${a11y ? "text-sm" : "text-xs"}`}
              >
                {s.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );

  // Auto-advance from intro splash to the simulation home
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
        return "Configurações. É como o painel de ajustes da casa, onde você liga e regula as coisas. Toque em iniciar simulação prática para começar.";
      case "sim-home":
        return allDone
          ? "Você concluiu todos os ajustes. Toque em concluir simulação."
          : "Esta é a tela de Ajustes. Toque na opção que está piscando para começar.";
      case "sim-wifi":
        return "Wi-Fi. Toque no botão verde para LIGAR o Wi-Fi, escolha sua rede e digite a senha.";
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

  const handleSpeak = () => (speaking ? stopSpeaking() : speak(screenText));

  const goHome = () => setStage("sim-home");

  // ----- Intro splash -----
  if (stage === "intro") {
    return (
      <main className="min-h-screen bg-primary flex flex-col items-center justify-center text-primary-foreground">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="size-24 rounded-full bg-primary-foreground text-primary flex items-center justify-center shadow-2xl">
            <Settings className="size-12" strokeWidth={2.6} />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Configurações</h1>
        </div>
      </main>
    );
  }

  // ----- Header bar (shared) -----
  const headerBar = (
    <header className="bg-primary text-primary-foreground px-5 pt-5 pb-6">
      <div className="w-full max-w-md mx-auto flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <Link
            to="/apps"
            aria-label="Voltar para aplicativos"
            className="inline-flex items-center gap-2 h-11 px-3 rounded-2xl text-base font-bold hover:bg-primary-foreground/10 transition"
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
              className="inline-flex items-center gap-2 h-11 px-3 rounded-full bg-primary-foreground text-primary text-base font-bold hover:opacity-90 transition"
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
          Configurações
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
            className={`rounded-2xl bg-card p-5 border-l-8 border-l-primary shadow-md ${
              a11y ? "border-2 border-foreground" : "border border-border"
            }`}
          >
            <h2 className={`font-extrabold text-primary ${a11y ? "text-2xl" : "text-xl"}`}>
              O que é parecido?
            </h2>
            <div
              className={`mt-3 inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1.5 font-extrabold ${
                a11y ? "text-lg" : "text-base"
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
              É como os <strong className="text-primary">botões e ajustes</strong> da sua casa:
              acende a luz, regula o volume do rádio e arruma as coisas do jeito que você gosta.
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
                Etapa 1 de {steps.length}
              </p>
            </div>
            <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden mb-4">
              <div className="h-full bg-primary transition-all duration-500" style={{ width: "25%" }} />
            </div>
            <ol className="flex flex-col gap-3">
              {[
                { n: 1, t: "Conectar no Wi-Fi", d: "Ligue o Wi-Fi, escolha a sua rede e digite a senha para usar a internet sem gastar dados." },
                { n: 2, t: "Ajustar o Som", d: "Arraste a barrinha para deixar o volume mais alto ou mais baixo, do jeito que você ouve melhor." },
                { n: 3, t: "Ajustar o Brilho", d: "Arraste a barrinha para deixar a tela mais clara ou mais escura, conforme a luz do ambiente." },
                { n: 4, t: "Aumentar a Letra", d: "Use os botões A menos e A mais para deixar as palavras maiores e mais fáceis de ler." },
              ].map((s) => {
                const active = s.n === 1;
                return (
                  <li
                    key={s.n}
                    className={`rounded-2xl p-4 transition ${
                      active
                        ? "bg-primary/5 border-2 border-primary"
                        : a11y
                          ? "bg-card border-2 border-foreground"
                          : "bg-card border border-border"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`size-8 rounded-full inline-flex items-center justify-center font-extrabold ${
                          active
                            ? "bg-primary text-primary-foreground ring-4 ring-primary/25"
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
            className="inline-flex items-center justify-center gap-2 w-full h-16 rounded-2xl bg-primary text-primary-foreground text-xl font-extrabold shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-[0.99] transition"
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
          <div className="size-24 rounded-full bg-success/15 text-success flex items-center justify-center">
            <CheckCircle2 className="size-14" strokeWidth={2.4} />
          </div>
          <h2 className={`font-extrabold ${a11y ? "text-3xl" : "text-2xl"}`}>
            Muito bem! Você conseguiu!
          </h2>
          <p className={`leading-snug ${a11y ? "text-xl" : "text-lg text-muted-foreground"}`}>
            Você aprendeu a conectar no Wi-Fi e a ajustar o som, o brilho e o tamanho da letra.
            Agora pode deixar o celular do seu jeitinho.
          </p>
          <div className="flex flex-col gap-3 w-full">
            <button
              type="button"
              onClick={() => {
                setDone({ wifi: false, sound: false, brightness: false, text: false });
                setWifiOn(false);
                setWifiPicked(null);
                setWifiPassword("");
                setWifiConnected(false);
                setVolumeTouched(false);
                setBrightnessTouched(false);
                setTextTouched(false);
                setStage("overview");
              }}
              className="h-14 rounded-2xl border-2 border-border bg-card text-foreground text-lg font-bold hover:bg-muted transition"
            >
              Repetir simulação
            </button>
            <button
              type="button"
              onClick={() => navigate({ to: "/apps" })}
              className="h-14 rounded-2xl bg-primary text-primary-foreground text-lg font-extrabold hover:bg-primary/90 transition"
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
        : nextFunc === "wifi"
          ? "Toque em Wi-Fi (está piscando) para começar."
          : nextFunc === "sound"
            ? "Agora toque em Som para ajustar o volume."
            : nextFunc === "brightness"
              ? "Agora toque em Tela e Brilho."
              : "Por último, toque em Tamanho da Letra."
      : stage === "sim-wifi"
        ? !wifiOn
          ? "Toque no botão (cinza) ao lado de Wi-Fi para LIGAR."
          : !wifiPicked
            ? "Escolha a sua rede de Wi-Fi (a primeira tem o sinal mais forte)."
            : !wifiConnected
              ? "Digite a senha e toque em Conectar. (Já está digitada para você.)"
              : "Pronto, conectado! Toque em Voltar aos Ajustes."
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
      {/* Tip banner */}
      <div className="bg-primary text-primary-foreground px-5 py-4 sticky top-0 z-20 shadow-md">
        <div className="w-full max-w-md mx-auto flex items-start justify-between gap-3">
          <p className={`leading-snug font-medium ${a11y ? "text-lg" : "text-base"}`}>
            <span className="font-extrabold">Passo {currentStep}:</span> {tip}
          </p>
          <Link
            to="/apps"
            aria-label="Sair da simulação"
            className="shrink-0 inline-flex items-center gap-1 h-9 px-3 rounded-full bg-white/20 hover:bg-white/30 text-sm font-bold transition"
          >
            <X className="size-4" />
            Sair
          </Link>
        </div>
      </div>
      <div className="bg-card border-b border-border">{Stepper}</div>

      <div className="w-full max-w-md mx-auto flex-1 flex flex-col min-h-0">
        {stage === "sim-home" ? (
          <SimHome
            done={done}
            nextFunc={nextFunc}
            allDone={allDone}
            onPick={(k) => {
              if (k === "wifi") setStage("sim-wifi");
              else if (k === "sound") setStage("sim-sound");
              else if (k === "brightness") setStage("sim-brightness");
              else setStage("sim-textsize");
            }}
            onFinish={() => setStage("done")}
          />
        ) : stage === "sim-wifi" ? (
          <SimWifi
            wifiOn={wifiOn}
            picked={wifiPicked}
            password={wifiPassword}
            connected={wifiConnected}
            onToggle={() => setWifiOn((v) => !v)}
            onPick={(n) => {
              setWifiPicked(n);
              setWifiPassword("vovomaria123");
            }}
            onPasswordChange={setWifiPassword}
            onConnect={() => setWifiConnected(true)}
            onBackToHome={() => {
              setDone((d) => ({ ...d, wifi: true }));
              goHome();
            }}
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
            <div className="flex items-center gap-2 text-primary">
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
              className="mt-2 h-12 rounded-full bg-primary text-primary-foreground text-base font-extrabold hover:bg-primary/90 transition"
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
  const items: {
    key: FuncKey;
    title: string;
    value: string;
    icon: React.ReactNode;
    iconBg: string;
  }[] = [
    {
      key: "wifi",
      title: "Wi-Fi",
      value: done.wifi ? "Conectado" : "Desligado",
      icon: <Wifi className="size-6 text-white" />,
      iconBg: "bg-primary",
    },
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
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <h2 className="text-xl font-extrabold">Ajustes</h2>
        <User className="size-6 text-foreground" />
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
                className={`w-full flex items-center gap-4 px-4 py-4 text-left border-b border-border transition ${
                  isNext
                    ? "bg-primary/5 ring-2 ring-inset ring-primary animate-pulse"
                    : isDoneItem
                      ? "bg-success/5 hover:bg-success/10"
                      : "hover:bg-muted"
                }`}
              >
                <span className={`size-10 rounded-xl flex items-center justify-center ${it.iconBg}`}>
                  {it.icon}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-lg font-bold">{it.title}</span>
                  <span
                    className={`block text-sm font-bold ${
                      isDoneItem ? "text-success" : "text-muted-foreground"
                    }`}
                  >
                    {it.value}
                  </span>
                </span>
                {isDoneItem ? (
                  <span className="inline-flex items-center gap-1 text-success font-extrabold text-sm">
                    <CheckCircle2 className="size-5" />
                    Feito
                  </span>
                ) : isNext ? (
                  <span className="inline-flex items-center gap-1 text-primary font-extrabold text-sm">
                    Toque aqui
                    <ChevronRight className="size-5" />
                  </span>
                ) : (
                  <ChevronRight className="size-5 text-muted-foreground" />
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
            className="w-full h-14 rounded-2xl bg-success text-white text-lg font-extrabold shadow-md hover:opacity-90 transition ring-4 ring-success/20 animate-pulse"
          >
            Concluir simulação
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------- Wi-Fi screen ---------- */
function SimWifi({
  wifiOn,
  picked,
  password,
  connected,
  onToggle,
  onPick,
  onPasswordChange,
  onConnect,
  onBackToHome,
}: {
  wifiOn: boolean;
  picked: WifiNetwork | null;
  password: string;
  connected: boolean;
  onToggle: () => void;
  onPick: (n: WifiNetwork) => void;
  onPasswordChange: (s: string) => void;
  onConnect: () => void;
  onBackToHome: () => void;
}) {
  // Password / connected sub-screen
  if (picked) {
    return (
      <div className="flex flex-col flex-1 bg-background">
        <div className="px-4 py-3 border-b border-border flex items-center gap-3">
          <h2 className="text-xl font-extrabold">{picked.ssid}</h2>
        </div>
        <div className="p-5 flex flex-col gap-5">
          {!connected ? (
            <>
              <div>
                <label htmlFor="wifi-pass" className="text-base font-extrabold text-foreground block mb-2">
                  Senha do Wi-Fi
                </label>
                <input
                  id="wifi-pass"
                  type="text"
                  value={password}
                  onChange={(e) => onPasswordChange(e.target.value)}
                  className="w-full h-14 px-4 rounded-2xl border-2 border-border bg-card text-lg font-mono focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20"
                  aria-label="Digite a senha do Wi-Fi"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  A senha geralmente fica embaixo do roteador (a caixinha do Wi-Fi).
                </p>
              </div>
              <button
                type="button"
                onClick={onConnect}
                disabled={password.length < 4}
                className="h-14 rounded-2xl bg-primary text-primary-foreground text-lg font-extrabold shadow-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition ring-4 ring-primary/20 animate-pulse"
              >
                Conectar
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 text-center py-6">
              <div className="size-20 rounded-full bg-success/15 text-success flex items-center justify-center">
                <Check className="size-12" strokeWidth={2.6} />
              </div>
              <h3 className="text-2xl font-extrabold text-success">Conectado!</h3>
              <p className="text-lg text-muted-foreground">
                Agora o celular está usando a internet do Wi-Fi <strong>{picked.ssid}</strong>.
              </p>
              <button
                type="button"
                onClick={onBackToHome}
                className="mt-2 w-full h-14 rounded-2xl bg-success text-white text-lg font-extrabold hover:opacity-90 transition ring-4 ring-success/20 animate-pulse inline-flex items-center justify-center gap-2"
              >
                <ChevronLeft className="size-5" /> Voltar aos Ajustes
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Wi-Fi page (toggle + networks if on)
  return (
    <div className="flex flex-col flex-1 bg-background">
      <div className="px-4 py-3 border-b border-border flex items-center gap-3">
        <h2 className="text-xl font-extrabold">Wi-Fi</h2>
      </div>

      {/* Toggle row */}
      <div className="px-4 py-4 flex items-center justify-between border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <Wifi className={`size-6 ${wifiOn ? "text-primary" : "text-muted-foreground"}`} />
          <div>
            <p className="text-lg font-extrabold leading-tight">Wi-Fi</p>
            <p className="text-sm font-bold text-muted-foreground">
              {wifiOn ? "Ligado" : "Desligado"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={wifiOn}
          aria-label="Ligar ou desligar Wi-Fi"
          className={`relative w-20 h-11 rounded-full transition shadow-inner ${
            wifiOn
              ? "bg-success"
              : "bg-muted ring-4 ring-primary/40 animate-pulse"
          }`}
        >
          <span
            className={`absolute top-1 size-9 rounded-full bg-white shadow-md transition-all ${
              wifiOn ? "left-10" : "left-1"
            }`}
          />
        </button>
      </div>

      {/* Networks (only if on) */}
      {wifiOn ? (
        <div className="px-4 py-3">
          <p className="text-sm text-muted-foreground font-bold uppercase tracking-wide mb-2">
            Redes disponíveis
          </p>
          <ul className="flex flex-col rounded-2xl overflow-hidden border border-border bg-card">
            {NETWORKS.map((n, idx) => {
              const isFirst = idx === 0;
              return (
                <li key={n.ssid}>
                  <button
                    type="button"
                    onClick={() => onPick(n)}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-4 text-left transition border-b border-border last:border-b-0 ${
                      isFirst ? "bg-primary/5 ring-2 ring-inset ring-primary animate-pulse" : "hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Wifi className="size-5 text-foreground shrink-0" />
                      <span className="text-lg font-bold truncate">{n.ssid}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {n.locked && <Lock className="size-4 text-muted-foreground" />}
                      <span className="text-sm font-bold text-muted-foreground">
                        {"●".repeat(n.bars)}
                        <span className="opacity-30">{"●".repeat(3 - n.bars)}</span>
                      </span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="px-6 py-10 text-center text-muted-foreground">
          <Wifi className="size-12 mx-auto mb-3 opacity-40" />
          <p className="text-base font-bold">
            Toque no botão acima para LIGAR o Wi-Fi e ver as redes disponíveis.
          </p>
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
  const Icon = volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2;
  return (
    <div className="flex flex-col flex-1 bg-background">
      <div className="px-4 py-3 border-b border-border flex items-center gap-3">
        <h2 className="text-xl font-extrabold">Som e Volume</h2>
      </div>
      <div className="p-6 flex flex-col gap-8">
        <div className="rounded-3xl bg-card border-2 border-border p-6 flex flex-col items-center gap-4 shadow-md">
          <div className="size-24 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Icon className="size-14" strokeWidth={2.4} />
          </div>
          <p className="text-5xl font-extrabold tabular-nums">{volume}%</p>
          <p className="text-base font-bold text-muted-foreground">Volume do Toque</p>
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
            className="w-full h-4 rounded-full appearance-none bg-muted accent-primary cursor-pointer"
            style={{
              background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${volume}%, var(--muted) ${volume}%, var(--muted) 100%)`,
            }}
          />
        </div>

        <button
          type="button"
          onClick={onBackToHome}
          disabled={!touched}
          className="h-14 rounded-2xl bg-primary text-primary-foreground text-lg font-extrabold shadow-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition inline-flex items-center justify-center gap-2"
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
  const previewBg = `oklch(${0.18 + (brightness / 100) * 0.78} 0.02 90)`;
  const previewFg = brightness > 55 ? "oklch(0.2 0 0)" : "oklch(0.95 0 0)";
  return (
    <div className="flex flex-col flex-1 bg-background">
      <div className="px-4 py-3 border-b border-border flex items-center gap-3">
        <h2 className="text-xl font-extrabold">Tela e Brilho</h2>
      </div>
      <div className="p-6 flex flex-col gap-6">
        <div
          className="rounded-3xl border-2 border-border p-6 flex flex-col items-center gap-3 shadow-md transition-colors"
          style={{ backgroundColor: previewBg, color: previewFg }}
        >
          <Sun className="size-14" strokeWidth={2.4} style={{ color: previewFg }} />
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
            className="w-full h-4 rounded-full appearance-none cursor-pointer accent-primary"
            style={{
              background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${brightness}%, var(--muted) ${brightness}%, var(--muted) 100%)`,
            }}
          />
        </div>

        <button
          type="button"
          onClick={onBackToHome}
          disabled={!touched}
          className="h-14 rounded-2xl bg-primary text-primary-foreground text-lg font-extrabold shadow-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition inline-flex items-center justify-center gap-2"
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
  const sizes = [14, 18, 22, 28, 34];
  const px = sizes[Math.max(0, Math.min(4, size - 1))];
  const labels = ["Pequena", "Padrão", "Média", "Grande", "Muito grande"];
  return (
    <div className="flex flex-col flex-1 bg-background">
      <div className="px-4 py-3 border-b border-border flex items-center gap-3">
        <h2 className="text-xl font-extrabold">Tamanho da Letra</h2>
      </div>
      <div className="p-6 flex flex-col gap-6">
        <div className="rounded-3xl bg-card border-2 border-border p-6 shadow-md">
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-3">
            Veja como a letra fica
          </p>
          <p
            className="font-bold leading-snug text-foreground transition-all"
            style={{ fontSize: `${px}px` }}
          >
            Bom dia! Hoje é um lindo dia para aprender coisas novas no celular.
          </p>
          <p className="mt-4 text-sm font-bold text-primary">
            Tamanho atual: {labels[size - 1]}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 bg-card rounded-2xl border-2 border-border p-3">
          <button
            type="button"
            onClick={() => onChange(Math.max(1, size - 1))}
            disabled={size <= 1}
            aria-label="Diminuir letra"
            className="flex-1 h-16 rounded-xl bg-muted hover:bg-muted/70 disabled:opacity-50 disabled:cursor-not-allowed text-foreground font-extrabold inline-flex items-center justify-center gap-2 transition"
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
                    i <= size ? "bg-primary" : "bg-muted"
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
            className="flex-1 h-16 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-extrabold inline-flex items-center justify-center gap-2 transition ring-2 ring-primary/30"
          >
            <Type className="size-6" />
            <span className="text-3xl">A+</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onBackToHome}
          disabled={!touched}
          className="h-14 rounded-2xl bg-primary text-primary-foreground text-lg font-extrabold shadow-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition inline-flex items-center justify-center gap-2"
        >
          <ChevronLeft className="size-5" /> Voltar aos Ajustes
        </button>
      </div>
    </div>
  );
}
