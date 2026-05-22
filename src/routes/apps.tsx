import { useState, useMemo } from "react";
import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import {
  Search,
  ChevronRight,
  Play,
  Globe,
  Camera,
  Settings,
  MessageCircle,
  Tv,
  BookOpen,
  Album,
  Mail,
  SlidersHorizontal,
} from "lucide-react";
import { useA11y } from "../lib/a11y";
import { useAudioTts } from "../lib/tts";
import { BottomTabBar } from "../components/BottomTabBar";
import { PageHeader } from "../components/PageHeader";

export const Route = createFileRoute("/apps")({
  component: AppsPage,
  head: () => ({
    meta: [
      { title: "Aplicativos — Ajudante Tech" },
      {
        name: "description",
        content:
          "Escolha um aplicativo do celular para aprender a usá-lo passo a passo, com comparações ao que você já conhece.",
      },
    ],
  }),
});

type Tone = "primary" | "accent" | "destructive" | "success" | "warning" | "info" | "pink" | "teal";

type AppItem = {
  name: string;
  analogy: string;
  shortAnalogy: string;
  analogyIcon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  description: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  tone: Tone;
  to?:
    | "/apps/youtube"
    | "/apps/google"
    | "/apps/camera"
    | "/apps/configuracoes"
    | "/apps/whatsapp";
};

const apps: AppItem[] = [
  {
    name: "Configurações",
    analogy: "Como o painel de ajustes da casa",
    shortAnalogy: "Painel de ajustes",
    analogyIcon: SlidersHorizontal,
    description: "Ajuste o Wi-Fi, o som, o brilho e o tamanho da letra do celular.",
    icon: Settings,
    tone: "primary",
    to: "/apps/configuracoes",
  },
  {
    name: "Câmera e Galeria",
    analogy: "Como uma Câmera e álbum de fotos",
    shortAnalogy: "Câmera e álbum",
    analogyIcon: Album,
    description: "Tire fotos e veja todas as suas lembranças guardadas.",
    icon: Camera,
    tone: "teal",
    to: "/apps/camera",
  },
  {
    name: "Pesquisa Google",
    analogy: "Como uma Enciclopédia",
    shortAnalogy: "Enciclopédia",
    analogyIcon: BookOpen,
    description: "Pergunte qualquer coisa e receba uma resposta na hora.",
    icon: Globe,
    tone: "info",
    to: "/apps/google",
  },
  {
    name: "YouTube",
    analogy: "Como uma Televisão",
    shortAnalogy: "Televisão",
    analogyIcon: Tv,
    description: "Assista vídeos de tudo: novelas, receitas, música e notícias.",
    icon: Play,
    tone: "destructive",
    to: "/apps/youtube",
  },
  {
    name: "WhatsApp",
    analogy: "Como cartas, telegramas e SMS",
    shortAnalogy: "Cartas e SMS",
    analogyIcon: Mail,
    description: "Envie mensagens, fotos e faça chamadas para amigas e pessoas próximas.",
    icon: MessageCircle,
    tone: "success",
    to: "/apps/whatsapp",
  },
];

const toneStyles: Record<Tone, { bg: string; text: string }> = {
  primary: { bg: "bg-primary", text: "text-primary-foreground" },
  accent: { bg: "bg-accent", text: "text-accent-foreground" },
  destructive: { bg: "bg-destructive", text: "text-destructive-foreground" },
  success: { bg: "bg-[oklch(0.62_0.16_150)]", text: "text-white" },
  warning: { bg: "bg-[oklch(0.78_0.16_75)]", text: "text-white" },
  info: { bg: "bg-[oklch(0.55_0.18_240)]", text: "text-white" },
  pink: { bg: "bg-[oklch(0.62_0.20_355)]", text: "text-white" },
  teal: { bg: "bg-[oklch(0.50_0.17_195)]", text: "text-white" },
};

function AppsPage() {
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const { enabled: a11y } = useA11y();
  const { speak, stopSpeaking } = useAudioTts({ setSpeaking });

  const readScreen = () =>
    speak({
      file: "apps-tela.mp3",
      text: "Aplicativos. Escolha um aplicativo para aprender a usá-lo passo a passo. Cada aplicativo é comparado com algo que você já conhece, para ficar mais fácil de entender.",
    });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return apps;
    return apps.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.analogy.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q),
    );
  }, [query]);

  const cardBase = a11y
    ? "group grid grid-cols-[4rem_minmax(0,1fr)_2rem] gap-x-4 gap-y-3 bg-card rounded-2xl p-4 border-4 border-foreground hover:bg-muted active:scale-[0.99] transition focus:outline-none focus:ring-4 focus:ring-foreground"
    : "group grid grid-cols-[3.25rem_minmax(0,1fr)_1.75rem] gap-x-4 gap-y-3 bg-card rounded-2xl p-5 border-2 border-border/60 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.15)] hover:border-primary/60 active:scale-[0.99] transition focus:outline-none focus:ring-4 focus:ring-primary/25";
  const iconBoxBase = a11y
    ? "size-16 rounded-xl flex items-center justify-center bg-foreground text-background"
    : "size-13 rounded-xl flex items-center justify-center";
  const iconClass = a11y ? "size-9" : "size-7";
  const titleClass = a11y
    ? "text-2xl font-extrabold text-foreground leading-tight truncate"
    : "text-xl font-extrabold text-card-foreground leading-none truncate";
  const analogyIconClass = a11y ? "size-5 shrink-0" : "size-4 shrink-0";
  const descClass = a11y
    ? "text-lg text-foreground mt-2 leading-snug font-medium"
    : "text-base text-muted-foreground leading-snug";
  const chevronClass = a11y
    ? "size-8 text-foreground shrink-0 justify-self-end"
    : "size-6 text-muted-foreground group-hover:text-primary transition shrink-0 justify-self-end";

  if (location.pathname !== "/apps") {
    return <Outlet />;
  }

  return (
    <main className="min-h-screen bg-background flex flex-col items-center px-5 py-6 pb-28">
      <div className="w-full max-w-md flex flex-col gap-6">
        <PageHeader
          speaking={speaking}
          onSpeakToggle={speaking ? stopSpeaking : readScreen}
        />

        {/* Title */}
        <div>
          <h1 className={`font-extrabold text-foreground tracking-tight ${a11y ? "text-4xl" : "text-3xl"}`}>
            Aplicativos
          </h1>
          <p
            className={`mt-1 leading-snug font-medium ${
              a11y ? "text-xl text-foreground" : "text-lg text-muted-foreground"
            }`}
          >
            Escolha um aplicativo para aprender passo a passo. Cada um é
            parecido com algo que você já conhece.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <label htmlFor="app-search" className="sr-only">
            Buscar aplicativo
          </label>
          <Search
            className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none ${
              a11y ? "size-7 text-foreground" : "size-6 text-muted-foreground"
            }`}
            strokeWidth={2.4}
          />
          <input
            id="app-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Qual aplicativo você quer aprender?"
            className={`w-full pr-4 rounded-2xl bg-card text-foreground placeholder:text-muted-foreground focus:outline-none transition ${
              a11y
                ? "h-[68px] text-xl border-4 border-foreground focus:ring-4 focus:ring-foreground"
                : "h-[60px] text-lg border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/20"
            }`}
            style={{ paddingLeft: "3.25rem" }}
          />
        </div>

        {/* List */}
        <nav aria-label="Lista de aplicativos" className="flex flex-col gap-4">
          {filtered.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-border p-6 text-center text-lg text-muted-foreground">
              Nenhum aplicativo encontrado. Tente outra palavra.
            </div>
          ) : (
            filtered.map((app) => {
              const t = toneStyles[app.tone];
              const Icon = app.icon;
              const Analogy = app.analogyIcon;
              const available = Boolean(app.to);
              if (!available) {
                return (
                  <div
                    key={app.name}
                    className={`${cardBase} opacity-60 cursor-not-allowed`}
                    aria-label={`${app.name}, em breve. ${app.description}`}
                    aria-disabled="true"
                  >
                    <div
                      className={
                        a11y ? iconBoxBase : `${iconBoxBase} ${t.bg} ${t.text} shadow-sm`
                      + " self-start"}
                    >
                      <Icon className={iconClass} strokeWidth={a11y ? 2.6 : 2.2} />
                    </div>
                    <div className="min-w-0 flex flex-col gap-2 self-center">
                      <h2 className={titleClass}>{app.name}</h2>
                      <span
                        className={
                          a11y
                            ? "inline-flex self-start items-center gap-1.5 px-3 py-1 rounded-full bg-foreground text-background text-base font-extrabold leading-none"
                            : "inline-flex self-start items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-extrabold leading-none bg-muted text-muted-foreground"
                        }
                      >
                        Em breve
                      </span>
                    </div>
                    <p className={`${descClass} col-span-3`}>{app.description}</p>
                  </div>
                );
              }
              return (
                <Link
                  key={app.name}
                  to={app.to!}
                  className={cardBase}
                  aria-label={`${app.name}, ${app.analogy}. ${app.description}`}
                >
                  <div
                    className={
                      a11y ? iconBoxBase : `${iconBoxBase} ${t.bg} ${t.text} shadow-sm`
                    + " self-start"}
                  >
                    <Icon className={iconClass} strokeWidth={a11y ? 2.6 : 2.2} />
                  </div>
                  <div className="min-w-0 flex flex-col gap-2 self-center">
                    <h2 className={titleClass}>{app.name}</h2>
                    <span
                      className={
                        a11y
                          ? "inline-flex self-start items-center gap-1.5 px-3 py-1 rounded-full bg-foreground text-background text-base font-extrabold leading-none"
                          : `inline-flex self-start items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-extrabold leading-none ${t.bg} ${t.text}`
                      }
                    >
                      <Analogy className={analogyIconClass} strokeWidth={2.6} />
                      <span className="truncate">{app.shortAnalogy}</span>
                    </span>
                  </div>
                  <ChevronRight className={`${chevronClass} self-center`} />
                  <p className={`${descClass} col-span-3`}>{app.description}</p>
                </Link>
              );
            })
          )}
        </nav>
      </div>
      <BottomTabBar />
    </main>
  );
}
