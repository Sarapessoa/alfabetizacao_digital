import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Volume2,
  Square,
  X,
  Users,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Search,
  Plus,
  BookOpen,
  Phone,
  User as UserIcon,
  Check,
  Star,
} from "lucide-react";
import { A11yToggle, useA11y } from "../lib/a11y";

export const Route = createFileRoute("/apps/contatos")({
  component: ContatosSimulation,
  head: () => ({
    meta: [
      { title: "Contatos — Ajudante Tech" },
      {
        name: "description",
        content:
          "Aprenda a usar a Agenda de Contatos do celular: pesquisar uma pessoa e cadastrar um novo contato, passo a passo.",
      },
    ],
  }),
});

type Stage =
  | "intro"
  | "overview"
  | "sim-list"
  | "sim-search"
  | "sim-add"
  | "done";

type TaskKey = "search" | "add";
const TASK_ORDER: TaskKey[] = ["search", "add"];

type Contact = {
  id: string;
  name: string;
  phone: string;
  color: string;
  favorite?: boolean;
};

const INITIAL_CONTACTS: Contact[] = [
  { id: "c1", name: "Cida (amiga)", phone: "(11) 98111-2233", color: "bg-[oklch(0.62_0.20_355)]", favorite: true },
  { id: "c2", name: "Antônio (amigo)", phone: "(11) 97222-3344", color: "bg-[oklch(0.55_0.18_240)]" },
  { id: "c3", name: "Dr. Paulo (médico)", phone: "(11) 3344-5566", color: "bg-[oklch(0.62_0.16_150)]" },
  { id: "c4", name: "Farmácia do Bairro", phone: "(11) 3322-1100", color: "bg-[oklch(0.78_0.16_75)]" },
  { id: "c5", name: "Grupo da Igreja", phone: "(11) 99888-7766", color: "bg-[oklch(0.55_0.15_140)]" },
  { id: "c6", name: "Lurdinha (vizinha)", phone: "(11) 98777-6655", color: "bg-[oklch(0.62_0.20_25)]" },
];

function initialOf(name: string) {
  const trimmed = name.trim();
  return trimmed ? trimmed[0].toUpperCase() : "?";
}

function ContatosSimulation() {
  const [stage, setStage] = useState<Stage>("overview");
  const [speaking, setSpeaking] = useState(false);
  const { enabled: a11y } = useA11y();
  const navigate = useNavigate();

  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [done, setDone] = useState<Record<TaskKey, boolean>>({ search: false, add: false });

  // Search
  const [query, setQuery] = useState("");
  const [searchOpened, setSearchOpened] = useState(false);
  const [openedContact, setOpenedContact] = useState<Contact | null>(null);

  // Add form
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");

  const [dialog, setDialog] = useState<null | { title: string; body: string }>(null);

  const steps = [
    { n: 1, label: "Pesquisar", key: "search" as TaskKey },
    { n: 2, label: "Adicionar", key: "add" as TaskKey },
  ];
  const completedCount = TASK_ORDER.filter((k) => done[k]).length;
  const nextTask: TaskKey | null = TASK_ORDER.find((k) => !done[k]) ?? null;
  const allDone = completedCount === TASK_ORDER.length;
  const isDone = stage === "done";
  const currentStep =
    stage === "overview"
      ? 1
      : stage === "sim-list"
        ? Math.min(completedCount + 1, steps.length)
        : stage === "sim-search"
          ? 1
          : 2;

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
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={steps.length}
        aria-valuenow={isDone ? steps.length : completedCount}
        aria-label="Progresso da simulação"
        className="h-2.5 w-full rounded-full bg-muted overflow-hidden"
      >
        <div
          className="h-full bg-info transition-all duration-500"
          style={{
            width: `${((isDone ? steps.length : completedCount) / steps.length) * 100}%`,
            backgroundColor: "oklch(0.55 0.18 240)",
          }}
        />
      </div>
      <ol className="mt-3 grid grid-cols-2 gap-2">
        {steps.map((s) => {
          const isStepDone = isDone || done[s.key];
          const active = !isDone && !done[s.key] && nextTask === s.key;
          return (
            <li key={s.n} className="flex flex-col items-center gap-1 text-center">
              <span
                className={`size-7 rounded-full inline-flex items-center justify-center text-xs font-extrabold transition ${
                  isStepDone
                    ? "bg-success text-white"
                    : active
                      ? "text-white ring-4"
                      : "bg-muted text-muted-foreground"
                }`}
                style={
                  active && !isStepDone
                    ? { backgroundColor: "oklch(0.55 0.18 240)", boxShadow: "0 0 0 4px oklch(0.55 0.18 240 / 0.25)" }
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
    const t = setTimeout(() => setStage("sim-list"), 1600);
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
        return "Contatos. É como a sua agenda de papel, onde você anota o telefone das pessoas. Toque em iniciar simulação prática para começar.";
      case "sim-list":
        return allDone
          ? "Você concluiu as duas tarefas. Toque em concluir simulação."
          : nextTask === "search"
            ? "Esta é a sua agenda. Para encontrar uma pessoa, toque na barra de pesquisa lá em cima."
            : "Agora vamos cadastrar uma amiga nova. Toque no botão azul com o sinal de mais.";
      case "sim-search":
        return "Pesquisar. Digite o nome da amiga, por exemplo Cida, e a agenda mostra só ela.";
      case "sim-add":
        return "Adicionar contato. Escreva o nome da pessoa e o telefone, depois toque em Salvar.";
      case "done":
        return "Parabéns! Você aprendeu a pesquisar e a cadastrar uma pessoa nova na sua agenda.";
      default:
        return "Contatos";
    }
  }, [stage, allDone, nextTask]);

  const handleSpeak = () => (speaking ? stopSpeaking() : speak(screenText));

  const goList = () => setStage("sim-list");

  // ----- Intro splash -----
  if (stage === "intro") {
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center text-white"
        style={{ backgroundColor: "oklch(0.55 0.18 240)" }}
      >
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="size-24 rounded-full bg-white flex items-center justify-center shadow-2xl"
               style={{ color: "oklch(0.55 0.18 240)" }}>
            <Users className="size-12" strokeWidth={2.6} />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Contatos</h1>
        </div>
      </main>
    );
  }

  // ----- Header bar (shared) -----
  const headerBar = (
    <header
      className="text-white px-5 pt-5 pb-6"
      style={{ backgroundColor: "oklch(0.55 0.18 240)" }}
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
              style={{ color: "oklch(0.55 0.18 240)" }}
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
          Contatos
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
            className={`rounded-2xl bg-card p-5 shadow-md border-l-8 ${
              a11y ? "border-2 border-foreground" : "border border-border"
            }`}
            style={{ borderLeftColor: "oklch(0.55 0.18 240)" }}
          >
            <h2
              className={`font-extrabold ${a11y ? "text-2xl" : "text-xl"}`}
              style={{ color: "oklch(0.55 0.18 240)" }}
            >
              O que é parecido?
            </h2>
            <div
              className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-extrabold text-white ${
                a11y ? "text-lg" : "text-base"
              }`}
              style={{ backgroundColor: "oklch(0.55 0.18 240)" }}
            >
              <BookOpen className="size-5" />
              Agenda de papel
            </div>
            <p
              className={`mt-3 leading-snug ${
                a11y ? "text-xl text-foreground" : "text-lg text-muted-foreground"
              }`}
            >
              É como aquela <strong style={{ color: "oklch(0.55 0.18 240)" }}>agendinha</strong> que
              você guarda na bolsa, com o telefone das amigas, do médico e da farmácia. No celular,
              ela nunca acaba e você acha a pessoa rapidinho.
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
                style={{ width: "50%", backgroundColor: "oklch(0.55 0.18 240)" }}
              />
            </div>
            <ol className="flex flex-col gap-3">
              {[
                {
                  n: 1,
                  t: "Pesquisar um Contato",
                  d: "Digite o nome da pessoa na barra de pesquisa para encontrar o telefone dela na hora, sem precisar virar páginas.",
                },
                {
                  n: 2,
                  t: "Adicionar Novo Contato",
                  d: "Toque no botão de mais, escreva o nome e o telefone da pessoa nova, e toque em Salvar para guardar para sempre.",
                },
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
                        ? {
                            borderColor: "oklch(0.55 0.18 240)",
                            backgroundColor: "oklch(0.55 0.18 240 / 0.06)",
                          }
                        : undefined
                    }
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`size-8 rounded-full inline-flex items-center justify-center font-extrabold text-white`}
                        style={{
                          backgroundColor: active
                            ? "oklch(0.55 0.18 240)"
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
              backgroundColor: "oklch(0.55 0.18 240)",
              boxShadow: "0 10px 30px -10px oklch(0.55 0.18 240 / 0.4)",
            }}
          >
            <Users className="size-6" />
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
            Muito bem! Você conseguiu!
          </h2>
          <p className={`leading-snug ${a11y ? "text-xl" : "text-lg text-muted-foreground"}`}>
            Você aprendeu a pesquisar pessoas e a cadastrar uma amiga nova na sua agenda. Sua
            agenda do celular nunca vai se perder!
          </p>
          <div className="flex flex-col gap-3 w-full">
            <button
              type="button"
              onClick={() => {
                setContacts(INITIAL_CONTACTS);
                setDone({ search: false, add: false });
                setQuery("");
                setSearchOpened(false);
                setOpenedContact(null);
                setNewName("");
                setNewPhone("");
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
              style={{ backgroundColor: "oklch(0.55 0.18 240)" }}
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
    stage === "sim-list"
      ? allDone
        ? "Você concluiu as duas tarefas. Toque em Concluir simulação."
        : nextTask === "search"
          ? "Toque na barra de pesquisa (que está piscando) lá em cima."
          : "Toque no botão azul com o sinal de + para cadastrar uma pessoa nova."
      : stage === "sim-search"
        ? !query
          ? "Digite o nome 'Cida' (já está sugerido) ou toque em Usar 'Cida'."
          : openedContact
            ? "Encontrou! Toque em Voltar para a agenda."
            : "Toque na pessoa que você procurou para abrir o contato."
        : !newName || !newPhone
          ? "Preencha o nome e o telefone. Pode tocar em Preencher para te ajudar."
          : "Tudo pronto. Toque em Salvar para guardar o contato.";

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <div
        className="text-white px-5 py-4 sticky top-0 z-20 shadow-md"
        style={{ backgroundColor: "oklch(0.55 0.18 240)" }}
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

      <div className="w-full max-w-md mx-auto flex-1 flex flex-col min-h-0">
        {stage === "sim-list" ? (
          <SimList
            contacts={contacts}
            done={done}
            nextTask={nextTask}
            allDone={allDone}
            onOpenSearch={() => {
              setSearchOpened(true);
              setStage("sim-search");
            }}
            onOpenAdd={() => setStage("sim-add")}
            onFinish={() => setStage("done")}
            onExplain={(t) => setDialog(t)}
          />
        ) : stage === "sim-search" ? (
          <SimSearch
            contacts={contacts}
            query={query}
            opened={openedContact}
            onQuery={setQuery}
            onOpen={(c) => setOpenedContact(c)}
            onClose={() => setOpenedContact(null)}
            onBackToList={() => {
              setDone((d) => ({ ...d, search: true }));
              setQuery("");
              setOpenedContact(null);
              goList();
            }}
          />
        ) : (
          <SimAdd
            name={newName}
            phone={newPhone}
            onNameChange={setNewName}
            onPhoneChange={setNewPhone}
            onSave={() => {
              const c: Contact = {
                id: `c-${Date.now()}`,
                name: newName.trim() || "Sem nome",
                phone: newPhone.trim(),
                color: "bg-[oklch(0.62_0.18_300)]",
              };
              setContacts((cs) => [c, ...cs]);
              setDone((d) => ({ ...d, add: true }));
              setNewName("");
              setNewPhone("");
              goList();
            }}
            onCancel={() => {
              setNewName("");
              setNewPhone("");
              goList();
            }}
            a11y={a11y}
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
            <div className="flex items-center gap-2" style={{ color: "oklch(0.55 0.18 240)" }}>
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
              className="mt-2 h-12 rounded-full text-white text-base font-extrabold hover:opacity-90 transition"
              style={{ backgroundColor: "oklch(0.55 0.18 240)" }}
            >
              OK, entendi
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

/* ---------- Contacts list ---------- */
function SimList({
  contacts,
  done,
  nextTask,
  allDone,
  onOpenSearch,
  onOpenAdd,
  onFinish,
  onExplain,
}: {
  contacts: Contact[];
  done: Record<TaskKey, boolean>;
  nextTask: TaskKey | null;
  allDone: boolean;
  onOpenSearch: () => void;
  onOpenAdd: () => void;
  onFinish: () => void;
  onExplain: (d: { title: string; body: string }) => void;
}) {
  const searchActive = nextTask === "search";
  const addActive = nextTask === "add";

  return (
    <div className="flex flex-col flex-1 bg-background relative">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <h2 className="text-xl font-extrabold">Contatos</h2>
        <span className="text-sm font-bold text-muted-foreground">
          {contacts.length} pessoas
        </span>
      </div>

      {/* Search bar */}
      <div className="px-4 pt-3 pb-2">
        <button
          type="button"
          onClick={onOpenSearch}
          className={`w-full h-14 rounded-2xl border-2 flex items-center gap-3 px-4 text-left transition ${
            searchActive
              ? "animate-pulse"
              : done.search
                ? "bg-success/5 border-success/30"
                : "bg-muted/40 border-border"
          }`}
          style={
            searchActive
              ? {
                  borderColor: "oklch(0.55 0.18 240)",
                  backgroundColor: "oklch(0.55 0.18 240 / 0.08)",
                  boxShadow: "0 0 0 4px oklch(0.55 0.18 240 / 0.2)",
                }
              : undefined
          }
        >
          <Search
            className="size-6"
            style={{ color: searchActive ? "oklch(0.55 0.18 240)" : undefined }}
          />
          <span
            className={`text-base font-bold ${
              searchActive ? "" : "text-muted-foreground"
            }`}
            style={searchActive ? { color: "oklch(0.55 0.18 240)" } : undefined}
          >
            {done.search ? "Pesquisar (você já fez!)" : "Pesquisar uma pessoa..."}
          </span>
        </button>
      </div>

      {/* Contacts list */}
      <ul className="flex flex-col overflow-y-auto pb-28">
        {contacts.map((c) => (
          <li key={c.id}>
            <button
              type="button"
              onClick={() =>
                onExplain({
                  title: c.name,
                  body: `Telefone: ${c.phone}. Aqui você poderia ligar, mandar mensagem ou chamar no WhatsApp.`,
                })
              }
              className="w-full flex items-center gap-3 px-4 py-3 text-left border-b border-border hover:bg-muted transition"
            >
              <span
                className={`size-12 rounded-full flex items-center justify-center text-white text-lg font-extrabold ${c.color}`}
              >
                {initialOf(c.name)}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-base font-extrabold truncate">{c.name}</span>
                <span className="block text-sm text-muted-foreground font-medium">
                  {c.phone}
                </span>
              </span>
              {c.favorite && (
                <Star
                  className="size-5"
                  fill="currentColor"
                  style={{ color: "oklch(0.78 0.16 75)" }}
                />
              )}
              <Phone className="size-5 text-muted-foreground" />
            </button>
          </li>
        ))}
      </ul>

      {/* Floating + button */}
      <button
        type="button"
        onClick={onOpenAdd}
        aria-label="Adicionar novo contato"
        className={`fixed bottom-6 right-6 size-16 rounded-full text-white flex items-center justify-center shadow-2xl transition ${
          addActive ? "animate-pulse ring-4" : ""
        } ${done.add ? "opacity-80" : ""}`}
        style={{
          backgroundColor: "oklch(0.55 0.18 240)",
          boxShadow:
            addActive
              ? "0 10px 30px -10px oklch(0.55 0.18 240 / 0.6), 0 0 0 8px oklch(0.55 0.18 240 / 0.25)"
              : "0 10px 30px -10px oklch(0.55 0.18 240 / 0.5)",
        }}
      >
        <Plus className="size-8" strokeWidth={3} />
      </button>

      {allDone && (
        <div className="fixed bottom-0 inset-x-0 p-4 bg-background/95 backdrop-blur border-t border-border">
          <div className="w-full max-w-md mx-auto">
            <button
              type="button"
              onClick={onFinish}
              className="w-full h-14 rounded-2xl bg-success text-white text-lg font-extrabold shadow-md hover:opacity-90 transition ring-4 ring-success/20 animate-pulse"
            >
              Concluir simulação
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Search ---------- */
function SimSearch({
  contacts,
  query,
  opened,
  onQuery,
  onOpen,
  onClose,
  onBackToList,
}: {
  contacts: Contact[];
  query: string;
  opened: Contact | null;
  onQuery: (v: string) => void;
  onOpen: (c: Contact) => void;
  onClose: () => void;
  onBackToList: () => void;
}) {
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return contacts;
    return contacts.filter((c) => c.name.toLowerCase().includes(q));
  }, [contacts, query]);

  if (opened) {
    return (
      <div className="flex flex-col flex-1 bg-background">
        <div className="px-4 py-3 border-b border-border flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1 h-10 px-3 rounded-full hover:bg-muted text-base font-bold"
          >
            <ChevronLeft className="size-5" />
            Voltar
          </button>
          <h2 className="text-lg font-extrabold ml-2">Contato</h2>
        </div>
        <div className="flex flex-col items-center gap-3 px-6 pt-8 pb-6">
          <span
            className={`size-24 rounded-full flex items-center justify-center text-white text-4xl font-extrabold ${opened.color}`}
          >
            {initialOf(opened.name)}
          </span>
          <h3 className="text-2xl font-extrabold text-center">{opened.name}</h3>
          <p className="text-lg text-muted-foreground font-bold">{opened.phone}</p>
          <div className="grid grid-cols-2 gap-3 w-full mt-4">
            <button
              type="button"
              className="h-14 rounded-2xl border-2 border-border bg-card text-foreground text-base font-extrabold hover:bg-muted transition inline-flex items-center justify-center gap-2"
            >
              <Phone className="size-5" />
              Ligar
            </button>
            <button
              type="button"
              className="h-14 rounded-2xl text-white text-base font-extrabold hover:opacity-90 transition inline-flex items-center justify-center gap-2"
              style={{ backgroundColor: "oklch(0.62 0.16 150)" }}
            >
              Mensagem
            </button>
          </div>
        </div>
        <div className="mt-auto p-4 border-t border-border">
          <button
            type="button"
            onClick={onBackToList}
            className="w-full h-14 rounded-2xl text-white text-lg font-extrabold transition hover:opacity-90 ring-4 animate-pulse"
            style={{
              backgroundColor: "oklch(0.55 0.18 240)",
              boxShadow: "0 0 0 4px oklch(0.55 0.18 240 / 0.25)",
            }}
          >
            Voltar para a agenda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-background">
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <button
          type="button"
          onClick={onBackToList}
          className="inline-flex items-center gap-1 h-10 px-3 rounded-full hover:bg-muted text-base font-bold"
          aria-label="Voltar"
        >
          <ChevronLeft className="size-5" />
        </button>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Digite o nome (ex.: Cida)"
            autoFocus
            className="w-full h-12 pl-10 pr-3 rounded-2xl bg-muted/40 border-2 text-base font-bold focus:outline-none"
            style={{ borderColor: "oklch(0.55 0.18 240)" }}
          />
        </div>
      </div>

      {!query && (
        <div className="px-4 py-3 border-b border-border flex flex-wrap gap-2">
          <span className="text-sm font-bold text-muted-foreground self-center">
            Sugestão:
          </span>
          <button
            type="button"
            onClick={() => onQuery("Cida")}
            className="h-10 px-4 rounded-full text-white text-sm font-extrabold animate-pulse"
            style={{ backgroundColor: "oklch(0.55 0.18 240)" }}
          >
            Usar "Cida"
          </button>
        </div>
      )}

      <ul className="flex flex-col overflow-y-auto">
        {filtered.length === 0 ? (
          <li className="px-6 py-10 text-center text-muted-foreground text-base font-bold">
            Nenhum contato encontrado.
          </li>
        ) : (
          filtered.map((c) => {
            const isMatch = query.trim() && c.name.toLowerCase().includes(query.trim().toLowerCase());
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => onOpen(c)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-border hover:bg-muted transition ${
                    isMatch ? "animate-pulse" : ""
                  }`}
                  style={
                    isMatch
                      ? { backgroundColor: "oklch(0.55 0.18 240 / 0.08)" }
                      : undefined
                  }
                >
                  <span
                    className={`size-12 rounded-full flex items-center justify-center text-white text-lg font-extrabold ${c.color}`}
                  >
                    {initialOf(c.name)}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-base font-extrabold truncate">{c.name}</span>
                    <span className="block text-sm text-muted-foreground font-medium">
                      {c.phone}
                    </span>
                  </span>
                  <ChevronRight className="size-5 text-muted-foreground" />
                </button>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}

/* ---------- Add new contact ---------- */
function SimAdd({
  name,
  phone,
  onNameChange,
  onPhoneChange,
  onSave,
  onCancel,
  a11y,
}: {
  name: string;
  phone: string;
  onNameChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
  a11y: boolean;
}) {
  const canSave = name.trim().length > 0 && phone.trim().length >= 8;

  return (
    <div className="flex flex-col flex-1 bg-background">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1 h-10 px-3 rounded-full hover:bg-muted text-base font-bold"
        >
          <ChevronLeft className="size-5" />
          Cancelar
        </button>
        <h2 className="text-lg font-extrabold">Novo Contato</h2>
        <span className="w-16" />
      </div>

      <div className="flex flex-col items-center gap-3 px-6 pt-6 pb-2">
        <span
          className="size-20 rounded-full bg-muted text-muted-foreground flex items-center justify-center"
        >
          <UserIcon className="size-10" strokeWidth={2.2} />
        </span>
      </div>

      <div className="px-5 py-4 flex flex-col gap-4">
        <label className="flex flex-col gap-2">
          <span className={`font-extrabold ${a11y ? "text-lg" : "text-base"}`}>Nome</span>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Ex.: Lúcia (amiga)"
            className={`h-14 px-4 rounded-2xl bg-card border-2 border-border text-base font-bold focus:outline-none focus:ring-4 ${
              a11y ? "text-lg" : ""
            }`}
            style={{
              boxShadow: name ? undefined : undefined,
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "oklch(0.55 0.18 240)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "")}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className={`font-extrabold ${a11y ? "text-lg" : "text-base"}`}>Telefone</span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="(11) 9 8765-4321"
            className={`h-14 px-4 rounded-2xl bg-card border-2 border-border text-base font-bold focus:outline-none ${
              a11y ? "text-lg" : ""
            }`}
            onFocus={(e) => (e.currentTarget.style.borderColor = "oklch(0.55 0.18 240)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "")}
          />
        </label>
      </div>

      <div className="mt-auto p-4 border-t border-border flex flex-col gap-3">
        <button
          type="button"
          onClick={canSave ? onSave : undefined}
          disabled={!canSave}
          className={`w-full h-14 rounded-2xl text-white text-lg font-extrabold transition ${
            canSave ? "hover:opacity-90 ring-4 animate-pulse" : "opacity-50 cursor-not-allowed"
          } inline-flex items-center justify-center gap-2`}
          style={{
            backgroundColor: "oklch(0.55 0.18 240)",
            boxShadow: canSave ? "0 0 0 4px oklch(0.55 0.18 240 / 0.25)" : undefined,
          }}
        >
          <Check className="size-6" />
          Salvar contato
        </button>
      </div>
    </div>
  );
}
