import { useState, useCallback } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Smartphone, BookOpen, ShieldCheck, ChevronRight, LogOut, Volume2, Square, Lightbulb } from "lucide-react";
import { A11yToggle, useA11y } from "../lib/a11y";

export const Route = createFileRoute("/home")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Início — Ajudante Tech" },
      {
        name: "description",
        content: "Escolha o que quer aprender hoje: aplicativos, glossário digital ou segurança contra golpes.",
      },
    ],
  }),
});

type Option = {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  to: string;
  tone: "primary" | "accent" | "destructive";
};

const options: Option[] = [
  {
    title: "Aplicativos",
    description: "Aprenda a usar YouTube, WhatsApp e outros",
    icon: Smartphone,
    to: "/apps",
    tone: "primary",
  },
  {
    title: "Glossário Digital",
    description: "Entenda os símbolos e palavras da internet",
    icon: BookOpen,
    to: "/glossario",
    tone: "accent",
  },
  {
    title: "Segurança e Golpes",
    description: "Dicas para ficar segura na internet",
    icon: ShieldCheck,
    to: "/seguranca",
    tone: "destructive",
  },
];

const toneStyles: Record<Option["tone"], { bg: string; text: string }> = {
  primary: { bg: "bg-primary/10", text: "text-primary" },
  accent: { bg: "bg-accent/15", text: "text-accent" },
  destructive: { bg: "bg-destructive/10", text: "text-destructive" },
};

function HomePage() {
  const [speaking, setSpeaking] = useState(false);
  const { enabled: a11y } = useA11y();

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "pt-BR";
    utter.rate = 0.9;
    const ptVoice = window.speechSynthesis.getVoices().find((v) => v.lang.toLowerCase().startsWith("pt"));
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

  const readScreen = () =>
    speak(
      "Bem-vinda! Escolha um dos caminhos abaixo para começar. Você tem três opções: Aplicativos, para aprender a usar YouTube e WhatsApp. Glossário Digital, para entender símbolos e palavras da internet. E Segurança e Golpes, com dicas para ficar segura.",
    );

  return (
    <main className="min-h-screen bg-background flex flex-col items-center px-5 py-6">
      <div className="w-full max-w-md flex flex-col gap-6">
        {/* Header */}
        <header className="flex items-center justify-between gap-3 pt-2">
          <div>
            <h1 className={`font-extrabold text-foreground tracking-tight ${a11y ? "text-4xl" : "text-3xl"}`}>Bem-vinda!</h1>
            <p className={`mt-1 font-medium ${a11y ? "text-xl text-foreground" : "text-lg text-muted-foreground"}`}>Escolha por onde começar:</p>
          </div>
          <Link
            to="/login"
            aria-label="Sair"
            className="inline-flex items-center gap-2 h-12 px-4 rounded-2xl border-2 border-border bg-card text-foreground text-base font-bold hover:bg-muted transition"
          >
            <LogOut className="size-5" />
            Sair
          </Link>
        </header>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <A11yToggle />
          <button
            type="button"
            onClick={speaking ? stopSpeaking : readScreen}
            aria-label={speaking ? "Parar leitura" : "Ouvir"}
            className="inline-flex items-center gap-2 h-12 px-5 rounded-full bg-accent text-accent-foreground text-base font-bold shadow-md shadow-accent/30 hover:bg-accent/90 active:scale-[0.99] transition"
          >
            {speaking ? <Square className="size-5" /> : <Volume2 className="size-5" />}
            {speaking ? "Parar" : "Ouvir"}
          </button>
        </div>

        {/* Options */}
        <nav aria-label="Caminhos de aprendizado" className="flex flex-col gap-4">
          {options.map(({ title, description, icon: Icon, to, tone }) => {
            const t = toneStyles[tone];
            return (
              <Link
                key={title}
                to={to}
                className={
                  a11y
                    ? "group flex items-center gap-4 bg-card rounded-3xl p-6 border-4 border-foreground hover:bg-muted active:scale-[0.99] transition focus:outline-none focus:ring-4 focus:ring-foreground"
                    : "group flex items-center gap-4 bg-card rounded-3xl p-5 border-2 border-border/60 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.15)] hover:border-primary/60 active:scale-[0.99] transition focus:outline-none focus:ring-4 focus:ring-primary/25"
                }
              >
                <div
                  className={
                    a11y
                      ? "shrink-0 size-16 rounded-2xl flex items-center justify-center bg-foreground"
                      : `shrink-0 size-16 rounded-2xl flex items-center justify-center ${t.bg}`
                  }
                >
                  <Icon className={a11y ? "size-9 text-background" : `size-8 ${t.text}`} strokeWidth={a11y ? 2.6 : 2.2} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className={`font-extrabold leading-tight ${a11y ? "text-3xl text-foreground" : "text-2xl text-card-foreground"}`}>{title}</h2>
                  <p className={`mt-1 leading-snug ${a11y ? "text-lg text-foreground font-medium" : "text-base text-muted-foreground"}`}>{description}</p>
                </div>
                <ChevronRight className={a11y ? "size-8 text-foreground shrink-0" : "size-7 text-muted-foreground group-hover:text-primary transition shrink-0"} />
              </Link>
            );
          })}
        </nav>

        {/* Tip of the day */}
        <section
          aria-label="Dica do dia"
          className={
            a11y
              ? "rounded-3xl p-6 bg-foreground text-background border-4 border-foreground"
              : "rounded-3xl p-5 bg-primary text-primary-foreground shadow-lg shadow-primary/30"
          }
        >
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="size-6" strokeWidth={2.4} />
            <h2 className={`font-extrabold ${a11y ? "text-2xl" : "text-xl"}`}>Dica do dia</h2>
          </div>
          <p className={`leading-snug ${a11y ? "text-xl font-medium" : "text-lg"}`}>
            Não tenha medo de explorar! Você não vai quebrar o celular tocando por aí. Quase tudo pode ser desfeito com
            o botão voltar.
          </p>
        </section>
      </div>
    </main>
  );
}
