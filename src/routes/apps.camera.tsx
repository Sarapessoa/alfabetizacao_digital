import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Volume2,
  Square,
  X,
  Camera,
  Album,
  CheckCircle2,
  Sparkles,
  Search,
  ChevronLeft,
  MoreVertical,
  RefreshCw,
  Share2,
  Pencil,
  Trash2,
  Image as ImageIcon,
  Heart,
  Info,
  Aperture,
} from "lucide-react";
import { A11yToggle, useA11y } from "../lib/a11y";
import religious1 from "@/assets/religious-1.jpg";
import religious2 from "@/assets/religious-2.jpg";
import religious3 from "@/assets/religious-3.jpg";
import religious4 from "@/assets/religious-4.jpg";
import religious5 from "@/assets/religious-5.jpg";
import religious6 from "@/assets/religious-6.jpg";

export const Route = createFileRoute("/apps/camera")({
  component: CameraSimulation,
  head: () => ({
    meta: [
      { title: "Câmera e Galeria — Ajudante Tech" },
      {
        name: "description",
        content:
          "Aprenda a usar a Câmera e a Galeria do celular com uma simulação prática passo a passo, comparando com a câmera e o álbum de fotos.",
      },
    ],
  }),
});

type Stage =
  | "intro"
  | "overview"
  | "sim-camera"
  | "sim-gallery"
  | "sim-album"
  | "sim-photo"
  | "done";

type Album = {
  id: string;
  name: string;
  count: number;
  cover: string; // image src
};

const ALBUMS: Album[] = [
  {
    id: "camera",
    name: "Câmera",
    count: 129,
    cover: religious1,
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    count: 45,
    cover: religious4,
  },
  {
    id: "familia",
    name: "Família",
    count: 12,
    cover: religious2,
  },
];

const PHOTOS = [
  religious1,
  religious2,
  religious3,
  religious4,
  religious5,
  religious6,
];

function CameraSimulation() {
  const [stage, setStage] = useState<Stage>("overview");
  const [speaking, setSpeaking] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [flash, setFlash] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [dialog, setDialog] = useState<null | { title: string; body: string }>(null);
  const { enabled: a11y } = useA11y();
  const navigate = useNavigate();

  const steps = [
    { n: 1, label: "Tirar foto" },
    { n: 2, label: "Abrir álbum" },
    { n: 3, label: "Escolher foto" },
    { n: 4, label: "Interagir" },
  ];
  const currentStep =
    stage === "overview" || stage === "sim-camera"
      ? 1
      : stage === "sim-gallery"
        ? 2
        : stage === "sim-album"
          ? 3
          : 4;
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
          className="h-full bg-[oklch(0.50_0.17_195)] transition-all duration-500"
          style={{ width: `${((isDone ? steps.length : currentStep) / steps.length) * 100}%` }}
        />
      </div>
    </div>
  );

  // Auto-advance from intro splash to the simulation
  useEffect(() => {
    if (stage !== "intro") return;
    const t = setTimeout(() => setStage("sim-camera"), 1800);
    return () => clearTimeout(t);
  }, [stage]);

  // Reset flash after taking photo
  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(false), 220);
    return () => clearTimeout(t);
  }, [flash]);

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
        return "Câmera e Galeria. É como ter uma câmera e um álbum de fotos no celular. Toque em iniciar simulação prática para começar.";
      case "sim-camera":
        return "Passo 1. Toque no botão branco redondo para tirar uma foto. Depois, toque no quadradinho à esquerda para abrir a galeria.";
      case "sim-gallery":
        return "Passo 2. Esta é a galeria. Toque em um álbum para ver as fotos guardadas dentro dele.";
      case "sim-album":
        return "Passo 3. Estas são as fotos deste álbum. Toque em uma foto para abri-la maior.";
      case "sim-photo":
        return "Passo 4. Você abriu a foto. Pode tocar em compartilhar, editar ou apagar. Quando terminar, toque em concluir.";
      case "done":
        return "Parabéns! Você aprendeu a tirar fotos e usar a galeria do celular.";
      default:
        return "Câmera e Galeria";
    }
  }, [stage]);

  const handleSpeak = () => (speaking ? stopSpeaking() : speak(screenText));

  // ----- Intro splash -----
  if (stage === "intro") {
    return (
      <main className="min-h-screen bg-[oklch(0.50_0.17_195)] flex flex-col items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="size-24 rounded-full bg-white text-[oklch(0.50_0.17_195)] flex items-center justify-center shadow-2xl">
            <Camera className="size-12" strokeWidth={2.6} />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Câmera</h1>
        </div>
      </main>
    );
  }

  // ----- Header bar (shared) -----
  const headerBar = (
    <header className="bg-[oklch(0.50_0.17_195)] text-white px-5 pt-5 pb-6">
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
              className="inline-flex items-center gap-2 h-11 px-3 rounded-full bg-white text-[oklch(0.50_0.17_195)] text-base font-bold hover:opacity-90 transition"
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
          Câmera e Galeria
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
            className={`rounded-2xl bg-card p-5 border-l-8 border-l-[oklch(0.50_0.17_195)] shadow-md ${
              a11y ? "border-2 border-foreground" : "border border-border"
            }`}
          >
            <h2 className={`font-extrabold text-[oklch(0.50_0.17_195)] ${a11y ? "text-2xl" : "text-xl"}`}>
              O que é parecido?
            </h2>
            <div
              className={`mt-3 inline-flex items-center gap-2 rounded-full bg-[oklch(0.50_0.17_195)]/10 text-[oklch(0.50_0.17_195)] px-3 py-1.5 font-extrabold ${
                a11y ? "text-lg" : "text-base"
              }`}
            >
              <Album className="size-5" />
              Câmera e álbum de fotos
            </div>
            <p
              className={`mt-3 leading-snug ${
                a11y ? "text-xl text-foreground" : "text-lg text-muted-foreground"
              }`}
            >
              É como ter uma <strong className="text-[oklch(0.50_0.17_195)]">câmera</strong> para tirar fotos e
              um <strong className="text-[oklch(0.50_0.17_195)]">álbum</strong> que guarda todas as suas
              lembranças, tudo dentro do celular.
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
                className="h-full bg-[oklch(0.50_0.17_195)] transition-all duration-500"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
            </div>
            <ol className="flex flex-col gap-3">
              {[
                {
                  n: 1,
                  t: "Tire uma Foto",
                  d: "Aponte para o que quer fotografar e toque no botão branco redondo.",
                },
                {
                  n: 2,
                  t: "Abra a Galeria",
                  d: "Toque no quadradinho com a foto, no canto, para ver suas lembranças.",
                },
                {
                  n: 3,
                  t: "Escolha uma Foto",
                  d: "Os álbuns guardam suas fotos. Toque em um e depois na foto que quer ver.",
                },
                {
                  n: 4,
                  t: "Compartilhe ou Apague",
                  d: "Com a foto aberta, você pode mandar para alguém, editar ou apagar.",
                },
              ].map((s) => {
                const done = s.n < currentStep;
                const active = s.n === currentStep;
                return (
                  <li
                    key={s.n}
                    className={`rounded-2xl p-4 transition ${
                      active
                        ? "bg-[oklch(0.50_0.17_195)]/5 border-2 border-[oklch(0.50_0.17_195)]"
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
                              ? "bg-[oklch(0.50_0.17_195)] text-white ring-4 ring-[oklch(0.50_0.17_195)]/25"
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
            className="inline-flex items-center justify-center gap-2 w-full h-16 rounded-2xl bg-[oklch(0.50_0.17_195)] text-white text-xl font-extrabold shadow-lg shadow-[oklch(0.50_0.17_195)]/30 hover:bg-[oklch(0.50_0.17_195)]/90 active:scale-[0.99] transition"
          >
            <Camera className="size-6" />
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
            Você aprendeu a tirar fotos e usar a galeria. Agora pode guardar suas lembranças e
            mostrar para a família.
          </p>
          <div className="flex flex-col gap-3 w-full">
            <button
              type="button"
              onClick={() => {
                setPhotoTaken(false);
                setSelectedAlbum(null);
                setSelectedPhoto(null);
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
              className="h-14 rounded-2xl bg-[oklch(0.50_0.17_195)] text-white text-lg font-extrabold hover:bg-[oklch(0.50_0.17_195)]/90 transition"
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
    stage === "sim-camera"
      ? photoTaken
        ? "Ótimo! Agora toque no quadradinho à esquerda para abrir a galeria."
        : "Toque no botão branco redondo para tirar uma foto."
      : stage === "sim-gallery"
        ? "Toque em um álbum para ver as fotos guardadas dentro dele."
        : stage === "sim-album"
          ? "Toque em uma foto para abri-la maior."
          : "Tente os botões de Compartilhar, Editar ou Apagar abaixo.";

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Instruction bar */}
      <div className="sticky top-0 z-20 shadow-md">
        <div className="bg-[oklch(0.50_0.17_195)] text-white">
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
                      done ? "bg-success text-white" : active ? "bg-[oklch(0.50_0.17_195)] text-white" : "bg-muted text-muted-foreground"
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
        {stage === "sim-camera" ? (
          <SimCamera
            photoTaken={photoTaken}
            flash={flash}
            onShoot={() => {
              setFlash(true);
              setPhotoTaken(true);
            }}
            onOpenGallery={() => setStage("sim-gallery")}
          />
        ) : stage === "sim-gallery" ? (
          <SimGallery
            onPickAlbum={(a) => {
              setSelectedAlbum(a);
              setStage("sim-album");
            }}
            onExplain={(d) => setDialog(d)}
          />
        ) : stage === "sim-album" ? (
          <SimAlbum
            album={selectedAlbum ?? ALBUMS[0]}
            onBack={() => setStage("sim-gallery")}
            onPickPhoto={(p) => {
              setSelectedPhoto(p);
              setStage("sim-photo");
            }}
          />
        ) : (
          <SimPhoto
            photo={selectedPhoto ?? PHOTOS[0]}
            liked={liked}
            onLike={() => setLiked((v) => !v)}
            onBack={() => setStage("sim-album")}
            onAction={(d) => setDialog(d)}
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
            <div className="flex items-center gap-2 text-[oklch(0.50_0.17_195)]">
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
              className="mt-2 h-12 rounded-full bg-[oklch(0.50_0.17_195)] text-white text-base font-extrabold hover:bg-[oklch(0.50_0.17_195)]/90 transition"
            >
              OK, entendi
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

/* ---------- Simulated Camera screen ---------- */
function SimCamera({
  photoTaken,
  flash,
  onShoot,
  onOpenGallery,
}: {
  photoTaken: boolean;
  flash: boolean;
  onShoot: () => void;
  onOpenGallery: () => void;
}) {
  return (
    <div className="flex flex-col flex-1 bg-black">
      {/* Viewfinder */}
      <div className="relative flex-1 overflow-hidden bg-black">
        <img
          src={religious1}
          alt="Imagem de Nossa Senhora vista pela câmera"
          className="absolute inset-0 w-full h-full object-cover"
          width={512}
          height={512}
        />
        {/* Focus frame */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="size-44 rounded-3xl border-2 border-white/60" />
        </div>
        {/* Flash overlay */}
        {flash && <div className="absolute inset-0 bg-white animate-pulse" />}
        {/* Top controls */}
        <div className="absolute top-3 left-0 right-0 flex justify-between px-4 text-white">
          <button
            type="button"
            className="size-10 rounded-full bg-black/40 flex items-center justify-center"
            aria-label="Flash"
          >
            <Aperture className="size-5" />
          </button>
          <span className="px-3 py-1 rounded-full bg-black/40 text-xs font-bold">FOTO</span>
        </div>
      </div>

      {/* Bottom control bar */}
      <div className="bg-black px-6 py-5 flex items-center justify-between">
        {/* Gallery thumbnail (left) */}
        <button
          type="button"
          onClick={photoTaken ? onOpenGallery : undefined}
          aria-label="Abrir galeria"
          className={`size-14 rounded-full overflow-hidden border-2 border-white/70 transition ${
            photoTaken
              ? "animate-pulse-ring cursor-pointer"
              : "opacity-50 cursor-not-allowed"
          }`}
        >
          {photoTaken ? (
            <img
              src={religious1}
              alt="Última foto tirada"
              className="size-full object-cover"
              width={64}
              height={64}
              loading="lazy"
            />
          ) : (
            <div className="size-full bg-zinc-700 flex items-center justify-center">
              <ImageIcon className="size-5 text-white/70" />
            </div>
          )}
        </button>

        {/* Shutter button */}
        <button
          type="button"
          onClick={onShoot}
          aria-label="Tirar foto"
          className={`size-20 rounded-full bg-white border-4 border-white/40 transition active:scale-95 ${
            photoTaken ? "ring-4 ring-white/20" : "animate-pulse-ring"
          }`}
        >
          <span className="block size-full rounded-full bg-white shadow-inner" />
        </button>

        {/* Switch camera (right) */}
        <button
          type="button"
          aria-label="Trocar câmera"
          className="size-14 rounded-full bg-zinc-700 text-white flex items-center justify-center"
        >
          <RefreshCw className="size-6" />
        </button>
      </div>
    </div>
  );
}

/* ---------- Simulated Gallery (albums) ---------- */
function SimGallery({
  onPickAlbum,
  onExplain,
}: {
  onPickAlbum: (a: Album) => void;
  onExplain: (d: { title: string; body: string }) => void;
}) {
  return (
    <div className="flex flex-col flex-1 bg-background">
      {/* Top bar */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <button
          type="button"
          aria-label="Câmera"
          onClick={() =>
            onExplain({
              title: "Voltar para a câmera",
              body:
                "Esse botãozinho de câmera abre a câmera de novo. Por agora, vamos seguir explorando a galeria.",
            })
          }
          className="size-10 rounded-full hover:bg-muted flex items-center justify-center"
        >
          <Camera className="size-6 text-foreground" />
        </button>
        <h2 className="text-xl font-extrabold">Galeria</h2>
        <button
          type="button"
          aria-label="Buscar"
          onClick={() =>
            onExplain({
              title: "Buscar fotos",
              body: "A lupa serve para procurar fotos por data ou local. Não é preciso agora.",
            })
          }
          className="size-10 rounded-full hover:bg-muted flex items-center justify-center"
        >
          <Search className="size-5 text-foreground" />
        </button>
      </div>

      {/* Albums grid */}
      <div className="p-4 grid grid-cols-2 gap-4">
        {ALBUMS.map((a, idx) => {
          const isFirst = idx === 0;
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => onPickAlbum(a)}
              className={`flex flex-col items-start gap-2 rounded-2xl p-2 text-left transition ${
                isFirst ? "animate-pulse-ring bg-[oklch(0.50_0.17_195)]/5" : "hover:bg-muted"
              }`}
            >
              <div
                className="relative aspect-square w-full rounded-xl overflow-hidden bg-muted shadow-md"
              >
                <img
                  src={a.cover}
                  alt={`Capa do álbum ${a.name}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  width={256}
                  height={256}
                  loading="lazy"
                />
                {isFirst && (
                  <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 bg-[oklch(0.50_0.17_195)] text-white text-xs font-extrabold px-2 py-1 rounded-full shadow z-10">
                    Toque aqui
                  </span>
                )}
              </div>
              <div className="px-1">
                <p className="text-base font-extrabold leading-tight">{a.name}</p>
                <p className="text-xs text-muted-foreground font-medium">{a.count} fotos</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Simulated Album (photos grid) ---------- */
function SimAlbum({
  album,
  onBack,
  onPickPhoto,
}: {
  album: Album;
  onBack: () => void;
  onPickPhoto: (p: string) => void;
}) {
  return (
    <div className="flex flex-col flex-1 bg-background">
      {/* Top bar */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <Camera className="size-6 text-foreground" />
        <h2 className="text-xl font-extrabold">Galeria</h2>
        <Search className="size-5 text-foreground" />
      </div>
      {/* Album header */}
      <div className="px-4 py-3 border-b border-border flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Voltar para os álbuns"
          className="size-10 rounded-full hover:bg-muted flex items-center justify-center"
        >
          <ChevronLeft className="size-6 text-foreground" />
        </button>
        <h3 className="text-lg font-extrabold">{album.name}</h3>
      </div>
      {/* Photos grid */}
      <div className="p-3 grid grid-cols-3 gap-2">
        {PHOTOS.map((p, idx) => {
          const isFirst = idx === 0;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onPickPhoto(p)}
              className={`relative aspect-square rounded-md overflow-hidden bg-muted transition ${
                isFirst ? "animate-pulse-ring" : "hover:opacity-90"
              }`}
              aria-label={`Foto ${idx + 1}`}
            >
              <img
                src={p}
                alt={`Foto religiosa ${idx + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
                width={200}
                height={200}
                loading="lazy"
              />
              {isFirst && (
                <span className="absolute bottom-1 left-1 right-1 bg-[oklch(0.50_0.17_195)] text-white text-[10px] font-extrabold px-1 py-0.5 rounded-full text-center z-10">
                  Toque aqui
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Simulated Photo (open + actions) ---------- */
function SimPhoto({
  photo,
  liked,
  onLike,
  onBack,
  onAction,
  onFinish,
}: {
  photo: string;
  liked: boolean;
  onLike: () => void;
  onBack: () => void;
  onAction: (d: { title: string; body: string }) => void;
  onFinish: () => void;
}) {
  return (
    <div className="flex flex-col flex-1 bg-black">
      {/* Top bar */}
      <div className="px-3 py-2 flex items-center justify-between text-white bg-black">
        <button
          type="button"
          onClick={onBack}
          aria-label="Voltar"
          className="size-10 rounded-full hover:bg-white/10 flex items-center justify-center"
        >
          <ArrowLeft className="size-6" />
        </button>
        <div className="text-center leading-tight">
          <p className="text-sm font-bold">Hoje, 14:30</p>
        </div>
        <button
          type="button"
          onClick={() =>
            onAction({
              title: "Mais opções",
              body:
                "Aqui aparecem mais ações como salvar em outro álbum, ver detalhes da foto e definir como papel de parede.",
            })
          }
          aria-label="Mais opções"
          className="size-10 rounded-full hover:bg-white/10 flex items-center justify-center"
        >
          <MoreVertical className="size-6" />
        </button>
      </div>

      {/* Photo */}
      <div className="flex-1 flex items-center justify-center bg-black">
        <img
          src={photo}
          alt="Foto aberta em tamanho maior"
          className="w-full aspect-square object-cover"
          width={512}
          height={512}
        />
      </div>

      {/* Like overlay button */}
      <div className="bg-black px-4 py-2 flex items-center justify-between text-white text-xs">
        <button
          type="button"
          onClick={onLike}
          aria-label={liked ? "Tirar curtida" : "Curtir foto"}
          className="inline-flex items-center gap-2 h-9 px-3 rounded-full bg-white/10 hover:bg-white/20 transition"
        >
          <Heart
            className={`size-5 ${liked ? "fill-rose-500 text-rose-500" : "text-white"}`}
          />
          <span className="font-bold">{liked ? "Favorito" : "Favoritar"}</span>
        </button>
        <button
          type="button"
          onClick={() =>
            onAction({
              title: "Detalhes da foto",
              body:
                "Mostra quando e onde a foto foi tirada, o tamanho do arquivo e em qual álbum ela está guardada.",
            })
          }
          className="inline-flex items-center gap-2 h-9 px-3 rounded-full bg-white/10 hover:bg-white/20 transition"
        >
          <Info className="size-5" />
          <span className="font-bold">Detalhes</span>
        </button>
      </div>

      {/* Bottom actions */}
      <div className="bg-zinc-900 text-white grid grid-cols-3 border-t border-white/10">
        <button
          type="button"
          onClick={() =>
            onAction({
              title: "Compartilhar",
              body:
                "Mandar a foto para alguém pelo WhatsApp, e-mail ou outro aplicativo. Você escolhe para quem enviar.",
            })
          }
          className="flex flex-col items-center gap-1 py-3 hover:bg-white/10 transition"
        >
          <Share2 className="size-6" />
          <span className="text-sm font-bold">Compartilhar</span>
        </button>
        <button
          type="button"
          onClick={() =>
            onAction({
              title: "Editar",
              body:
                "Permite recortar a foto, deixar mais clara ou aplicar filtros. A foto original fica salva.",
            })
          }
          className="flex flex-col items-center gap-1 py-3 hover:bg-white/10 transition border-x border-white/10"
        >
          <Pencil className="size-6" />
          <span className="text-sm font-bold">Editar</span>
        </button>
        <button
          type="button"
          onClick={() =>
            onAction({
              title: "Apagar",
              body:
                "Joga a foto na lixeira. Ela ainda fica guardada por um tempo, então dá para recuperar se for sem querer.",
            })
          }
          className="flex flex-col items-center gap-1 py-3 hover:bg-white/10 transition"
        >
          <Trash2 className="size-6" />
          <span className="text-sm font-bold">Apagar</span>
        </button>
      </div>

      {/* Finish bar */}
      <div className="p-4 border-t border-white/10 bg-black sticky bottom-0">
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