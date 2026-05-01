/* ============================================
   MUSIC GENRES WEB - main.js
   Autor: Proyecto Universitario
   ============================================ */

// ── Variables globales ──────────────────────
const LASTFM_API_KEY = "2b0f7e0a7e3b8c1d4f6a9e2c5d8b1e4a"; // Demo key – reemplaza con la tuya
const LASTFM_BASE    = "https://ws.audioscrobbler.com/2.0/";

// Géneros mapeados a tags de Last.fm
const GENRE_TAGS = {
  jazz:     "jazz",
  rock:     "rock",
  "indie-pop": "indie pop",
  rnb:      "r&b",
  salsa:    "salsa",
  flamenco: "flamenco",
};

// Artistas destacados por página (contenido estático enriquecido)
const GENRE_DATA = {
  jazz: {
    color: "#F5A623",
    gradient: "linear-gradient(135deg, #1a0a00 0%, #3d1f00 50%, #1a0a00 100%)",
    accent: "#F5A623",
    icon: "🎷",
    description: "El jazz nació a principios del siglo XX en Nueva Orleans, fusionando blues, ragtime y música africana. Es un género caracterizado por la improvisación, el ritmo sincopado y la expresión emocional.",
    canciones: [
      { titulo: "Strangers in the Night", artista: "Frank Sinatra" },
      { titulo: "So What", artista: "Miles Davis" },
      { titulo: "What a Wonderful World", artista: "Louis Armstrong" },
      { titulo: "My Favorite Things", artista: "John Coltrane" },
      { titulo: "Deep in It", artista: "Berlioz" },
      { titulo: "Georgia in My Mind", artista: "Ray Charles" },
    ],
    destacados: [
      { rol: "Trompetista", nombre: "Miles Davis" },
      { rol: "Pianista",    nombre: "Herbie Hancock" },
      { rol: "Saxofón",     nombre: "Wayne Shorter" },
      { rol: "Contrabajo",  nombre: "Ron Carter" },
      { rol: "Batería",     nombre: "Tony Williams" },
    ],
  },
  rock: {
    color: "#E63946",
    gradient: "linear-gradient(135deg, #0d0000 0%, #2d0a0a 50%, #0d0000 100%)",
    accent: "#E63946",
    icon: "🎸",
    description: "El rock surgió en los años 50 en Estados Unidos, evolucionando del rhythm and blues y el country. Con su guitarra eléctrica característica, el rock ha dado lugar a incontables subgéneros que han marcado la cultura popular.",
    canciones: [
      { titulo: "Sultans of Swing", artista: "Dire Straits" },
      { titulo: "Stairway to Heaven", artista: "Led Zeppelin" },
      { titulo: "Smells Like Teen Spirit", artista: "Nirvana" },
      { titulo: "Jailhouse Rock", artista: "Elvis Presley" },
      { titulo: "Sweet Child O' Mine", artista: "Guns N' Roses" },
      { titulo: "Highway to Hell", artista: "AC/DC" },
    ],
    destacados: [
      { rol: "Mejor Voz",     nombre: "Johnny Cash, Elvis Presley, Axl Rose, Chester Bennington, Bryan Adams" },
      { rol: "Mejor Guitarra", nombre: "Eddie Van Halen, Mark Knopfler, Jimi Hendrix, Eric Clapton, Jimmy Page" },
    ],
  },
  "indie-pop": {
    color: "#7B2FBE",
    gradient: "linear-gradient(135deg, #0a0014 0%, #1e0038 50%, #0a0014 100%)",
    accent: "#B57BEE",
    icon: "🎵",
    description: "El indie pop nació en los años 80 como alternativa al pop comercial, caracterizándose por su producción independiente, melodías pegadizas y letras introspectivas. Combina la accesibilidad del pop con la autenticidad del indie.",
    canciones: [
      { titulo: "Billie Jean", artista: "Michael Jackson" },
      { titulo: "Like a Prayer", artista: "Madonna" },
      { titulo: "Believer", artista: "Imagine Dragons" },
      { titulo: "Starboy", artista: "The Weeknd" },
      { titulo: "Oops!... I Did It Again", artista: "Britney Spears" },
      { titulo: "Diamonds", artista: "Rihanna" },
    ],
    destacados: [],
  },
  rnb: {
    color: "#00B4D8",
    gradient: "linear-gradient(135deg, #000a14 0%, #001e38 50%, #000a14 100%)",
    accent: "#00B4D8",
    icon: "🎤",
    description: "El Rhythm & Blues surgió en la comunidad afroamericana en los años 40. Fusiona jazz, gospel y blues, y es la base de gran parte de la música popular moderna. El hip-hop nació como una evolución urbana y expresiva del R&B.",
    canciones: [
      { titulo: "Shook Ones, Pt II", artista: "Mobb Deep" },
      { titulo: "Big Poppa", artista: "The Notorious B.I.G." },
      { titulo: "N.Y. State of Mind", artista: "Nas" },
      { titulo: "Lose Yourself", artista: "Eminem" },
      { titulo: "Money Trees", artista: "Kendrick Lamar" },
      { titulo: "Miseducation", artista: "Lauryn Hill" },
    ],
    destacados: [
      { rol: "Hip Hop – Gangsta",     nombre: "Tupac" },
      { rol: "Hip Hop – Comercial",   nombre: "Travis Scott" },
      { rol: "Hip Hop – Storytelling", nombre: "Kendrick Lamar" },
      { rol: "Máximo Exponente",       nombre: "Nas" },
      { rol: "MH",                     nombre: "Eminem, Jay-Z, Kanye West, J Cole, Lauryn Hill" },
    ],
  },
  salsa: {
    color: "#F4D03F",
    gradient: "linear-gradient(135deg, #140a00 0%, #3d2600 50%, #140a00 100%)",
    accent: "#F4D03F",
    icon: "💃",
    description: "La salsa nació en Nueva York en los años 60, fusionando ritmos caribeños como el son cubano, la guaracha y el mambo. Con su energía desbordante y sus ritmos contagiosos, la salsa se convirtió en el emblema de la música latina.",
    canciones: [
      { titulo: "El Gran Varón", artista: "Willie Colón" },
      { titulo: "Cali Pachanguero", artista: "Grupo Niche" },
      { titulo: "Pedro Navaja", artista: "Rubén Blades" },
      { titulo: "Llorarás", artista: "Oscar D'León" },
      { titulo: "Vivir Mi Vida", artista: "Marc Anthony" },
      { titulo: "La Murga", artista: "Willie Colón" },
    ],
    destacados: [
      { rol: "Rey de la Salsa",  nombre: "Celia Cruz" },
      { rol: "Mejor Pianista",   nombre: "Larry Harlow" },
      { rol: "Mejor Orquesta",   nombre: "Fania All Stars" },
      { rol: "Voz Legendaria",   nombre: "Héctor Lavoe" },
    ],
  },
  flamenco: {
    color: "#FF6B35",
    gradient: "linear-gradient(135deg, #140500 0%, #3d1000 50%, #140500 100%)",
    accent: "#FF6B35",
    icon: "💃",
    description: "El flamenco es un arte nacido en Andalucía, España, declarado Patrimonio Inmaterial de la Humanidad por la UNESCO en 2010. Fusiona cante, toque y baile en una expresión artística profunda, llena de duende y pasión.",
    canciones: [
      { titulo: "Entre Dos Aguas", artista: "Paco de Lucía" },
      { titulo: "Como el Agua", artista: "Camarón de la Isla" },
      { titulo: "Dame Veneno", artista: "Los Chunguitos" },
      { titulo: "Canastera", artista: "El Canelita" },
      { titulo: "El Alba", artista: "José Mercé" },
      { titulo: "Catalina", artista: "Rosalía" },
    ],
    destacados: [
      { rol: "Mejor Guitarrista", nombre: "Paco de Lucía" },
      { rol: "Mejor Grupo",       nombre: "Los Chichos" },
      { rol: "Mejor Vocalista",   nombre: "Camarón de la Isla" },
      { rol: "MH",                nombre: "Los Chunguitos, Omar Montes, Los Chichos" },
    ],
  },
};

// ── Utilidades ──────────────────────────────

/** Detecta la página actual por el <body data-page="..."> */
function getCurrentPage() {
  return document.body.dataset.page || "home";
}

/** Formatea texto con primera letra en mayúscula */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Crea un elemento HTML con clases y atributos opcionales */
function createElement(tag, classes = [], attrs = {}) {
  const el = document.createElement(tag);
  if (classes.length) el.classList.add(...classes);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
}

// ── Tema claro / oscuro ─────────────────────
function initThemeToggle() {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;

  const saved = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", saved);
  btn.textContent = saved === "dark" ? "☀️" : "🌙";

  btn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next    = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    btn.textContent = next === "dark" ? "☀️" : "🌙";
    btn.classList.add("spin");
    setTimeout(() => btn.classList.remove("spin"), 400);
  });
}

// ── Menú hamburguesa ────────────────────────
function initMobileMenu() {
  const toggle = document.getElementById("nav-toggle");
  const menu   = document.getElementById("nav-menu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    menu.classList.toggle("open");
    toggle.classList.toggle("active");
  });

  // Cierra al hacer clic en un enlace
  menu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      toggle.classList.remove("active");
    });
  });
}

// ── Scroll reveal (Intersection Observer) ───
function initScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  items.forEach((el) => observer.observe(el));
}

// ── Header sticky + hide on scroll ─────────
function initStickyHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  let lastY = window.scrollY;

  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 60);
    header.classList.toggle("hidden", y > lastY + 10 && y > 200);
    lastY = y;
  }, { passive: true });
}

// ── Active nav link ─────────────────────────
function setActiveNavLink() {
  const page  = getCurrentPage();
  const links = document.querySelectorAll(".nav-link");
  links.forEach(link => {
    const href = link.getAttribute("href") || "";
    const isActive =
      (page === "home" && (href === "index.html" || href === "./")) ||
      href.includes(page);
    link.classList.toggle("active", isActive);
  });
}

// ── Partículas de notas musicales ───────────
function initParticles() {
  const canvas = document.getElementById("particles-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const notes = ["♩", "♪", "♫", "♬", "𝄞"];
  let particles = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x     = Math.random() * canvas.width;
      this.y     = canvas.height + 20;
      this.note  = notes[Math.floor(Math.random() * notes.length)];
      this.size  = Math.random() * 18 + 10;
      this.speed = Math.random() * 0.6 + 0.2;
      this.drift = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = `hsl(${Math.random() * 360}, 70%, 70%)`;
    }
    update() {
      this.y -= this.speed;
      this.x += this.drift;
      if (this.y < -30) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle   = this.color;
      ctx.font        = `${this.size}px serif`;
      ctx.fillText(this.note, this.x, this.y);
      ctx.restore();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: 30 }, () => {
      const p = new Particle();
      p.y = Math.random() * canvas.height; // distribuir al inicio
      return p;
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", resize, { passive: true });
  init();
  animate();
}

// ── Last.fm API: top tracks de un género ────
async function fetchTopTracks(genre, limit = 6) {
  const tag = GENRE_TAGS[genre];
  if (!tag) return [];

  const url = `${LASTFM_BASE}?method=tag.gettoptracks&tag=${encodeURIComponent(tag)}&api_key=${LASTFM_API_KEY}&format=json&limit=${limit}`;

  try {
    const res  = await fetch(url);
    const data = await res.json();
    return data?.tracks?.track || [];
  } catch (err) {
    console.warn("Last.fm fetch error:", err);
    return [];
  }
}

// ── Renderiza canciones de la API o estáticas ─
async function renderTrackList(genre) {
  const container = document.getElementById("api-tracks");
  if (!container) return;

  container.innerHTML = `<div class="loading-spinner"><span></span></div>`;

  const tracks = await fetchTopTracks(genre);

  if (tracks.length === 0) {
    // Fallback: datos estáticos
    const data = GENRE_DATA[genre];
    if (!data) return;

    container.innerHTML = data.canciones
      .map(
        (c, i) => `
        <div class="track-card reveal" style="animation-delay:${i * 0.08}s">
          <span class="track-num">${String(i + 1).padStart(2, "0")}</span>
          <div class="track-info">
            <strong class="track-title">${c.titulo}</strong>
            <span class="track-artist">${c.artista}</span>
          </div>
          <span class="track-icon">🎵</span>
        </div>`
      )
      .join("");
  } else {
    container.innerHTML = tracks
      .map(
        (t, i) => `
        <div class="track-card reveal" style="animation-delay:${i * 0.08}s">
          <span class="track-num">${String(i + 1).padStart(2, "0")}</span>
          <div class="track-info">
            <strong class="track-title">${t.name}</strong>
            <span class="track-artist">${t.artist?.name || ""}</span>
          </div>
          <a href="${t.url}" target="_blank" rel="noopener" class="track-link" title="Ver en Last.fm">↗</a>
        </div>`
      )
      .join("");
  }

  initScrollReveal();
}

// ── Buscador de canciones (Last.fm search) ──
function initSearch() {
  const form  = document.getElementById("search-form");
  const input = document.getElementById("search-input");
  const res   = document.getElementById("search-results");
  if (!form || !input || !res) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return;

    res.innerHTML = `<div class="loading-spinner"><span></span></div>`;

    const url = `${LASTFM_BASE}?method=track.search&track=${encodeURIComponent(q)}&api_key=${LASTFM_API_KEY}&format=json&limit=8`;

    try {
      const data   = await fetch(url).then(r => r.json());
      const tracks = data?.results?.trackmatches?.track || [];

      if (!tracks.length) {
        res.innerHTML = `<p class="no-results">No se encontraron resultados para "<em>${q}</em>".</p>`;
        return;
      }

      res.innerHTML = tracks
        .map(
          t => `
          <div class="search-card">
            <div class="search-info">
              <strong>${t.name}</strong>
              <span>${t.artist}</span>
            </div>
            <a href="${t.url}" target="_blank" rel="noopener" class="btn-sm">Ver ↗</a>
          </div>`
        )
        .join("");
    } catch {
      res.innerHTML = `<p class="no-results">Error al conectar con la API. Inténtalo más tarde.</p>`;
    }
  });
}

// ── Renderiza artistas destacados ───────────
function renderHighlights(genre) {
  const container = document.getElementById("highlights");
  if (!container) return;

  const data = GENRE_DATA[genre];
  if (!data?.destacados?.length) return;

  container.innerHTML = data.destacados
    .map(
      (d, i) => `
      <div class="highlight-card reveal" style="animation-delay:${i * 0.1}s">
        <span class="highlight-role">${d.rol}</span>
        <strong class="highlight-name">${d.nombre}</strong>
      </div>`
    )
    .join("");
}

// ── GSAP – animación hero ────────────────────
function initHeroAnimation() {
  if (typeof gsap === "undefined") return;

  gsap.from(".hero-title", {
    duration: 1,
    y: -60,
    opacity: 0,
    ease: "power3.out",
  });
  gsap.from(".hero-subtitle", {
    duration: 1,
    y: 40,
    opacity: 0,
    delay: 0.3,
    ease: "power3.out",
  });
  gsap.from(".genre-card", {
    duration: 0.7,
    y: 50,
    opacity: 0,
    stagger: 0.1,
    delay: 0.6,
    ease: "back.out(1.3)",
  });
}

// ── Init page-specific logic ─────────────────
function initPage() {
  const page = getCurrentPage();

  if (page === "home") {
    initParticles();
    initHeroAnimation();
    initSearch();
  }

  if (GENRE_DATA[page]) {
    renderTrackList(page);
    renderHighlights(page);

    // Aplica color de acento dinámico
    const accent = GENRE_DATA[page].accent;
    document.documentElement.style.setProperty("--genre-accent", accent);
  }
}

// ── Bootstrap ────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initMobileMenu();
  initStickyHeader();
  setActiveNavLink();
  initScrollReveal();
  initPage();
});
