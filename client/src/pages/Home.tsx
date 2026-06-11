/**
 * Noven Labs — Landing Page
 * Design: Dark Premium Editorial / Neominimalismo Tecnológico
 * Fonts: Syne 800 (display) + DM Sans 300-500 (body)
 * Colors: #080B10 bg, #4585fc brand, #E8ECF2 text, #8A96A8 muted
 */

import { useEffect, useRef, useState, useCallback } from "react";
import {
  ArrowRight, Menu, X, Check, XCircle, Zap, Search, Smartphone,
  Activity, PenLine, MessageCircle, Send, ChevronDown, Star
} from "lucide-react";

// ─── Reveal Hook ────────────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ─── AI Chat Bot Responses ───────────────────────────────────────────────────
const BOT_RESPONSES: Record<string, string> = {
  "Como funciona o processo?":
    "Nosso processo tem 4 etapas simples: 1️⃣ Conversa inicial para entender seu negócio, 2️⃣ Estratégia e design (você aprova antes do código), 3️⃣ Desenvolvimento com acompanhamento em tempo real, e 4️⃣ Lançamento com suporte completo. Prazo médio: 7 a 14 dias úteis.",
  "Quanto tempo demora?":
    "O prazo médio de entrega é de **7 a 14 dias úteis**, dependendo da complexidade do projeto. Projetos simples (landing page) costumam ficar prontos em até 7 dias. Você acompanha o progresso em tempo real.",
  "Quais serviços vocês fazem?":
    "Criamos: ✦ Sites institucionais profissionais ✦ Landing pages de alta conversão ✦ Sistemas web personalizados ✦ Redesign de sites existentes ✦ Otimização SEO. Todos com foco em gerar clientes reais para o seu negócio.",
  "Quero falar no WhatsApp":
    "Ótimo! Clique aqui para falar diretamente no WhatsApp: https://wa.me/5585999492843 — Respondemos em minutos! 🚀",
};

function getBotReply(msg: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes("processo") || lower.includes("funciona"))
    return BOT_RESPONSES["Como funciona o processo?"];
  if (lower.includes("tempo") || lower.includes("prazo") || lower.includes("demora"))
    return BOT_RESPONSES["Quanto tempo demora?"];
  if (lower.includes("serviço") || lower.includes("faz") || lower.includes("oferecem"))
    return BOT_RESPONSES["Quais serviços vocês fazem?"];
  if (lower.includes("whatsapp") || lower.includes("zap") || lower.includes("falar"))
    return BOT_RESPONSES["Quero falar no WhatsApp"];
  if (lower.includes("preço") || lower.includes("valor") || lower.includes("custo") || lower.includes("quanto"))
    return "Os valores variam conforme o projeto. Para um orçamento personalizado e gratuito, preencha o formulário ou fale no WhatsApp: https://wa.me/5585999492843 — sem compromisso!";
  if (lower.includes("garantia") || lower.includes("revisão"))
    return "Sim! Oferecemos revisões durante o desenvolvimento e suporte pós-entrega. Não somimos depois de entregar — estamos disponíveis para ajustar e melhorar seu site.";
  return "Obrigado pela mensagem! Para uma resposta mais completa, preencha o formulário de contato ou fale diretamente no WhatsApp: https://wa.me/5585999492843 — respondemos em minutos! 🚀";
}

// ─── Types ───────────────────────────────────────────────────────────────────
interface ChatMessage { role: "bot" | "user"; text: string; }

// ─── Main Component ──────────────────────────────────────────────────────────
export default function Home() {
  useReveal();

  // Navbar scroll
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobile menu
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // FAQ
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const toggleFaq = (i: number) => setOpenFaq(openFaq === i ? null : i);

  // Contact form
  const [formData, setFormData] = useState({ name: "", whatsapp: "", business: "", message: "" });
  const [toastVisible, setToastVisible] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setToastVisible(true);
    setFormData({ name: "", whatsapp: "", business: "", message: "" });
    setTimeout(() => setToastVisible(false), 4000);
  };

  // AI Chat
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: "bot", text: "Olá! 👋 Sou o assistente da Noven Labs. Como posso ajudar você hoje?" },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatOpen) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatOpen]);

  const sendChatMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { role: "user", text };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setTimeout(() => {
      setChatMessages((prev) => [...prev, { role: "bot", text: getBotReply(text) }]);
    }, 700);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendChatMessage(chatInput);
  };

  // Close mobile menu on link click
  const navLinks = [
    { href: "#problema", label: "O Problema" },
    { href: "#solucao", label: "Solução" },
    { href: "#resultados", label: "Resultados" },
    { href: "#processo", label: "Processo" },
    { href: "#faq", label: "FAQ" },
  ];

  const faqItems = [
    {
      q: "Quanto custa um site profissional?",
      a: "O investimento varia conforme a complexidade do projeto — tipo de site, número de páginas, funcionalidades e prazo. Fazemos um orçamento personalizado e gratuito após entender suas necessidades. Não temos pacotes genéricos: cada projeto é único.",
    },
    {
      q: "Preciso ter domínio e hospedagem?",
      a: "Não necessariamente. Podemos cuidar de tudo para você — desde a compra do domínio até a configuração da hospedagem. Se você já tiver, também trabalhamos com o que você tem. Nosso objetivo é facilitar ao máximo o processo.",
    },
    {
      q: "Quanto tempo leva para ficar pronto?",
      a: "O prazo médio é de 7 a 14 dias úteis para projetos padrão. Projetos mais complexos podem levar mais tempo, mas sempre combinamos o prazo antes de começar. Você acompanha o progresso em tempo real e pode pedir ajustes durante o desenvolvimento.",
    },
    {
      q: "E se eu não tiver fotos ou textos prontos?",
      a: "Não é obrigatório, mas ajuda muito. Caso você não tenha, podemos usar bancos de imagens profissionais gratuitamente e ajudamos você a criar os textos que comunicam bem o seu negócio. O conteúdo certo faz toda a diferença nos resultados do site.",
    },
    {
      q: "O site vai aparecer no Google automaticamente?",
      a: "Entregamos todos os sites com SEO técnico configurado corretamente: estrutura semântica, meta tags, velocidade otimizada, sitemap e indexação. Isso garante que o Google rastreie e indexe seu site. Para aparecer nos primeiros resultados, é necessário um trabalho contínuo de SEO — que também oferecemos como serviço adicional.",
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#080B10", color: "#E8ECF2" }}>

      {/* ===== TOAST ===== */}
      <div className={`toast-custom${toastVisible ? " show" : ""}`}>
        ✓ Mensagem enviada! Te respondo em breve.
      </div>

      {/* ===== NAVBAR ===== */}
      <header
        id="navbar"
        className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-400${scrolled ? " navbar-scrolled" : ""}`}
      >
        <div className="container flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(69,133,252,0.12)", border: "1px solid rgba(69,133,252,0.25)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#4585fc" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M2 17l10 5 10-5" stroke="#4585fc" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M2 12l10 5 10-5" stroke="#4585fc" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 17, letterSpacing: "-0.02em" }}>
              Noven<span style={{ color: "#4585fc" }}>Labs</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm transition-colors duration-200"
                style={{ color: "#8A96A8", fontFamily: "DM Sans, sans-serif" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#E8ECF2")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#8A96A8")}
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a href="#contato" className="btn-cta text-sm py-2.5 px-5">
              Quero meu site <ArrowRight size={14} />
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg transition-colors"
            style={{ color: "#8A96A8" }}
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* ===== MOBILE MENU ===== */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-50"
          onClick={closeMenu}
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
        />
      )}
      <div
        className="fixed inset-y-0 right-0 z-50 w-72 flex flex-col p-8 transition-transform duration-350"
        style={{
          background: "#0D111A",
          borderLeft: "1px solid rgba(255,255,255,0.06)",
          transform: menuOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div className="flex justify-between items-center mb-10">
          <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800 }}>
            Noven<span style={{ color: "#4585fc" }}>Labs</span>
          </span>
          <button onClick={closeMenu} style={{ color: "#8A96A8" }} aria-label="Fechar menu">
            <X size={22} />
          </button>
        </div>
        <nav className="flex flex-col gap-5">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={closeMenu}
              className="text-lg font-medium transition-colors"
              style={{ color: "rgba(255,255,255,0.8)", fontFamily: "DM Sans, sans-serif" }}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="mt-auto">
          <a href="#contato" onClick={closeMenu} className="btn-cta w-full justify-center">
            Quero meu site <ArrowRight size={14} />
          </a>
        </div>
      </div>

      {/* ===== HERO ===== */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden noise-overlay"
        style={{ paddingTop: 120, paddingBottom: 80 }}
      >
        {/* Background image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663753489018/8U6aRZEKpobYTJf93cEHmV/hero-bg-hj4cLUNfdVreoTxgKXEom3.webp)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.35,
          }}
        />
        {/* Grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-100" />
        {/* Glow orbs */}
        <div
          className="hero-glow"
          style={{
            width: 700, height: 700,
            background: "radial-gradient(ellipse, rgba(69,133,252,0.14) 0%, transparent 70%)",
            top: -200, right: -200,
          }}
        />
        <div
          className="hero-glow"
          style={{
            width: 500, height: 500,
            background: "radial-gradient(ellipse, rgba(37,99,235,0.1) 0%, transparent 70%)",
            bottom: -100, left: -150,
          }}
        />

        <div className="container relative z-10 w-full">
          <div style={{ maxWidth: 720 }}>
            {/* Tag */}
            <div className="reveal mb-6">
              <span className="tag-pill">
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4585fc", display: "inline-block" }} />
                Sites que geram clientes reais
              </span>
            </div>

            {/* Headline */}
            <h1
              className="reveal stagger-1 text-white mb-6"
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(2.6rem, 7vw, 5rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.025em",
              }}
            >
              Seu negócio<br />
              <span className="gradient-text">não aparece.</span><br />
              Seus clientes<br />
              somem.
            </h1>

            {/* Subheadline */}
            <p
              className="reveal stagger-2 mb-10"
              style={{
                fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                color: "#8A96A8",
                lineHeight: 1.7,
                maxWidth: 520,
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 300,
              }}
            >
              Enquanto você lê isso, seu concorrente está recebendo clientes pela internet.
              A Noven Labs cria sites profissionais que trabalham por você{" "}
              <strong style={{ color: "#E8ECF2", fontWeight: 500 }}>24 horas por dia.</strong>
            </p>

            {/* CTAs */}
            <div className="reveal stagger-3 flex flex-wrap gap-4 mb-14">
              <a href="#contato" className="btn-cta text-base">
                Quero um site que venda <ArrowRight size={16} />
              </a>
              <a href="#problema" className="btn-outline text-base">
                Ver mais
              </a>
            </div>

            {/* Social proof */}
            <div className="reveal stagger-4 flex flex-wrap items-center gap-5">
              <div className="flex -space-x-2">
                {[
                  { letter: "A", color: "#4585fc" },
                  { letter: "M", color: "#a78bfa" },
                  { letter: "R", color: "#60a5fa" },
                  { letter: "C", color: "#fb923c" },
                ].map((av) => (
                  <div
                    key={av.letter}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: "#1A2235",
                      border: "2px solid #080B10",
                      color: av.color,
                      fontFamily: "Syne, sans-serif",
                    }}
                  >
                    {av.letter}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5 mb-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} fill="#facc15" stroke="none" />
                  ))}
                </div>
                <p style={{ fontSize: 13, color: "#8A96A8", fontFamily: "DM Sans, sans-serif" }}>
                  <strong style={{ color: "#E8ECF2" }}>+3 negócios</strong> já aumentaram suas vendas
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ opacity: 0.35 }}
        >
          <span style={{ fontSize: 10, color: "#8A96A8", fontFamily: "DM Sans, sans-serif", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            scroll
          </span>
          <div style={{ width: 1, height: 32, background: "linear-gradient(to bottom, #8A96A8, transparent)" }} />
        </div>
      </section>

      {/* ===== MARQUEE ===== */}
      <div
        className="py-5 overflow-hidden"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "#0D111A" }}
      >
        <div className="marquee-track">
          {[
            "✦ Sites Profissionais", "✦ Landing Pages de Alta Conversão", "✦ Sistemas Web",
            "✦ Presença Digital", "✦ Vendas 24h/dia", "✦ Mobile First",
            "✦ SEO Estratégico", "✦ Identidade Visual Digital",
            "✦ Sites Profissionais", "✦ Landing Pages de Alta Conversão", "✦ Sistemas Web",
            "✦ Presença Digital", "✦ Vendas 24h/dia", "✦ Mobile First",
            "✦ SEO Estratégico", "✦ Identidade Visual Digital",
          ].map((item, i) => (
            <span
              key={i}
              className="px-6 whitespace-nowrap text-sm"
              style={{
                color: i % 2 === 0 ? "#8A96A8" : "#4585fc",
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 500,
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ===== PROBLEMA ===== */}
      <section id="problema" className="section-pad relative overflow-hidden">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-16 reveal">
            <span className="tag-pill mb-4">O que você está perdendo agora</span>
            <h2
              className="text-white mt-4 mb-5"
              style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 1.1, letterSpacing: "-0.015em" }}
            >
              A internet não espera.<br />Seus clientes, também não.
            </h2>
            <p style={{ fontSize: "1.1rem", color: "#8A96A8", maxWidth: 520, margin: "0 auto", fontFamily: "DM Sans, sans-serif", lineHeight: 1.7 }}>
              Todo dia sem uma presença digital profissional é dinheiro indo direto para o bolso do seu concorrente.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
            {[
              { num: "97%", desc: "dos consumidores pesquisam online antes de comprar" },
              { num: "75%", desc: "julgam a credibilidade de um negócio pelo site" },
              { num: "3s", desc: "é o tempo que um visitante espera antes de sair" },
              { num: "24h", desc: "por dia que seu site pode trabalhar gerando clientes" },
            ].map((s, i) => (
              <div key={i} className={`card-glass rounded-2xl p-6 text-center reveal stagger-${i + 1}`}>
                <div className="stat-num mb-2">{s.num}</div>
                <p style={{ fontSize: 13, color: "#8A96A8", fontFamily: "DM Sans, sans-serif", lineHeight: 1.5 }}>{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Pain points */}
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: <XCircle size={18} stroke="#EF4444" />,
                title: "Invisível no Google",
                desc: "Quando alguém procura pelo que você faz, aparece seu concorrente. Você nem existe para esses clientes potenciais.",
              },
              {
                icon: <XCircle size={18} stroke="#EF4444" />,
                title: "Sem autoridade digital",
                desc: "Sem site, você depende do boca a boca. Qualquer concorrente com um site profissional parece maior, mais sério e mais confiável.",
              },
              {
                icon: <XCircle size={18} stroke="#EF4444" />,
                title: "Fechado fora do horário",
                desc: "Seu negócio fecha às 18h. Mas os clientes procuram à noite, no fim de semana, no feriado. Sem site, você perde todos esses contatos.",
              },
            ].map((p, i) => (
              <div key={i} className={`card-glass rounded-2xl p-7 reveal stagger-${i + 1}`}>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-5"
                  style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}
                >
                  {p.icon}
                </div>
                <h3 className="text-white text-lg mb-3" style={{ fontFamily: "Syne, sans-serif", fontWeight: 600 }}>{p.title}</h3>
                <p style={{ fontSize: 14, color: "#8A96A8", lineHeight: 1.65, fontFamily: "DM Sans, sans-serif" }}>{p.desc}</p>
              </div>
            ))}
          </div>

          {/* Urgency banner */}
          <div
            className="mt-12 rounded-2xl p-7 md:p-10 reveal"
            style={{ border: "1px solid rgba(69,133,252,0.2)", background: "rgba(69,133,252,0.05)" }}
          >
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1">
                <p
                  className="text-white leading-snug"
                  style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", fontFamily: "Syne, sans-serif", fontWeight: 600 }}
                >
                  "Seus clientes estão procurando agora.<br />
                  A pergunta é: <span style={{ color: "#4585fc" }}>eles te encontram</span> ou encontram seu concorrente?"
                </p>
              </div>
              <div className="flex-shrink-0">
                <a href="#contato" className="btn-cta">Resolver agora <ArrowRight size={14} /></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ===== REALIDADE ===== */}
      <section className="section-pad relative">
        <div className="container">
          <div className="text-center mb-14 reveal">
            <span className="tag-pill mb-4">A diferença que faz diferença</span>
            <h2
              className="text-white mt-4 mb-5"
              style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 1.1, letterSpacing: "-0.015em" }}
            >
              Site amador vs site<br /><span className="gradient-text">que vende de verdade</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Sem site */}
            <div
              className="rounded-2xl p-7 md:p-8 reveal reveal-left"
              style={{ border: "1px solid rgba(239,68,68,0.15)", background: "rgba(239,68,68,0.04)" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#EF4444" }} />
                <h3 className="text-white text-lg" style={{ fontFamily: "Syne, sans-serif", fontWeight: 600 }}>
                  Sem site ou site ruim
                </h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Não aparece no Google para clientes locais",
                  "Parece menos confiável que concorrentes com site profissional",
                  "Perde clientes toda vez que o negócio está fechado",
                  "Depende 100% do boca a boca e anúncios pagos",
                  "Dificuldade em cobrar preços mais altos (sem credibilidade)",
                  "Sem métricas: não sabe de onde vêm os clientes",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3" style={{ fontSize: 14, color: "#8A96A8", fontFamily: "DM Sans, sans-serif" }}>
                    <span className="compare-bad mt-0.5 flex-shrink-0 font-bold">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Com site */}
            <div
              className="rounded-2xl p-7 md:p-8 reveal reveal-right"
              style={{ border: "1px solid rgba(69,133,252,0.2)", background: "rgba(69,133,252,0.04)" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#4585fc" }} />
                <h3 className="text-white text-lg" style={{ fontFamily: "Syne, sans-serif", fontWeight: 600 }}>
                  Com site profissional Noven Labs
                </h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Aparece quando clientes buscam pelo seu serviço no Google",
                  "Transmite autoridade e profissionalismo instantâneo",
                  "Recebe contatos e pedidos 24h por dia, 7 dias por semana",
                  "Gera clientes organicamente sem depender só de anúncios",
                  "Justifica preços premium com presença digital de qualidade",
                  "Métricas claras para entender e otimizar resultados",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3" style={{ fontSize: 14, color: "#E8ECF2", fontFamily: "DM Sans, sans-serif" }}>
                    <span className="compare-good mt-0.5 flex-shrink-0 font-bold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ===== SOLUÇÃO ===== */}
      <section id="solucao" className="section-pad">
        <div className="container">
          <div className="text-center mb-14 reveal">
            <span className="tag-pill mb-4">A solução</span>
            <h2
              className="text-white mt-4 mb-5"
              style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 1.1, letterSpacing: "-0.015em" }}
            >
              Sites feitos para<br /><span className="gradient-text">gerar resultados</span>
            </h2>
            <p style={{ fontSize: "1.1rem", color: "#8A96A8", maxWidth: 480, margin: "0 auto", fontFamily: "DM Sans, sans-serif", lineHeight: 1.7 }}>
              Não criamos apenas sites bonitos. Criamos máquinas de vendas digitais focadas em transformar visitantes em clientes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 mb-10">
            {[
              {
                icon: <PenLine size={20} stroke="#4585fc" />,
                title: "Design que converte",
                desc: "Cada elemento do site é pensado para guiar o visitante até a ação que você quer: ligar, mandar mensagem, comprar. Nada é por acaso.",
              },
              {
                icon: <Search size={20} stroke="#4585fc" />,
                title: "Otimizado para o Google",
                desc: "Entregamos sites com SEO técnico configurado desde o início para que o Google encontre e ranqueie seu negócio para os termos que seus clientes buscam.",
              },
              {
                icon: <Smartphone size={20} stroke="#4585fc" />,
                title: "Perfeito no celular",
                desc: "Mais de 70% das buscas são feitas pelo celular. Desenvolvemos com mentalidade mobile-first para que sua experiência seja impecável em qualquer dispositivo.",
              },
              {
                icon: <Activity size={20} stroke="#4585fc" />,
                title: "Velocidade extrema",
                desc: "Sites lentos perdem clientes. Entregamos código limpo e otimizado para carregamento ultrarrápido, garantindo que nenhum visitante abandone por demora.",
              },
            ].map((s, i) => (
              <div key={i} className={`card-glass rounded-2xl p-7 reveal stagger-${i + 1}`}>
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: "rgba(69,133,252,0.1)", border: "1px solid rgba(69,133,252,0.2)" }}
                >
                  {s.icon}
                </div>
                <h3 className="text-white text-xl mb-3" style={{ fontFamily: "Syne, sans-serif", fontWeight: 600 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: "#8A96A8", lineHeight: 1.65, fontFamily: "DM Sans, sans-serif" }}>{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center reveal">
            <a href="#contato" className="btn-cta text-base">Quero um site assim <ArrowRight size={16} /></a>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ===== RESULTADOS ===== */}
      <section id="resultados" className="section-pad">
        <div className="container">
          <div className="text-center mb-14 reveal">
            <span className="tag-pill mb-4">Resultados reais</span>
            <h2
              className="text-white mt-4 mb-5"
              style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 1.1, letterSpacing: "-0.015em" }}
            >
              Não são promessas.<br /><span className="gradient-text">São números reais.</span>
            </h2>
          </div>

          {/* Results visual */}
          <div
            className="rounded-2xl overflow-hidden mb-14 reveal"
            style={{ border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663753489018/8U6aRZEKpobYTJf93cEHmV/results-visual-NsrhWsRYb7xgLzs3FFg239.webp"
              alt="Dashboard de resultados"
              className="w-full"
              style={{ maxHeight: 320, objectFit: "cover", objectPosition: "center top" }}
            />
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-3 gap-5 mb-14">
            {[
              {
                text: "Em 3 semanas após o lançamento do site, o volume de mensagens no WhatsApp triplicou. As pessoas chegavam dizendo que tinham encontrado a gente pelo Google. Antes do site, isso nunca acontecia.",
                name: "Rafael M.",
                role: "Restaurante em Fortaleza-CE",
                letter: "R",
                color: "#4585fc",
              },
              {
                text: "Antes eu sentia que qualquer fornecedor maior parecia mais profissional que eu. Com o site novo, os clientes chegam dizendo que me encontraram e ficaram impressionados. A percepção de valor mudou completamente.",
                name: "Pedro Argerson",
                role: "Programador iniciante",
                letter: "P",
                color: "#a78bfa",
              },
              {
                text: "Meu negócio é pequeno, mas hoje tenho um site melhor que muitas empresas grandes da minha área. Isso me deu confiança pra cobrar mais pelos meus serviços. Melhorou muito minha imagem no mercado. Valeu cada centavo.",
                name: "Marcos A.",
                role: "Prestador de serviços autônomo",
                letter: "M",
                color: "#60a5fa",
              },
            ].map((t, i) => (
              <div key={i} className={`quote-card reveal stagger-${i + 1}`}>
                <div style={{ paddingTop: 40 }}>
                  <p style={{ fontSize: 14, color: "rgba(232,236,242,0.8)", lineHeight: 1.7, marginBottom: 20, fontFamily: "DM Sans, sans-serif" }}>
                    "{t.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
                      style={{ background: "#1A2235", color: t.color, fontFamily: "Syne, sans-serif" }}
                    >
                      {t.letter}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium" style={{ fontFamily: "DM Sans, sans-serif" }}>{t.name}</p>
                      <p style={{ fontSize: 12, color: "#8A96A8", fontFamily: "DM Sans, sans-serif" }}>{t.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Big quote */}
          <div
            className="rounded-2xl p-8 md:p-12 reveal text-center"
            style={{ border: "1px solid rgba(255,255,255,0.06)", background: "#131928" }}
          >
            <p
              className="text-white font-semibold leading-snug max-w-3xl mx-auto"
              style={{ fontSize: "clamp(1.3rem, 3vw, 1.8rem)", fontFamily: "Syne, sans-serif" }}
            >
              "Quem é <span style={{ color: "#4585fc" }}>encontrado primeiro</span>,<br />vende primeiro."
            </p>
            <p style={{ color: "#8A96A8", marginTop: 16, fontSize: 14, fontFamily: "DM Sans, sans-serif" }}>
              — A realidade do mercado digital de hoje
            </p>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ===== PROCESSO ===== */}
      <section id="processo" className="section-pad">
        <div className="container">
          <div className="text-center mb-14 reveal">
            <span className="tag-pill mb-4">Simples e rápido</span>
            <h2
              className="text-white mt-4 mb-5"
              style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 1.1, letterSpacing: "-0.015em" }}
            >
              Do zero ao ar em<br /><span className="gradient-text">4 passos simples</span>
            </h2>
            <p style={{ fontSize: "1.1rem", color: "#8A96A8", maxWidth: 480, margin: "0 auto", fontFamily: "DM Sans, sans-serif", lineHeight: 1.7 }}>
              Sem complicação, sem burocracia. Você foca no seu negócio, a gente cuida do resto.
            </p>
          </div>

          {/* Process visual */}
          <div
            className="rounded-2xl overflow-hidden mb-10 reveal"
            style={{ border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663753489018/8U6aRZEKpobYTJf93cEHmV/process-visual-PAN4hX4ZBfXx7yqCjjt8Jq.webp"
              alt="Processo de desenvolvimento"
              className="w-full"
              style={{ maxHeight: 260, objectFit: "cover", objectPosition: "center" }}
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { num: "01", title: "Conversa inicial", desc: "Entendemos seu negócio, seu público, seus objetivos e o que você precisa que o site faça por você." },
              { num: "02", title: "Estratégia e design", desc: "Criamos o layout e a estrutura pensando em conversão. Você aprova antes de qualquer linha de código." },
              { num: "03", title: "Desenvolvimento", desc: "Desenvolvemos com código limpo, rápido e otimizado. Você acompanha o progresso e pede ajustes em tempo real." },
              { num: "04", title: "Lançamento e suporte", desc: "Publicamos o site, configuramos o domínio e ficamos ao seu lado durante a transição para garantir que tudo funcione." },
            ].map((step, i) => (
              <div key={i} className={`reveal stagger-${i + 1}`}>
                <div className="card-glass rounded-2xl p-7 h-full">
                  <div className="step-badge mb-5">{step.num}</div>
                  <h3 className="text-white text-lg mb-3" style={{ fontFamily: "Syne, sans-serif", fontWeight: 600 }}>{step.title}</h3>
                  <p style={{ fontSize: 14, color: "#8A96A8", lineHeight: 1.65, fontFamily: "DM Sans, sans-serif" }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center reveal">
            <p style={{ color: "#8A96A8", fontSize: 14, marginBottom: 24, fontFamily: "DM Sans, sans-serif" }}>
              Prazo médio de entrega:{" "}
              <strong style={{ color: "#E8ECF2" }}>7 a 14 dias úteis</strong> dependendo da complexidade
            </p>
            <a href="#contato" className="btn-cta">Começar agora <ArrowRight size={14} /></a>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ===== POR QUE NÓS ===== */}
      <section className="section-pad">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div className="reveal reveal-left">
              <span className="tag-pill mb-5 inline-block">Por que a Noven Labs</span>
              <h2
                className="text-white mb-6"
                style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 1.1, letterSpacing: "-0.015em" }}
              >
                Feito por quem<br />entende de<br /><span className="gradient-text">resultado.</span>
              </h2>
              <p style={{ color: "#8A96A8", lineHeight: 1.7, marginBottom: 32, fontFamily: "DM Sans, sans-serif" }}>
                Não somos uma agência genérica que cria sites bonitos para foto. Somos especialistas em criar presença digital que gera resultado mensurável para negócios reais.
              </p>
              <a href="#contato" className="btn-cta">Falar com a equipe <ArrowRight size={14} /></a>
            </div>

            <div className="space-y-4 reveal reveal-right">
              {[
                { title: "100% foco em conversão", desc: "Cada decisão de design é tomada pensando em transformar visitas em contatos e vendas." },
                { title: "Entrega rápida e garantida", desc: "Prazos cumpridos. Sem surpresas. Seu site pronto no prazo combinado ou te avisamos antes." },
                { title: "Tecnologia moderna", desc: "Código limpo, performático e fácil de manter. Sites que duram e crescem com seu negócio." },
                { title: "Suporte pós-entrega", desc: "Não somimos depois de entregar. Estamos disponíveis para ajustar, melhorar e evoluir seu site." },
                { title: "Comunicação transparente", desc: "Você acompanha cada etapa do projeto. Sem surpresas, sem termos técnicos desnecessários." },
              ].map((item, i) => (
                <div key={i} className="card-glass rounded-xl p-5 flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(69,133,252,0.1)", border: "1px solid rgba(69,133,252,0.2)" }}
                  >
                    <Check size={18} stroke="#4585fc" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1" style={{ fontFamily: "DM Sans, sans-serif", fontSize: 15 }}>{item.title}</h4>
                    <p style={{ fontSize: 13, color: "#8A96A8", fontFamily: "DM Sans, sans-serif", lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ===== FAQ ===== */}
      <section id="faq" className="section-pad">
        <div className="container">
          <div className="text-center mb-14 reveal">
            <span className="tag-pill mb-4">Dúvidas frequentes</span>
            <h2
              className="text-white mt-4 mb-5"
              style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 1.1, letterSpacing: "-0.015em" }}
            >
              Respondemos suas<br /><span className="gradient-text">principais dúvidas</span>
            </h2>
          </div>

          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            {faqItems.map((item, i) => (
              <div
                key={i}
                className={`faq-item${openFaq === i ? " faq-open" : ""} reveal`}
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
              >
                <button
                  className="w-full flex items-center justify-between gap-4 py-5 text-left"
                  onClick={() => toggleFaq(i)}
                  aria-expanded={openFaq === i}
                >
                  <h3
                    className="text-white font-medium"
                    style={{ fontFamily: "DM Sans, sans-serif", fontSize: 15, fontWeight: 500 }}
                  >
                    {item.q}
                  </h3>
                  <ChevronDown
                    size={18}
                    className="faq-arrow flex-shrink-0"
                    style={{ color: "#8A96A8" }}
                  />
                </button>
                <div className="faq-answer">
                  <p style={{ fontSize: 14, color: "#8A96A8", lineHeight: 1.7, fontFamily: "DM Sans, sans-serif" }}>
                    {item.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ===== CTA FINAL / CONTATO ===== */}
      <section id="contato" className="section-pad relative overflow-hidden noise-overlay">
        {/* Glow */}
        <div
          className="hero-glow"
          style={{
            width: 600, height: 600,
            background: "radial-gradient(ellipse, rgba(69,133,252,0.12) 0%, transparent 70%)",
            top: -150, left: "50%", transform: "translateX(-60%)",
          }}
        />

        <div className="container relative z-10" style={{ maxWidth: 960 }}>
          <div className="text-center mb-14 reveal">
            <span className="tag-pill mb-4">Vamos começar</span>
            <h2
              className="text-white mt-4 mb-5"
              style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 1.1, letterSpacing: "-0.015em" }}
            >
              Seu negócio fecha às 18h.<br />
              <span className="gradient-text">Seu site não.</span>
            </h2>
            <p style={{ fontSize: "1.1rem", color: "#8A96A8", maxWidth: 480, margin: "0 auto", fontFamily: "DM Sans, sans-serif", lineHeight: 1.7 }}>
              Preencha o formulário abaixo ou fale direto no WhatsApp. Respondemos em menos de 24 horas com um diagnóstico gratuito da sua presença digital.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-start">
            {/* Form */}
            <div className="card-glass rounded-2xl p-7 md:p-8 reveal reveal-left">
              <h3
                className="text-white text-xl mb-6"
                style={{ fontFamily: "Syne, sans-serif", fontWeight: 600 }}
              >
                Solicitar orçamento
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    className="block text-sm mb-2"
                    style={{ color: "#8A96A8", fontFamily: "DM Sans, sans-serif" }}
                    htmlFor="name"
                  >
                    Seu nome
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="form-field"
                    placeholder="João Silva"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm mb-2"
                    style={{ color: "#8A96A8", fontFamily: "DM Sans, sans-serif" }}
                    htmlFor="whatsapp"
                  >
                    WhatsApp
                  </label>
                  <input
                    id="whatsapp"
                    type="tel"
                    className="form-field"
                    placeholder="(85) 99999-0000"
                    required
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm mb-2"
                    style={{ color: "#8A96A8", fontFamily: "DM Sans, sans-serif" }}
                    htmlFor="business"
                  >
                    Tipo de negócio
                  </label>
                  <input
                    id="business"
                    type="text"
                    className="form-field"
                    placeholder="Restaurante, loja, serviços..."
                    required
                    value={formData.business}
                    onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm mb-2"
                    style={{ color: "#8A96A8", fontFamily: "DM Sans, sans-serif" }}
                    htmlFor="message"
                  >
                    O que você precisa? (opcional)
                  </label>
                  <textarea
                    id="message"
                    rows={3}
                    className="form-field resize-none"
                    placeholder="Site novo, landing page, reformulação..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>
                <button type="submit" className="btn-cta w-full justify-center text-base py-4">
                  Quero meu diagnóstico gratuito <ArrowRight size={16} />
                </button>
                <p style={{ fontSize: 12, textAlign: "center", color: "#8A96A8", fontFamily: "DM Sans, sans-serif" }}>
                  Sem spam. Sem compromisso. Resposta em até 24h.
                </p>
              </form>
            </div>

            {/* Alternativas */}
            <div className="reveal reveal-right space-y-6">
              <div>
                <p className="text-white font-semibold mb-4" style={{ fontFamily: "DM Sans, sans-serif" }}>
                  Prefere falar direto?
                </p>
                <a
                  href="https://wa.me/5585999492843?text=Ol%C3%A1!%20Quero%20saber%20mais%20sobre%20criar%20um%20site%20profissional%20para%20meu%20neg%C3%B3cio."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-glass flex items-center gap-3 rounded-xl p-4"
                  style={{ textDecoration: "none" }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#22c55e">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.11 1.524 5.838L.064 23.5l5.787-1.517A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.809 9.809 0 0 1-5.001-1.366l-.359-.214-3.716.975.992-3.617-.234-.371A9.818 9.818 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm" style={{ fontFamily: "DM Sans, sans-serif" }}>Conversar no WhatsApp</p>
                    <p style={{ fontSize: 12, color: "#8A96A8", fontFamily: "DM Sans, sans-serif" }}>Resposta imediata — clique aqui</p>
                  </div>
                  <ArrowRight size={16} style={{ marginLeft: "auto", color: "#8A96A8" }} />
                </a>
              </div>

              <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 50%, transparent)" }} />

              <div className="space-y-3">
                <p className="text-white font-semibold" style={{ fontFamily: "DM Sans, sans-serif" }}>Por que não esperar?</p>
                {[
                  "Cada dia sem site é um dia que seu concorrente recebe clientes que poderiam ser seus.",
                  "O diagnóstico é gratuito e não gera compromisso nenhum da sua parte.",
                  "Respondemos em menos de 24h com uma análise real do seu cenário digital.",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span style={{ color: "#4585fc", fontSize: 14, marginTop: 2, flexShrink: 0 }}>✦</span>
                    <p style={{ fontSize: 14, color: "#8A96A8", fontFamily: "DM Sans, sans-serif", lineHeight: 1.6 }}>{item}</p>
                  </div>
                ))}
              </div>

              <div className="card-glass rounded-xl p-5">
                <p style={{ fontSize: 14, color: "#8A96A8", fontFamily: "DM Sans, sans-serif", lineHeight: 1.6 }}>
                  Atendemos com <strong style={{ color: "#E8ECF2" }}>foco total na sua região</strong> — especialmente negócios no Ceará, mas com projetos por todo o Brasil.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 40, paddingBottom: 40 }}>
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(69,133,252,0.12)", border: "1px solid rgba(69,133,252,0.25)" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#4585fc" strokeWidth="2" strokeLinejoin="round"/>
                  <path d="M2 17l10 5 10-5" stroke="#4585fc" strokeWidth="2" strokeLinejoin="round"/>
                  <path d="M2 12l10 5 10-5" stroke="#4585fc" strokeWidth="2" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 17, letterSpacing: "-0.02em" }}>
                Noven<span style={{ color: "#4585fc" }}>Labs</span>
              </span>
            </div>
            <p style={{ fontSize: 14, color: "#8A96A8", textAlign: "center", fontFamily: "DM Sans, sans-serif" }}>
              Sites que geram resultados para negócios reais. Fortaleza-CE.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://wa.me/5585994928430"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 14, color: "#8A96A8", fontFamily: "DM Sans, sans-serif", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#E8ECF2")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#8A96A8")}
              >
                WhatsApp
              </a>
              <span style={{ color: "rgba(255,255,255,0.1)" }}>·</span>
              <a
                href="mailto:contato@novenlabs.com.br"
                style={{ fontSize: 14, color: "#8A96A8", fontFamily: "DM Sans, sans-serif", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#E8ECF2")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#8A96A8")}
              >
                Email
              </a>
            </div>
          </div>
          <div style={{ marginTop: 24, textAlign: "center" }}>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.18)", fontFamily: "DM Sans, sans-serif" }}>
              © 2025 Noven Labs. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* ===== AI CHAT ===== */}
      <div
        style={{
          position: "fixed",
          right: 22,
          bottom: 22,
          zIndex: 80,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 14,
        }}
        aria-live="polite"
      >
        {/* Chat panel */}
        {chatOpen && (
          <div
            className="ai-panel"
            role="dialog"
            aria-modal="false"
            aria-label="Assistente Noven Labs"
            style={{
              animation: "msgIn 0.25s cubic-bezier(0.34,1.56,0.64,1) both",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "18px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                borderBottom: "1px solid rgba(255,255,255,0.07)",
                background: "linear-gradient(135deg, rgba(69,133,252,0.16), rgba(8,11,16,0))",
              }}
            >
              <div
                style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: "rgba(69,133,252,0.12)",
                  border: "1px solid rgba(69,133,252,0.24)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <MessageCircle size={20} stroke="#4585fc" />
              </div>
              <div>
                <h3 style={{ color: "#E8ECF2", fontSize: 14, fontWeight: 600, fontFamily: "DM Sans, sans-serif" }}>
                  Assistente Noven Labs
                </h3>
                <p style={{ color: "#8A96A8", fontSize: 12, display: "flex", alignItems: "center", gap: 6, marginTop: 4, fontFamily: "DM Sans, sans-serif" }}>
                  <span className="pulse-dot" />
                  Online agora
                </p>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                style={{
                  marginLeft: "auto",
                  width: 34, height: 34, borderRadius: 10,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#8A96A8",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  cursor: "pointer",
                  transition: "color 0.2s, border-color 0.2s",
                }}
                aria-label="Fechar chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div
              style={{
                flex: 1, overflowY: "auto", padding: 18,
                display: "flex", flexDirection: "column", gap: 12,
              }}
            >
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className="ai-message-in"
                  style={{
                    maxWidth: "86%",
                    padding: "12px 14px",
                    borderRadius: 14,
                    fontSize: 14,
                    lineHeight: 1.5,
                    fontFamily: "DM Sans, sans-serif",
                    alignSelf: msg.role === "bot" ? "flex-start" : "flex-end",
                    ...(msg.role === "bot"
                      ? {
                          color: "#D8DFEA",
                          background: "rgba(255,255,255,0.055)",
                          border: "1px solid rgba(255,255,255,0.07)",
                          borderBottomLeftRadius: 5,
                        }
                      : {
                          color: "#080B10",
                          background: "#4585fc",
                          fontWeight: 600,
                          borderBottomRightRadius: 5,
                        }),
                  }}
                >
                  {msg.text.includes("https://wa.me") ? (
                    <>
                      {msg.text.split("https://wa.me")[0]}
                      <a
                        href={"https://wa.me" + msg.text.split("https://wa.me")[1].split(" ")[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#4585fc", textDecoration: "underline" }}
                      >
                        clique aqui
                      </a>
                    </>
                  ) : (
                    msg.text
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick actions */}
            <div style={{ padding: "0 18px 14px", display: "flex", gap: 8, overflowX: "auto" }}>
              {["Como funciona o processo?", "Quanto tempo demora?", "Quais serviços vocês fazem?", "Quero falar no WhatsApp"].map((q) => (
                <button
                  key={q}
                  onClick={() => sendChatMessage(q)}
                  style={{
                    flexShrink: 0,
                    color: "#E8ECF2",
                    background: "rgba(69,133,252,0.08)",
                    border: "1px solid rgba(69,133,252,0.18)",
                    borderRadius: 999,
                    padding: "8px 12px",
                    fontSize: 12,
                    cursor: "pointer",
                    fontFamily: "DM Sans, sans-serif",
                    transition: "background 0.2s, border-color 0.2s",
                    whiteSpace: "nowrap",
                  }}
                >
                  {q.split("?")[0].split(" ").slice(0, 2).join(" ")}
                </button>
              ))}
            </div>

            {/* Input */}
            <form
              onSubmit={handleChatSubmit}
              style={{
                padding: 14, display: "flex", gap: 9,
                borderTop: "1px solid rgba(255,255,255,0.07)",
                background: "rgba(8,11,16,0.72)",
              }}
            >
              <input
                type="text"
                placeholder="Digite sua dúvida..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                style={{
                  flex: 1, minWidth: 0, height: 44,
                  color: "#E8ECF2",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12, padding: "0 13px",
                  outline: "none", fontSize: 14,
                  fontFamily: "DM Sans, sans-serif",
                }}
                autoComplete="off"
              />
              <button
                type="submit"
                style={{
                  width: 44, height: 44, borderRadius: 12,
                  color: "#080B10", background: "#4585fc",
                  border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.2s, transform 0.2s",
                  flexShrink: 0,
                }}
                aria-label="Enviar mensagem"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        )}

        {/* Toggle button */}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          style={{
            width: 62, height: 62, borderRadius: 18,
            color: "#080B10", background: "#4585fc",
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 16px 45px rgba(69,133,252,0.35)",
            position: "relative",
            transition: "background 0.2s, transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 20px 55px rgba(69,133,252,0.45)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 16px 45px rgba(69,133,252,0.35)";
          }}
          aria-label={chatOpen ? "Fechar assistente" : "Abrir assistente virtual"}
        >
          {/* Online indicator */}
          <span
            style={{
              position: "absolute", top: 9, right: 9,
              width: 10, height: 10, borderRadius: "50%",
              background: "#22c55e", border: "2px solid #4585fc",
            }}
          />
          {chatOpen ? <X size={26} /> : <MessageCircle size={26} />}
        </button>

        {/* Bubble label */}
        {!chatOpen && (
          <div
            style={{
              position: "absolute",
              right: 72, bottom: 12,
              whiteSpace: "nowrap",
              color: "#E8ECF2",
              background: "rgba(13,17,26,0.96)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 999,
              padding: "9px 13px",
              fontSize: 13,
              boxShadow: "0 12px 35px rgba(0,0,0,0.32)",
              pointerEvents: "none",
              fontFamily: "DM Sans, sans-serif",
              animation: "msgIn 0.4s 1.5s both",
            }}
          >
            Tire suas dúvidas aqui
          </div>
        )}
      </div>

    </div>
  );
}
