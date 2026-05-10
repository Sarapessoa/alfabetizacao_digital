import { useState, useCallback } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, LogIn, Smartphone, Volume2, Square } from "lucide-react";
import { A11yToggle } from "../lib/a11y";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Entrar — Ajudante Tech" },
      { name: "description", content: "Entre para continuar aprendendo a usar seu celular com tranquilidade." },
    ],
  }),
});

function LoginPage() {
  const [showPwd, setShowPwd] = useState(false);
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const navigate = useNavigate();

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Seu navegador não suporta leitura em voz alta.");
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "pt-BR";
    utter.rate = 0.9;
    utter.pitch = 1;
    const voices = window.speechSynthesis.getVoices();
    const ptVoice = voices.find((v) => v.lang.toLowerCase().startsWith("pt"));
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

  const readScreen = () => {
    speak(
      "Bem-vinda de volta ao Ajudante Tech. Vamos continuar juntas, no seu ritmo. Digite seu e-mail e sua senha, e depois toque no botão Entrar. Se preferir, você também pode tocar em Entrar sem login.",
    );
  };

  return (
    <main className="min-h-screen bg-background flex flex-col items-center px-5 py-8">
      <div className="w-full max-w-md flex flex-col gap-8">
        {/* Header acolhedor */}
        <header className="text-center flex flex-col items-center gap-3 pt-2">
          <div className="size-20 rounded-3xl bg-primary/10 flex items-center justify-center shadow-sm">
            <Smartphone className="size-10 text-primary" strokeWidth={2.2} />
          </div>
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight">
            Ajudante Tech
          </h1>
          <p className="text-xl text-muted-foreground font-medium">
            Que bom te ver de novo! 👋
          </p>
          <div className="mt-2 flex items-center gap-2">
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
        </header>

        {/* Card */}
        <section
          aria-labelledby="login-title"
          className="bg-card rounded-3xl p-7 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.12)] border border-border/60 flex flex-col gap-6"
        >
          <div className="flex flex-col gap-1">
            <h2 id="login-title" className="text-3xl font-bold text-card-foreground">
              Bem-vinda de volta
            </h2>
            <p className="text-lg text-muted-foreground">
              Vamos continuar juntas, no seu ritmo.
            </p>
          </div>

          <form
            className="flex flex-col gap-5"
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/apps" });
            }}
          >
            {/* Email */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label htmlFor="email" className="text-xl font-bold text-foreground">
                  Seu e-mail
                </label>
                <button
                  type="button"
                  onClick={() => speak("Seu e-mail. Digite o endereço de e-mail que você usa para entrar.")}
                  aria-label="Ouvir explicação do campo e-mail"
                  className="size-11 rounded-full flex items-center justify-center bg-muted text-foreground hover:bg-accent hover:text-accent-foreground transition"
                >
                  <Volume2 className="size-5" />
                </button>
              </div>
              <input
                id="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="seunome@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-16 rounded-2xl border-2 border-border bg-background px-5 text-xl text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition"
              />
            </div>

            {/* Senha */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label htmlFor="senha" className="text-xl font-bold text-foreground">
                  Sua senha
                </label>
                <button
                  type="button"
                  onClick={() => speak("Sua senha. Digite a palavra secreta que você escolheu para entrar na sua conta.")}
                  aria-label="Ouvir explicação do campo senha"
                  className="size-11 rounded-full flex items-center justify-center bg-muted text-foreground hover:bg-accent hover:text-accent-foreground transition"
                >
                  <Volume2 className="size-5" />
                </button>
              </div>
              <div className="relative">
                <input
                  id="senha"
                  type={showPwd ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Digite sua senha"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  className="h-16 w-full rounded-2xl border-2 border-border bg-background px-5 pr-16 text-xl text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  aria-label={showPwd ? "Esconder a senha" : "Mostrar a senha"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 size-12 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition"
                >
                  {showPwd ? <EyeOff className="size-6" /> : <Eye className="size-6" />}
                </button>
              </div>
            </div>

            {/* Botão principal */}
            <button
              type="submit"
              className="mt-2 h-[68px] w-full rounded-2xl bg-primary text-primary-foreground text-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-[0.99] transition focus:outline-none focus:ring-4 focus:ring-primary/30"
            >
              <LogIn className="size-7" strokeWidth={2.4} />
              Entrar
            </button>

            <button
              type="button"
              onClick={() => navigate({ to: "/apps" })}
              className="h-[60px] w-full rounded-2xl bg-transparent text-foreground text-xl font-semibold border-2 border-border hover:bg-muted active:scale-[0.99] transition focus:outline-none focus:ring-4 focus:ring-primary/20"
            >
              Entrar sem login
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
