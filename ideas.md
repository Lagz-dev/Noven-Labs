# Noven Labs — Brainstorming de Design

## Proposta escolhida: Dark Premium Editorial

### Design Movement
**Neominimalismo Tecnológico** — Inspirado em interfaces de empresas como Linear, Vercel e Stripe. Espaço negativo como protagonista, tipografia editorial agressiva, e micro-detalhes que comunicam precisão técnica.

### Core Principles
1. **Contraste intencional**: Fundos quase-pretos com elementos de alto contraste em azul elétrico (#4585fc) e branco puro.
2. **Tipografia como hierarquia**: Syne em pesos extremos (800) para headlines, DM Sans leve para corpo — a diferença de peso cria ritmo visual.
3. **Espaçamento generoso**: Seções com padding vertical amplo, criando respiração e sensação de premium.
4. **Profundidade sutil**: Glassmorphism discreto em cards, gradientes radiais como luz ambiente, sem exagero.

### Color Philosophy
- Background: `#080B10` — quase preto, não totalmente, para evitar dureza excessiva
- Surface: `#0D111A` / `#131928` — camadas de profundidade
- Brand: `#4585fc` — azul elétrico, confiança + tecnologia
- Accent glow: `rgba(69,133,252,0.15)` — brilho ambiente nos cards
- Text: `#E8ECF2` (primário), `#8A96A8` (secundário/muted)
- Danger: `#EF4444` para elementos de contraste negativo

### Layout Paradigm
Layout assimétrico com âncora à esquerda no hero. Seções alternando entre grid 2-col e full-width. Cards com bordas finas e glassmorphism. Marquee horizontal como separador dinâmico.

### Signature Elements
1. **Grid pattern sutil** no hero — linhas finas com 2.5% de opacidade
2. **Glow radial** posicionado estrategicamente atrás de elementos-chave
3. **Tag pill** com borda azul translúcida como rótulo de seção

### Interaction Philosophy
Hover states com elevação sutil (`translateY(-3px)`) e mudança de borda para azul. Botões com efeito de brilho ao hover. FAQ com accordion suave. Chat flutuante com spring animation.

### Animation
- Reveal on scroll: `opacity 0→1` + `translateY(28px→0)` em 750ms
- Stagger: delays de 100ms entre elementos de um mesmo grupo
- Marquee: loop infinito 30s, pausa no hover
- Botão CTA: shimmer sweep no hover
- Cards: border-color transition 300ms

### Typography System
- Display/Headlines: **Syne 800** — agressivo, moderno, memorável
- Body: **DM Sans 400/500** — legível, neutro, profissional
- Tags/Labels: DM Sans 600, uppercase, letter-spacing 0.08em
- Scale: clamp() para fluid typography responsiva
