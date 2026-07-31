"use client";

import Icon, { type LucideIconName } from "@atoms/Icon";
import { leagueSpartan } from "@styles/fonts";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import {
  motion,
  type MotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { Button } from "@/app/_components/ui/button";

type WelcomeLandingProps = {
  redirectUrl: string;
};

const transactions: {
  icon: LucideIconName;
  label: string;
  meta: string;
  amount: string;
  tone: string;
}[] = [
  {
    icon: "ShoppingBasket",
    label: "Mercado",
    meta: "Alimentação · hoje",
    amount: "− R$ 186,42",
    tone: "bg-amber-400/15 text-amber-300",
  },
  {
    icon: "CarFront",
    label: "Mobilidade",
    meta: "Transporte · ontem",
    amount: "− R$ 42,90",
    tone: "bg-sky-400/15 text-sky-300",
  },
  {
    icon: "BriefcaseBusiness",
    label: "Pagamento recebido",
    meta: "Receita · 08 jul",
    amount: "+ R$ 4.850,00",
    tone: "bg-emerald-400/15 text-emerald-300",
  },
];

const storyChapters = [
  {
    number: "01",
    label: "Dashboard",
    title: "Tudo começa com uma visão completa.",
    body: "Saldo, receitas, despesas e o resultado do mês reunidos em um único painel.",
    image: "/landing/dashboard.png",
    imageAlt: "Dashboard do Oto Finance com saldos, gráficos e transações",
    cardColor: "#3b9633",
  },
  {
    number: "02",
    label: "Transações",
    title: "Cada movimentação continua fácil de encontrar.",
    body: "Filtre, categorize e acompanhe cada entrada, saída ou transferência sem perder o contexto.",
    image: "/landing/transactions.png",
    imageAlt: "Lista de transações e filtros do Oto Finance",
    cardColor: "#215a8d",
  },
  {
    number: "03",
    label: "Contas",
    title: "Todas as suas contas, um único saldo.",
    body: "Veja onde seu dinheiro está e acompanhe cada instituição lado a lado.",
    image: "/landing/accounts.png",
    imageAlt: "Contas bancárias e seus saldos no Oto Finance",
    cardColor: "#683b91",
  },
  {
    number: "04",
    label: "Cartões",
    title: "Seus cartões entram na mesma história.",
    body: "Fechamentos e vencimentos organizados para que a próxima fatura nunca seja surpresa.",
    image: "/landing/cards-desktop.png",
    mobileImage: "/landing/cards-mobile.png",
    imageAlt: "Cartões de crédito cadastrados no Oto Finance",
    cardColor: "#b86717",
  },
  {
    number: "05",
    label: "Análises",
    title: "No fim, números viram decisões.",
    body: "Categorias e subcategorias revelam os hábitos que mais impactam o seu mês.",
    image: "/landing/analytics.png",
    imageAlt: "Análises financeiras por categoria e subcategoria",
    cardColor: "#287a52",
  },
];

const chapterLayouts = [
  { image: "bottom", text: "top-right" },
  { image: "top", text: "bottom-right" },
  { image: "top", text: "bottom-left" },
  { image: "bottom", text: "top-left" },
  { image: "bottom", text: "top-right" },
] as const;

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative grid size-10 place-items-center overflow-hidden rounded-xl bg-[#79df55] shadow-[0_0_30px_rgba(121,223,85,0.16)]">
        <Image
          src="/favicon.ico"
          alt=""
          width={32}
          height={32}
          className="size-7"
        />
      </div>
      <span
        className={`${leagueSpartan.className} text-lg font-bold tracking-[-0.03em] text-white`}
      >
        Oto Finance
      </span>
    </div>
  );
}

function ArrowButtonContent({ label }: { label: string }) {
  return (
    <>
      <span>{label}</span>
      <span className="grid size-8 place-items-center rounded-full bg-black text-white transition-transform duration-300 group-hover:translate-x-1">
        <Icon name="ArrowUpRight" size={16} />
      </span>
    </>
  );
}

function DemoCreditCard({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`relative isolate overflow-hidden rounded-[1.65rem] border border-white/20 bg-[linear-gradient(135deg,#79df55_0%,#3d9c30_42%,#17351d_100%)] text-white shadow-[0_35px_80px_rgba(0,0,0,0.4)] ${
        compact ? "h-[174px] w-[284px] p-5" : "h-[210px] w-[340px] p-6"
      }`}
    >
      <div className="absolute -right-16 -top-20 size-56 rounded-full border-[36px] border-white/10" />
      <div className="absolute -bottom-24 -left-12 size-56 rounded-full bg-black/10 blur-2xl" />
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/65">
              Oto Finance
            </p>
            <p className="mt-1 text-sm font-semibold">Cartão principal</p>
          </div>
          <div className="flex -space-x-2">
            <span className="size-7 rounded-full bg-white/80" />
            <span className="size-7 rounded-full bg-lime-200/55" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-8 w-10 rounded-md bg-[linear-gradient(135deg,#f8e59a,#a88128)] shadow-inner" />
          <Icon name="Wifi" size={20} className="rotate-90 text-white/75" />
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="font-mono text-base tracking-[0.2em]">
              •••• &nbsp; 2486
            </p>
            <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/65">
              João Silva
            </p>
          </div>
          <p className="text-xs font-medium text-white/70">08 / 29</p>
        </div>
      </div>
    </div>
  );
}

function MiniChart() {
  return (
    <div className="relative mt-5 h-24 overflow-hidden">
      <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-white/10" />
      <svg
        viewBox="0 0 360 100"
        className="absolute inset-0 size-full overflow-visible"
        role="img"
        aria-label="Gráfico de evolução do saldo"
      >
        <defs>
          <linearGradient id="line-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#79df55" stopOpacity=".3" />
            <stop offset="100%" stopColor="#79df55" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0 88 C30 82 38 65 67 69 C98 73 108 49 137 52 C168 55 177 69 207 52 C232 38 249 48 271 30 C295 10 320 26 360 8 L360 100 L0 100 Z"
          fill="url(#line-fill)"
        />
        <path
          d="M0 88 C30 82 38 65 67 69 C98 73 108 49 137 52 C168 55 177 69 207 52 C232 38 249 48 271 30 C295 10 320 26 360 8"
          fill="none"
          stroke="#79df55"
          strokeLinecap="round"
          strokeWidth="3"
        />
        <circle cx="360" cy="8" r="5" fill="#79df55" />
        <circle cx="360" cy="8" r="11" fill="#79df55" opacity=".15" />
      </svg>
    </div>
  );
}

function DashboardPreview({ className = "" }: { className?: string }) {
  return (
    <div
      className={`overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#121512]/95 p-3 shadow-[0_50px_120px_rgba(0,0,0,0.55)] backdrop-blur-xl ${className}`}
    >
      <div className="border-white/8 flex items-center justify-between border-b px-3 pb-3 pt-1">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-[#79df55]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/60">
            Visão geral
          </span>
        </div>
        <div className="flex gap-1">
          <span className="size-1.5 rounded-full bg-white/15" />
          <span className="size-1.5 rounded-full bg-white/15" />
          <span className="size-1.5 rounded-full bg-white/15" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-3">
        <div className="col-span-2 rounded-2xl bg-[#1b201b] p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-medium text-white/45">
                Saldo total
              </p>
              <p className="mt-1 text-2xl font-bold tracking-[-0.04em] text-white">
                R$ 12.840,30
              </p>
            </div>
            <span className="rounded-full bg-[#79df55]/10 px-2 py-1 text-[9px] font-bold text-[#8dec6c]">
              +8,4%
            </span>
          </div>
          <MiniChart />
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.035] p-3">
          <div className="flex items-center gap-2 text-white/45">
            <Icon name="ArrowDownLeft" size={12} />
            <span className="text-[9px]">Receitas</span>
          </div>
          <p className="mt-2 text-sm font-bold text-white">R$ 6.320</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/[0.035] p-3">
          <div className="flex items-center gap-2 text-white/45">
            <Icon name="ArrowUpRight" size={12} />
            <span className="text-[9px]">Despesas</span>
          </div>
          <p className="mt-2 text-sm font-bold text-white">R$ 2.184</p>
        </div>
      </div>
    </div>
  );
}

function TransactionPreview() {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-[#121512]/95 p-5 shadow-[0_35px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-white">Últimas transações</p>
          <p className="mt-1 text-[10px] text-white/35">
            Atualizado há poucos segundos
          </p>
        </div>
        <span className="rounded-full border border-white/10 px-2.5 py-1 text-[9px] font-semibold text-white/50">
          Julho
        </span>
      </div>

      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.label}
            className="flex items-center justify-between gap-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div
                className={`grid size-9 shrink-0 place-items-center rounded-xl ${transaction.tone}`}
              >
                <Icon name={transaction.icon} size={16} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[11px] font-bold text-white/90">
                  {transaction.label}
                </p>
                <p className="mt-0.5 truncate text-[9px] text-white/35">
                  {transaction.meta}
                </p>
              </div>
            </div>
            <p
              className={`shrink-0 text-[10px] font-bold ${
                transaction.amount.startsWith("+")
                  ? "text-[#8dec6c]"
                  : "text-white/75"
              }`}
            >
              {transaction.amount}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function StoryCreditCard({
  backgroundColor,
}: {
  backgroundColor: MotionValue<string>;
}) {
  return (
    <motion.div
      className="relative isolate h-[174px] w-[284px] overflow-hidden rounded-[1.65rem] border border-white/20 p-5 text-white shadow-[0_35px_90px_rgba(0,0,0,0.5)]"
      style={{ backgroundColor }}
    >
      <div className="absolute -right-16 -top-20 size-56 rounded-full border-[36px] border-white/10" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,.16),transparent_48%,rgba(0,0,0,.28))]" />
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/65">
              Oto Finance
            </p>
            <p className="mt-1 text-sm font-semibold">Cartão principal</p>
          </div>
          <div className="flex -space-x-2">
            <span className="size-7 rounded-full bg-white/80" />
            <span className="size-7 rounded-full bg-lime-200/55" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-8 w-10 rounded-md bg-[linear-gradient(135deg,#f8e59a,#a88128)]" />
          <Icon name="Wifi" size={20} className="rotate-90 text-white/75" />
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="font-mono text-base tracking-[0.2em]">
              •••• &nbsp; 2486
            </p>
            <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/65">
              João Silva
            </p>
          </div>
          <p className="text-xs font-medium text-white/70">08 / 29</p>
        </div>
      </div>
    </motion.div>
  );
}

function DesktopChapter({
  chapter,
  index,
  progress,
}: {
  chapter: (typeof storyChapters)[number];
  index: number;
  progress: MotionValue<number>;
}) {
  const center = index / (storyChapters.length - 1);
  const opacity = useTransform(
    progress,
    index === 0
      ? [0, 0.07, 0.16]
      : index === storyChapters.length - 1
        ? [0.84, 0.93, 1]
        : [center - 0.16, center - 0.09, center + 0.09, center + 0.16],
    index === 0
      ? [1, 1, 0]
      : index === storyChapters.length - 1
        ? [0, 1, 1]
        : [0, 1, 1, 0],
  );
  const contentY = useTransform(opacity, [0, 1], [24, 0]);
  const imageScale = useTransform(opacity, [0, 1], [0.965, 1]);
  const layout = chapterLayouts[index];
  const isImageTop = layout.image === "top";
  const isTextTop = layout.text.startsWith("top");
  const isTextLeft = layout.text.endsWith("left");
  const imageY = useTransform(opacity, [0, 1], [isImageTop ? -22 : 22, 0]);

  return (
    <motion.article
      className="pointer-events-none absolute inset-0"
      style={{ opacity }}
    >
      <motion.div
        className={`absolute left-[11%] right-[11%] h-[48vh] ${
          isImageTop ? "top-[9vh]" : "bottom-[9vh]"
        }`}
        style={{ y: imageY, scale: imageScale }}
      >
        <Image
          src={chapter.image}
          alt={chapter.imageAlt}
          fill
          sizes="(min-width: 1920px) 1498px, 78vw"
          priority={index === 0}
          className="object-contain drop-shadow-[0_45px_70px_rgba(0,0,0,.55)]"
        />
      </motion.div>

      <motion.div
        className={`absolute z-10 ${
          isTextTop ? "top-[11vh]" : "bottom-[11vh]"
        }`}
        style={{
          y: contentY,
          left: isTextLeft ? "7%" : "calc(11% + 284px)",
          right: isTextLeft ? "calc(11% + 284px)" : "7%",
        }}
      >
        <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.24em] text-[#8dec6c]">
          {chapter.number} · {chapter.label}
        </p>
        <h2
          className={`${leagueSpartan.className} text-[clamp(2.4rem,3.6vw,4.2rem)] font-medium leading-[0.94] tracking-[-0.06em] text-white`}
        >
          {chapter.title}
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-7 text-white/55">
          {chapter.body}
        </p>
      </motion.div>
    </motion.article>
  );
}

function MobileStory() {
  return (
    <div className="space-y-16 px-5 py-14 md:hidden">
      {storyChapters.map((chapter) => {
        const hasMobileImage = "mobileImage" in chapter;
        const mobileImage =
          hasMobileImage && chapter.mobileImage
            ? chapter.mobileImage
            : chapter.image;

        return (
          <motion.article
            key={chapter.number}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
          >
            <div>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#8dec6c]">
                {chapter.number} · {chapter.label}
              </p>
              <h2
                className={`${leagueSpartan.className} text-4xl font-medium leading-[0.96] tracking-[-0.055em]`}
              >
                {chapter.title}
              </h2>
              <p className="mt-4 text-sm leading-6 text-white/55">
                {chapter.body}
              </p>
            </div>
            <div
              className={`relative mt-6 w-full ${
                hasMobileImage ? "aspect-[1905/1159]" : "aspect-[1.8/1]"
              }`}
            >
              <Image
                src={mobileImage}
                alt={chapter.imageAlt}
                fill
                sizes="calc(100vw - 2.5rem)"
                className="object-contain"
              />
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}

function AppStory({
  scrollContainer,
}: {
  scrollContainer: React.RefObject<HTMLDivElement>;
}) {
  const storyRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    container: scrollContainer,
    target: storyRef,
    offset: ["start start", "end end"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: prefersReducedMotion ? 1000 : 110,
    damping: prefersReducedMotion ? 100 : 30,
    mass: prefersReducedMotion ? 0.01 : 0.28,
    restDelta: 0.0005,
  });
  const cardLeft = useTransform(
    smoothProgress,
    [0, 0.25, 0.5, 0.75, 1],
    ["7%", "7%", "93%", "93%", "7%"],
  );
  const cardOffset = useTransform(
    smoothProgress,
    [0, 0.25, 0.5, 0.75, 1],
    ["0%", "0%", "-100%", "-100%", "0%"],
  );
  const cardTop = useTransform(
    smoothProgress,
    [0, 0.25, 0.5, 0.75, 1],
    ["11vh", "89vh", "89vh", "11vh", "11vh"],
  );
  const cardVerticalOffset = useTransform(
    smoothProgress,
    [0, 0.25, 0.5, 0.75, 1],
    ["0%", "-100%", "-100%", "0%", "0%"],
  );
  const cardRotateX = useTransform(
    smoothProgress,
    [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1],
    prefersReducedMotion
      ? [0, 0, 0, 0, 0, 0, 0, 0, 0]
      : [0, 88, 0, 0, 0, 88, 0, 0, 0],
  );
  const cardRotateY = useTransform(
    smoothProgress,
    [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1],
    prefersReducedMotion
      ? [0, 0, 0, 0, 0, 0, 0, 0, 0]
      : [0, 0, 0, 88, 0, 0, 0, 88, 0],
  );
  const cardRotateZ = useTransform(
    smoothProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [-6, -3, 3, 6, -6],
  );
  const cardColor = useTransform(
    smoothProgress,
    [0, 0.25, 0.5, 0.75, 1],
    storyChapters.map((chapter) => chapter.cardColor),
  );
  const glowX = useTransform(
    smoothProgress,
    [0, 0.25, 0.5, 0.75, 1],
    ["22%", "22%", "78%", "78%", "22%"],
  );
  const glowY = useTransform(
    smoothProgress,
    [0, 0.25, 0.5, 0.75, 1],
    ["25%", "75%", "75%", "25%", "25%"],
  );

  return (
    <section ref={storyRef} className="relative bg-[#090b09]">
      <span id="story-title" className="absolute left-0 top-0" />
      <MobileStory />

      <div className="relative hidden h-[600vh] md:block">
        {storyChapters.map((chapter, index) => (
          <span
            key={chapter.number}
            id={`story-${chapter.number}`}
            className="absolute left-0"
            style={{ top: `${index * 125}vh` }}
          />
        ))}
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <div className="absolute inset-0 opacity-[0.13] [background-image:linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] [background-size:72px_72px]" />
          <div className="absolute inset-y-0 left-1/2 w-full max-w-[1920px] -translate-x-1/2">
            <motion.div
              className="absolute inset-0 opacity-80"
              style={{
                background: useTransform(
                  [glowX, glowY],
                  ([x, y]) =>
                    `radial-gradient(circle at ${x} ${y}, rgba(121,223,85,.105), transparent 32%)`,
                ),
              }}
            />
            <div className="absolute left-[7%] top-8 z-40 text-[10px] font-bold uppercase tracking-[0.22em] text-white/25">
              Uma visão em movimento
            </div>
            <div className="absolute right-[7%] top-8 z-40 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/25">
              Role para explorar <Icon name="ArrowDown" size={13} />
            </div>

            {storyChapters.map((chapter, index) => (
              <DesktopChapter
                key={chapter.number}
                chapter={chapter}
                index={index}
                progress={smoothProgress}
              />
            ))}

            <motion.div
              className="absolute z-30 origin-center [perspective:1000px]"
              style={{
                left: cardLeft,
                top: cardTop,
                x: cardOffset,
                y: cardVerticalOffset,
                rotateX: cardRotateX,
                rotateY: cardRotateY,
                rotateZ: cardRotateZ,
              }}
            >
              <StoryCreditCard backgroundColor={cardColor} />
            </motion.div>

            <div className="absolute bottom-7 left-[7%] right-[7%] z-40 flex items-center gap-5">
              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/25">
                01
              </span>
              <div className="h-px flex-1 overflow-hidden bg-white/10">
                <motion.div
                  className="h-full origin-left bg-[#79df55]"
                  style={{ scaleX: smoothProgress }}
                />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/25">
                05
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ClosingSection({ redirectUrl }: WelcomeLandingProps) {
  return (
    <section
      id="comece"
      className="relative overflow-hidden bg-[#79df55] px-5 py-20 text-[#0d130d] md:px-10 md:py-36"
    >
      <div className="absolute -right-28 -top-44 size-[580px] rounded-full border-[85px] border-black/[0.045]" />
      <div className="absolute -bottom-56 -left-28 size-[520px] rounded-full border-[75px] border-white/20" />
      <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-black/45">
          Seu próximo mês começa aqui
        </p>
        <h2
          className={`${leagueSpartan.className} mt-6 max-w-4xl text-5xl font-medium leading-[0.92] tracking-[-0.065em] md:text-8xl`}
        >
          Faça as pazes com o seu dinheiro.
        </h2>
        <p className="mt-7 max-w-xl text-base leading-7 text-black/55 md:text-lg">
          Uma visão mais simples hoje pode mudar todas as decisões que vêm
          depois.
        </p>
        <div className="mt-10 flex w-full max-w-md flex-col justify-center gap-3 sm:flex-row">
          <SignInButton forceRedirectUrl={redirectUrl} mode="modal">
            <Button className="rounded-full text-white">
              <Icon name="LogIn" />
              <span>Entrar</span>
            </Button>
          </SignInButton>
          <SignUpButton forceRedirectUrl={redirectUrl} mode="modal">
            <Button
              variant="secondary"
              className="rounded-full bg-black text-white"
            >
              <Icon name="UserPlus" />
              <span>Cadastrar</span>
            </Button>
          </SignUpButton>
        </div>
      </div>
    </section>
  );
}

export default function WelcomeLanding({ redirectUrl }: WelcomeLandingProps) {
  const scrollContainer = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollContainer}
      className="scrollbar-hidden relative h-full overflow-y-auto overflow-x-hidden bg-[#0b0d0b] text-white selection:bg-[#79df55] selection:text-black"
    >
      <header className="absolute inset-x-0 top-0 z-50 px-5 py-5 md:px-10 md:py-7">
        <nav className="mx-auto flex max-w-7xl items-center justify-between">
          <Logo />
          <div className="hidden items-center gap-8 font-semibold text-muted-foreground md:flex">
            <a
              href="#story-title"
              className="transition-colors hover:text-white"
            >
              Como funciona
            </a>
          </div>
          <div className="flex items-center gap-2 md:gap-8">
            <SignInButton forceRedirectUrl={redirectUrl} mode="modal">
              <Button>
                <Icon name="LogIn" className="mr-0 sm:mr-2" />
                <span className="hidden sm:block">Entrar</span>
              </Button>
            </SignInButton>
            <SignUpButton forceRedirectUrl={redirectUrl} mode="modal">
              <Button variant="outline">
                <Icon name="UserPlus" className="mr-0 sm:mr-2" />
                <span className="hidden sm:block">Cadastrar</span>
              </Button>
            </SignUpButton>
          </div>
        </nav>
      </header>

      <main>
        <section className="relative min-h-[100svh] overflow-hidden bg-[#0b0d0b] px-5 pb-10 pt-32 md:px-10 md:pb-16 md:pt-36">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_35%,rgba(121,223,85,0.12),transparent_30%)]" />
          <div className="absolute -right-40 top-10 size-[560px] rounded-full border border-white/[0.04]" />
          <div className="absolute -right-24 top-28 size-[410px] rounded-full border border-white/[0.04]" />

          <div className="relative mx-auto grid min-h-[calc(100svh-10rem)] max-w-7xl items-center gap-8 md:grid-cols-[0.9fr,1.1fr] md:gap-8">
            <div className="relative z-20 max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#79df55]/20 bg-[#79df55]/[0.07] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8dec6c]"
              >
                <span className="size-1.5 rounded-full bg-[#79df55] shadow-[0_0_10px_#79df55]" />
                Finanças com inteligência
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.7 }}
                className={`${leagueSpartan.className} text-[clamp(3.6rem,7vw,7.5rem)] font-medium leading-[0.84] tracking-[-0.075em] text-white`}
              >
                Sua vida
                <br />
                financeira,
                <br />
                <span className="text-[#79df55]">finalmente clara.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16, duration: 0.7 }}
                className="text-white/48 mt-8 max-w-lg text-base leading-7 md:text-lg md:leading-8"
              >
                Contas, cartões e escolhas em uma visão simples — com
                inteligência para mostrar o que os números não dizem sozinhos.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.24, duration: 0.7 }}
                className="mt-9 flex flex-col gap-3 sm:flex-row"
              >
                <SignUpButton forceRedirectUrl={redirectUrl} mode="modal">
                  <button className="group flex h-14 items-center justify-between gap-6 rounded-full bg-[#79df55] px-5 text-sm font-bold text-black transition-transform hover:scale-[1.02]">
                    <ArrowButtonContent label="Começar gratuitamente" />
                  </button>
                </SignUpButton>
                <a
                  href="#story-title"
                  className="border-white/12 flex h-14 items-center justify-center gap-2 rounded-full border px-6 text-sm font-bold text-white/75 transition-colors hover:bg-white/[0.06] hover:text-white"
                >
                  Ver como funciona
                  <Icon name="ArrowDown" size={16} />
                </a>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.94, rotate: 2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.16, duration: 0.9, ease: "easeOut" }}
              className="relative mx-auto h-[230px] w-full max-w-[620px] md:h-[650px]"
            >
              <div className="absolute left-[8%] top-[8%] hidden w-[72%] rotate-[-4deg] md:left-[6%] md:top-[8%] md:block">
                <DashboardPreview />
              </div>
              <motion.div
                className="absolute left-1/2 top-[8%] z-20 -ml-[142px] md:left-auto md:right-[-5%] md:top-[48%] md:ml-0"
                animate={{ y: [0, -12, 0], rotate: [-7, -4, -7] }}
                transition={{
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <div className="md:hidden">
                  <DemoCreditCard compact />
                </div>
                <div className="hidden md:block">
                  <DemoCreditCard />
                </div>
              </motion.div>
              <motion.div
                className="absolute bottom-[4%] left-0 z-10 hidden w-[270px] md:bottom-[2%] md:left-[-8%] md:block md:w-[315px]"
                animate={{ y: [0, 8, 0] }}
                transition={{
                  duration: 6,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <TransactionPreview />
              </motion.div>
              <div className="absolute right-[2%] top-[5%] hidden items-center gap-2 rounded-full border border-white/10 bg-black/45 px-3 py-2 text-[9px] font-semibold text-white/55 backdrop-blur-md md:flex">
                <span className="size-1.5 rounded-full bg-[#79df55]" />
                Atualizado agora
              </div>
            </motion.div>
          </div>
        </section>

        <section
          id="como-funciona"
          className="border-y border-white/[0.06] bg-[#0b0d0b] px-5 py-6 md:px-10 md:py-8"
        >
          <div className="text-white/28 mx-auto flex max-w-7xl flex-col gap-5 text-[10px] font-bold uppercase tracking-[0.18em] md:flex-row md:items-center md:justify-between">
            <span>Uma rotina financeira mais leve</span>
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              <span className="flex items-center gap-2">
                <Icon name="ShieldCheck" size={14} className="text-[#79df55]" />
                Seus dados protegidos
              </span>
              <span className="flex items-center gap-2">
                <Icon name="Smartphone" size={14} className="text-[#79df55]" />
                Feito para qualquer tela
              </span>
              <span className="flex items-center gap-2">
                <Icon
                  name="BrainCircuit"
                  size={14}
                  className="text-[#79df55]"
                />
                Insights personalizados
              </span>
            </div>
          </div>
        </section>

        <AppStory scrollContainer={scrollContainer} />
        <ClosingSection redirectUrl={redirectUrl} />
      </main>

      <footer className="bg-[#0b0d0b] px-5 py-8 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 border-t border-white/[0.07] pt-8 md:flex-row md:items-center md:justify-between">
          <Logo />
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Oto Finance. Clareza para cada
            escolha.
          </p>
        </div>
      </footer>
    </div>
  );
}
