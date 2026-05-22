import { ArrowLeft, LogOut, Volume2, Square } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { A11yToggle, useA11y } from "../lib/a11y";
import { useScrolled } from "../lib/use-scrolled";
import { clearSession } from "../lib/auth";

type Props = {
  onBack?: () => void;
  backLabel?: string;
  speaking: boolean;
  onSpeakToggle: () => void;
  speakLabel?: string;
};

export function PageHeader({
  onBack,
  backLabel = "Voltar",
  speaking,
  onSpeakToggle,
  speakLabel = "Ouvir",
}: Props) {
  const scrolled = useScrolled();
  const navigate = useNavigate();
  const { enabled: a11y } = useA11y();

  return (
    <>
      <div className={a11y ? "h-[80px] shrink-0" : "h-[72px] shrink-0"} aria-hidden="true" />
      <header
        className={`fixed inset-x-0 top-0 z-30 px-5 py-3 bg-background/95 backdrop-blur flex items-center justify-center gap-3 transition-shadow ${
          scrolled ? "shadow-lg shadow-foreground/10 border-b border-border" : ""
        }`}
      >
        <div className="max-w-md w-full flex items-center justify-between">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              aria-label={backLabel}
              className={`inline-flex items-center gap-2 rounded-2xl bg-card text-foreground font-bold hover:bg-muted transition ${
                a11y ? "h-14 px-4 border-4 border-foreground text-lg" : "h-12 px-4 border-2 border-border text-base"
              }`}
            >
              <ArrowLeft className={a11y ? "size-6" : "size-5"} /> Voltar
            </button>
          ) : (
            <button
              type="button"
              onClick={() => { clearSession(); navigate({ to: "/" }); }}
              className={`inline-flex items-center gap-2 rounded-2xl bg-card text-foreground font-bold hover:bg-muted transition ${
                a11y ? "h-14 px-4 border-4 border-foreground text-lg" : "h-12 px-4 border-2 border-border text-base"
              }`}
            >
              <LogOut className={a11y ? "size-6" : "size-5"} /> Sair
            </button>
          )}
          <div className="flex items-center gap-2">
            <A11yToggle />
            <button
              type="button"
              onClick={onSpeakToggle}
              aria-label={speaking ? "Parar leitura" : speakLabel}
              className={`inline-flex items-center gap-2 rounded-full font-bold active:scale-[0.99] transition ${
                a11y
                  ? "h-14 px-4 bg-foreground text-background border-4 border-foreground text-lg hover:opacity-90"
                  : "h-12 px-4 bg-accent text-accent-foreground text-base shadow-md shadow-accent/30 hover:bg-accent/90"
              }`}
            >
              {speaking ? <Square className={a11y ? "size-6" : "size-5"} /> : <Volume2 className={a11y ? "size-6" : "size-5"} />}
              {speaking ? "Parar" : "Ouvir"}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
