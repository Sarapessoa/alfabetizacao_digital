import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Volume2,
  Square,
  X,
  CheckCircle2,
  Sparkles,
  ChevronLeft,
  Mail,
  MessageCircle,
  Phone,
  Video,
  Mic,
  Send,
  Camera,
  Paperclip,
  Smile,
  Search,
  MoreVertical,
  Play,
  Pause,
  PhoneOff,
  Check,
  CheckCheck,
} from "lucide-react";
import { A11yToggle, useA11y } from "../lib/a11y";

export const Route = createFileRoute("/apps/whatsapp")({
  component: WhatsappSimulation,
  head: () => ({
    meta: [
      { title: "WhatsApp — Ajudante Tech" },
      {
        name: "description",
        content:
          "Aprenda a usar o WhatsApp passo a passo: abrir conversa, enviar mensagem, fazer ligação ou chamada de vídeo e enviar áudio.",
      },
    ],
  }),
});

type Stage =
  | "intro"
  | "overview"
  | "sim-chats"
  | "sim-message"
  | "sim-call"
  | "sim-audio"
  | "done";

type Chat = {
  id: string;
  name: string;
  initial: string;
  preview: string;
  time: string;
  unread?: number;
  color: string;
};

const CHATS: Chat[] = [
  {
    id: "cida",
    name: "Dona Cida (amiga)",
    initial: "C",
    preview: "Já tomou seu remédio?",
    time: "10:24",
    unread: 2,
    color: "bg-[oklch(0.62_0.20_355)]",
  },
  {
    id: "antonio",
    name: "Seu Antônio (amigo)",
    initial: "A",
    preview: "Te espero amanhã na pracinha ❤️",
    time: "Ontem",
    color: "bg-[oklch(0.55_0.18_240)]",
  },
  {
    id: "igreja",
    name: "Grupo da Igreja",
    initial: "I",
    preview: "Padre: Missa hoje às 19h",
    time: "Ontem",
    color: "bg-[oklch(0.78_0.16_75)]",
  },
];

type ChatMessage = {
  id: string;
  from: "me" | "them";
  kind: "text" | "audio";
  text?: string;
  durationSec?: number;
};

const INITIAL_MESSAGES: ChatMessage[] = [
  { id: "m1", from: "them", kind: "text", text: "Bom dia, amiga! Tudo bem?" },
  { id: "m2", from: "them", kind: "text", text: "Já tomou seu remédio?" },
];

function WhatsappSimulation() {
  const [stage, setStage] = useState<Stage>("overview");
  const [speaking, setSpeaking] = useState(false);
  const { enabled: a11y } = useA11y();
  const navigate = useNavigate();

  const [openChat, setOpenChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [draft, setDraft] = useState("Estou bem, amiga! Tomei sim 😊");
  const [messageSent, setMessageSent] = useState(false);

  // Call
  const [callType, setCallType] = useState<null | "voice" | "video">(null);
  const [callPhase, setCallPhase] = useState<"idle" | "ringing" | "ended">("idle");
  const [callSeconds, setCallSeconds] = useState(0);

  // Audio
  const [recording, setRecording] = useState(false);
  const [recSeconds, setRecSeconds] = useState(0);
  const recTimer = useRef<number | null>(null);
  const [audioSent, setAudioSent] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);
  const playTimer = useRef<number | null>(null);

  const [dialog, setDialog] = useState<null | { title: string; body: string }>(null);

  const steps = [
    { n: 1, label: "Abrir" },
    { n: 2, label: "Enviar" },
    { n: 3, label: "Ligar" },
    { n: 4, label: "Áudio" },
  ];
  const currentStep =
    stage === "overview" || stage === "sim-chats"
      ? 1
      : stage === "sim-message"
        ? 2
        : stage === "sim-call"
          ? 3
          : 4;
  const isDone = stage === "done";

  const Stepper = (
    <div className="w-full max-w-md mx-auto px-5 pt-4 pb-2">
      <div className="flex items-center justify-between gap-2 mb-2">
        <p className={`font-extrabold ${a11y ? "text-base" : "text-sm"}`}>
          {isDone ? "Simulação concluída" : `Etapa ${currentStep} de ${steps.length}`}
        </p>
        <p className={`text-muted-foreground font-medium ${a11y ? "text-base" : "text-xs"}`}>
          {isDone ? "100%" : `${Math.round((currentStep / steps.length) * 100)}%`}
        </p>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={steps.length}
        aria-valuenow={isDone ? steps.length : currentStep}
        aria-label="Progresso da simulação"
        className="h-2.5 w-full rounded-full bg-muted overflow-hidden"
      >
        <div
          className="h-full bg-success transition-all duration-500"
          style={{
            width: `${((isDone ? steps.length : currentStep) / steps.length) * 100}%`,
          }}
        />
      </div>
      <ol className="mt-3 grid grid-cols-4 gap-2">
        {steps.map((s) => {
          const done = isDone || s.n < currentStep;
          const active = !isDone && s.n === currentStep;
          return (
            <li key={s.n} className="flex flex-col items-center gap-1 text-center">
              <span
                className={`size-7 rounded-full inline-flex items-center justify-center text-xs font-extrabold transition ${
                  done
                    ? "bg-success text-white"
                    : active
                      ? "bg-success text-white ring-4 ring-success/25"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {done ? <CheckCircle2 className="size-4" /> : s.n}
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

  // Auto-advance from intro splash
  useEffect(() => {
    if (stage !== "intro") return;
    const t = setTimeout(() => setStage("sim-chats"), 1800);
    return () => clearTimeout(t);
  }, [stage]);

  // Call ringing timer (auto-answer after a beat then count duration)
  useEffect(() => {
    if (callPhase !== "ringing") return;
    setCallSeconds(0);
    const t = window.setInterval(() => setCallSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(t);
  }, [callPhase]);

  // Recording timer
  useEffect(() => {
    if (!recording) {
      if (recTimer.current) {
        window.clearInterval(recTimer.current);
        recTimer.current = null;
      }
      return;
    }
    setRecSeconds(0);
    recTimer.current = window.setInterval(
      () => setRecSeconds((s) => Math.min(s + 1, 30)),
      1000,
    );
    return () => {
      if (recTimer.current) window.clearInterval(recTimer.current);
    };
  }, [recording]);

  // Playback timer
  useEffect(() => {
    if (!playing) {
      if (playTimer.current) {
        window.clearInterval(playTimer.current);
        playTimer.current = null;
      }
      return;
    }
    playTimer.current = window.setInterval(() => {
      setPlayProgress((p) => {
        const next = p + 4;
        if (next >= 100) {
          setPlaying(false);
          return 0;
        }
        return next;
      });
    }, 120);
    return () => {
      if (playTimer.current) window.clearInterval(playTimer.current);
    };
  }, [playing]);

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
        return "WhatsApp. É como cartas, telegramas e SMS, só que muito mais rápido. Toque em iniciar simulação prática para começar.";
      case "sim-chats":
        return "Passo 1. Estas são suas conversas. Toque em uma para abrir e ler as mensagens.";
      case "sim-message":
        return "Passo 2. Para responder, toque na caixinha de texto, escreva e depois toque no botão verde para enviar.";
      case "sim-call":
        return "Passo 3. Toque no telefone para fazer uma ligação, ou na câmera de vídeo para uma chamada de vídeo.";
      case "sim-audio":
        return "Passo 4. Para enviar um áudio, segure o botão do microfone, fale e solte. Para ouvir, toque no botão de play.";
      case "done":
        return "Parabéns! Você aprendeu a usar o WhatsApp.";
      default:
        return "WhatsApp";
    }
  }, [stage]);

  const handleSpeak = () => (speaking ? stopSpeaking() : speak(screenText));

  // ----- Intro splash -----
  if (stage === "intro") {
    return (
      <main className="min-h-screen bg-success flex flex-col items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="size-24 rounded-full bg-white text-success flex items-center justify-center shadow-2xl">
            <MessageCircle className="size-12" strokeWidth={2.6} />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">WhatsApp</h1>
        </div>
      </main>
    );
  }

  // ----- Header bar (shared) -----
  const headerBar = (
    <header className="bg-success text-white px-5 pt-5 pb-6">
      <div className="w-full max-w-md mx-auto flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <Link
            to="/apps"
            aria-label="Voltar para aplicativos"
            className="inline-flex items-center gap-2 h-11 px-3 rounded-2xl text-base font-bold hover:bg-white/10 transition"
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
              className="inline-flex items-center gap-2 h-11 px-3 rounded-full bg-white text-success text-base font-bold hover:opacity-90 transition"
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
          WhatsApp
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
            className={`rounded-2xl bg-card p-5 border-l-8 border-l-success shadow-md ${
              a11y ? "border-2 border-foreground" : "border border-border"
            }`}
          >
            <h2 className={`font-extrabold text-success ${a11y ? "text-2xl" : "text-xl"}`}>
              O que é parecido?
            </h2>
            <div
              className={`mt-3 inline-flex items-center gap-2 rounded-full bg-success/10 text-success px-3 py-1.5 font-extrabold ${
                a11y ? "text-lg" : "text-base"
              }`}
            >
              <Mail className="size-5" />
              Cartas, telegramas e SMS
            </div>
            <p
              className={`mt-3 leading-snug ${
                a11y ? "text-xl text-foreground" : "text-lg text-muted-foreground"
              }`}
            >
              É como mandar uma <strong className="text-success">carta</strong> para a família, só
              que chega na hora. Também dá para conversar pelo telefone e ver a pessoa, como nas
              antigas chamadas, mas de graça.
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
            <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden mb-4">
              <div className="h-full bg-success transition-all duration-500" style={{ width: "25%" }} />
            </div>
            <ol className="flex flex-col gap-3">
              {[
                { n: 1, t: "Abrir uma Conversa", d: "Toque no nome da pessoa para ver as mensagens que vocês trocaram." },
                { n: 2, t: "Enviar uma Mensagem", d: "Escreva na caixinha embaixo e toque no botão verde para mandar." },
                { n: 3, t: "Ligar ou Chamada de Vídeo", d: "Use o telefone para falar, ou a câmera para ver a pessoa enquanto conversa." },
                { n: 4, t: "Enviar e Ouvir Áudio", d: "Segure o microfone para gravar sua voz. Toque no play para ouvir os áudios recebidos." },
              ].map((s) => {
                const active = s.n === 1;
                return (
                  <li
                    key={s.n}
                    className={`rounded-2xl p-4 transition ${
                      active
                        ? "bg-success/5 border-2 border-success"
                        : a11y
                          ? "bg-card border-2 border-foreground"
                          : "bg-card border border-border"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`size-8 rounded-full inline-flex items-center justify-center font-extrabold ${
                          active
                            ? "bg-success text-white ring-4 ring-success/25"
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
            className="inline-flex items-center justify-center gap-2 w-full h-16 rounded-2xl bg-success text-white text-xl font-extrabold shadow-lg shadow-success/30 hover:opacity-90 active:scale-[0.99] transition"
          >
            <MessageCircle className="size-6" />
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
            Você aprendeu a abrir conversas, mandar mensagens, fazer ligações e enviar áudios.
            Agora pode falar com a família a qualquer hora!
          </p>
          <div className="flex flex-col gap-3 w-full">
            <button
              type="button"
              onClick={() => {
                setOpenChat(null);
                setMessages(INITIAL_MESSAGES);
                setDraft("Estou bem, amiga! Tomei sim 😊");
                setMessageSent(false);
                setCallType(null);
                setCallPhase("idle");
                setRecording(false);
                setAudioSent(false);
                setPlaying(false);
                setPlayProgress(0);
                setStage("overview");
              }}
              className="h-14 rounded-2xl border-2 border-border bg-card text-foreground text-lg font-bold hover:bg-muted transition"
            >
              Repetir simulação
            </button>
            <button
              type="button"
              onClick={() => navigate({ to: "/apps" })}
              className="h-14 rounded-2xl bg-success text-white text-lg font-extrabold hover:opacity-90 transition"
            >
              Ver outros aplicativos
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ----- Tip banner -----
  const tip =
    stage === "sim-chats"
      ? "Toque na conversa de Dona Cida (amiga), que está piscando."
      : stage === "sim-message"
        ? messageSent
          ? "Mensagem enviada! Toque em Continuar para a próxima etapa."
          : "Toque no botão verde com a setinha para ENVIAR a mensagem."
        : stage === "sim-call"
          ? callPhase === "idle"
            ? "Toque no telefone (ligar) ou na câmera de vídeo, no topo da tela."
            : callPhase === "ringing"
              ? "Está chamando... Toque no botão vermelho para encerrar."
              : "Chamada encerrada. Toque em Continuar."
          : audioSent
            ? "Áudio enviado! Toque no PLAY para ouvir o áudio recebido."
            : recording
              ? "Gravando... Solte o botão para enviar o áudio."
              : "Segure o botão do microfone para gravar e fale algo.";

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Tip banner */}
      <div className="bg-success text-white px-5 py-4 sticky top-0 z-20 shadow-md">
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
        {stage === "sim-chats" ? (
          <SimChats
            onPick={(c) => {
              setOpenChat(c);
              setStage("sim-message");
            }}
            onExplain={(d) => setDialog(d)}
          />
        ) : stage === "sim-message" ? (
          <SimMessage
            chat={openChat ?? CHATS[0]}
            messages={messages}
            draft={draft}
            sent={messageSent}
            onDraftChange={setDraft}
            onSend={() => {
              if (!draft.trim()) return;
              setMessages((m) => [
                ...m,
                { id: `me-${Date.now()}`, from: "me", kind: "text", text: draft.trim() },
              ]);
              setDraft("");
              setMessageSent(true);
            }}
            onContinue={() => setStage("sim-call")}
          />
        ) : stage === "sim-call" ? (
          <SimCall
            chat={openChat ?? CHATS[0]}
            type={callType}
            phase={callPhase}
            seconds={callSeconds}
            onStart={(t) => {
              setCallType(t);
              setCallPhase("ringing");
            }}
            onEnd={() => setCallPhase("ended")}
            onContinue={() => setStage("sim-audio")}
          />
        ) : (
          <SimAudio
            chat={openChat ?? CHATS[0]}
            messages={messages}
            recording={recording}
            recSeconds={recSeconds}
            audioSent={audioSent}
            playing={playing}
            playProgress={playProgress}
            onHoldStart={() => setRecording(true)}
            onHoldEnd={() => {
              if (!recording) return;
              const dur = Math.max(2, recSeconds);
              setRecording(false);
              setMessages((m) => [
                ...m,
                { id: `me-aud-${Date.now()}`, from: "me", kind: "audio", durationSec: dur },
                {
                  id: `them-aud-${Date.now() + 1}`,
                  from: "them",
                  kind: "audio",
                  durationSec: 6,
                },
              ]);
              setAudioSent(true);
            }}
            onPlay={() => {
              setPlayProgress(0);
              setPlaying(true);
            }}
            onPause={() => setPlaying(false)}
            onFinish={() => setStage("done")}
          />
        )}
      </div>

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
            <div className="flex items-center gap-2 text-success">
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
              className="mt-2 h-12 rounded-full bg-success text-white text-base font-extrabold hover:opacity-90 transition"
            >
              OK, entendi
            </button>
          </div>
        </div>
      )}
    </main>
  );
}


/* =====================================================================
   WhatsApp visual constants (faithful to the real app)
   ===================================================================== */
const WA = {
  teal: "#008069", // header bar
  tealDark: "#075E54", // call screen / accents
  green: "#25D366", // FAB / mic / send
  outBubble: "#D9FDD3",
  inBubble: "#FFFFFF",
  chatBg: "#EFEAE2",
  composerBg: "#F0F2F5",
  tickRead: "#53BDEB",
  metaGray: "#667781",
  divider: "#E9EDEF",
};

// Subtle doodle-like dotted texture for chat background
const CHAT_BG_STYLE: React.CSSProperties = {
  backgroundColor: WA.chatBg,
  backgroundImage:
    "radial-gradient(rgba(11, 20, 26, 0.05) 1px, transparent 1px), radial-gradient(rgba(11, 20, 26, 0.04) 1px, transparent 1px)",
  backgroundSize: "22px 22px, 38px 38px",
  backgroundPosition: "0 0, 11px 11px",
};

/* ---------- Chats list (WhatsApp Home) ---------- */
function SimChats({
  onPick,
  onExplain,
}: {
  onPick: (c: Chat) => void;
  onExplain: (d: { title: string; body: string }) => void;
}) {
  return (
    <div className="flex flex-col flex-1 bg-white">
      {/* Top bar (teal) */}
      <div
        className="px-4 py-3 flex items-center justify-between text-white"
        style={{ backgroundColor: WA.teal }}
      >
        <h2 className="text-xl font-bold tracking-tight">WhatsApp</h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() =>
              onExplain({ title: "Buscar", body: "A lupa serve para procurar uma conversa pelo nome." })
            }
            aria-label="Buscar"
            className="size-10 rounded-full hover:bg-white/10 flex items-center justify-center"
          >
            <Search className="size-5" />
          </button>
          <button
            type="button"
            onClick={() =>
              onExplain({ title: "Mais opções", body: "Aqui aparecem ajustes e novidades. Vamos pular por agora." })
            }
            aria-label="Mais opções"
            className="size-10 rounded-full hover:bg-white/10 flex items-center justify-center"
          >
            <MoreVertical className="size-5" />
          </button>
        </div>
      </div>

      {/* Tabs (visual only) */}
      <div
        className="flex text-sm font-bold uppercase tracking-wide text-white/80"
        style={{ backgroundColor: WA.teal }}
      >
        <div className="flex-1 text-center pb-2 border-b-[3px] border-white text-white">
          Conversas
        </div>
        <div className="flex-1 text-center pb-2 border-b-[3px] border-transparent">Status</div>
        <div className="flex-1 text-center pb-2 border-b-[3px] border-transparent">Chamadas</div>
      </div>

      <ul className="flex flex-col bg-white flex-1">
        {CHATS.map((c, idx) => {
          const isFirst = idx === 0;
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => onPick(c)}
                className={`w-full flex items-center gap-3 px-3 py-3 text-left border-b transition ${
                  isFirst ? "ring-2 ring-inset animate-pulse" : "hover:bg-black/5"
                }`}
                style={{
                  borderColor: WA.divider,
                  backgroundColor: isFirst ? "rgba(37, 211, 102, 0.08)" : undefined,
                  ...(isFirst ? ({ ["--tw-ring-color" as string]: WA.green } as React.CSSProperties) : {}),
                }}
              >
                <span
                  className={`size-12 rounded-full flex items-center justify-center text-white text-lg font-bold ${c.color}`}
                >
                  {c.initial}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-[17px] font-semibold truncate text-foreground">
                      {c.name}
                    </span>
                    <span
                      className="text-xs font-medium shrink-0"
                      style={{ color: c.unread ? WA.green : WA.metaGray }}
                    >
                      {c.time}
                    </span>
                  </span>
                  <span className="flex items-center justify-between gap-2 mt-0.5">
                    <span className="text-sm truncate" style={{ color: WA.metaGray }}>
                      {c.preview}
                    </span>
                    {c.unread ? (
                      <span
                        className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-white text-xs font-bold shrink-0"
                        style={{ backgroundColor: WA.green }}
                      >
                        {c.unread}
                      </span>
                    ) : null}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Floating chat FAB */}
      <div className="relative">
        <div
          className="absolute right-4 -top-16 size-14 rounded-2xl flex items-center justify-center shadow-lg"
          style={{ backgroundColor: WA.green }}
          aria-hidden
        >
          <MessageCircle className="size-7 text-white" />
        </div>
      </div>
    </div>
  );
}

/* ---------- Chat header (inside a conversation) ---------- */
function ChatHeader({
  chat,
  onCall,
  onVideo,
  highlight,
}: {
  chat: Chat;
  onCall?: () => void;
  onVideo?: () => void;
  highlight?: "call" | "video" | "both" | "none";
}) {
  const h = highlight ?? "none";
  const ringCall = h === "call" || h === "both";
  const ringVideo = h === "video" || h === "both";
  return (
    <div
      className="px-2 py-2 flex items-center gap-2 text-white"
      style={{ backgroundColor: WA.teal }}
    >
      <button type="button" aria-label="Voltar" className="size-9 rounded-full hover:bg-white/10 flex items-center justify-center">
        <ChevronLeft className="size-6" />
      </button>
      <span
        className={`size-10 rounded-full flex items-center justify-center text-white font-bold ${chat.color}`}
      >
        {chat.initial}
      </span>
      <div className="flex-1 min-w-0 leading-tight">
        <p className="text-[16px] font-semibold truncate">{chat.name}</p>
        <p className="text-[12px] text-white/85">online</p>
      </div>
      <button
        type="button"
        onClick={onVideo}
        aria-label="Chamada de vídeo"
        className={`size-10 rounded-full flex items-center justify-center transition ${
          ringVideo ? "bg-white/20 ring-2 ring-white animate-pulse" : "hover:bg-white/10"
        }`}
      >
        <Video className="size-5" />
      </button>
      <button
        type="button"
        onClick={onCall}
        aria-label="Ligar"
        className={`size-10 rounded-full flex items-center justify-center transition ${
          ringCall ? "bg-white/20 ring-2 ring-white animate-pulse" : "hover:bg-white/10"
        }`}
      >
        <Phone className="size-5" />
      </button>
      <button type="button" aria-label="Mais opções" className="size-10 rounded-full hover:bg-white/10 flex items-center justify-center">
        <MoreVertical className="size-5" />
      </button>
    </div>
  );
}

/* ---------- Message bubble ---------- */
function Bubble({
  mine,
  children,
  time,
  read,
  className,
  style,
}: {
  mine: boolean;
  children: React.ReactNode;
  time: string;
  read?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`relative max-w-[80%] px-2.5 py-1.5 shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] ${
        mine ? "self-end" : "self-start"
      } ${className ?? ""}`}
      style={{
        backgroundColor: mine ? WA.outBubble : WA.inBubble,
        borderRadius: 8,
        borderTopRightRadius: mine ? 0 : 8,
        borderTopLeftRadius: mine ? 8 : 0,
        ...style,
      }}
    >
      {/* Tail */}
      <span
        aria-hidden
        className="absolute top-0 w-2 h-3 overflow-hidden"
        style={{
          [mine ? "right" : "left"]: -8,
        }}
      >
        <span
          className="block w-3 h-3"
          style={{
            backgroundColor: mine ? WA.outBubble : WA.inBubble,
            transform: mine ? "skewX(-30deg) translateX(-4px)" : "skewX(30deg) translateX(4px)",
            boxShadow: "0 1px 0.5px rgba(11,20,26,0.13)",
          }}
        />
      </span>
      <div className="text-[15px] leading-snug text-[#111B21]">{children}</div>
      <div
        className="flex items-center justify-end gap-1 mt-0.5 text-[11px]"
        style={{ color: WA.metaGray }}
      >
        <span>{time}</span>
        {mine && (
          <CheckCheck
            className="size-3.5"
            style={{ color: read ? WA.tickRead : WA.metaGray }}
          />
        )}
      </div>
    </div>
  );
}

/* ---------- Messages list ---------- */
function MessagesList({
  messages,
  playing,
  playProgress,
  onPlay,
  onPause,
  highlightLastIncomingAudio,
}: {
  messages: ChatMessage[];
  playing?: boolean;
  playProgress?: number;
  onPlay?: () => void;
  onPause?: () => void;
  highlightLastIncomingAudio?: boolean;
}) {
  const lastIncomingAudioId = [...messages]
    .reverse()
    .find((m) => m.from === "them" && m.kind === "audio")?.id;
  return (
    <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-1.5" style={CHAT_BG_STYLE}>
      {messages.map((m) => {
        const mine = m.from === "me";
        if (m.kind === "text") {
          return (
            <Bubble key={m.id} mine={mine} time="10:24" read>
              <p className="whitespace-pre-wrap break-words">{m.text}</p>
            </Bubble>
          );
        }
        const isHighlight =
          highlightLastIncomingAudio && !mine && m.id === lastIncomingAudioId;
        const isThisPlaying = playing && !mine && m.id === lastIncomingAudioId;
        const dur = m.durationSec ?? 5;
        const progress = isThisPlaying ? (playProgress ?? 0) : 0;
        return (
          <Bubble
            key={m.id}
            mine={mine}
            time="10:25"
            read
            className={isHighlight ? "ring-2 ring-offset-1 animate-pulse" : ""}
            style={
              isHighlight
                ? ({ ["--tw-ring-color" as string]: WA.green } as React.CSSProperties)
                : undefined
            }
          >
            <div className="flex items-center gap-2 min-w-[12rem]">
              <button
                type="button"
                onClick={() => {
                  if (mine) return;
                  if (isThisPlaying) onPause?.();
                  else onPlay?.();
                }}
                aria-label={isThisPlaying ? "Pausar áudio" : "Tocar áudio"}
                disabled={mine}
                className="size-9 rounded-full flex items-center justify-center shrink-0 text-white"
                style={{ backgroundColor: WA.metaGray }}
              >
                {isThisPlaying ? <Pause className="size-5" /> : <Play className="size-5" />}
              </button>
              <div className="flex-1">
                {/* Fake waveform */}
                <div className="relative h-5 flex items-center gap-[2px]">
                  {Array.from({ length: 26 }).map((_, i) => {
                    const heights = [6, 10, 14, 8, 12, 16, 10, 6, 12, 18, 14, 8, 6, 10, 14, 18, 12, 8, 14, 10, 6, 12, 16, 10, 8, 12];
                    const filledTo = mine ? 26 : Math.round((progress / 100) * 26);
                    const filled = i < filledTo;
                    return (
                      <span
                        key={i}
                        className="rounded-full"
                        style={{
                          width: 2,
                          height: heights[i],
                          backgroundColor: filled ? WA.tickRead : "#B1B7BB",
                        }}
                      />
                    );
                  })}
                </div>
                <p className="text-[11px] mt-0.5" style={{ color: WA.metaGray }}>
                  {formatDur(dur)}
                </p>
              </div>
              <span
                className="size-7 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: mine ? "rgba(0,0,0,0.05)" : "rgba(0,0,0,0.05)" }}
              >
                <Mic className="size-4" style={{ color: WA.metaGray }} />
              </span>
            </div>
          </Bubble>
        );
      })}
    </div>
  );
}

function formatDur(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

/* ---------- Composer (shared shell) ---------- */
function ComposerShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="px-2 py-2 flex items-end gap-2"
      style={{ backgroundColor: WA.chatBg }}
    >
      {children}
    </div>
  );
}

function ComposerInputPill({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex-1 flex items-center gap-1 rounded-full px-1.5 min-h-12 shadow-sm"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      {children}
    </div>
  );
}

/* ---------- Sim: enviar mensagem ---------- */
function SimMessage({
  chat,
  messages,
  draft,
  sent,
  onDraftChange,
  onSend,
  onContinue,
}: {
  chat: Chat;
  messages: ChatMessage[];
  draft: string;
  sent: boolean;
  onDraftChange: (s: string) => void;
  onSend: () => void;
  onContinue: () => void;
}) {
  const hasDraft = draft.trim().length > 0;
  return (
    <div className="flex flex-col flex-1">
      <ChatHeader chat={chat} />
      <MessagesList messages={messages} />
      <ComposerShell>
        <ComposerInputPill>
          <button
            type="button"
            aria-label="Emoji"
            className="size-10 flex items-center justify-center"
            style={{ color: WA.metaGray }}
          >
            <Smile className="size-6" />
          </button>
          <input
            type="text"
            value={draft}
            onChange={(e) => onDraftChange(e.target.value)}
            placeholder="Mensagem"
            aria-label="Escreva sua mensagem"
            className="flex-1 h-11 bg-transparent outline-none text-[16px] text-[#111B21] placeholder:text-[color:var(--meta)]"
            style={{ ["--meta" as string]: WA.metaGray } as React.CSSProperties}
          />
          <button
            type="button"
            aria-label="Anexar"
            className="size-10 flex items-center justify-center -rotate-45"
            style={{ color: WA.metaGray }}
          >
            <Paperclip className="size-5" />
          </button>
          {!hasDraft && (
            <button
              type="button"
              aria-label="Câmera"
              className="size-10 flex items-center justify-center"
              style={{ color: WA.metaGray }}
            >
              <Camera className="size-5" />
            </button>
          )}
        </ComposerInputPill>
        <button
          type="button"
          onClick={hasDraft && !sent ? onSend : undefined}
          disabled={!hasDraft || sent}
          aria-label={hasDraft ? "Enviar mensagem" : "Gravar áudio"}
          className={`size-12 rounded-full text-white flex items-center justify-center shadow-md transition ${
            hasDraft && !sent ? "ring-4 ring-[rgba(37,211,102,0.4)] animate-pulse" : ""
          }`}
          style={{ backgroundColor: WA.green }}
        >
          {hasDraft ? <Send className="size-5" strokeWidth={2.6} /> : <Mic className="size-5" />}
        </button>
      </ComposerShell>
      {sent && (
        <div className="p-4 border-t border-border bg-background">
          <button
            type="button"
            onClick={onContinue}
            className="w-full h-14 rounded-2xl text-white text-lg font-extrabold shadow-md hover:opacity-90 transition ring-4 ring-[rgba(37,211,102,0.25)] animate-pulse"
            style={{ backgroundColor: WA.green }}
          >
            Continuar
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------- Sim: ligação / chamada de vídeo ---------- */
function SimCall({
  chat,
  type,
  phase,
  seconds,
  onStart,
  onEnd,
  onContinue,
}: {
  chat: Chat;
  type: "voice" | "video" | null;
  phase: "idle" | "ringing" | "ended";
  seconds: number;
  onStart: (t: "voice" | "video") => void;
  onEnd: () => void;
  onContinue: () => void;
}) {
  if (phase === "idle") {
    return (
      <div className="flex flex-col flex-1">
        <ChatHeader
          chat={chat}
          highlight="both"
          onCall={() => onStart("voice")}
          onVideo={() => onStart("video")}
        />
        <MessagesList
          messages={[
            ...INITIAL_MESSAGES,
            { id: "you-msg", from: "me", kind: "text", text: "Estou bem, amiga! Tomei sim 😊" },
          ]}
        />
        <div
          className="px-3 py-3 text-center text-sm"
          style={{ backgroundColor: WA.chatBg, color: WA.metaGray }}
        >
          ↑ Toque no <strong style={{ color: WA.teal }}>telefone</strong> ou na{" "}
          <strong style={{ color: WA.teal }}>câmera de vídeo</strong> no topo
        </div>
      </div>
    );
  }

  if (phase === "ringing") {
    return (
      <div
        className="flex flex-col flex-1 text-white relative overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${WA.tealDark} 0%, #0B302A 100%)`,
        }}
      >
        {/* Fake video feed background for video calls */}
        {type === "video" && (
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 50% 35%, rgba(255,255,255,0.08), transparent 60%), linear-gradient(180deg, #0B302A, #0A1F1B)`,
            }}
          />
        )}
        <div className="relative z-10 px-5 pt-6 flex items-center justify-between">
          <p className="text-sm text-white/80">
            {type === "video" ? "Chamada de vídeo" : "Chamada de voz"} · WhatsApp
          </p>
          <p className="text-sm font-bold text-white/90">
            {seconds < 3 ? "Chamando..." : formatDur(seconds)}
          </p>
        </div>
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
          <span
            className={`size-32 rounded-full flex items-center justify-center text-5xl font-extrabold ${chat.color} ${
              seconds < 3 ? "animate-pulse" : ""
            }`}
            style={{ boxShadow: "0 0 0 6px rgba(255,255,255,0.08)" }}
          >
            {chat.initial}
          </span>
          <h3 className="text-3xl font-semibold">{chat.name}</h3>
          <p className="text-base text-white/70">
            {seconds < 3 ? "Tocando o telefone..." : type === "video" ? "Em chamada de vídeo" : "Em chamada"}
          </p>
        </div>
        {type === "video" && seconds >= 3 && (
          <div
            className="absolute right-4 top-20 w-24 h-32 rounded-2xl border border-white/20 flex items-center justify-center text-[11px] text-white/70 z-10"
            style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
          >
            Sua câmera
          </div>
        )}
        <div className="relative z-10 p-8 flex justify-center">
          <button
            type="button"
            onClick={onEnd}
            aria-label="Encerrar chamada"
            className="size-16 rounded-full text-white flex items-center justify-center shadow-2xl ring-4 ring-white/20 animate-pulse"
            style={{ backgroundColor: "#EA0038" }}
          >
            <PhoneOff className="size-7" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-background">
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
        <div
          className="size-20 rounded-full flex items-center justify-center text-white"
          style={{ backgroundColor: WA.green }}
        >
          <Check className="size-12" strokeWidth={2.6} />
        </div>
        <h3 className="text-2xl font-extrabold" style={{ color: WA.teal }}>
          Chamada encerrada
        </h3>
        <p className="text-base text-muted-foreground">
          Você fez uma {type === "video" ? "chamada de vídeo" : "ligação"} de {formatDur(seconds)}.
        </p>
      </div>
      <div className="p-5 border-t border-border">
        <button
          type="button"
          onClick={onContinue}
          className="w-full h-14 rounded-2xl text-white text-lg font-extrabold shadow-md hover:opacity-90 transition ring-4 ring-[rgba(37,211,102,0.25)] animate-pulse"
          style={{ backgroundColor: WA.green }}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}

/* ---------- Sim: enviar/ouvir áudio ---------- */
function SimAudio({
  chat,
  messages,
  recording,
  recSeconds,
  audioSent,
  playing,
  playProgress,
  onHoldStart,
  onHoldEnd,
  onPlay,
  onPause,
  onFinish,
}: {
  chat: Chat;
  messages: ChatMessage[];
  recording: boolean;
  recSeconds: number;
  audioSent: boolean;
  playing: boolean;
  playProgress: number;
  onHoldStart: () => void;
  onHoldEnd: () => void;
  onPlay: () => void;
  onPause: () => void;
  onFinish: () => void;
}) {
  return (
    <div className="flex flex-col flex-1">
      <ChatHeader chat={chat} />
      <MessagesList
        messages={messages}
        playing={playing}
        playProgress={playProgress}
        onPlay={onPlay}
        onPause={onPause}
        highlightLastIncomingAudio={audioSent}
      />

      <ComposerShell>
        <ComposerInputPill>
          {recording ? (
            <span
              className="flex items-center gap-2 px-3 font-bold flex-1"
              style={{ color: "#EA0038" }}
            >
              <span className="size-3 rounded-full bg-[#EA0038] animate-pulse" />
              Gravando... {formatDur(recSeconds)}
              <span className="ml-auto text-xs font-medium" style={{ color: WA.metaGray }}>
                ← deslize para cancelar
              </span>
            </span>
          ) : (
            <>
              <button
                type="button"
                aria-label="Emoji"
                className="size-10 flex items-center justify-center"
                style={{ color: WA.metaGray }}
              >
                <Smile className="size-6" />
              </button>
              <span className="flex-1 text-[16px]" style={{ color: WA.metaGray }}>
                Mensagem
              </span>
              <button
                type="button"
                aria-label="Anexar"
                className="size-10 flex items-center justify-center -rotate-45"
                style={{ color: WA.metaGray }}
              >
                <Paperclip className="size-5" />
              </button>
              <button
                type="button"
                aria-label="Câmera"
                className="size-10 flex items-center justify-center"
                style={{ color: WA.metaGray }}
              >
                <Camera className="size-5" />
              </button>
            </>
          )}
        </ComposerInputPill>
        {audioSent ? (
          <button
            type="button"
            onClick={onFinish}
            className="h-12 px-4 rounded-full text-white text-base font-bold inline-flex items-center gap-2 shadow-md"
            style={{ backgroundColor: WA.green }}
          >
            Concluir
          </button>
        ) : (
          <button
            type="button"
            onMouseDown={onHoldStart}
            onMouseUp={onHoldEnd}
            onMouseLeave={() => recording && onHoldEnd()}
            onTouchStart={(e) => {
              e.preventDefault();
              onHoldStart();
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              onHoldEnd();
            }}
            aria-label="Segure para gravar áudio"
            className={`size-12 rounded-full text-white flex items-center justify-center shadow-md transition select-none ${
              recording
                ? "scale-125 ring-8 ring-[rgba(234,0,56,0.25)]"
                : "ring-4 ring-[rgba(37,211,102,0.4)] animate-pulse"
            }`}
            style={{ backgroundColor: recording ? "#EA0038" : WA.green }}
          >
            <Mic className="size-6" strokeWidth={2.6} />
          </button>
        )}
      </ComposerShell>

      {!audioSent && !recording && (
        <div
          className="px-4 py-2 text-center text-xs border-t"
          style={{ backgroundColor: "#fff", borderColor: WA.divider, color: WA.metaGray }}
        >
          Dica: <strong>segure</strong> o microfone para gravar e <strong>solte</strong> para enviar.
        </div>
      )}
    </div>
  );
}
