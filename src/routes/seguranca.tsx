import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ShieldCheck,
  ShieldAlert,
  Phone,
  MessageSquare,
  Mail,
  ShoppingBag,
  Gift,
  Wrench,
  Heart,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Search,
  Lightbulb,
} from "lucide-react";
import { useA11y } from "../lib/a11y";
import { BottomTabBar } from "../components/BottomTabBar";
import { PageHeader } from "../components/PageHeader";

export const Route = createFileRoute("/seguranca")({
  component: SegurancaPage,
  head: () => ({
    meta: [
      { title: "Segurança e Golpes — Ajudante Tech" },
      {
        name: "description",
        content:
          "Aprenda a reconhecer os principais golpes na internet e no celular: como identificar sinais de alerta e o que fazer com calma em cada situação.",
      },
    ],
  }),
});

type IconCmp = React.ComponentType<{ className?: string; strokeWidth?: number }>;

type Scam = {
  id: string;
  name: string;
  short: string;
  icon: IconCmp;
  how: string;
  signals: string[];
  doThis: string[];
  dontDo: string[];
  safePhrase: string;
};

const SCAMS: Scam[] = [
  {
    id: "filho",
    name: "Mensagem de número novo",
    short: "Alguém diz ser conhecido seu pedindo PIX urgente.",
    icon: MessageSquare,
    how: "Você recebe uma mensagem no WhatsApp ou SMS de um número que não conhece. A pessoa diz: 'Oi, sou eu, troquei de número' e logo pede um PIX urgente para pagar uma conta ou resolver uma emergência.",
    signals: [
      "Número diferente do habitual da pessoa.",
      "Pressa: 'preciso agora', 'estou sem tempo'.",
      "A pessoa não pode atender no telefone.",
      "Foto de perfil sumiu ou parece estranha.",
    ],
    doThis: [
      "Ligue para o número antigo da pessoa, mesmo que ela diga que não funciona.",
      "Faça uma chamada de vídeo para ver o rosto antes de qualquer coisa.",
      "Combine uma pergunta que só vocês dois sabem responder.",
    ],
    dontDo: [
      "Mandar PIX só por mensagem escrita.",
      "Salvar o número novo sem confirmar pessoalmente.",
    ],
    safePhrase:
      "'Que bom! Antes de te mandar, vou te ligar pra confirmar. Se não atender, falo com você outra hora.'",
  },
  {
    id: "banco",
    name: "Falso funcionário do banco",
    short: "Ligação dizendo que sua conta foi invadida.",
    icon: Phone,
    how: "Você recebe uma ligação. A pessoa diz que é do banco e que viu uma compra estranha na sua conta. Pede sua senha, código do cartão, ou que você instale um aplicativo para 'proteger' o dinheiro.",
    signals: [
      "Pedem senha, código do cartão ou número que chegou por SMS.",
      "Pedem para você instalar um aplicativo 'do banco'.",
      "Pedem para você ir até o caixa eletrônico enquanto eles ficam na linha.",
      "Falam para não desligar e não contar para ninguém.",
    ],
    doThis: [
      "Desligue o telefone sem se justificar.",
      "Ligue você mesma para o banco, usando o número que está atrás do seu cartão.",
      "Se desconfiar de alguma coisa na conta, vá até a agência.",
    ],
    dontDo: [
      "Dizer senhas, códigos ou número do cartão por telefone.",
      "Instalar aplicativos que alguém pediu por ligação.",
    ],
    safePhrase:
      "'Obrigada, vou desligar e ligar para o banco pelo número do meu cartão.'",
  },
  {
    id: "link",
    name: "Link estranho por SMS ou e-mail",
    short: "Mensagem com link pedindo para você clicar.",
    icon: Mail,
    how: "Chega um SMS ou e-mail dizendo que sua encomenda foi taxada, sua conta da luz está atrasada, ou que você precisa atualizar um cadastro. Tem um link azul para você tocar e pagar ou colocar seus dados.",
    signals: [
      "Pressa: 'só hoje', 'vai cortar', 'última chance'.",
      "Endereço do site com letras estranhas ou trocadas.",
      "Você não estava esperando essa mensagem.",
      "Pedem CPF, senha ou dados do cartão na mesma página.",
    ],
    doThis: [
      "Não toque no link. Apague a mensagem.",
      "Se quiser conferir, abra o aplicativo oficial (Correios, banco, luz) direto pelo celular.",
      "Mostre a mensagem para alguém de confiança antes de fazer qualquer coisa.",
    ],
    dontDo: [
      "Tocar em link de encomenda que você não pediu.",
      "Colocar seus dados em página que abriu por SMS.",
    ],
    safePhrase:
      "'Na dúvida, não toco. Se for importante, eles entram em contato pelo aplicativo certo.'",
  },
  {
    id: "loja",
    name: "Loja ou promoção falsa",
    short: "Site oferecendo preço bom demais para ser verdade.",
    icon: ShoppingBag,
    how: "Você vê um anúncio nas redes sociais ou no WhatsApp com uma promoção incrível: geladeira muito barata, remédio pela metade do preço. O site parece bonito, mas é uma cópia feita só para roubar seu dinheiro.",
    signals: [
      "Preço muito mais baixo que em outras lojas.",
      "Endereço do site com palavras estranhas ou trocadas.",
      "Só aceita pagamento por PIX, sem boleto nem cartão.",
      "Não tem telefone nem endereço da loja na página.",
    ],
    doThis: [
      "Procure o nome da loja no Google e veja se outras pessoas reclamaram.",
      "Compre só em lojas conhecidas que você já comprou antes.",
      "Prefira pagar com cartão: dá para contestar se for golpe.",
    ],
    dontDo: [
      "Mandar PIX para loja que você nunca ouviu falar.",
      "Confiar só porque o anúncio apareceu no Facebook ou Instagram.",
    ],
    safePhrase:
      "'Se está barato demais, alguma coisa está errada. Prefiro pagar um pouco mais e ficar tranquila.'",
  },
  {
    id: "premio",
    name: "Prêmio ou sorteio que você não jogou",
    short: "Aviso de que você ganhou alguma coisa.",
    icon: Gift,
    how: "Chega uma mensagem dizendo que você ganhou um prêmio: dinheiro, viagem, celular novo. Para receber, pedem que você pague uma 'taxa de liberação' ou mande seus dados pessoais.",
    signals: [
      "Você não participou de nenhum sorteio.",
      "Pedem para você pagar antes para receber o prêmio.",
      "Querem CPF, dados do banco ou foto do documento.",
      "Mandam um link para 'resgatar' o prêmio.",
    ],
    doThis: [
      "Apague a mensagem sem responder.",
      "Lembre-se: prêmio de verdade nunca pede dinheiro antes.",
    ],
    dontDo: [
      "Pagar taxa para liberar prêmio.",
      "Mandar foto de documento por mensagem.",
    ],
    safePhrase: "'Não joguei, então não ganhei. Vou apagar.'",
  },
  {
    id: "suporte",
    name: "Falso suporte técnico",
    short: "Aviso dizendo que seu celular está com vírus.",
    icon: Wrench,
    how: "Aparece um aviso na tela, ou alguém liga, dizendo que seu celular ou computador está com vírus. Pedem para você instalar um programa, ou dar acesso à sua tela, para 'consertar'.",
    signals: [
      "Aviso piscando na tela com som de alerta.",
      "Pedem para baixar um programa que você nunca ouviu falar.",
      "Pedem para ver sua tela de longe, por aplicativo.",
      "Dizem ser da Microsoft, Google ou da operadora de celular.",
    ],
    doThis: [
      "Feche o aviso. Se não fechar, desligue o celular e ligue de novo.",
      "Procure ajuda de um parente ou de uma loja de confiança.",
    ],
    dontDo: [
      "Instalar programa para 'limpar' o celular.",
      "Deixar estranhos verem ou controlarem sua tela.",
    ],
    safePhrase:
      "'Vou desligar e pedir para alguém de confiança olhar.'",
  },
  {
    id: "amizade",
    name: "Amizade ou paquera pela internet",
    short: "Pessoa nova querendo intimidade ou dinheiro.",
    icon: Heart,
    how: "Alguém te chama no Facebook, Instagram ou WhatsApp. Conversa muito, manda mensagens carinhosas, mas nunca quer fazer chamada de vídeo ou se encontrar. Depois de um tempo, começa a pedir dinheiro emprestado por causa de um 'problema'.",
    signals: [
      "Sempre tem uma desculpa para não fazer videochamada.",
      "Foto de perfil parece de revista ou de outra pessoa.",
      "Conta histórias de sofrimento e pede dinheiro.",
      "Mora longe, fora do Brasil, ou está sempre viajando.",
    ],
    doThis: [
      "Faça chamada de vídeo antes de criar laços.",
      "Conte para alguém da família ou amiga sobre essa pessoa.",
      "Pesquise a foto da pessoa no Google Imagens.",
    ],
    dontDo: [
      "Mandar dinheiro para alguém que você nunca viu pessoalmente.",
      "Mandar fotos íntimas para pessoa de internet.",
    ],
    safePhrase:
      "'Se você é de verdade, vamos conversar por vídeo. Dinheiro eu não mando.'",
  },
];

function SegurancaPage() {
  const [openScam, setOpenScam] = useState<Scam | null>(null);
  const [query, setQuery] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const { enabled: a11y } = useA11y();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [openScam]);

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

  const readScreen = () => {
    if (openScam) {
      const text = `${openScam.name}. Como funciona: ${openScam.how}. Sinais de alerta: ${openScam.signals.join("; ")}. O que fazer: ${openScam.doThis.join("; ")}. O que não fazer: ${openScam.dontDo.join("; ")}. Frase pronta: ${openScam.safePhrase}`;
      speak(text);
    } else {
      speak(
        "Segurança e golpes. Aqui você aprende a reconhecer os principais golpes que circulam no celular e na internet. Toque em cada um para ver os sinais de alerta e o que fazer com calma.",
      );
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SCAMS;
    return SCAMS.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.short.toLowerCase().includes(q) ||
        s.how.toLowerCase().includes(q),
    );
  }, [query]);

  // ===== DETAIL VIEW =====
  if (openScam) {
    const Icon = openScam.icon;
    return (
      <main className="min-h-screen bg-background flex flex-col items-center px-5 py-6">
        <div className="w-full max-w-md flex flex-col gap-6">
          <PageHeader
            onBack={() => { setOpenScam(null); window.scrollTo(0, 0); }}
            backLabel="Voltar para a lista"
            speaking={speaking}
            onSpeakToggle={speaking ? stopSpeaking : readScreen}
            speakLabel="Ouvir explicação"
          />

          {/* Hero */}
          <section
            className={
              a11y
                ? "rounded-3xl bg-card border-4 border-foreground p-6 flex flex-col items-center text-center gap-3"
                : "rounded-3xl bg-destructive/10 p-6 flex flex-col items-center text-center gap-3 border-2 border-destructive/30"
            }
          >
            <div
              className={
                a11y
                  ? "size-24 rounded-2xl flex items-center justify-center bg-foreground"
                  : "size-24 rounded-2xl flex items-center justify-center bg-destructive shadow-md"
              }
            >
              <Icon
                className={a11y ? "size-14 text-background" : "size-14 text-destructive-foreground"}
                strokeWidth={a11y ? 2.6 : 2.2}
              />
            </div>
            <h1 className={`font-extrabold tracking-tight ${a11y ? "text-3xl text-foreground" : "text-3xl text-foreground"}`}>
              {openScam.name}
            </h1>
            <p className={`leading-snug font-medium ${a11y ? "text-xl text-foreground" : "text-lg text-muted-foreground"}`}>
              {openScam.short}
            </p>
          </section>

          {/* How it works */}
          <SectionCard a11y={a11y} title="Como funciona o golpe" tone="neutral">
            <p className={`leading-snug ${a11y ? "text-xl font-medium" : "text-lg"} text-foreground`}>
              {openScam.how}
            </p>
          </SectionCard>

          {/* Signals */}
          <SectionCard a11y={a11y} title="Sinais de alerta" tone="warning" icon={AlertTriangle}>
            <ul className="flex flex-col gap-3">
              {openScam.signals.map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <XCircle className="size-6 shrink-0 text-yellow-600 mt-0.5" strokeWidth={2.4} />
                  <span className={`leading-snug text-foreground ${a11y ? "text-xl font-medium" : "text-lg"}`}>{s}</span>
                </li>
              ))}
            </ul>
          </SectionCard>

          {/* Do this */}
          <SectionCard a11y={a11y} title="O que fazer com calma" tone="success" icon={ShieldCheck}>
            <ul className="flex flex-col gap-3">
              {openScam.doThis.map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="size-6 shrink-0 text-success mt-0.5" strokeWidth={2.4} />
                  <span className={`leading-snug text-foreground ${a11y ? "text-xl font-medium" : "text-lg"}`}>{s}</span>
                </li>
              ))}
            </ul>
          </SectionCard>

          {/* Dont do */}
          <SectionCard a11y={a11y} title="O que não fazer" tone="danger" icon={ShieldAlert}>
            <ul className="flex flex-col gap-3">
              {openScam.dontDo.map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <XCircle className="size-6 shrink-0 text-destructive mt-0.5" strokeWidth={2.4} />
                  <span className={`leading-snug text-foreground ${a11y ? "text-xl font-medium" : "text-lg"}`}>{s}</span>
                </li>
              ))}
            </ul>
          </SectionCard>

          {/* Safe phrase */}
          <section
            className={
              a11y
                ? "rounded-3xl p-6 bg-foreground text-background border-4 border-foreground"
                : "rounded-3xl p-6 bg-primary text-primary-foreground shadow-lg shadow-primary/30"
            }
          >
            <h2 className={`font-extrabold mb-2 ${a11y ? "text-2xl" : "text-xl"}`}>
              Frase pronta para sair da situação
            </h2>
            <p className={`leading-snug italic ${a11y ? "text-2xl font-bold" : "text-xl font-bold"}`}>
              {openScam.safePhrase}
            </p>
          </section>

          <button
            type="button"
            onClick={() => setOpenScam(null)}
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

  // ===== LIST VIEW =====
  return (
    <main className="min-h-screen bg-background flex flex-col items-center px-5 py-6 pb-28">
      <div className="w-full max-w-md flex flex-col gap-6">
        <PageHeader
          speaking={speaking}
          onSpeakToggle={speaking ? stopSpeaking : readScreen}
        />

        <div>
          <h1 className={`font-extrabold text-foreground tracking-tight ${a11y ? "text-4xl" : "text-3xl"}`}>
            Segurança e Golpes
          </h1>
          <p className={`mt-1 leading-snug font-medium ${a11y ? "text-xl text-foreground" : "text-lg text-muted-foreground"}`}>
            Aprenda a reconhecer os golpes mais comuns e o que fazer em cada situação.
          </p>
        </div>

        {/* Golden rule */}
        <section
          aria-label="Regra de ouro"
          className={
            a11y
              ? "rounded-3xl p-6 bg-foreground text-background border-4 border-foreground"
              : "rounded-3xl p-5 bg-destructive text-destructive-foreground shadow-lg shadow-destructive/30"
          }
        >
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert className="size-7" strokeWidth={2.4} />
            <h2 className={`font-extrabold ${a11y ? "text-2xl" : "text-xl"}`}>Regra de Ouro</h2>
          </div>
          <p className={`leading-snug ${a11y ? "text-xl font-medium" : "text-lg"}`}>
            Bancos, lojas e órgãos do governo nunca pedem senha, código de SMS ou
            PIX urgente por telefone, mensagem ou e-mail. Na dúvida, desligue e pergunte
            a alguém de confiança.
          </p>
        </section>

        {/* Search */}
        <div className="relative">
          <label htmlFor="scam-search" className="sr-only">
            Buscar golpe
          </label>
          <Search
            className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none ${
              a11y ? "size-7 text-foreground" : "size-6 text-muted-foreground"
            }`}
            strokeWidth={2.4}
          />
          <input
            id="scam-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar um golpe..."
            className={`w-full pr-4 rounded-2xl bg-card text-foreground placeholder:text-muted-foreground focus:outline-none transition ${
              a11y
                ? "h-[68px] text-xl border-4 border-foreground focus:ring-4 focus:ring-foreground"
                : "h-[60px] text-lg border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/20"
            }`}
            style={{ paddingLeft: "3.25rem" }}
          />
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-border p-6 text-center text-lg text-muted-foreground">
            Nenhum golpe encontrado. Tente outra palavra.
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {filtered.map((scam) => {
              const Icon = scam.icon;
              return (
                <li key={scam.id}>
                  <button
                    type="button"
                    onClick={() => setOpenScam(scam)}
                    className={
                      a11y
                        ? "w-full flex items-center gap-4 bg-card rounded-2xl p-4 border-4 border-foreground hover:bg-muted active:scale-[0.99] transition focus:outline-none focus:ring-4 focus:ring-foreground text-left"
                        : "w-full flex items-center gap-4 bg-card rounded-2xl p-4 border-2 border-border/60 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.12)] hover:border-destructive/60 active:scale-[0.99] transition focus:outline-none focus:ring-4 focus:ring-destructive/25 text-left"
                    }
                  >
                    <div
                      className={
                        a11y
                          ? "shrink-0 size-14 rounded-xl flex items-center justify-center bg-foreground"
                          : "shrink-0 size-14 rounded-xl flex items-center justify-center bg-destructive/10"
                      }
                    >
                      <Icon
                        className={a11y ? "size-8 text-background" : "size-7 text-destructive"}
                        strokeWidth={a11y ? 2.6 : 2.2}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-extrabold leading-tight ${a11y ? "text-2xl text-foreground" : "text-xl text-card-foreground"}`}>
                        {scam.name}
                      </h3>
                      <p className={`mt-1 leading-snug ${a11y ? "text-lg text-foreground font-medium" : "text-base text-muted-foreground"}`}>
                        {scam.short}
                      </p>
                    </div>
                    <ChevronRight className={a11y ? "size-7 text-foreground shrink-0" : "size-6 text-muted-foreground shrink-0"} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {/* Closing tip */}
        <section
          aria-label="Dica final"
          className={
            a11y
              ? "rounded-3xl p-6 bg-card border-4 border-foreground"
              : "rounded-3xl p-5 bg-info/10 border-2 border-info/30"
          }
        >
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className={`size-6 ${a11y ? "text-foreground" : "text-info"}`} strokeWidth={2.4} />
            <h2 className={`font-extrabold ${a11y ? "text-2xl text-foreground" : "text-xl text-foreground"}`}>
              Na dúvida, não decida sozinha
            </h2>
          </div>
          <p className={`leading-snug ${a11y ? "text-xl text-foreground font-medium" : "text-lg text-foreground"}`}>
            Antes de clicar, pagar ou responder, respire fundo e mostre a mensagem para
            uma pessoa de confiança. Golpista trabalha com pressa: quem te apressa, te
            engana.
          </p>
        </section>
      </div>
      <BottomTabBar />
    </main>
  );
}

/* ============ subcomponents ============ */

function SectionCard({
  a11y,
  title,
  tone,
  icon: Icon,
  children,
}: {
  a11y: boolean;
  title: string;
  tone: "neutral" | "danger" | "success" | "warning";
  icon?: IconCmp;
  children: React.ReactNode;
}) {
  const toneClass = a11y
    ? "bg-card border-4 border-foreground"
    : tone === "danger"
      ? "bg-destructive/5 border-2 border-destructive/30"
      : tone === "success"
        ? "bg-success/10 border-2 border-success/30"
        : tone === "warning"
          ? "bg-yellow-500/10 border-2 border-yellow-500/30"
          : "bg-card border-2 border-border/60 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)]";

  const titleColor = a11y
    ? "text-foreground"
    : tone === "danger"
      ? "text-destructive"
      : tone === "success"
        ? "text-success"
        : tone === "warning"
          ? "text-yellow-600"
          : "text-foreground";

  return (
    <section className={`rounded-2xl p-5 ${toneClass}`}>
      <div className="flex items-center gap-2 mb-3">
        {Icon && <Icon className={`size-6 ${titleColor}`} strokeWidth={2.4} />}
        <h2
          className={`font-extrabold ${
            a11y ? "text-2xl" : "text-xl"
          } ${titleColor}`}
        >
          {title}
        </h2>
      </div>

      {children}
    </section>
  );
}