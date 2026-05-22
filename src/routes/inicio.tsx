import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, ChevronRight, Lightbulb, ShieldCheck, Smartphone, Square, Volume2 } from "lucide-react";
import { BottomTabBar } from "../components/BottomTabBar";
import { PageHeader } from "../components/PageHeader";
import { useA11y } from "../lib/a11y";
import { useAudioTts } from "../lib/tts";

export const Route = createFileRoute("/inicio")({
  component: InicioPage,
  head: () => ({
    meta: [
      { title: "Inicio — Ajudante Tech" },
      {
        name: "description",
        content: "Escolha por onde começar: aplicativos, glossário digital ou segurança na internet.",
      },
    ],
  }),
});

type HomeCard = {
  title: string;
  description: string;
  to: "/apps" | "/glossario" | "/seguranca";
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  tone: "blue" | "orange" | "red";
};

const cards: HomeCard[] = [
  {
    title: "Aplicativos",
    description: "Aprenda a usar YouTube, WhatsApp e outros",
    to: "/apps",
    icon: Smartphone,
    tone: "blue",
  },
  {
    title: "Glossário Digital",
    description: "Entenda os símbolos e palavras da internet",
    to: "/glossario",
    icon: BookOpen,
    tone: "orange",
  },
  {
    title: "Segurança e Golpes",
    description: "Dicas para ficar segura na internet",
    to: "/seguranca",
    icon: ShieldCheck,
    tone: "red",
  },
];

const toneStyles = {
  blue: { bg: "bg-primary/10", text: "text-primary" },
  orange: { bg: "bg-accent/15", text: "text-accent" },
  red: { bg: "bg-destructive/10", text: "text-destructive" },
};

function InicioPage() {
  const [speaking, setSpeaking] = useState(false);
  const { enabled: a11y } = useA11y();
  const { speak, stopSpeaking } = useAudioTts({ setSpeaking });

  const readScreen = () =>
    speak({
      file: "inicio-tela.mp3",
      text:
        "Bem-vindo! Escolha um dos caminhos abaixo para começar: aplicativos, glossário digital ou segurança e golpes. Dica do dia: não tenha medo de explorar. Quase tudo pode ser desfeito com o botão voltar.",
    });

  const readTip = () =>
    speak({
      file: "inicio-dica-dia.mp3",
      text:
        "Dica do dia. Não tenha medo de explorar. Você não vai quebrar o celular tocando por aí. Quase tudo pode ser desfeito com o botão voltar.",
    });

  return (
    <main className="min-h-screen bg-background flex flex-col items-center px-5 py-6 pb-28">
      <div className="w-full max-w-md flex flex-col gap-6">
        <PageHeader
          speaking={speaking}
          onSpeakToggle={speaking ? stopSpeaking : readScreen}
        />

        <section className="flex flex-col gap-2">
          <h1 className={`font-extrabold text-foreground tracking-tight ${a11y ? "text-4xl" : "text-3xl"}`}>
            Bem-vindo!
          </h1>
          <p
            className={`leading-snug font-medium ${
              a11y ? "text-xl text-foreground" : "text-lg text-muted-foreground"
            }`}
          >
            Escolha um dos caminhos abaixo para começar
          </p>
        </section>

        <nav aria-label="Caminhos para começar" className="flex flex-col gap-4">
          {cards.map((card) => {
            const Icon = card.icon;
            const tone = toneStyles[card.tone];
            return (
              <Link
                key={card.to}
                to={card.to}
                className={`group grid items-center transition active:scale-[0.99] focus:outline-none ${
                  a11y
                    ? "grid-cols-[4rem_minmax(0,1fr)_2rem] gap-4 rounded-2xl bg-card p-4 border-4 border-foreground focus:ring-4 focus:ring-foreground"
                    : "grid-cols-[4.5rem_minmax(0,1fr)_1.75rem] gap-4 rounded-[1.75rem] bg-card p-5 border-2 border-border/70 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.18)] hover:border-primary/50 focus:ring-4 focus:ring-primary/25"
                }`}
                aria-label={`${card.title}. ${card.description}`}
              >
                <span
                  className={`flex items-center justify-center shrink-0 ${
                    a11y ? "size-16 rounded-xl bg-foreground text-background" : `size-16 rounded-2xl ${tone.bg} ${tone.text}`
                  }`}
                >
                  <Icon className={a11y ? "size-9" : "size-8"} strokeWidth={2.4} />
                </span>
                <span className="min-w-0">
                  <span
                    className={`block font-extrabold text-card-foreground leading-tight ${
                      a11y ? "text-2xl" : "text-xl"
                    }`}
                  >
                    {card.title}
                  </span>
                  <span
                    className={`block mt-1 leading-snug ${
                      a11y ? "text-lg text-foreground" : "text-base text-foreground"
                    }`}
                  >
                    {card.description}
                  </span>
                </span>
                <ChevronRight
                  className={`justify-self-end transition ${
                    a11y
                      ? "size-8 text-foreground"
                      : "size-7 text-muted-foreground group-hover:text-primary"
                  }`}
                  strokeWidth={2.4}
                />
              </Link>
            );
          })}
        </nav>

        <section
          className={
            a11y
              ? "rounded-2xl bg-card p-5 border-4 border-foreground"
              : "rounded-[1.75rem] bg-[oklch(0.97_0.03_88)] p-5 border-2 border-[oklch(0.87_0.07_88)] shadow-[0_4px_20px_-12px_rgba(0,0,0,0.18)]"
          }
        >
          <div className="flex items-center gap-3">
            <span
              className={
                a11y
                  ? "size-14 rounded-xl bg-foreground text-background flex items-center justify-center shrink-0"
                  : "size-12 rounded-2xl bg-[oklch(0.90_0.08_88)] text-[oklch(0.45_0.13_75)] flex items-center justify-center shrink-0"
              }
            >
              <Lightbulb className={a11y ? "size-7" : "size-6"} strokeWidth={2.4} />
            </span>
            <h2 className={`flex-1 font-extrabold leading-none ${a11y ? "text-2xl text-foreground" : "text-xl text-[oklch(0.25_0.06_75)]"}`}>
              Dica do dia
            </h2>
            <button
              type="button"
              onClick={speaking ? stopSpeaking : readTip}
              aria-label={speaking ? "Parar dica do dia" : "Ouvir dica do dia"}
              className={`rounded-full flex items-center justify-center transition active:scale-[0.98] ${
                a11y
                  ? "size-14 bg-foreground text-background border-4 border-foreground hover:opacity-90"
                  : "size-12 bg-white/80 text-[oklch(0.45_0.13_75)] border border-[oklch(0.84_0.08_88)] hover:bg-[oklch(0.90_0.08_88)]"
              }`}
            >
              {speaking ? <Square className={a11y ? "size-6" : "size-5"} /> : <Volume2 className={a11y ? "size-6" : "size-5"} />}
            </button>
          </div>
          <p className={`mt-4 font-semibold leading-snug ${a11y ? "text-xl text-foreground" : "text-lg text-[oklch(0.30_0.04_75)]"}`}>
            Não tenha medo de explorar! Você não vai quebrar o celular tocando por aí.
            Quase tudo pode ser desfeito com o botão voltar.
          </p>
        </section>
      </div>
      <BottomTabBar />
    </main>
  );
}
