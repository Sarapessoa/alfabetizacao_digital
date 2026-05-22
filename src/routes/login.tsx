import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, LogIn, Smartphone, Volume2, Square } from "lucide-react";
import { A11yToggle, useA11y } from "../lib/a11y";
import { saveSession } from "../lib/auth";
import { useAudioTts } from "../lib/tts";

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
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const navigate = useNavigate();
  const { speak, stopSpeaking } = useAudioTts({ setSpeaking });
  const { enabled: a11y } = useA11y();

  const readScreen = () => {
    speak({
      file: "login-tela.mp3",
      text: "Bem-vinda ao Ajudante Tech. Digite seu e-mail e toque no botão Entrar para começar.",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Digite um e-mail válido com @.");
      return;
    }
    setError("");
    saveSession(email);
    navigate({ to: "/inicio" });
  };

  return (
    <main className="min-h-screen bg-background flex flex-col items-center px-5 py-8">
      <div className="w-full max-w-md flex flex-col gap-8">
        {/* Header */}
        <header className="text-center flex flex-col items-center gap-3 pt-2">
          <div
            className={`size-20 rounded-3xl flex items-center justify-center shadow-sm ${
              a11y
                ? "bg-background text-foreground border-4 border-foreground"
                : "bg-primary/10"
            }`}
          >
            <Smartphone className={`size-10 ${a11y ? "text-foreground" : "text-primary"}`} strokeWidth={2.2} />
          </div>
          <h1 className={`${a11y ? "text-5xl" : "text-4xl"} font-extrabold text-foreground tracking-tight`}>
            Ajudante Tech
          </h1>
          <p className={`${a11y ? "text-2xl text-foreground" : "text-xl text-muted-foreground"} font-medium`}>
            Que bom te ver!
          </p>
          <div className="mt-2 flex items-center gap-2">
            <A11yToggle />
            <button
              type="button"
              onClick={speaking ? stopSpeaking : readScreen}
              aria-label={speaking ? "Parar leitura" : "Ouvir"}
              className={`inline-flex items-center gap-2 h-12 px-5 rounded-full font-bold active:scale-[0.99] transition ${
                a11y
                  ? "bg-foreground text-background border-4 border-foreground text-lg"
                  : "bg-accent text-accent-foreground text-base shadow-md shadow-accent/30 hover:bg-accent/90"
              }`}
            >
              {speaking ? <Square className="size-5" /> : <Volume2 className="size-5" />}
              {speaking ? "Parar" : "Ouvir"}
            </button>
          </div>
        </header>

        {/* Card */}
        <section
          aria-labelledby="login-title"
          className={`bg-card rounded-3xl p-7 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.12)] flex flex-col gap-6 ${
            a11y ? "border-4 border-foreground" : "border border-border/60"
          }`}
        >
          <div className="flex flex-col gap-1">
            <h2 id="login-title" className={`${a11y ? "text-4xl" : "text-3xl"} font-bold text-card-foreground`}>
              Bem-vinda de volta
            </h2>
            <p className={`${a11y ? "text-xl text-foreground" : "text-lg text-muted-foreground"}`}>
              Vamos continuar juntas, no seu ritmo.
            </p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label htmlFor="email" className="text-xl font-bold text-foreground">
                  Seu e-mail
                </label>
                <button
                  type="button"
                  onClick={() =>
                    speak({
                      file: "login-campo-email.mp3",
                      text: "Seu e-mail. Digite o endereço de e-mail que você usa. Ele precisa ter o símbolo arroba.",
                    })
                  }
                  aria-label="Ouvir explicação do campo e-mail"
                  className={`size-11 rounded-full flex items-center justify-center transition ${
                    a11y
                      ? "bg-background text-foreground border-4 border-foreground"
                      : "bg-muted text-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
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
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                className={`h-16 rounded-2xl bg-background px-5 text-foreground focus:outline-none focus:ring-4 transition ${
                  a11y ? "text-2xl border-4 placeholder:text-foreground" : "text-xl border-2 placeholder:text-muted-foreground/60"
                } ${
                  error
                    ? a11y
                      ? "border-foreground focus:border-foreground focus:ring-foreground/20"
                      : "border-destructive focus:border-destructive focus:ring-destructive/20"
                    : a11y
                      ? "border-foreground focus:border-foreground focus:ring-foreground/20"
                      : "border-border focus:border-primary focus:ring-primary/20"
                }`}
              />
              {error && (
                <p role="alert" className={`${a11y ? "text-lg text-foreground" : "text-base text-destructive"} font-semibold`}>
                  {error}
                </p>
              )}
            </div>

            {/* Senha */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label htmlFor="senha" className="text-xl font-bold text-foreground">
                  Sua senha
                </label>
                <button
                  type="button"
                  onClick={() =>
                    speak({
                      file: "login-campo-senha.mp3",
                      text: "Sua senha. Digite a palavra secreta que você escolheu para entrar na sua conta.",
                    })
                  }
                  aria-label="Ouvir explicação do campo senha"
                  className={`size-11 rounded-full flex items-center justify-center transition ${
                    a11y
                      ? "bg-background text-foreground border-4 border-foreground"
                      : "bg-muted text-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
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
                  className={`h-16 w-full rounded-2xl bg-background px-5 pr-16 text-foreground focus:outline-none focus:ring-4 transition ${
                    a11y
                      ? "text-2xl border-4 border-foreground placeholder:text-foreground focus:border-foreground focus:ring-foreground/20"
                      : "text-xl border-2 border-border placeholder:text-muted-foreground/60 focus:border-primary focus:ring-primary/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  aria-label={showPwd ? "Esconder a senha" : "Mostrar a senha"}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 size-12 rounded-xl flex items-center justify-center transition ${
                    a11y
                      ? "text-foreground bg-background border-2 border-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {showPwd ? <EyeOff className="size-6" /> : <Eye className="size-6" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`mt-2 h-[68px] w-full rounded-2xl text-2xl font-bold flex items-center justify-center gap-3 active:scale-[0.99] transition focus:outline-none focus:ring-4 ${
                a11y
                  ? "bg-foreground text-background border-4 border-foreground focus:ring-foreground/30"
                  : "bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 focus:ring-primary/30"
              }`}
            >
              <LogIn className="size-7" strokeWidth={2.4} />
              Entrar
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
