import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Volume2,
  Square,
  X,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Home,
  Search,
  PlaySquare,
  User as UserIcon,
  CheckCircle2,
  Sparkles,
  Newspaper,
  Plus,
  Camera,
  Music,
  ChevronDown,
  Settings,
  Grid3x3,
  ChevronUp,
  Check,
} from "lucide-react";
import { A11yToggle, useA11y } from "../lib/a11y";

import postFood from "../assets/insta-food.jpg";
import postFriends from "../assets/insta-friends.jpg";
import postCrochet from "../assets/insta-crochet.jpg";
import postPet from "../assets/insta-pet.jpg";
import postGarden from "../assets/insta-garden.jpg";
import postChapel from "../assets/insta-chapel.jpg";
import religious1 from "../assets/religious-1.jpg";
import religious2 from "../assets/religious-2.jpg";
import religious3 from "../assets/religious-3.jpg";
import avatarMe from "../assets/insta-avatar-me.jpg";
import reel1 from "../assets/insta-reel-1.jpg";
import reel2 from "../assets/insta-reel-2.jpg";
import reel3 from "../assets/insta-reel-3.jpg";

export const Route = createFileRoute("/apps/instagram")({
  component: InstagramSimulation,
  head: () => ({
    meta: [
      { title: "Instagram — Ajudante Tech" },
      {
        name: "description",
        content:
          "Aprenda a usar o Instagram: ver o feed, curtir e comentar fotos, assistir Reels e ver seu perfil, passo a passo.",
      },
    ],
  }),
});

type Stage =
  | "intro"
  | "overview"
  | "sim-feed"
  | "sim-reels"
  | "sim-profile"
  | "done";

type TaskKey = "like" | "comment" | "reels" | "profile";
const TASK_ORDER: TaskKey[] = ["like", "comment", "reels", "profile"];

type Post = {
  id: string;
  user: string;
  user_sub?: string;
  avatarColor: string;
  image: string;
  baseLikes: number;
  caption: string;
  comments: { user: string; text: string }[];
  location?: string;
};

const POSTS: Post[] = [
  {
    id: "p1",
    user: "cida_amiga",
    user_sub: "Dona Cida",
    avatarColor: "from-pink-500 via-orange-400 to-yellow-300",
    image: postFood,
    baseLikes: 142,
    caption: "Brigadeiro caseiro pro lanche da tarde 😋☕ quem quer?",
    comments: [
      { user: "lurdinha_v", text: "Tô indo aí, amiga!" },
      { user: "antonio.s", text: "Que delícia, hein!" },
    ],
    location: "Cozinha da Cida",
  },
  {
    id: "p2",
    user: "lurdinha_v",
    user_sub: "Lurdinha",
    avatarColor: "from-fuchsia-500 via-rose-400 to-amber-300",
    image: postFriends,
    baseLikes: 312,
    caption: "Tarde de bolo e prosa com as amigas ☕💕",
    comments: [{ user: "cida_amiga", text: "Saudade dessa turma! ❤️" }],
  },
  {
    id: "p3",
    user: "jardim.dona.rosa",
    user_sub: "Dona Rosa",
    avatarColor: "from-purple-500 via-pink-500 to-orange-400",
    image: postGarden,
    baseLikes: 89,
    caption: "Minhas orquídeas finalmente floresceram 🌸",
    comments: [{ user: "lurdinha_v", text: "Que jardim lindo!" }],
  },
  {
    id: "p4",
    user: "croche_da_lu",
    user_sub: "Lu Crochê",
    avatarColor: "from-rose-400 via-fuchsia-500 to-purple-500",
    image: postCrochet,
    baseLikes: 264,
    caption: "Toalhinha nova pronta! Levei a semana toda 🧶✨",
    comments: [],
  },
  {
    id: "p5",
    user: "antonio.s",
    user_sub: "Seu Antônio",
    avatarColor: "from-amber-400 via-orange-400 to-rose-400",
    image: postPet,
    baseLikes: 178,
    caption: "O Toby pediu pra aparecer no Instagram 🐶❤️",
    comments: [{ user: "cida_amiga", text: "Que fofura!" }],
  },
  {
    id: "p6",
    user: "paroquia.santa",
    user_sub: "Paróquia",
    avatarColor: "from-amber-400 via-rose-400 to-pink-500",
    image: postChapel,
    baseLikes: 521,
    caption: "Missa especial hoje às 19h. Esperamos todos! 🙏",
    comments: [],
  },
];

type Reel = {
  id: string;
  user: string;
  image: string;
  caption: string;
  baseLikes: number;
  song: string;
};

const REELS: Reel[] = [
  {
    id: "r1",
    user: "receitas_da_vovo",
    image: reel1,
    caption: "Receita de bolo de fubá fofinho 🍰 anota aí!",
    baseLikes: 1820,
    song: "Bolero · Roberto Carlos",
  },
  {
    id: "r2",
    user: "doguinhos_br",
    image: reel2,
    caption: "Olha esse fofuxo brincando 🐶❤️",
    baseLikes: 9540,
    song: "Som original · doguinhos_br",
  },
  {
    id: "r3",
    user: "novelas.brasil",
    image: reel3,
    caption: "Os melhores momentos da novela das 9 📺💖",
    baseLikes: 4210,
    song: "Trilha sonora · Globo",
  },
];

/* ================================================================== */
function InstagramSimulation() {
  const [stage, setStage] = useState<Stage>("overview");
  const [speaking, setSpeaking] = useState(false);
  const { enabled: a11y } = useA11y();
  const navigate = useNavigate();

  const [done, setDone] = useState<Record<TaskKey, boolean>>({
    like: false,
    comment: false,
    reels: false,
    profile: false,
  });

  // Feed
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const [postComments, setPostComments] = useState<Record<string, { user: string; text: string }[]>>({});
  const [openComments, setOpenComments] = useState<string | null>(null);
  const [draftComment, setDraftComment] = useState("");

  // Reels
  const [reelIdx, setReelIdx] = useState(0);
  const [likedReels, setLikedReels] = useState<Set<string>>(new Set());

  const [dialog, setDialog] = useState<null | { title: string; body: string }>(null);

  const steps = [
    { n: 1, label: "Curtir", key: "like" as TaskKey },
    { n: 2, label: "Comentar", key: "comment" as TaskKey },
    { n: 3, label: "Reels", key: "reels" as TaskKey },
    { n: 4, label: "Perfil", key: "profile" as TaskKey },
  ];
  const completedCount = TASK_ORDER.filter((k) => done[k]).length;
  const allDone = completedCount === TASK_ORDER.length;
  const isDone = stage === "done";

  const currentStep =
    stage === "overview"
      ? 1
      : stage === "sim-feed"
        ? done.like && !done.comment
          ? 2
          : done.like && done.comment
            ? 2
            : 1
        : stage === "sim-reels"
          ? 3
          : stage === "sim-profile"
            ? 4
            : 1;

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
      <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${((isDone ? steps.length : completedCount) / steps.length) * 100}%`,
            background:
              "linear-gradient(90deg, oklch(0.78 0.16 75), oklch(0.62 0.20 25), oklch(0.62 0.20 355))",
          }}
        />
      </div>
      <ol className="mt-3 grid grid-cols-4 gap-2">
        {steps.map((s) => {
          const isStepDone = isDone || done[s.key];
          const active =
            !isDone &&
            !done[s.key] &&
            TASK_ORDER.find((k) => !done[k]) === s.key;
          return (
            <li key={s.n} className="flex flex-col items-center gap-1 text-center">
              <span
                className={`size-7 rounded-full inline-flex items-center justify-center text-xs font-extrabold transition ${
                  isStepDone
                    ? "bg-success text-white"
                    : active
                      ? "text-white"
                      : "bg-muted text-muted-foreground"
                }`}
                style={
                  active && !isStepDone
                    ? {
                        background:
                          "linear-gradient(135deg, oklch(0.78 0.16 75), oklch(0.62 0.20 25), oklch(0.62 0.20 355))",
                        boxShadow: "0 0 0 4px oklch(0.62 0.20 355 / 0.25)",
                      }
                    : undefined
                }
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

  // Auto-advance from intro splash
  useEffect(() => {
    if (stage !== "intro") return;
    const t = setTimeout(() => setStage("sim-feed"), 1600);
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
        return "Instagram. É como uma revista de fofoca, mas com gente que você conhece. Toque em iniciar simulação prática.";
      case "sim-feed":
        if (!done.like) return "Este é o feed. Toque duas vezes na foto, ou no coração embaixo, para curtir.";
        if (!done.comment) return "Agora toque no balãozinho de comentário e escreva uma palavra carinhosa para a amiga.";
        return "Muito bem! Use a barra de baixo para ir aos Reels, ou toque em Continuar.";
      case "sim-reels":
        return done.reels
          ? "Pronto! Use a barra de baixo para ver o seu perfil, ou toque em Continuar."
          : "Reels são vídeos curtinhos. Curta no coração ❤️ e toque em Próximo para ver outro.";
      case "sim-profile":
        return done.profile
          ? "Esse é o seu perfil. Toque em Concluir simulação."
          : "Esse é o seu cantinho, com suas fotos e suas amigas. Toque em qualquer foto para ver maior.";
      case "done":
        return "Parabéns! Você aprendeu a usar o Instagram: feed, curtidas, comentários, Reels e seu perfil.";
      default:
        return "Instagram";
    }
  }, [stage, done]);

  const handleSpeak = () => (speaking ? stopSpeaking() : speak(screenText));

  const PINK = "oklch(0.62 0.20 355)";

  // ----- Intro splash -----
  if (stage === "intro") {
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center text-white"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.78 0.16 75) 0%, oklch(0.62 0.20 25) 45%, oklch(0.62 0.20 355) 100%)",
        }}
      >
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="size-24 rounded-3xl bg-white/15 backdrop-blur flex items-center justify-center shadow-2xl ring-4 ring-white/30">
            <Camera className="size-12" strokeWidth={2.4} />
          </div>
          <h1
            className="text-5xl font-extrabold tracking-tight"
            style={{ fontFamily: "'Grand Hotel', 'Snell Roundhand', cursive" }}
          >
            Instagram
          </h1>
        </div>
      </main>
    );
  }

  // ----- Header bar (overview/done) -----
  const headerBar = (
    <header
      className="text-white px-5 pt-5 pb-6"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.78 0.16 75) 0%, oklch(0.62 0.20 25) 50%, oklch(0.62 0.20 355) 100%)",
      }}
    >
      <div className="w-full max-w-md mx-auto flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <Link
            to="/apps"
            aria-label="Voltar para aplicativos"
            className="inline-flex items-center gap-2 h-11 px-3 rounded-2xl text-base font-bold hover:bg-white/15 transition"
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
              className="inline-flex items-center gap-2 h-11 px-3 rounded-full bg-white text-base font-bold hover:opacity-90 transition"
              style={{ color: PINK }}
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
          style={{ fontFamily: "'Grand Hotel', 'Snell Roundhand', cursive" }}
        >
          Instagram
        </h1>
      </div>
    </header>
  );

  // ----- Overview -----
  if (stage === "overview") {
    return (
      <main className="min-h-screen bg-muted/40 flex flex-col">
        {headerBar}
        <div className="w-full max-w-md mx-auto flex-1 flex flex-col gap-6 px-5 py-6">
          <section
            className={`rounded-2xl bg-card p-5 shadow-md border-l-8 ${
              a11y ? "border-2 border-foreground" : "border border-border"
            }`}
            style={{ borderLeftColor: PINK }}
          >
            <h2 className={`font-extrabold ${a11y ? "text-2xl" : "text-xl"}`} style={{ color: PINK }}>
              O que é parecido?
            </h2>
            <div
              className="mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-extrabold text-white text-base"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.78 0.16 75), oklch(0.62 0.20 25), oklch(0.62 0.20 355))",
              }}
            >
              <Newspaper className="size-5" />
              Revista de fofoca
            </div>
            <p
              className={`mt-3 leading-snug ${
                a11y ? "text-xl text-foreground" : "text-lg text-muted-foreground"
              }`}
            >
              É como folhear uma <strong style={{ color: PINK }}>revista cheia de fotos</strong>
              {" "}das amigas, dos seus passatempos preferidos e de assuntos que você gosta —
              receitas, jardim, novelas, animais, crochê. E você ainda pode mandar um
              coraçãozinho ou comentar.
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
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: "25%",
                  background:
                    "linear-gradient(90deg, oklch(0.78 0.16 75), oklch(0.62 0.20 25), oklch(0.62 0.20 355))",
                }}
              />
            </div>
            <ol className="flex flex-col gap-3">
              {[
                { n: 1, t: "Curtir uma foto", d: "Toque no coraçãozinho embaixo da foto, ou dois toques rápidos na foto, para mandar um carinho para a amiga." },
                { n: 2, t: "Comentar uma foto", d: "Toque no balãozinho e escreva uma palavra carinhosa para a pessoa." },
                { n: 3, t: "Ver os Reels", d: "Reels são vídeos curtinhos. Curta os que gostar e deslize o dedo para cima na tela para ver o próximo." },
                { n: 4, t: "Ver seu perfil", d: "É o seu cantinho com suas fotos e os assuntos que você gosta." },
              ].map((s) => {
                const active = s.n === 1;
                return (
                  <li
                    key={s.n}
                    className={`rounded-2xl p-4 transition ${
                      active
                        ? a11y
                          ? "border-2 border-foreground bg-muted/40"
                          : "border-2"
                        : a11y
                          ? "bg-card border-2 border-foreground"
                          : "bg-card border border-border"
                    }`}
                    style={
                      active && !a11y
                        ? { borderColor: PINK, backgroundColor: "oklch(0.62 0.20 355 / 0.06)" }
                        : undefined
                    }
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="size-8 rounded-full inline-flex items-center justify-center font-extrabold text-white"
                        style={{
                          background: active
                            ? "linear-gradient(135deg, oklch(0.78 0.16 75), oklch(0.62 0.20 25), oklch(0.62 0.20 355))"
                            : "oklch(0.85 0.02 250)",
                          color: active ? "#fff" : "var(--muted-foreground)",
                        }}
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
            className="inline-flex items-center justify-center gap-2 w-full h-16 rounded-2xl text-white text-xl font-extrabold shadow-lg transition hover:opacity-90 active:scale-[0.99]"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.78 0.16 75), oklch(0.62 0.20 25), oklch(0.62 0.20 355))",
              boxShadow: "0 10px 30px -10px oklch(0.62 0.20 355 / 0.5)",
            }}
          >
            <Camera className="size-6" />
            Iniciar Simulação Prática
          </button>
        </div>
      </main>
    );
  }

  // ----- Done -----
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
            Maravilha! Você aprendeu!
          </h2>
          <p className={`leading-snug ${a11y ? "text-xl" : "text-lg text-muted-foreground"}`}>
            Agora você sabe ver fotos no feed, curtir e comentar, assistir Reels e ver seu próprio
            perfil. Use sempre que sentir saudade!
          </p>
          <div className="flex flex-col gap-3 w-full">
            <button
              type="button"
              onClick={() => {
                setDone({ like: false, comment: false, reels: false, profile: false });
                setLikedPosts(new Set());
                setSavedPosts(new Set());
                setPostComments({});
                setOpenComments(null);
                setDraftComment("");
                setReelIdx(0);
                setLikedReels(new Set());
                setStage("overview");
              }}
              className="h-14 rounded-2xl border-2 border-border bg-card text-foreground text-lg font-bold hover:bg-muted transition"
            >
              Repetir simulação
            </button>
            <button
              type="button"
              onClick={() => navigate({ to: "/apps" })}
              className="h-14 rounded-2xl text-white text-lg font-extrabold hover:opacity-90 transition"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.78 0.16 75), oklch(0.62 0.20 25), oklch(0.62 0.20 355))",
              }}
            >
              Ver outros aplicativos
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ----- Tip -----
  const tip =
    stage === "sim-feed"
      ? !done.like
        ? "Toque no coração ❤️ embaixo da foto da Cida (que está piscando)."
        : !done.comment
          ? "Toque no balãozinho 💬 da foto da Cida e escreva 'Que delícia!'"
          : "Pronto! Toque em Continuar, ou use a barrinha de baixo para ir aos Reels e ao Perfil."
      : stage === "sim-reels"
        ? !done.reels
          ? "Curta um vídeo (toque no coração ❤️ do lado direito)."
          : reelIdx < REELS.length - 1
            ? "Agora deslize o dedo para cima ⬆ para ver outro vídeo."
            : "Pronto! Toque em Continuar para ver o seu perfil."
        : !done.profile
          ? "Veja suas fotos e seus seguidores. Quando estiver pronto, toque em Concluir."
          : "Toque em Concluir simulação.";

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <div
        className="text-white px-5 py-4 sticky top-0 z-30 shadow-md"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.78 0.16 75), oklch(0.62 0.20 25), oklch(0.62 0.20 355))",
        }}
      >
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

      <div className="w-full max-w-md mx-auto flex-1 flex flex-col min-h-0 bg-white">
        {stage === "sim-feed" ? (
          <SimFeed
            posts={POSTS}
            likedPosts={likedPosts}
            savedPosts={savedPosts}
            postComments={postComments}
            openComments={openComments}
            draftComment={draftComment}
            done={done}
            onToggleLike={(id) => {
              setLikedPosts((s) => {
                const ns = new Set(s);
                if (ns.has(id)) ns.delete(id);
                else ns.add(id);
                return ns;
              });
              if (id === "p1") setDone((d) => ({ ...d, like: true }));
            }}
            onToggleSave={(id) =>
              setSavedPosts((s) => {
                const ns = new Set(s);
                if (ns.has(id)) ns.delete(id);
                else ns.add(id);
                return ns;
              })
            }
            onOpenComments={(id) => {
              setOpenComments(id);
              setDraftComment("Que delícia, amiga!");
            }}
            onCloseComments={() => {
              setOpenComments(null);
              setDraftComment("");
            }}
            onDraftChange={setDraftComment}
            onSendComment={(id) => {
              const text = draftComment.trim();
              if (!text) return;
              setPostComments((m) => ({
                ...m,
                [id]: [...(m[id] ?? []), { user: "voce", text }],
              }));
              setDraftComment("");
              if (id === "p1") setDone((d) => ({ ...d, comment: true }));
            }}
            onContinue={() => setStage("sim-reels")}
            onTabChange={(t) => {
              if (t === "reels") setStage("sim-reels");
              if (t === "profile") setStage("sim-profile");
            }}
          />
        ) : stage === "sim-reels" ? (
          <SimReels
            reels={REELS}
            idx={reelIdx}
            likedReels={likedReels}
            done={done}
            onLike={(id) => {
              setLikedReels((s) => {
                const ns = new Set(s);
                if (ns.has(id)) ns.delete(id);
                else ns.add(id);
                return ns;
              });
              if (!done.reels) setDone((d) => ({ ...d, reels: true }));
            }}
            onIdxChange={(i) => setReelIdx(i)}
            onContinue={() => setStage("sim-profile")}
            onTabChange={(t) => {
              if (t === "feed") setStage("sim-feed");
              if (t === "profile") setStage("sim-profile");
            }}
          />
        ) : (
          <SimProfile
            postsViewed={done.profile}
            onMarkSeen={() => setDone((d) => ({ ...d, profile: true }))}
            onFinish={() => setStage("done")}
            onTabChange={(t) => {
              if (t === "feed") setStage("sim-feed");
              if (t === "reels") setStage("sim-reels");
            }}
            onPostClick={(idx) =>
              setDialog({
                title: `Foto ${idx + 1}`,
                body: "Aqui dá para ver a foto maior, com curtidas e comentários. Toque no X para fechar.",
              })
            }
          />
        )}
      </div>

      {dialog && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-foreground/60 flex items-end sm:items-center justify-center z-40 px-4 pb-6 pt-20"
          onClick={() => setDialog(null)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-card border-2 border-border shadow-2xl p-6 flex flex-col gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2" style={{ color: PINK }}>
              <Sparkles className="size-6" />
              <h3 className="font-extrabold text-xl">{dialog.title}</h3>
            </div>
            <p className="leading-snug text-base text-muted-foreground">{dialog.body}</p>
            <button
              type="button"
              onClick={() => setDialog(null)}
              className="mt-2 h-12 rounded-full text-white text-base font-extrabold hover:opacity-90 transition"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.78 0.16 75), oklch(0.62 0.20 25), oklch(0.62 0.20 355))",
              }}
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
   FEED
===================================================================== */
function StoryRing({
  src,
  name,
  isYou,
}: {
  src?: string;
  name: string;
  isYou?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1 shrink-0">
      <div className="relative size-[72px]">
        <div
          className="absolute inset-0 rounded-full p-[3px]"
          style={{
            background: isYou
              ? "#dbdbdb"
              : "conic-gradient(from 180deg, #feda77, #f58529, #dd2a7b, #8134af, #515bd4, #dd2a7b, #f58529, #feda77)",
          }}
        >
          <div className="size-full rounded-full bg-white p-[2.5px]">
            {src ? (
              <img
                src={src}
                alt=""
                className="size-full rounded-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="size-full rounded-full bg-gradient-to-br from-pink-300 to-orange-300" />
            )}
          </div>
        </div>
        {isYou && (
          <span
            className="absolute bottom-0 right-0 size-[22px] rounded-full text-white flex items-center justify-center border-[2.5px] border-white"
            style={{ backgroundColor: "#0095f6" }}
          >
            <Plus className="size-3.5" strokeWidth={3.5} />
          </span>
        )}
      </div>
      <span className="text-[12px] font-normal truncate max-w-[72px] text-black">
        {isYou ? "Seu story" : name}
      </span>
    </div>
  );
}

function PostCard({
  post,
  liked,
  saved,
  comments,
  highlighted,
  highlightLike,
  highlightComment,
  onToggleLike,
  onToggleSave,
  onOpenComments,
}: {
  post: Post;
  liked: boolean;
  saved: boolean;
  comments: { user: string; text: string }[];
  highlighted: boolean;
  highlightLike: boolean;
  highlightComment: boolean;
  onToggleLike: () => void;
  onToggleSave: () => void;
  onOpenComments: () => void;
}) {
  const [doubleTap, setDoubleTap] = useState(false);
  const lastTap = useRef(0);
  const handleImageTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      if (!liked) onToggleLike();
      setDoubleTap(true);
      window.setTimeout(() => setDoubleTap(false), 600);
    }
    lastTap.current = now;
  };

  const totalLikes = post.baseLikes + (liked ? 1 : 0);
  const allComments = [...post.comments, ...comments];

  return (
    <article
      className={`bg-white ${
        highlighted ? "ring-4 ring-offset-2 rounded-2xl" : ""
      }`}
      style={
        highlighted
          ? { boxShadow: "0 0 0 4px oklch(0.62 0.20 355 / 0.35)" }
          : undefined
      }
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-3 py-2.5">
        <div
          className="size-10 rounded-full p-[2px]"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.78 0.16 75), oklch(0.62 0.20 25), oklch(0.62 0.20 355))",
          }}
        >
          <div className="size-full rounded-full bg-white p-[2px]">
            <div
              className={`size-full rounded-full bg-gradient-to-br ${post.avatarColor}`}
            />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-extrabold text-black leading-tight truncate">
            {post.user}
          </p>
          {post.location && (
            <p className="text-[11px] text-black/70 truncate">{post.location}</p>
          )}
        </div>
        <button type="button" aria-label="Mais" className="text-black p-1">
          <MoreHorizontal className="size-5" />
        </button>
      </div>

      {/* Image */}
      <div className="relative bg-black select-none" onClick={handleImageTap}>
        <img
          src={post.image}
          alt=""
          className="w-full aspect-square object-cover"
          loading="lazy"
          draggable={false}
        />
        {doubleTap && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Heart
              className="size-28 text-white drop-shadow-2xl animate-ping"
              fill="white"
              strokeWidth={1}
            />
          </div>
        )}
      </div>

      {/* Action row */}
      <div className="flex items-center px-3 pt-2.5 pb-1">
        <button
          type="button"
          onClick={onToggleLike}
          aria-label={liked ? "Descurtir" : "Curtir"}
          className={`p-1.5 -ml-1 transition ${
            highlightLike ? "rounded-full ring-4 animate-pulse" : ""
          }`}
          style={
            highlightLike
              ? { boxShadow: "0 0 0 4px oklch(0.62 0.20 25 / 0.35)" }
              : undefined
          }
        >
          <Heart
            className="size-7"
            strokeWidth={1.8}
            fill={liked ? "#ED4956" : "none"}
            color={liked ? "#ED4956" : "#000"}
          />
        </button>
        <button
          type="button"
          onClick={onOpenComments}
          aria-label="Comentar"
          className={`p-1.5 transition ${
            highlightComment ? "rounded-full ring-4 animate-pulse" : ""
          }`}
          style={
            highlightComment
              ? { boxShadow: "0 0 0 4px oklch(0.55 0.18 240 / 0.35)" }
              : undefined
          }
        >
          <MessageCircle
            className="size-7 text-black"
            strokeWidth={1.8}
            style={{ transform: "scaleX(-1)" }}
          />
        </button>
        <button type="button" aria-label="Compartilhar" className="p-1.5">
          <Send className="size-7 text-black" strokeWidth={1.8} />
        </button>
        <button
          type="button"
          onClick={onToggleSave}
          aria-label={saved ? "Remover dos salvos" : "Salvar"}
          className="p-1.5 ml-auto"
        >
          <Bookmark
            className="size-7 text-black"
            strokeWidth={1.8}
            fill={saved ? "#000" : "none"}
          />
        </button>
      </div>

      {/* Likes */}
      <div className="px-3 pb-1">
        <p className="text-[14px] font-extrabold text-black">
          {totalLikes.toLocaleString("pt-BR")} curtidas
        </p>
      </div>

      {/* Caption */}
      <div className="px-3 pb-1.5">
        <p className="text-[14px] text-black leading-snug">
          <span className="font-extrabold">{post.user}</span>{" "}
          {post.caption}
        </p>
      </div>

      {/* Comments preview */}
      {allComments.length > 0 && (
        <div className="px-3 pb-2">
          <button
            type="button"
            onClick={onOpenComments}
            className="text-[13px] text-black/60"
          >
            Ver todos os {allComments.length} comentários
          </button>
          {allComments.slice(-1).map((c, i) => (
            <p key={i} className="text-[14px] text-black leading-snug">
              <span className="font-extrabold">{c.user}</span> {c.text}
            </p>
          ))}
        </div>
      )}

      <div className="h-2" />
    </article>
  );
}

function SimFeed({
  posts,
  likedPosts,
  savedPosts,
  postComments,
  openComments,
  draftComment,
  done,
  onToggleLike,
  onToggleSave,
  onOpenComments,
  onCloseComments,
  onDraftChange,
  onSendComment,
  onContinue,
  onTabChange,
}: {
  posts: Post[];
  likedPosts: Set<string>;
  savedPosts: Set<string>;
  postComments: Record<string, { user: string; text: string }[]>;
  openComments: string | null;
  draftComment: string;
  done: Record<TaskKey, boolean>;
  onToggleLike: (id: string) => void;
  onToggleSave: (id: string) => void;
  onOpenComments: (id: string) => void;
  onCloseComments: () => void;
  onDraftChange: (v: string) => void;
  onSendComment: (id: string) => void;
  onContinue: () => void;
  onTabChange: (t: "feed" | "reels" | "profile") => void;
}) {
  const targetId = "p1";
  return (
    <div className="flex flex-col flex-1 bg-white text-black">
      {/* IG header */}
      <div className="flex items-center justify-between px-4 h-14 bg-white">
        <button type="button" aria-label="Adicionar" className="text-black -ml-1 p-1">
          <Plus className="size-7" strokeWidth={2} />
        </button>
        <button
          type="button"
          className="flex items-center gap-1 text-black absolute left-1/2 -translate-x-1/2"
        >
          <span
            className="text-[28px] leading-none"
            style={{ fontFamily: "'Grand Hotel', 'Snell Roundhand', cursive" }}
          >
            Instagram
          </span>
          <ChevronDown className="size-5" strokeWidth={2.2} />
        </button>
        <button type="button" aria-label="Notificações" className="text-black relative p-1 -mr-1">
          <Heart className="size-7" strokeWidth={1.8} />
          <span className="absolute top-0.5 right-0.5 size-2.5 rounded-full bg-[#ED4956] border-2 border-white" />
        </button>
      </div>

      {/* Stories */}
      <div className="flex gap-3 px-3 py-3 overflow-x-auto border-b border-black/5">
        <StoryRing name="Você" src={avatarMe} isYou />
        <StoryRing name="cida_amiga" src={postFood} />
        <StoryRing name="lurdinha" src={postFriends} />
        <StoryRing name="dona_rosa" src={postGarden} />
        <StoryRing name="lu_croche" src={postCrochet} />
        <StoryRing name="seu_antonio" src={postPet} />
        <StoryRing name="paroquia" src={postChapel} />
      </div>

      {/* Posts */}
      <div className="flex flex-col">
        {posts.map((p) => {
          const isTarget = p.id === targetId;
          return (
            <PostCard
              key={p.id}
              post={p}
              liked={likedPosts.has(p.id)}
              saved={savedPosts.has(p.id)}
              comments={postComments[p.id] ?? []}
              highlighted={isTarget && (!done.like || !done.comment)}
              highlightLike={isTarget && !done.like}
              highlightComment={isTarget && done.like && !done.comment}
              onToggleLike={() => onToggleLike(p.id)}
              onToggleSave={() => onToggleSave(p.id)}
              onOpenComments={() => onOpenComments(p.id)}
            />
          );
        })}
        <div className="h-32" />
      </div>

      {/* Continue bar */}
      {done.like && done.comment && (
        <div className="sticky bottom-14 left-0 right-0 z-20 px-4 py-3 bg-white border-t border-black/10">
          <button
            type="button"
            onClick={onContinue}
            className="w-full h-14 rounded-2xl text-white text-lg font-extrabold animate-pulse hover:opacity-90"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.78 0.16 75), oklch(0.62 0.20 25), oklch(0.62 0.20 355))",
              boxShadow: "0 0 0 4px oklch(0.62 0.20 355 / 0.25)",
            }}
          >
            Continuar para os Reels →
          </button>
        </div>
      )}

      {/* Bottom tab bar */}
      <BottomTabs current="feed" onChange={onTabChange} />

      {/* Comments sheet */}
      {openComments && (
        <CommentsSheet
          post={posts.find((p) => p.id === openComments)!}
          comments={postComments[openComments] ?? []}
          draft={draftComment}
          onDraftChange={onDraftChange}
          onSend={() => onSendComment(openComments)}
          onClose={onCloseComments}
          mustComment={openComments === targetId && !done.comment}
        />
      )}
    </div>
  );
}

function CommentsSheet({
  post,
  comments,
  draft,
  onDraftChange,
  onSend,
  onClose,
  mustComment,
}: {
  post: Post;
  comments: { user: string; text: string }[];
  draft: string;
  onDraftChange: (v: string) => void;
  onSend: () => void;
  onClose: () => void;
  mustComment: boolean;
}) {
  const all = [...post.comments, ...comments];
  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-t-3xl flex flex-col max-h-[85vh] text-black"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pt-2 pb-1 flex justify-center">
          <div className="h-1 w-10 rounded-full bg-black/20" />
        </div>
        <div className="flex items-center justify-between px-4 py-2 border-b border-black/10">
          <h3 className="font-extrabold text-base">Comentários</h3>
          <button onClick={onClose} aria-label="Fechar" className="p-1">
            <X className="size-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
          {all.length === 0 && (
            <p className="text-sm text-black/60 text-center py-6">
              Seja a primeira a comentar.
            </p>
          )}
          {all.map((c, i) => (
            <div key={i} className="flex gap-2">
              <div
                className={`size-8 rounded-full bg-gradient-to-br ${
                  c.user === "voce"
                    ? "from-blue-400 to-blue-600"
                    : "from-pink-400 to-orange-400"
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-[13px]">
                  <span className="font-extrabold">
                    {c.user === "voce" ? "você" : c.user}
                  </span>{" "}
                  {c.text}
                </p>
                <p className="text-[11px] text-black/50 mt-0.5">agora</p>
              </div>
              <Heart className="size-3.5 text-black/40 mt-1.5" />
            </div>
          ))}
        </div>
        {/* Emoji quick row */}
        <div className="border-t border-black/10 px-2 pt-2 pb-1 flex items-center justify-between bg-white">
          {["❤️", "🙌", "🔥", "👏", "🥲", "😍", "😮", "😂"].map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => onDraftChange((draft + " " + e).trim())}
              className="text-2xl px-1"
              aria-label={`Reagir ${e}`}
            >
              {e}
            </button>
          ))}
        </div>
        <div className="p-3 flex items-center gap-2 bg-white">
          <div className="size-9 rounded-full overflow-hidden shrink-0">
            <img src={avatarMe} alt="" className="size-full object-cover" />
          </div>
          <input
            type="text"
            value={draft}
            onChange={(e) => onDraftChange(e.target.value)}
            placeholder="O que você acha disso?"
            className="flex-1 h-11 px-4 rounded-full bg-black/5 text-[14px] outline-none placeholder:text-black/50"
          />
          <button
            type="button"
            onClick={onSend}
            disabled={!draft.trim()}
            className={`h-11 px-4 rounded-full text-sm font-extrabold transition ${
              draft.trim()
                ? mustComment
                  ? "text-white animate-pulse"
                  : "text-blue-500"
                : "text-blue-300"
            }`}
            style={
              mustComment && draft.trim()
                ? {
                    background:
                      "linear-gradient(135deg, oklch(0.78 0.16 75), oklch(0.62 0.20 25), oklch(0.62 0.20 355))",
                  }
                : undefined
            }
          >
            Publicar
          </button>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   REELS
===================================================================== */
function SimReels({
  reels,
  idx,
  likedReels,
  done,
  onLike,
  onIdxChange,
  onContinue,
  onTabChange,
}: {
  reels: Reel[];
  idx: number;
  likedReels: Set<string>;
  done: Record<TaskKey, boolean>;
  onLike: (id: string) => void;
  onIdxChange: (i: number) => void;
  onContinue: () => void;
  onTabChange: (t: "feed" | "reels" | "profile") => void;
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const canContinue = done.reels && idx === reels.length - 1;

  const handleScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const h = el.clientHeight;
    if (h === 0) return;
    const i = Math.round(el.scrollTop / h);
    if (i !== idx && i >= 0 && i < reels.length) onIdxChange(i);
  }, [idx, reels.length, onIdxChange]);

  return (
    <div className="flex flex-col flex-1 bg-black text-white relative overflow-hidden">
      {/* Top header */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 pt-4 pb-2 pointer-events-none">
        <Camera className="size-7" strokeWidth={2} />
        <div className="flex items-center gap-5 pointer-events-auto">
          <button className="text-xl font-extrabold">Reels</button>
          <button className="text-xl font-extrabold opacity-60 flex items-center gap-1">
            Amigos
            <span className="flex -space-x-1.5">
              <span className="size-5 rounded-full bg-pink-300 border border-black" />
              <span className="size-5 rounded-full bg-amber-300 border border-black" />
            </span>
          </button>
        </div>
      </div>

      {/* Vertical snap scroller — swipe up/down to change reels */}
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="absolute inset-0 overflow-y-scroll snap-y snap-mandatory pb-14"
        style={{ scrollbarWidth: "none" }}
      >
        {reels.map((reel, i) => {
          const liked = likedReels.has(reel.id);
          const totalLikes = reel.baseLikes + (liked ? 1 : 0);
          const isCurrent = i === idx;
          return (
            <section
              key={reel.id}
              className="relative w-full h-full snap-start snap-always"
              style={{ height: "calc(100% - 0px)" }}
            >
              <div className="absolute inset-0">
                <img
                  src={reel.image}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />
              </div>

              {/* Right action column */}
              <div className="absolute right-3 bottom-32 z-20 flex flex-col items-center gap-5">
                <button
                  type="button"
                  onClick={() => onLike(reel.id)}
                  aria-label={liked ? "Descurtir" : "Curtir"}
                  className={`flex flex-col items-center gap-1 ${
                    isCurrent && !liked && !done.reels ? "animate-pulse" : ""
                  }`}
                >
                  <span
                    className="size-12 rounded-full flex items-center justify-center"
                    style={
                      isCurrent && !liked && !done.reels
                        ? { boxShadow: "0 0 0 4px oklch(0.62 0.20 25 / 0.5)" }
                        : undefined
                    }
                  >
                    <Heart
                      className="size-9"
                      strokeWidth={1.8}
                      fill={liked ? "#ED4956" : "none"}
                      color={liked ? "#ED4956" : "#fff"}
                    />
                  </span>
                  <span className="text-xs font-extrabold drop-shadow">
                    {totalLikes.toLocaleString("pt-BR")}
                  </span>
                </button>
                <button type="button" className="flex flex-col items-center gap-1">
                  <MessageCircle
                    className="size-9"
                    strokeWidth={1.8}
                    style={{ transform: "scaleX(-1)" }}
                  />
                  <span className="text-xs font-extrabold drop-shadow">128</span>
                </button>
                <button type="button" className="flex flex-col items-center gap-1">
                  <Send className="size-9" strokeWidth={1.8} />
                  <span className="text-xs font-extrabold drop-shadow">42</span>
                </button>
                <button type="button" className="flex flex-col items-center">
                  <MoreHorizontal className="size-9" strokeWidth={2} />
                </button>
                <div
                  className="size-10 rounded-md border-2 border-white"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.78 0.16 75), oklch(0.62 0.20 355))",
                  }}
                />
              </div>

              {/* Bottom info */}
              <div className="absolute left-3 right-20 bottom-24 z-20">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="size-8 rounded-full p-[2px]"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.78 0.16 75), oklch(0.62 0.20 355))",
                    }}
                  >
                    <div className="size-full rounded-full bg-white p-[1px]">
                      <div className="size-full rounded-full bg-gradient-to-br from-pink-300 to-orange-300" />
                    </div>
                  </div>
                  <span className="text-sm font-extrabold drop-shadow">{reel.user}</span>
                  <button className="ml-1 h-7 px-3 rounded-md border border-white/80 text-xs font-extrabold">
                    Seguir
                  </button>
                </div>
                <p className="text-sm leading-snug drop-shadow line-clamp-2">{reel.caption}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium drop-shadow">
                  <Music className="size-3.5" />
                  {reel.song}
                </div>
              </div>

              {/* Swipe hint on current reel when user hasn't moved yet */}
              {isCurrent && done.reels && i < reels.length - 1 && (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-20 z-20 flex flex-col items-center gap-1 animate-bounce pointer-events-none">
                  <ChevronUp className="size-7 drop-shadow" />
                  <span className="text-xs font-bold drop-shadow">Deslize para cima</span>
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* Floating Continue button (only when allowed) */}
      {canContinue && (
        <div className="absolute left-0 right-0 bottom-16 z-30 px-3 flex justify-center pointer-events-none">
          <button
            type="button"
            onClick={onContinue}
            className="pointer-events-auto h-12 px-6 rounded-full text-white text-base font-extrabold animate-pulse inline-flex items-center justify-center gap-2"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.78 0.16 75), oklch(0.62 0.20 25), oklch(0.62 0.20 355))",
              boxShadow: "0 0 0 4px oklch(0.62 0.20 355 / 0.35)",
            }}
          >
            Continuar para o Perfil →
          </button>
        </div>
      )}

      <BottomTabs current="reels" onChange={onTabChange} dark />
    </div>
  );
}

/* =====================================================================
   PROFILE
===================================================================== */
function SimProfile({
  postsViewed,
  onMarkSeen,
  onFinish,
  onTabChange,
  onPostClick,
}: {
  postsViewed: boolean;
  onMarkSeen: () => void;
  onFinish: () => void;
  onTabChange: (t: "feed" | "reels" | "profile") => void;
  onPostClick: (idx: number) => void;
}) {
  // mark profile as viewed shortly after entering
  useEffect(() => {
    const t = setTimeout(() => onMarkSeen(), 1500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const myPosts = [postFriends, postGarden, postFood, postCrochet, postPet, religious1, postChapel, reel1, reel2];

  return (
    <div className="flex flex-col flex-1 bg-white text-black">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-12 border-b border-black/10">
        <div className="flex items-center gap-1">
          <h2 className="text-[18px] font-extrabold">dona_clara</h2>
          <ChevronDown className="size-5" />
        </div>
        <div className="flex items-center gap-3">
          <Plus className="size-6" strokeWidth={2} />
          <Settings className="size-6" strokeWidth={2} />
        </div>
      </div>

      {/* Profile head */}
      <div className="px-4 pt-4 pb-3 flex items-center gap-6">
        <div
          className="size-[88px] rounded-full p-[2.5px] shrink-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.78 0.16 75), oklch(0.62 0.20 25), oklch(0.62 0.20 355))",
          }}
        >
          <div className="size-full rounded-full bg-white p-[2px]">
            <img
              src={avatarMe}
              alt="Sua foto"
              className="size-full rounded-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
        <div className="flex-1 grid grid-cols-3 gap-1 text-center">
          {[
            { v: "27", l: "publicações" },
            { v: "184", l: "seguidores" },
            { v: "97", l: "seguindo" },
          ].map((s) => (
            <div key={s.l}>
              <p className="text-[18px] font-extrabold leading-tight">{s.v}</p>
              <p className="text-[12px] text-black/70">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bio */}
      <div className="px-4 pb-3">
        <p className="text-[14px] font-extrabold leading-tight">Dona Clara 👵</p>
        <p className="text-[13px] leading-snug">
          Bom dia, gente boa! ☀️<br />
          Crochê · Jardim · Receitas · Novelas 📺
        </p>
      </div>

      {/* Buttons */}
      <div className="px-4 pb-3 flex gap-2">
        <button className="flex-1 h-9 rounded-md bg-black/5 text-[14px] font-extrabold">
          Editar perfil
        </button>
        <button className="flex-1 h-9 rounded-md bg-black/5 text-[14px] font-extrabold">
          Compartilhar
        </button>
        <button className="size-9 rounded-md bg-black/5 flex items-center justify-center">
          <UserIcon className="size-5" />
        </button>
      </div>

      {/* Highlights */}
      <div className="px-4 pb-3 flex gap-4 overflow-x-auto">
        {[
          { l: "Amigas", c: "from-pink-400 to-orange-400" },
          { l: "Receitas", c: "from-rose-400 to-fuchsia-500" },
          { l: "Jardim", c: "from-green-400 to-emerald-500" },
          { l: "Crochê", c: "from-fuchsia-400 to-purple-500" },
          { l: "Novelas", c: "from-amber-400 to-rose-400" },
        ].map((h) => (
          <div key={h.l} className="flex flex-col items-center gap-1 shrink-0">
            <div
              className={`size-16 rounded-full bg-gradient-to-br ${h.c} p-[2px]`}
            >
              <div className="size-full rounded-full bg-white p-[2px]">
                <div className={`size-full rounded-full bg-gradient-to-br ${h.c}`} />
              </div>
            </div>
            <span className="text-[11px] font-medium">{h.l}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-t border-black/10 grid grid-cols-3">
        <button className="h-11 flex items-center justify-center border-t-2 border-black -mt-px">
          <Grid3x3 className="size-6" />
        </button>
        <button className="h-11 flex items-center justify-center text-black/40">
          <PlaySquare className="size-6" />
        </button>
        <button className="h-11 flex items-center justify-center text-black/40">
          <UserIcon className="size-6" />
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-[2px]">
        {myPosts.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onPostClick(i)}
            className="aspect-square overflow-hidden bg-black"
          >
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover hover:opacity-90 transition"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {/* Finish */}
      <div className="sticky bottom-14 left-0 right-0 z-20 px-4 py-3 bg-white border-t border-black/10">
        <button
          type="button"
          onClick={onFinish}
          disabled={!postsViewed}
          className={`w-full h-14 rounded-2xl text-white text-lg font-extrabold transition ${
            postsViewed ? "animate-pulse" : "opacity-50"
          } inline-flex items-center justify-center gap-2`}
          style={{
            background:
              "linear-gradient(135deg, oklch(0.78 0.16 75), oklch(0.62 0.20 25), oklch(0.62 0.20 355))",
            boxShadow: postsViewed
              ? "0 0 0 4px oklch(0.62 0.20 355 / 0.35)"
              : undefined,
          }}
        >
          <Check className="size-6" />
          Concluir simulação
        </button>
      </div>

      <BottomTabs current="profile" onChange={onTabChange} />
    </div>
  );
}

/* =====================================================================
   BOTTOM TABS
===================================================================== */
function BottomTabs({
  current,
  onChange,
  dark = false,
}: {
  current: "feed" | "reels" | "profile";
  onChange: (t: "feed" | "reels" | "profile") => void;
  dark?: boolean;
}) {
  const items: {
    key: "feed" | "reels" | "profile" | "search" | "direct";
    icon: React.ComponentType<{ className?: string; strokeWidth?: number; fill?: string }>;
    label: string;
    clickable: boolean;
  }[] = [
    { key: "feed", icon: Home, label: "Início", clickable: true },
    { key: "reels", icon: PlaySquare, label: "Reels", clickable: true },
    { key: "direct", icon: Send, label: "Direct", clickable: false },
    { key: "search", icon: Search, label: "Buscar", clickable: false },
    { key: "profile", icon: UserIcon, label: "Perfil", clickable: true },
  ];
  const bg = dark ? "bg-black border-white/10 text-white" : "bg-white border-black/10 text-black";
  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-30 border-t h-14 ${bg} flex`}
    >
      <div className="w-full max-w-md mx-auto grid grid-cols-5">
        {items.map((it) => {
          const Icon = it.icon;
          const active = it.key === current;
          if (it.key === "profile") {
            return (
              <button
                key={it.key}
                type="button"
                onClick={() => onChange("profile")}
                aria-label="Perfil"
                className="flex items-center justify-center"
              >
                <span
                  className={`size-7 rounded-full overflow-hidden ${
                    active
                      ? dark
                        ? "ring-2 ring-white"
                        : "ring-2 ring-black"
                      : ""
                  }`}
                >
                  <img src={avatarMe} alt="" className="size-full object-cover" />
                </span>
              </button>
            );
          }
          return (
            <button
              key={it.key}
              type="button"
              onClick={() => it.clickable && onChange(it.key as "feed" | "reels" | "profile")}
              aria-label={it.label}
              className={`flex items-center justify-center transition ${
                active ? "" : "opacity-90"
              } ${!it.clickable ? "opacity-50" : "hover:opacity-100"}`}
            >
              <Icon
                className="size-7"
                strokeWidth={active ? 2.4 : 1.8}
                fill={active && it.key === "feed" ? "currentColor" : "none"}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
