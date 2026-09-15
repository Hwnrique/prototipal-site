import { useEffect, useId, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ChevronDown,
  Search,
  Menu,
  X,
  ShieldCheck,
  HeartHandshake,
  ScanLine,
  MoveUpRight,
  Mail,
  MapPin,
  MessageCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  Activity,
  Instagram,
  Facebook,
  Linkedin,
  Pause,
  Play,
} from "lucide-react";
import { articles, categories, products, type Product } from "./data";
import shalomLogo from "./public/img/logo.png";

// Uma fotografia por banner. Troque estas URLs pelas imagens oficiais desejadas.
const heroImages = [
  'https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=2000&q=90',
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=2000&q=90',
  'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=2000&q=90',
];
const SLIDE_INTERVAL = 5000;
// Centralize o endereço para atualizar o mapa e as rotas ao mesmo tempo.
const companyAddress = 'Alameda Salvador, 1057 - Caminho das Árvores, Salvador - BA, 41820-790';
const mapsQuery = encodeURIComponent(companyAddress);
// Preencha com os perfis oficiais. Sem URL, o botão indica que o link está pendente.
const socialLinks = [
  { name: 'Instagram', icon: Instagram, url: '' },
  { name: 'Facebook', icon: Facebook, url: '' },
  { name: 'LinkedIn', icon: Linkedin, url: '' },
];

function Logo() {
  return (
    <a href="#inicio" className="logo" aria-label="Shalom Med — início">
      {/* O Vite inclui a imagem importada no build. */}
      <img className="logo-image" src={shalomLogo} alt="Shalom Med" width={427} height={124} />
    </a>
  );
}

// Ilustrações vetoriais próprias: substitua por fotos reais de produtos quando disponíveis.
function ProductArt({ kind }: { kind: string }) {
  const gradientId = useId();
  const color = kind === "enteral" ? "#8055ab" : "var(--green)";
  return (
    <svg
      viewBox="0 0 320 230"
      className={`product-art ${kind}`}
      role="img"
      aria-label="Ilustração conceitual do produto"
    >
      <defs>
        <linearGradient id={gradientId}>
          <stop stopColor="#fff" />
          <stop offset=".5" stopColor="#dae5e6" />
          <stop offset="1" stopColor="#fff" />
        </linearGradient>
      </defs>
      {kind === "connector" || kind === "catheter" ? (
        <g transform="rotate(-32 160 115)">
          <rect
            x="70"
            y="99"
            width="165"
            height="33"
            rx="12"
            fill={`url(#${gradientId})`}
            stroke="#aec5c9"
          />
          <rect
            x="130"
            y="88"
            width="58"
            height="55"
            rx="7"
            fill={color}
            opacity=".8"
          />
          <path
            d="M148 88V64Q160 52 172 64V88M148 143V165Q160 178 172 165V143"
            fill={color}
          />
          <rect x="222" y="102" width="28" height="27" rx="4" fill="#93cdd0" />
          <path d="M50 115H72M250 115H278" stroke="#9baeb6" strokeWidth="4" />
        </g>
      ) : (
        <g>
          <path
            d="M159 83V115C159 137 243 99 250 148C263 215 63 215 72 152C77 112 223 113 224 158C224 193 100 194 104 159C107 133 193 137 193 159"
            fill="none"
            stroke="#c0d2d4"
            strokeWidth="6"
          />
          <path
            d="M159 83V115C159 137 243 99 250 148C263 215 63 215 72 152C77 112 223 113 224 158C224 193 100 194 104 159C107 133 193 137 193 159"
            fill="none"
            stroke="#fdfefe"
            strokeWidth="3"
          />
          <rect
            x="143"
            y="40"
            width="32"
            height="56"
            rx="9"
            fill={`url(#${gradientId})`}
            stroke="#b1cace"
          />
          <rect x="145" y="29" width="28" height="14" rx="3" fill={color} />
          <path d="M159 29V10" stroke="#aebfc4" strokeWidth="5" />
          <rect x="226" y="135" width="29" height="36" rx="5" fill={color} />
          <rect x="184" y="149" width="18" height="35" rx="3" fill={color} />
        </g>
      )}
    </svg>
  );
}

type Dialog =
  | { type: "contact"; title: string }
  | { type: "product"; product: Product }
  | { type: "article"; index: number }
  | { type: "privacy" }
  | null;

export default function App() {
  const [menu, setMenu] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [category, setCategory] = useState(categories[0]);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [slide, setSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [dragging, setDragging] = useState(false);
  const gesture = useRef<{ x: number; y: number; id: number } | null>(null);
  const suppressClick = useRef(false);

  // Reinicia a contagem após cada troca manual e limpa o timer ao desmontar.
  useEffect(() => {
    if (!autoplay || dragging) return;
    const timer = window.setTimeout(() => {
      setSlide(current => (current + 1) % heroImages.length);
    }, SLIDE_INTERVAL);
    return () => window.clearTimeout(timer);
  }, [slide, autoplay, dragging]);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [submitted, setSubmitted] = useState(false);
  const modal = useRef<HTMLDialogElement>(null);
  const nav = useRef<HTMLElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  // O elemento dialog gerencia o foco e bloqueia a interação com o fundo.
  useEffect(() => {
    if (dialog) {
      lastFocus.current = document.activeElement as HTMLElement;
      modal.current?.showModal();
      document.body.style.overflow = "hidden";
    } else {
      modal.current?.close();
      document.body.style.overflow = "";
      lastFocus.current?.focus();
      setSubmitted(false);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [dialog]);
  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!nav.current?.contains(event.target as Node)) setDropdown(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);
  const contact = (title = "Vamos conversar?") => {
    setMenu(false);
    setDialog({ type: "contact", title });
  };
  const filter = (value: string) => {
    setCategory(value);
    setExpanded(true);
    setDropdown(false);
    setMenu(false);
    document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth" });
  };
  const normalize = (value: string) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  const filtered = products.filter(
    (p) =>
      (category === categories[0] || p.category === category) &&
      normalize(`${p.name} ${p.category}`).includes(normalize(query)),
  );
  const headlines = [
    <>
      Cuidado em cada
      <br />
      <em>conexão.</em>
    </>,
    <>
      Mais perto de quem
      <br />
      <em>cuida.</em>
    </>,
    <>
      Soluções para um
      <br />
      <em>novo amanhã.</em>
    </>,
  ];
  return (
    <>
      <div className="topbar">
        <div className="container">
          <span>Conectando qualidade, confiança e cuidado.</span>
          <div>
            <button onClick={() => contact("Atendimento Shalom Med")}>
              <Mail size={13} /> Fale com a Shalom
            </button>
            <span className="top-divider" />
            <span>Brasil · PT</span>
          </div>
        </div>
      </div>
      <header
        ref={nav}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setDropdown(false);
            setMenu(false);
            setSearchOpen(false);
          }
        }}
      >
        <div className="container navbar">
          <Logo />
          <button
            className="mobile-toggle icon-button"
            aria-label={menu ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
          <nav
            className={menu ? "navigation open" : "navigation"}
            aria-label="Navegação principal"
          >
            <a href="#inicio" onClick={() => setMenu(false)}>
              Início
            </a>
            <a href="#sobre" onClick={() => setMenu(false)}>
              Sobre nós
            </a>
            <div className="dropdown">
              <button
                className={dropdown ? "nav-products active" : "nav-products"}
                onClick={() => setDropdown(!dropdown)}
                aria-expanded={dropdown}
                aria-controls="product-menu"
              >
                Produtos <ChevronDown size={14} />
              </button>
              {dropdown && (
                <div className="mega-menu" id="product-menu">
                  <div className="mega-intro">
                    <span className="eyebrow">NOSSO PORTFÓLIO</span>
                    <h3>
                      Uma conexão para
                      <br />
                      cada cuidado.
                    </h3>
                    <p>Explore nossas linhas de produtos.</p>
                  </div>
                  <div className="mega-links">
                    {categories.map((c) => (
                      <button key={c} onClick={() => filter(c)}>
                        {c}
                        <ArrowUpRight size={15} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button onClick={() => contact("Encontre um representante")}>
              Representantes
            </button>
            <button onClick={() => contact("Seja um parceiro B2B")}>
              Parceiros
            </button>
            <a href="#blog" onClick={() => setMenu(false)}>
              Blog
            </a>
            <button onClick={() => contact("Como podemos ajudar? — SAC")}>
              SAC
            </button>
          </nav>
          <div className="nav-actions">
            <button
              className="icon-button"
              aria-label="Pesquisar produtos"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search size={20} />
            </button>
            <button className="button small" onClick={() => contact()}>
              Fale conosco <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
        {searchOpen && (
          <form
            className="search-bar container"
            onSubmit={(e) => {
              e.preventDefault();
              filter(categories[0]);
            }}
          >
            <Search size={20} />
            <input
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setExpanded(true);
              }}
              placeholder="Qual produto você procura?"
              aria-label="Pesquisar catálogo"
            />
            <button className="text-button" type="submit">
              Buscar <ArrowRight size={17} />
            </button>
            <button
              type="button"
              className="icon-button"
              aria-label="Fechar busca"
              onClick={() => setSearchOpen(false)}
            >
              <X size={19} />
            </button>
          </form>
        )}
      </header>
      <main>
        <section id="inicio" className="hero" aria-label="Destaques Shalom Med"
          aria-roledescription="carrossel"
          onPointerDown={event => {
            if (!event.isPrimary || event.button !== 0) return;
            suppressClick.current = false;
            // Links e controles continuam respondendo ao clique normalmente.
            if ((event.target as HTMLElement).closest('a, button')) return;
            gesture.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
            event.currentTarget.setPointerCapture(event.pointerId);
            setDragging(true);
          }}
          onPointerUp={event => {
            const start = gesture.current;
            if (!start || start.id !== event.pointerId) return;
            const dx = event.clientX - start.x;
            const dy = event.clientY - start.y;
            // Um gesto horizontal de 50px evita trocas por toques acidentais.
            if (Math.abs(dx) >= 50 && Math.abs(dx) > Math.abs(dy) * 1.2) {
              setSlide(current => (current + (dx < 0 ? 1 : -1) + heroImages.length) % heroImages.length);
              suppressClick.current = true;
            }
            gesture.current = null;
            setDragging(false);
            event.currentTarget.releasePointerCapture(event.pointerId);
          }}
          onPointerCancel={() => { gesture.current = null; setDragging(false); }}
          onLostPointerCapture={() => { gesture.current = null; setDragging(false); }}
          onClickCapture={event => {
            if (suppressClick.current) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false; }
          }}
        >
          {heroImages.map((image, index) => <div key={image}
            className={`hero-photo hero-slide-photo${slide === index ? ' is-active' : ''}`}
            style={{ backgroundImage: `url("${image}")` }} aria-hidden="true" />)}
          <div className="hero-shade" />
          <div className="container hero-content">
            <span className="eyebrow">
              <span className="status-dot" /> JUNTOS, PELA VIDA
            </span>
            <h1>{headlines[slide]}</h1>
            <p>
              Produtos médico-hospitalares que conectam
              <br className="desktop-break" /> a qualidade que você busca ao
              cuidado que importa.
            </p>
            <div className="hero-buttons">
              <a className="button" href="#produtos">
                Explore nossos produtos <ArrowUpRight size={18} />
              </a>
              <a className="hero-secondary" href="#sobre">
                Conheça a Shalom Med <ArrowRight size={17} />
              </a>
            </div>
            <div className="hero-pagination">
              <span>0{slide + 1}</span>
              <div className="slide-lines">
                {headlines.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Exibir banner ${i + 1}`}
                    aria-pressed={slide === i}
                    className={slide === i ? "selected" : ""}
                    onClick={() => setSlide(i)}
                  />
                ))}
              </div>
              <span className="muted">03</span>
              <button className="autoplay-toggle" onClick={() => setAutoplay(current => !current)}
                aria-label={autoplay ? 'Pausar troca automática dos slides' : 'Retomar troca automática dos slides'}>
                {autoplay ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
                <span className="autoplay-label">{autoplay ? 'Pausar' : 'Reproduzir'}</span>
              </button>
            </div>
          </div>
          <div className="hero-caption">
            <span className="caption-icon">
              <HeartHandshake size={24} />
            </span>
            <div>
              Nosso propósito é simples.
              <br />
              <strong>Cuidar de quem cuida.</strong>
            </div>
          </div>
          <span className="hero-side">SHALOM MED · CONEXÕES QUE CUIDAM</span>
        </section>
        <section className="values">
          <div className="container values-inner">
            {[
              {
                icon: ShieldCheck,
                name: "Qualidade em primeiro lugar",
                text: "Atenção aos detalhes, em cada solução.",
              },
              {
                icon: HeartHandshake,
                name: "Compromisso com o cuidado",
                text: "Pessoas no centro de tudo o que fazemos.",
              },
              {
                icon: ScanLine,
                name: "Confiança em cada etapa",
                text: "Proximidade do primeiro contato em diante.",
              },
            ].map((v) => (
              <div className="value" key={v.name}>
                <v.icon size={29} strokeWidth={1.4} />
                <div>
                  <h3>{v.name}</h3>
                  <p>{v.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section id="produtos" className="section products-section">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="eyebrow">SOLUÇÕES QUE FAZEM A DIFERENÇA</span>
                <h2>
                  Feitos para cuidar.
                  <br />
                  <span>Pensados para conectar.</span>
                </h2>
              </div>
              <div className="heading-aside">
                <p>
                  Conheça as linhas que fazem parte
                  <br />
                  do nosso universo de cuidado.
                </p>
                <button
                  className="text-button"
                  onClick={() => {
                    setExpanded(!expanded);
                    setCategory(categories[0]);
                    setQuery("");
                  }}
                >
                  {expanded ? "Ver destaques" : "Ver todos os produtos"}{" "}
                  <ArrowUpRight size={19} />
                </button>
              </div>
            </div>
            <div className="filters" aria-label="Categorias de produtos">
              {categories.slice(0, expanded ? undefined : 5).map((c) => (
                <button
                  key={c}
                  className={category === c ? "selected" : ""}
                  aria-pressed={category === c}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>
            {query && (
              <p className="search-summary">
                Resultados para “{query}”{" "}
                <button onClick={() => setQuery("")}>Limpar busca</button>
              </p>
            )}
            <div className="product-grid">
              {filtered.slice(0, expanded ? undefined : 4).map((p) => (
                <button
                  className="product-card"
                  key={p.id}
                  onClick={() => setDialog({ type: "product", product: p })}
                >
                  <div className="product-image">
                    <span className="product-tag">{p.tag}</span>
                    <ProductArt kind={p.kind} />
                    <span className="image-label">ILUSTRAÇÃO</span>
                  </div>
                  <div className="product-info">
                    <span>{p.category}</span>
                    <h3>{p.name}</h3>
                    <div>
                      Conhecer produto <ArrowUpRight size={18} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {!filtered.length && (
              <div className="empty">
                <Search />
                <h3>Nenhum produto encontrado</h3>
                <p>Tente outro termo ou explore todas as categorias.</p>
                <button
                  className="button"
                  onClick={() => {
                    setQuery("");
                    setCategory(categories[0]);
                  }}
                >
                  Limpar filtros
                </button>
              </div>
            )}
            <div className="catalog-note">
              <span>
                <span className="status-dot" /> A solução certa começa com uma
                boa conversa.
              </span>
              <button
                className="text-button"
                onClick={() =>
                  contact("Encontre a solução para sua instituição")
                }
              >
                Fale com nossa equipe <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>
        <section id="sobre" className="about section">
          <div className="container about-grid">
            <div className="about-visual">
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1000&q=85"
                alt="Profissionais de saúde conversando no ambiente de trabalho"
                loading="lazy"
              />
              <div className="about-badge">
                <Activity size={34} />
                <span>
                  O que nos move
                  <br />
                  <strong>é a vida.</strong>
                </span>
              </div>
              <span className="photo-note">Imagem ilustrativa</span>
            </div>
            <div className="about-content">
              <span className="eyebrow">ESSA É A NOSSA ESSÊNCIA</span>
              <h2>
                Por trás de cada produto,
                <br />
                um propósito <em>maior.</em>
              </h2>
              <p>
                Acreditamos que cuidar vai além. É estar perto, entender cada
                necessidade e construir conexões que fazem a diferença na vida
                das pessoas.
              </p>
              <p>
                A Shalom Med nasce dessa inspiração: aproximar soluções
                médico-hospitalares de quem dedica seus dias ao cuidado com o
                próximo.
              </p>
              <div className="about-points">
                <span>
                  <Check size={16} /> Pessoas em primeiro lugar
                </span>
                <span>
                  <Check size={16} /> Relações de confiança
                </span>
                <span>
                  <Check size={16} /> Atenção a cada detalhe
                </span>
                <span>
                  <Check size={16} /> Compromisso com o futuro
                </span>
              </div>
              <button
                className="button navy"
                onClick={() => contact("Conheça melhor a Shalom Med")}
              >
                Vamos nos conhecer <ArrowUpRight size={18} />
              </button>
            </div>
          </div>
        </section>
        <section className="partner">
          <div className="container partner-inner">
            <div className="partner-icon">
              <HeartHandshake size={45} strokeWidth={1.2} />
            </div>
            <div>
              <span className="eyebrow">CRESCER É MELHOR QUANDO É JUNTOS</span>
              <h2>Boas parcerias. Novas possibilidades.</h2>
              <p>
                Faça parte da nossa rede e leve mais cuidado a cada destino.
              </p>
            </div>
            <button
              className="button"
              onClick={() => contact("Seja um parceiro B2B")}
            >
              Seja um parceiro <ArrowUpRight size={18} />
            </button>
          </div>
        </section>
        <section id="blog" className="section blog">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="eyebrow">CONHECIMENTO QUE APROXIMA</span>
                <h2>Por dentro do cuidado.</h2>
              </div>
              <span className="blog-subtitle">
                Perspectivas, conexões e novidades.
              </span>
            </div>
            <div className="blog-grid">
              {articles.map((a, i) => (
                <button
                  className="article-card"
                  key={a.title}
                  onClick={() => setDialog({ type: "article", index: i })}
                >
                  <div className="article-image">
                    <img
                      src={`https://images.unsplash.com/${a.image}?auto=format&fit=crop&w=700&q=80`}
                      alt={
                        [
                          "Profissional de saúde em atendimento",
                          "Profissional de saúde em ambiente clínico",
                          "Ambiente de atendimento hospitalar",
                        ][i]
                      }
                      loading="lazy"
                    />
                    <span>
                      <ArrowUpRight size={22} />
                    </span>
                  </div>
                  <div className="article-meta">
                    {a.category}
                    <span>EDITORIAL</span>
                  </div>
                  <h3>{a.title}</h3>
                  <span className="article-link">
                    Continuar leitura <ArrowRight size={16} />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
        <section id="localizacao" className="section location" aria-labelledby="location-title">
          <div className="container location-grid">
            <div className="location-content">
              <span className="eyebrow">PERTO DE VOCÊ</span>
              <h2 id="location-title">Encontre a <em>Shalom Med.</em></h2>
              <p>Estamos em Salvador, no bairro Caminho das Árvores.</p>
              <div className="location-address">
                <MapPin size={26} aria-hidden="true" />
                <address>{companyAddress}</address>
              </div>
              <a className="button navy"
                href={`https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`}
                target="_blank" rel="noopener noreferrer">
                Como chegar <ArrowUpRight size={18} aria-hidden="true" />
                <span className="sr-only"> (abre o Google Maps em uma nova aba)</span>
              </a>
            </div>
            {/* O mapa usa o endereço informado e carrega apenas perto da área visível. */}
            <iframe className="location-map"
              title="Localização da Shalom Med — Alameda Salvador, 1057, Salvador"
              src={`https://maps.google.com/maps?q=${mapsQuery}&z=16&output=embed`}
              loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
          </div>
        </section>
        <section id="contato" className="contact-banner">
          <div className="container">
            <div>
              <span className="eyebrow">ESTAMOS AQUI PARA VOCÊ</span>
              <h2>
                Como podemos <em>ajudar?</em>
              </h2>
              <p>Conte com a gente para encontrar o próximo passo.</p>
            </div>
            <button className="button navy" onClick={() => contact()}>
              Converse com a nossa equipe <ArrowUpRight size={19} />
            </button>
          </div>
        </section>
      </main>
      <footer>
        <div className="container footer-grid">
          <div className="footer-brand">
            <Logo />
            <p>
              Conectando soluções.
              <br />
              Aproximando pessoas.
              <br />
              Cuidando da vida.
            </p>
            <div className="footer-socials" aria-label="Redes sociais">
              {socialLinks.map(({ name, icon: Icon, url }) => url ? (
                <a key={name} href={url} target="_blank" rel="noopener noreferrer"
                  aria-label={`${name} da Shalom Med (abre em nova aba)`} title={name}>
                  <Icon size={20} aria-hidden="true" />
                </a>
              ) : (
                <button key={name} type="button" disabled
                  aria-label={`${name}: perfil ainda não informado`} title={`${name}: perfil ainda não informado`}>
                  <Icon size={20} aria-hidden="true" />
                </button>
              ))}
            </div>
            {socialLinks.every(social => !social.url) && <small className="social-pending">Perfis sociais em breve.</small>}
          </div>
          <div>
            <h3>Explore</h3>
            <a href="#inicio">Início</a>
            <a href="#sobre">Sobre nós</a>
            <a href="#produtos">Nossos produtos</a>
            <a href="#blog">Blog</a>
            <a href="#localizacao">Localização</a>
          </div>
          <div>
            <h3>Vamos nos conectar</h3>
            <button onClick={() => contact("Encontre um representante")}>
              Representantes
            </button>
            <button onClick={() => contact("Seja um parceiro B2B")}>
              Seja um parceiro B2B
            </button>
            <button onClick={() => contact("Atendimento — SAC")}>SAC</button>
            <button onClick={() => setDialog({ type: "privacy" })}>
              Privacidade
            </button>
          </div>
          <div className="footer-contact">
            <h3>Fale com a Shalom</h3>
            <button onClick={() => contact()}>
              <Mail size={16} /> Entre em contato <ArrowUpRight size={14} />
            </button>
            <a href="#localizacao"><MapPin size={16} /> Salvador, BA — veja a localização</a>
            <p>
              Um novo olhar para o cuidado.
              <br />
              Uma conexão de cada vez.
            </p>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>
            © {new Date().getFullYear()} Shalom Med. Todos os direitos
            reservados.
          </span>
          <span>Protótipo demonstrativo · Conteúdo ilustrativo</span>
        </div>
      </footer>
      <button
        className="floating-contact"
        onClick={() => contact()}
        aria-label="Abrir atendimento"
      >
        <MessageCircle size={25} />
      </button>
      <dialog
        ref={modal}
        onCancel={() => setDialog(null)}
        onClick={(e) => {
          if (e.target === modal.current) setDialog(null);
        }}
        aria-labelledby="dialog-title"
      >
        <button
          className="modal-close icon-button"
          aria-label="Fechar janela"
          onClick={() => setDialog(null)}
        >
          <X />
        </button>
        {dialog?.type === "product" && (
          <div className="product-detail">
            <div className="detail-art">
              <ProductArt kind={dialog.product.kind} />
            </div>
            <span className="eyebrow">{dialog.product.category}</span>
            <h2 id="dialog-title">{dialog.product.name}</h2>
            <p>{dialog.product.description}</p>
            <div className="demo-note">
              Produto ilustrativo do protótipo. Modelos, especificações,
              registros e disponibilidade deverão ser preenchidos com os dados
              oficiais.
            </div>
            <button
              className="button"
              onClick={() => contact(`Tenho interesse: ${dialog.product.name}`)}
            >
              Solicitar informações <ArrowUpRight size={18} />
            </button>
          </div>
        )}
        {dialog?.type === "article" && (
          <article className="article-detail">
            <span className="eyebrow">{articles[dialog.index].category}</span>
            <h2 id="dialog-title">{articles[dialog.index].title}</h2>
            <img
              src={`https://images.unsplash.com/${articles[dialog.index].image}?auto=format&fit=crop&w=800&q=80`}
              alt="Imagem editorial ilustrativa"
            />
            <p>{articles[dialog.index].text}</p>
            <small>Conteúdo demonstrativo para apresentação do layout.</small>
            <div className="article-navigation">
              <button
                className="text-button"
                onClick={() =>
                  setDialog({ type: "article", index: (dialog.index + 2) % 3 })
                }
              >
                <ChevronLeft size={16} /> Anterior
              </button>
              <button
                className="text-button"
                onClick={() =>
                  setDialog({ type: "article", index: (dialog.index + 1) % 3 })
                }
              >
                Próximo <ChevronRight size={16} />
              </button>
            </div>
          </article>
        )}
        {dialog?.type === "privacy" && (
          <>
            <span className="eyebrow">SOBRE ESTE PROTÓTIPO</span>
            <h2 id="dialog-title">Privacidade</h2>
            <p>
              Este site é uma demonstração front-end. Os formulários não enviam
              nem armazenam suas informações. Não há cookies de análise
              implementados.
            </p>
            <p>
              As imagens e fontes externas são carregadas do Unsplash e Google
              Fonts. O mapa é carregado do Google Maps. Esses serviços recebem
              os dados técnicos da requisição. Antes da
              publicação, substitua este texto pela política oficial da empresa
              e configure os serviços utilizados.
            </p>
          </>
        )}
        {dialog?.type === "contact" && (
          <>
            <span className="eyebrow">UMA BOA CONEXÃO COMEÇA AQUI</span>
            <h2 id="dialog-title">{dialog.title}</h2>
            {submitted ? (
              <div className="success" role="status">
                <span>
                  <Check size={30} />
                </span>
                <h3>Demonstração concluída!</h3>
                <p>
                  O formulário foi validado. Nenhum dado foi enviado ou
                  armazenado, pois este protótipo não possui backend.
                </p>
                <button className="button" onClick={() => setDialog(null)}>
                  Concluir <Check size={17} />
                </button>
              </div>
            ) : (
              <>
                <p>Preencha os campos e conheça a experiência de contato.</p>
                {/* A validação é nativa do navegador. Integre aqui um serviço de envio futuramente. */}
                <form
                  className="contact-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                >
                  <label>
                    Seu nome
                    <input
                      name="name"
                      required
                      placeholder="Como podemos chamar você?"
                      autoComplete="name"
                    />
                  </label>
                  <label>
                    E-mail
                    <input
                      name="email"
                      required
                      type="email"
                      placeholder="voce@empresa.com.br"
                      autoComplete="email"
                    />
                  </label>
                  <div className="form-row">
                    <label>
                      Instituição
                      <input
                        name="company"
                        placeholder="Nome da empresa"
                        autoComplete="organization"
                      />
                    </label>
                    <label>
                      Estado
                      <select name="state" required defaultValue="">
                        <option value="" disabled>
                          Selecione
                        </option>
                        {[
                          "AC",
                          "AL",
                          "AP",
                          "AM",
                          "BA",
                          "CE",
                          "DF",
                          "ES",
                          "GO",
                          "MA",
                          "MT",
                          "MS",
                          "MG",
                          "PA",
                          "PB",
                          "PR",
                          "PE",
                          "PI",
                          "RJ",
                          "RN",
                          "RS",
                          "RO",
                          "RR",
                          "SC",
                          "SP",
                          "SE",
                          "TO",
                        ].map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <label>
                    Como podemos ajudar?
                    <textarea
                      name="message"
                      required
                      rows={3}
                      placeholder="Conte um pouco sobre o que você procura."
                    />
                  </label>
                  <p className="form-disclaimer">
                    Ambiente de demonstração. Não há envio de dados.
                  </p>
                  <button className="button" type="submit">
                    Simular envio <MoveUpRight size={18} />
                  </button>
                </form>
              </>
            )}
          </>
        )}
      </dialog>
    </>
  );
}
