import { ArrowLeft, Volume2, Square } from "lucide-react";
import { A11yToggle, useA11y } from "../lib/a11y";
import { useScrolled } from "../lib/use-scrolled";

type Props = {
  title?: string;
  onBack?: () => void;
  backLabel?: string;
  speaking: boolean;
  onSpeakToggle: () => void;
  speakLabel?: string;
};

export function PageHeader({
  title,
  onBack,
  backLabel = "Voltar",
  speaking,
  onSpeakToggle,
  speakLabel = "Ouvir",
}: Props) {
  const { enabled: a11y } = useA11y();
  const scrolled = useScrolled();

  return (
    <header
      style={{ width: "100vw", marginLeft: "calc(-50vw + 50%)" }}
      className={`sticky top-0 z-30 px-5 py-3 bg-background/95 backdrop-blur flex items-center justify-between gap-3 transition-shadow ${
        scrolled ? "shadow-lg shadow-foreground/10 border-b border-border" : ""
      }`}
    >
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          aria-label={backLabel}
          className="inline-flex items-center gap-2 h-12 px-4 rounded-2xl border-2 border-border bg-card text-foreground text-base font-bold hover:bg-muted transition"
        >
          <ArrowLeft className="size-5" /> Voltar
        </button>
      ) : (
        <span
          className={`font-extrabold text-foreground tracking-tight ${a11y ? "text-2xl" : "text-xl"}`}
        >
          {title}
        </span>
      )}
      <div className="flex items-center gap-2">
        <A11yToggle />
        <button
          type="button"
          onClick={onSpeakToggle}
          aria-label={speaking ? "Parar leitura" : speakLabel}
          className="inline-flex items-center gap-2 h-12 px-4 rounded-full bg-accent text-accent-foreground text-base font-bold shadow-md shadow-accent/30 hover:bg-accent/90 active:scale-[0.99] transition"
        >
          {speaking ? <Square className="size-5" /> : <Volume2 className="size-5" />}
          {speaking ? "Parar" : "Ouvir"}
        </button>
      </div>
    </header>
  );
}
