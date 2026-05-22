import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Search,
  ChevronRight,
  Lightbulb,
  Square,
  Volume2,
  LayoutGrid,
  Power,
  Hand,
  ThumbsUp,
  ShieldCheck,
  Wifi,
  BatteryMedium,
  Bluetooth,
  Bell,
  Smartphone,
  Home as HomeIcon,
  ArrowLeft as ArrowLeftIcon,
  Menu as MenuIcon,
  Settings as SettingsIcon,
  RefreshCcw,
  Heart,
  MessageCircle,
  Share2,
  PlayCircle,
  UserPlus,
  Lock,
  KeyRound,
  ShieldAlert,
  Ban,
  Fingerprint,
  Download,
  Paperclip,
  Mic,
  Link2,
} from "lucide-react";
import { useA11y } from "../lib/a11y";
import { useAudioTts } from "../lib/tts";
import { BottomTabBar } from "../components/BottomTabBar";
import { PageHeader } from "../components/PageHeader";

export const Route = createFileRoute("/glossario")({
  component: GlossarioPage,
  head: () => ({
    meta: [
      { title: "Glossário Digital — Ajudante Tech" },
      {
        name: "description",
        content:
          "Aprenda o que cada símbolo e palavra da internet significa: básicos, navegação, redes sociais e segurança.",
      },
    ],
  }),
});

type CategoryKey = "todos" | "basicos" | "navegacao" | "redes" | "seguranca";

type Tone = "primary" | "accent" | "destructive" | "success" | "warning" | "info" | "pink";

type IconCmp = React.ComponentType<{ className?: string; strokeWidth?: number }>;

type Term = {
  id: string;
  name: string;
  category: Exclude<CategoryKey, "todos">;
  icon: IconCmp;
  tone: Tone;
  short: string;
  what: string;
  where: string;
  example: string;
};

type Category = {
  key: Exclude<CategoryKey, "todos">;
  name: string;
  description: string;
  icon: IconCmp;
  tone: Tone;
};

const CATEGORIES: Category[] = [
  {
    key: "basicos",
    name: "Parte 1: Básicos",
    description: "Os símbolos do dia a dia do celular.",
    icon: Power,
    tone: "success",
  },
  {
    key: "navegacao",
    name: "Parte 2: Navegação",
    description: "Como andar pelas telas e voltar.",
    icon: Hand,
    tone: "info",
  },
  {
    key: "redes",
    name: "Parte 3: Redes Sociais",
    description: "Curtir, comentar, compartilhar e seguir.",
    icon: ThumbsUp,
    tone: "pink",
  },
  {
    key: "seguranca",
    name: "Parte 4: Segurança",
    description: "Cadeados, senhas e como se proteger.",
    icon: ShieldCheck,
    tone: "warning",
  },
];

const TERMS: Term[] = [
  // Básicos
  {
    id: "wifi",
    name: "Wi-Fi",
    category: "basicos",
    icon: Wifi,
    tone: "info",
    short: "Internet sem fio da casa",
    what: "É a internet que vem sem fio, parecido com o sinal do rádio. Quando o celular pega Wi-Fi, você navega de graça, sem gastar os dados do plano.",
    where: "No alto da tela, em forma de leque ou ondinhas.",
    example: "Em casa, no Wi-Fi, você pode assistir vídeos sem se preocupar com a conta.",
  },
  {
    id: "bateria",
    name: "Bateria",
    category: "basicos",
    icon: BatteryMedium,
    tone: "success",
    short: "Quanta energia o celular ainda tem",
    what: "Mostra quanta energia falta no celular. Quando está baixa (vermelha), é hora de colocar para carregar na tomada.",
    where: "No canto de cima, do lado direito, com um número (por exemplo, 78%).",
    example: "Se está em 15%, procure o carregador antes que o celular desligue.",
  },
  {
    id: "bluetooth",
    name: "Bluetooth",
    category: "basicos",
    icon: Bluetooth,
    tone: "info",
    short: "Conecta o celular a fones e caixinhas",
    what: "É um sinal curto que liga o celular sem fio a fones de ouvido, caixinhas de som ou ao rádio do carro.",
    where: "Nas configurações ou na barra de cima do celular, em forma de letra B.",
    example: "Você liga o Bluetooth para ouvir música no fone sem fio.",
  },
  {
    id: "notificacao",
    name: "Notificação",
    category: "basicos",
    icon: Bell,
    tone: "warning",
    short: "Aviso que aparece na tela",
    what: "É um avisinho que o celular dá quando alguém manda mensagem ou acontece algo novo. Aparece um sininho ou uma bolinha.",
    where: "Em cima da tela, ou em uma bolinha vermelha sobre o aplicativo.",
    example: "Uma notificação do WhatsApp avisa que sua amiga te mandou uma mensagem.",
  },
  {
    id: "app",
    name: "Aplicativo (App)",
    category: "basicos",
    icon: Smartphone,
    tone: "primary",
    short: "Os 'programinhas' do celular",
    what: "É cada quadradinho com desenho na tela inicial. Cada um serve para uma coisa: ver vídeo, mandar mensagem, tirar foto.",
    where: "Na tela inicial, organizados em quadradinhos.",
    example: "O WhatsApp é um aplicativo para mandar mensagens.",
  },
  {
    id: "download",
    name: "Download (baixar)",
    category: "basicos",
    icon: Download,
    tone: "info",
    short: "Trazer um arquivo da internet para o celular",
    what: "É quando você guarda no celular alguma coisa que veio da internet, como uma foto, música ou documento. Depois de baixar, fica salvo e dá para ver mesmo sem internet.",
    where: "Aparece como uma setinha apontando para baixo, em cima de uma linha.",
    example: "Quando alguém manda uma foto no WhatsApp, você toca para fazer o download e ela fica salva na galeria.",
  },

  // Navegação
  {
    id: "home",
    name: "Início (Home)",
    category: "navegacao",
    icon: HomeIcon,
    tone: "info",
    short: "Volta para a tela principal",
    what: "É o botão da casinha. Toca nele para voltar para a tela inicial, igual quando você volta para sua casa.",
    where: "Embaixo da tela, no meio, em forma de casinha ou bolinha.",
    example: "Se ficou perdida em um aplicativo, toque na casinha para começar de novo.",
  },
  {
    id: "voltar",
    name: "Voltar",
    category: "navegacao",
    icon: ArrowLeftIcon,
    tone: "primary",
    short: "Volta para a tela anterior",
    what: "É a setinha para a esquerda. Serve para voltar um passo, igual quando você desfaz uma coisa que fez sem querer.",
    where: "No canto de cima da esquerda, ou embaixo da tela.",
    example: "Abriu uma foto e quer voltar para a galeria? Toque na setinha de voltar.",
  },
  {
    id: "menu",
    name: "Menu (três risquinhos)",
    category: "navegacao",
    icon: MenuIcon,
    tone: "primary",
    short: "Abre uma lista de opções",
    what: "São três risquinhos um em cima do outro. Toca neles para abrir mais opções, como se fosse um cardápio.",
    where: "Geralmente no canto de cima, à esquerda ou direita.",
    example: "No YouTube, o menu mostra suas inscrições e seu histórico.",
  },
  {
    id: "config",
    name: "Configurações (engrenagem)",
    category: "navegacao",
    icon: SettingsIcon,
    tone: "primary",
    short: "Onde você ajusta as coisas",
    what: "É o desenho de uma engrenagem (rodinha com dentinhos). Lá dentro você ajusta som, brilho, tamanho da letra e outras coisas.",
    where: "Dentro de qualquer aplicativo, ou na tela inicial do celular.",
    example: "Toque na engrenagem para deixar a letra do celular maior.",
  },
  {
    id: "lupa",
    name: "Pesquisar (lupa)",
    category: "navegacao",
    icon: Search,
    tone: "info",
    short: "Procura uma palavra ou pessoa",
    what: "É o desenho de uma lupinha. Serve para procurar alguma coisa: um contato, um vídeo, uma palavra.",
    where: "Dentro de quase todos os aplicativos, no alto da tela.",
    example: "Toque na lupa do YouTube e escreva 'receita de bolo de fubá'.",
  },
  {
    id: "recarregar",
    name: "Recarregar (setinha em círculo)",
    category: "navegacao",
    icon: RefreshCcw,
    tone: "success",
    short: "Atualiza a tela",
    what: "É uma setinha que faz uma volta. Serve para atualizar a tela e mostrar as novidades, como ver mensagens novas.",
    where: "No alto da tela, ou puxando a tela para baixo com o dedo.",
    example: "Puxe a tela do WhatsApp para baixo para ver as mensagens novas.",
  },
  {
    id: "link",
    name: "Link (endereço azul)",
    category: "navegacao",
    icon: Link2,
    tone: "info",
    short: "Atalho que leva para outro lugar",
    what: "É uma palavra ou endereço, geralmente azul e sublinhado, que ao tocar abre uma nova página, vídeo ou site. Funciona como uma porta que leva a outro lugar.",
    where: "Em mensagens, e-mails, sites e publicações nas redes sociais.",
    example: "Sua amiga manda um link de receita no WhatsApp. Ao tocar, abre o site com o passo a passo. Cuidado: só toque em links de quem você confia.",
  },
  {
    id: "anexo",
    name: "Anexo (clipe de papel)",
    category: "navegacao",
    icon: Paperclip,
    tone: "primary",
    short: "Mandar uma foto ou documento junto",
    what: "É um desenho de clipinho. Serve para mandar junto com a mensagem uma foto, um documento ou um áudio guardado no celular.",
    where: "Dentro do WhatsApp e do e-mail, perto de onde você escreve a mensagem.",
    example: "Toque no clipinho do WhatsApp para escolher uma foto da galeria e mandar para uma amiga.",
  },

  // Redes sociais
  {
    id: "curtir",
    name: "Curtir (coração)",
    category: "redes",
    icon: Heart,
    tone: "destructive",
    short: "Mandar um carinho na publicação",
    what: "É um coraçãozinho. Tocar nele é como dar um 'gostei' ou um carinho na foto da pessoa.",
    where: "Embaixo das fotos no Instagram e WhatsApp.",
    example: "Curta a foto da sua amiga para ela saber que você gostou.",
  },
  {
    id: "comentar",
    name: "Comentar (balãozinho)",
    category: "redes",
    icon: MessageCircle,
    tone: "info",
    short: "Escrever um recadinho na foto",
    what: "É um balãozinho de fala. Toca nele para escrever um recado embaixo da foto da pessoa, que outras pessoas também podem ver.",
    where: "Embaixo das fotos, ao lado do coraçãozinho.",
    example: "Escreva 'Que delícia!' embaixo da foto do bolo da Cida.",
  },
  {
    id: "compartilhar",
    name: "Compartilhar (setinha)",
    category: "redes",
    icon: Share2,
    tone: "success",
    short: "Mandar para outra pessoa",
    what: "É uma setinha para o lado. Serve para mandar uma foto, vídeo ou mensagem para outra pessoa, como passar adiante uma carta.",
    where: "Embaixo das publicações ou em cima das fotos.",
    example: "Compartilhe um vídeo bonito com a Lurdinha pelo WhatsApp.",
  },
  {
    id: "reels",
    name: "Reels / Vídeo curto",
    category: "redes",
    icon: PlayCircle,
    tone: "pink",
    short: "Vídeos curtinhos para passar o tempo",
    what: "São vídeos rápidos, de poucos segundos. Você desliza o dedo para cima na tela para ver o próximo.",
    where: "No Instagram e no YouTube, em uma aba só de vídeos.",
    example: "Veja Reels de receitas, crochê e flores quando estiver descansando.",
  },
  {
    id: "seguir",
    name: "Seguir",
    category: "redes",
    icon: UserPlus,
    tone: "info",
    short: "Acompanhar as publicações de alguém",
    what: "Quando você 'segue' uma pessoa ou página, as publicações dela aparecem para você ver. É como assinar uma revista.",
    where: "No perfil das pessoas, em um botão azul escrito 'Seguir'.",
    example: "Siga uma página de receitas para receber dicas todos os dias.",
  },
  {
    id: "audio",
    name: "Áudio (microfone)",
    category: "redes",
    icon: Mic,
    tone: "pink",
    short: "Mandar um recado de voz no lugar de digitar",
    what: "É o desenho de um microfoninho. Em vez de escrever a mensagem, você segura o botão e fala. Quando solta, o recado é enviado em forma de áudio.",
    where: "No WhatsApp, do lado direito de onde você escreve a mensagem.",
    example: "Segure o microfoninho, fale 'Bom dia!' e solte o dedo para mandar o áudio.",
  },

  // Segurança
  {
    id: "cadeado",
    name: "Cadeado",
    category: "seguranca",
    icon: Lock,
    tone: "success",
    short: "Mostra que o site é seguro",
    what: "É o desenho de um cadeado fechadinho. Quando aparece em um site, quer dizer que ele é mais seguro para usar.",
    where: "No alto da tela, do lado do endereço do site.",
    example: "Antes de digitar a senha do banco, confira se tem o cadeado.",
  },
  {
    id: "senha",
    name: "Senha",
    category: "seguranca",
    icon: KeyRound,
    tone: "warning",
    short: "A 'chave' da sua conta",
    what: "É uma palavra ou número secreto que só você sabe. Serve para abrir suas contas, como a chave abre a porta de casa.",
    where: "Quando você entra em um aplicativo ou site pela primeira vez no celular.",
    example: "Nunca conte sua senha para ninguém, nem por telefone, nem por mensagem.",
  },
  {
    id: "duas-etapas",
    name: "Verificação em duas etapas",
    category: "seguranca",
    icon: Fingerprint,
    tone: "info",
    short: "Uma chave a mais para sua conta",
    what: "É uma proteção extra: além da senha, o aplicativo manda um código no celular para confirmar que é você.",
    where: "Dentro das configurações do WhatsApp, do Instagram e do email.",
    example: "Ative no WhatsApp para ninguém conseguir entrar na sua conta de outro celular.",
  },
  {
    id: "bloquear",
    name: "Bloquear",
    category: "seguranca",
    icon: Ban,
    tone: "destructive",
    short: "Impedir uma pessoa de te falar",
    what: "Quando você bloqueia uma pessoa, ela não consegue mais te mandar mensagens nem te ligar. É como fechar a porta para alguém.",
    where: "Dentro da conversa da pessoa, no menu de opções.",
    example: "Se um número estranho ficar te mandando golpe, bloqueie sem medo.",
  },
  {
    id: "golpe",
    name: "Golpe / Phishing",
    category: "seguranca",
    icon: ShieldAlert,
    tone: "destructive",
    short: "Mensagem falsa para te enganar",
    what: "São mensagens, ligações ou e-mails que tentam te enganar para roubar seu dinheiro ou sua senha. Pedem coisas urgentes ou prometem prêmios.",
    where: "Pode chegar por SMS, WhatsApp, e-mail ou ligação.",
    example: "Se chegar uma mensagem dizendo que você ganhou um prêmio, desconfie e não toque no link.",
  },
];

const toneStyles: Record<Tone, { bg: string; text: string; soft: string; softText: string }> = {
  primary: { bg: "bg-primary", text: "text-primary-foreground", soft: "bg-primary/10", softText: "text-primary" },
  accent: { bg: "bg-accent", text: "text-accent-foreground", soft: "bg-accent/15", softText: "text-accent" },
  destructive: { bg: "bg-destructive", text: "text-destructive-foreground", soft: "bg-destructive/10", softText: "text-destructive" },
  success: { bg: "bg-[oklch(0.62_0.16_150)]", text: "text-white", soft: "bg-[oklch(0.62_0.16_150)]/12", softText: "text-[oklch(0.45_0.16_150)]" },
  warning: { bg: "bg-[oklch(0.78_0.16_75)]", text: "text-white", soft: "bg-[oklch(0.78_0.16_75)]/15", softText: "text-[oklch(0.50_0.16_75)]" },
  info: { bg: "bg-[oklch(0.55_0.18_240)]", text: "text-white", soft: "bg-[oklch(0.55_0.18_240)]/12", softText: "text-[oklch(0.45_0.18_240)]" },
  pink: { bg: "bg-[oklch(0.62_0.20_355)]", text: "text-white", soft: "bg-[oklch(0.62_0.20_355)]/12", softText: "text-[oklch(0.50_0.20_355)]" },
};

function GlossarioPage() {
  const { enabled: a11y } = useA11y();
  const [speaking, setSpeaking] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryKey | null>(null);
  const [openTerm, setOpenTerm] = useState<Term | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [openTerm, category]);

  const { speak, stopSpeaking } = useAudioTts({ setSpeaking });

  const readScreen = () => {
    if (openTerm) {
      speak({
        file: `glossario-termo-${openTerm.id}.mp3`,
        text: `${openTerm.name}. ${openTerm.what} Onde aparece: ${openTerm.where}. Exemplo: ${openTerm.example}`,
      });
    } else if (category) {
      const cat = CATEGORIES.find((c) => c.key === category);
      speak({
        file:
          category === "todos"
            ? "glossario-categoria-todos.mp3"
            : `glossario-categoria-${category}.mp3`,
        text: `${cat?.name ?? "Todos os símbolos"}. Toque em qualquer palavra para aprender o que ela significa.`,
      });
    } else {
      speak({
        file: "glossario-tela.mp3",
        text: "Glossário Digital. Pesquise uma palavra ou escolha uma categoria para aprender o que cada símbolo do celular significa.",
      });
    }
  };

  const readTip = () => {
    speak({
      file: "glossario-dica-dia.mp3",
      text:
        "Dica do dia. Os símbolos são como placas de trânsito: uma vez que você aprende o que significam, eles aparecem em vários lugares e ajudam a se virar sozinha.",
    });
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = TERMS;
    if (category && category !== "todos") list = list.filter((t) => t.category === category);
    if (q) {
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.short.toLowerCase().includes(q) ||
          t.what.toLowerCase().includes(q),
      );
    }
    return list;
  }, [query, category]);

  // ----- TERM DETAIL VIEW -----
  if (openTerm) {
    const tone = toneStyles[openTerm.tone];
    const Icon = openTerm.icon;
    return (
      <main className="min-h-screen bg-background flex flex-col items-center px-5 py-6">
        <div className="w-full max-w-md flex flex-col gap-6">
          <PageHeader
            onBack={() => { setOpenTerm(null); window.scrollTo(0, 0); }}
            backLabel="Voltar para a lista"
            speaking={speaking}
            onSpeakToggle={speaking ? stopSpeaking : readScreen}
            speakLabel="Ouvir explicação"
          />

          <section
            className={
              a11y
                ? "rounded-3xl bg-card border-4 border-foreground p-6 flex flex-col items-center text-center gap-3"
                : `rounded-3xl ${tone.soft} p-6 flex flex-col items-center text-center gap-3 border-2 border-border/40`
            }
          >
            <div
              className={
                a11y
                  ? "size-24 rounded-2xl flex items-center justify-center bg-foreground"
                  : `size-24 rounded-2xl flex items-center justify-center ${tone.bg} shadow-md`
              }
            >
              <Icon className={a11y ? "size-14 text-background" : `size-14 ${tone.text}`} strokeWidth={a11y ? 2.6 : 2.2} />
            </div>
            <h1 className={`font-extrabold tracking-tight ${a11y ? "text-4xl text-foreground" : "text-3xl text-foreground"}`}>
              {openTerm.name}
            </h1>
            <p className={`leading-snug font-medium ${a11y ? "text-xl text-foreground" : "text-lg text-muted-foreground"}`}>
              {openTerm.short}
            </p>
          </section>

          <section className="flex flex-col gap-4">
            <InfoCard a11y={a11y} title="O que é?" body={openTerm.what} />
            <InfoCard a11y={a11y} title="Onde aparece?" body={openTerm.where} />
            <InfoCard a11y={a11y} title="Exemplo do dia a dia" body={openTerm.example} highlighted />
          </section>

          <button
            type="button"
            onClick={() => setOpenTerm(null)}
            className={
              a11y
                ? "w-full h-16 rounded-2xl bg-foreground text-background text-2xl font-extrabold"
                : "w-full h-14 rounded-2xl bg-primary text-primary-foreground text-lg font-extrabold shadow-md shadow-primary/30 hover:bg-primary/90 transition"
            }
          >
            Entendi!
          </button>
        </div>
      </main>
    );
  }

  // ----- LIST / OVERVIEW -----
  const showingList = category !== null || query.trim() !== "";

  return (
    <main className="min-h-screen bg-background flex flex-col items-center px-5 py-6 pb-28">
      <div className="w-full max-w-md flex flex-col gap-6">
        <PageHeader
          onBack={showingList ? () => { setCategory(null); setQuery(""); window.scrollTo(0, 0); } : undefined}
          backLabel="Voltar para as categorias"
          speaking={speaking}
          onSpeakToggle={speaking ? stopSpeaking : readScreen}
        />

        {/* Title */}
        <div>
          <h1 className={`font-extrabold text-foreground tracking-tight ${a11y ? "text-4xl" : "text-3xl"}`}>
            Glossário Digital
          </h1>
          <p className={`mt-1 leading-snug font-medium ${a11y ? "text-xl text-foreground" : "text-lg text-muted-foreground"}`}>
            {showingList
              ? "Toque em uma palavra para aprender o que ela significa."
              : "Pesquise uma palavra ou escolha uma categoria."}
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <label htmlFor="glossary-search" className="sr-only">
            Buscar símbolo ou palavra
          </label>
          <Search
            className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none ${
              a11y ? "size-7 text-foreground" : "size-6 text-muted-foreground"
            }`}
            strokeWidth={2.4}
          />
          <input
            id="glossary-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar símbolo ou palavra..."
            className={`w-full pr-4 rounded-2xl bg-card text-foreground focus:outline-none transition ${
              a11y
                ? "h-[68px] text-xl border-4 border-foreground placeholder:text-foreground focus:ring-4 focus:ring-foreground"
                : "h-[60px] text-lg border-2 border-border placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/20"
            }`}
            style={{ paddingLeft: "3.25rem" }}
          />
        </div>

        {/* Categories OR results list */}
        {showingList ? (
          <TermsList a11y={a11y} terms={filtered} onOpen={setOpenTerm} />
        ) : (
          <>
            <nav aria-label="Categorias" className="flex flex-col gap-3">
              <CategoryCard
                a11y={a11y}
                icon={LayoutGrid}
                tone="primary"
                name="Todos os Símbolos"
                description={`${TERMS.length} palavras e símbolos para aprender.`}
                onClick={() => setCategory("todos")}
              />
              {CATEGORIES.map((c) => (
                <CategoryCard
                  key={c.key}
                  a11y={a11y}
                  icon={c.icon}
                  tone={c.tone}
                  name={c.name}
                  description={c.description}
                  onClick={() => setCategory(c.key)}
                />
              ))}
            </nav>

            {/* Tip */}
            <section
              aria-label="Dica do dia"
              className={
                a11y
                  ? "rounded-[1.75rem] p-6 bg-card border-4 border-foreground"
                  : "rounded-[1.75rem] p-5 bg-[oklch(0.97_0.03_88)] border-2 border-[oklch(0.87_0.07_88)] shadow-[0_4px_20px_-12px_rgba(0,0,0,0.18)]"
              }
            >
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={
                    a11y
                      ? "size-14 rounded-2xl bg-foreground text-background flex items-center justify-center shrink-0"
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
                  className={
                    a11y
                      ? "size-14 rounded-full bg-foreground text-background border-4 border-foreground hover:opacity-90 flex items-center justify-center transition active:scale-[0.98]"
                      : "size-12 rounded-full bg-white/80 text-[oklch(0.45_0.13_75)] border border-[oklch(0.84_0.08_88)] hover:bg-[oklch(0.90_0.08_88)] flex items-center justify-center transition active:scale-[0.98]"
                  }
                >
                  {speaking ? <Square className={a11y ? "size-6" : "size-5"} /> : <Volume2 className={a11y ? "size-6" : "size-5"} />}
                </button>
              </div>
              <p className={`leading-snug ${a11y ? "text-xl font-medium text-foreground" : "text-lg font-semibold text-[oklch(0.30_0.04_75)]"}`}>
                Os símbolos são como placas de trânsito: uma vez que você aprende o que significam, eles aparecem em
                vários lugares e ajudam a se virar sozinha.
              </p>
            </section>
          </>
        )}
      </div>
      <BottomTabBar />
    </main>
  );
}

/* ============ subcomponents ============ */

function CategoryCard({
  a11y,
  icon: Icon,
  tone,
  name,
  description,
  onClick,
}: {
  a11y: boolean;
  icon: IconCmp;
  tone: Tone;
  name: string;
  description: string;
  onClick: () => void;
}) {
  const t = toneStyles[tone];
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        a11y
          ? "group flex items-center gap-4 bg-card rounded-2xl p-5 border-4 border-foreground hover:bg-muted active:scale-[0.99] transition focus:outline-none focus:ring-4 focus:ring-foreground text-left"
          : "group flex items-center gap-4 bg-card rounded-2xl p-5 border-2 border-border/60 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.15)] hover:border-primary/60 active:scale-[0.99] transition focus:outline-none focus:ring-4 focus:ring-primary/25 text-left"
      }
    >
      <div
        className={
          a11y
            ? "shrink-0 size-14 rounded-xl flex items-center justify-center bg-foreground"
            : `shrink-0 size-14 rounded-xl flex items-center justify-center ${t.soft}`
        }
      >
        <Icon className={a11y ? "size-8 text-background" : `size-7 ${t.softText}`} strokeWidth={a11y ? 2.6 : 2.4} />
      </div>
      <div className="flex-1 min-w-0">
        <h2 className={`font-extrabold leading-tight ${a11y ? "text-2xl text-foreground" : "text-xl text-card-foreground"}`}>
          {name}
        </h2>
        <p className={`mt-1 leading-snug ${a11y ? "text-lg text-foreground font-medium" : "text-base text-muted-foreground"}`}>
          {description}
        </p>
      </div>
      <ChevronRight className={a11y ? "size-7 text-foreground shrink-0" : "size-6 text-muted-foreground group-hover:text-primary transition shrink-0"} />
    </button>
  );
}

function TermsList({
  a11y,
  terms,
  onOpen,
}: {
  a11y: boolean;
  terms: Term[];
  onOpen: (t: Term) => void;
}) {
  if (terms.length === 0) {
    return (
      <div
        className={`rounded-3xl border-dashed p-6 text-center font-bold ${
          a11y
            ? "border-4 border-foreground text-xl text-foreground"
            : "border-2 border-border text-lg text-muted-foreground"
        }`}
      >
        Nenhuma palavra encontrada. Tente outra busca.
      </div>
    );
  }
  return (
    <ul className="flex flex-col gap-3">
      {terms.map((term) => {
        const t = toneStyles[term.tone];
        const Icon = term.icon;
        return (
          <li key={term.id}>
            <button
              type="button"
              onClick={() => onOpen(term)}
              className={
                a11y
                  ? "w-full flex items-center gap-4 bg-card rounded-2xl p-4 border-4 border-foreground hover:bg-muted active:scale-[0.99] transition focus:outline-none focus:ring-4 focus:ring-foreground text-left"
                  : "w-full flex items-center gap-4 bg-card rounded-2xl p-4 border-2 border-border/60 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.12)] hover:border-primary/60 active:scale-[0.99] transition focus:outline-none focus:ring-4 focus:ring-primary/25 text-left"
              }
            >
              <div
                className={
                  a11y
                    ? "shrink-0 size-14 rounded-xl flex items-center justify-center bg-foreground"
                    : `shrink-0 size-14 rounded-xl flex items-center justify-center ${t.bg}`
                }
              >
                <Icon className={a11y ? "size-8 text-background" : `size-7 ${t.text}`} strokeWidth={a11y ? 2.6 : 2.2} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-extrabold leading-tight ${a11y ? "text-2xl text-foreground" : "text-xl text-card-foreground"}`}>
                  {term.name}
                </h3>
                <p className={`mt-1 leading-snug ${a11y ? "text-lg text-foreground font-medium" : "text-base text-muted-foreground"}`}>
                  {term.short}
                </p>
              </div>
              <ChevronRight className={a11y ? "size-7 text-foreground shrink-0" : "size-6 text-muted-foreground shrink-0"} />
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function InfoCard({
  a11y,
  title,
  body,
  highlighted,
}: {
  a11y: boolean;
  title: string;
  body: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={
        highlighted
          ? a11y
            ? "rounded-2xl p-5 bg-foreground text-background border-4 border-foreground"
            : "rounded-2xl p-5 bg-accent/15 border-2 border-accent/30"
          : a11y
            ? "rounded-2xl p-5 bg-card border-4 border-foreground"
            : "rounded-2xl p-5 bg-card border-2 border-border/60 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)]"
      }
    >
      <h3
        className={`font-extrabold mb-1 ${
          a11y ? "text-2xl" : "text-xl"
        } ${highlighted && !a11y ? "text-accent" : highlighted && a11y ? "" : "text-foreground"}`}
      >
        {title}
      </h3>
      <p
        className={`leading-snug ${
          a11y ? "text-xl font-medium" : "text-lg"
        } ${highlighted && !a11y ? "text-foreground" : highlighted && a11y ? "" : "text-foreground"}`}
      >
        {body}
      </p>
    </div>
  );
}
