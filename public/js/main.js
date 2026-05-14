/* ================================================================
   SONIDO · main.js
   - Reveal con GSAP + ScrollTrigger
   - Marquee infinito (clonado)
   - Generador aleatorio (Axios + iTunes)
   - Año footer, año en navbar, etc.
   ================================================================ */

(function () {
  // ----- Init GSAP / ScrollTrigger -----
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("DOMContentLoaded", function () {
    initYear();
    initMarquee();
    renderGenreSections();
    initGenreScrollAnimations();
    initReveals();
    initHero();
    initGenerator();
    initChartHoverSound();
    initChartPlayer();
    initGlobalSingleAudio();
  });

  // ----- Solo un <audio> sonando a la vez en toda la página -----
  // Cubre: reproductor del chart, generador aleatorio y tarjetas de género.
  function initGlobalSingleAudio() {
    document.addEventListener("play", function (e) {
      const t = e.target;
      if (!(t instanceof HTMLAudioElement)) return;
      document.querySelectorAll("audio").forEach(function (a) {
        if (a !== t && !a.paused) a.pause();
      });
    }, true);
  }

  // ----- Mini reproductor inline para las filas del Billboard -----
  // Un único <audio> compartido. El botón vive integrado en la fila,
  // sin parecer un control nativo: solo un icono play/pause monocromo.
  function initChartPlayer() {
    const audio = document.createElement("audio");
    audio.preload = "none";
    audio.setAttribute("aria-hidden", "true");
    document.body.appendChild(audio);

    const cache = new Map(); // key -> previewUrl | null
    let activeBtn = null;

    function clearActive() {
      if (activeBtn) {
        activeBtn.classList.remove("is-playing", "is-loading");
        activeBtn = null;
      }
    }

    audio.addEventListener("play",  () => activeBtn && activeBtn.classList.add("is-playing"));
    audio.addEventListener("pause", () => activeBtn && activeBtn.classList.remove("is-playing"));
    audio.addEventListener("ended", () => clearActive());

    document.addEventListener("click", function (e) {
      const btn = e.target.closest(".chart-play");
      if (!btn) return;
      e.preventDefault();

      // Toggle si es la misma pista
      if (activeBtn === btn) {
        if (audio.paused) audio.play().catch(() => {});
        else audio.pause();
        return;
      }

      const key = btn.dataset.genre + "|" + btn.dataset.idx;
      if (cache.has(key)) {
        const url = cache.get(key);
        if (!url) { btn.classList.add("is-disabled"); btn.title = "Sin preview disponible"; return; }
        clearActive();
        activeBtn = btn;
        audio.src = url;
        audio.play().catch(() => {});
        return;
      }

      clearActive();
      activeBtn = btn;
      btn.classList.add("is-loading");

      window.SonidoAPI.itunesLookupTrack(btn.dataset.artist, btn.dataset.title)
        .then((t) => {
          btn.classList.remove("is-loading");
          const url = t && t.previewUrl;
          cache.set(key, url || null);
          if (!url) {
            btn.classList.add("is-disabled");
            btn.title = "Sin preview disponible";
            activeBtn = null;
            return;
          }
          audio.src = url;
          audio.play().catch(() => {});
        })
        .catch(() => {
          btn.classList.remove("is-loading");
          activeBtn = null;
        });
    });
  }

  // ----- Tic sonoro al hacer hover sobre filas del Billboard -----
  // Usa Web Audio API para generar un blip corto (sin assets).
  // Una frecuencia distinta por género para reforzar la identidad sonora.
  function initChartHoverSound() {
    if (reduced) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    let ctx = null;
    let lastPlay = 0;
    const COOLDOWN_MS = 80;
    const FREQ_BY_GENRE = {
      hiphop: 110, jazz: 392, flamenco: 587, pop: 880, rock: 220
    };

    function ensureCtx() {
      if (!ctx) ctx = new AudioCtx();
      if (ctx.state === "suspended") ctx.resume();
      return ctx;
    }

    function blip(freq) {
      const now = performance.now();
      if (now - lastPlay < COOLDOWN_MS) return;
      lastPlay = now;
      const c = ensureCtx();
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, c.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.6, c.currentTime + 0.06);
      gain.gain.setValueAtTime(0.0001, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.18, c.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.18);
      osc.connect(gain).connect(c.destination);
      osc.start();
      osc.stop(c.currentTime + 0.2);
    }

    // Delegación: una sola escucha para todas las filas, incluso las renderizadas tarde.
    document.addEventListener("mouseover", function (e) {
      const row = e.target.closest(".chart-row");
      if (!row) return;
      const section = row.closest("[data-genre]");
      const id = section && section.dataset.genre;
      blip(FREQ_BY_GENRE[id] || 440);
    });
  }

  function initYear() {
    document.querySelectorAll("[data-year]").forEach((el) => {
      el.textContent = new Date().getFullYear();
    });
  }

  // Duplicar contenido de marquee para loop infinito
  function initMarquee() {
    document.querySelectorAll(".marquee").forEach((m) => {
      m.innerHTML = m.innerHTML + m.innerHTML;
    });
  }

  // Reveal por scroll
  function initReveals() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (reduced || !window.gsap || !window.ScrollTrigger) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }

    items.forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
        onStart: () => el.classList.add("is-in")
      });
    });
  }

  // Animación entrada hero
  function initHero() {
    const hero = document.querySelector(".hero");
    if (!hero || reduced || !window.gsap) return;

    gsap.from(".hero__eyebrow", { y: 20, opacity: 0, duration: 0.8, ease: "expo.out" });
    gsap.from(".hero__title span", {
      y: 80, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.1, delay: 0.1
    });
    gsap.from(".hero__sub", { y: 20, opacity: 0, duration: 0.8, ease: "expo.out", delay: 0.5 });
    gsap.from(".hero__cta > *", {
      y: 20, opacity: 0, duration: 0.7, ease: "expo.out", stagger: 0.1, delay: 0.7
    });
  }

  // Generador aleatorio: pulsa botón -> Axios busca pista random en un género al azar
  function initGenerator() {
    const btn = document.getElementById("genBtn");
    const out = document.getElementById("genOut");
    const title = document.getElementById("genTitle");
    if (!btn || !out) return;

    const genres = window.SONIDO_GENRE_LIST || ["rock"];
    const labels = (window.SONIDO_GENRES || {});

    btn.addEventListener("click", function () {
      out.innerHTML = window.SonidoRender.loader();
      btn.disabled = true;

      window.SonidoAPI.randomFromGenres(genres)
        .then((res) => {
          if (!res) { out.innerHTML = window.SonidoRender.empty("No encontramos nada esta vez."); return; }
          if (title) title.textContent = labels[res.genre] ? labels[res.genre].name.toUpperCase() : res.genre.toUpperCase();
          out.innerHTML = window.SonidoRender.trackCard(res.track);
          initGenrePlayer(out);
        })
        .catch((err) => {
          console.error(err);
          out.innerHTML = window.SonidoRender.error("La API de iTunes no respondió. Reintenta.");
        })
        .finally(() => { btn.disabled = false; });
    });
  }

  // ---------- Render de secciones por género ----------
  function renderGenreSections() {
    const host = document.getElementById("genreSections");
    if (!host || !window.SONIDO_GENRES || !window.SONIDO_GENRE_LIST) return;

    const vuBars = Array.from({ length: 8 }, () => "<span></span>").join("");

    const html = window.SONIDO_GENRE_LIST.map((id, idx) => {
      const g = window.SONIDO_GENRES[id];
      if (!g) return "";

      const songs = (g.songs || []).slice(0, 6).map((s, i) => `
        <li class="chart-row gs-item">
          <span class="chart-rank">${String(i + 1).padStart(2, "0")}</span>
          <div class="chart-meta">
            <p class="chart-song">${escapeHtml(s.title)}</p>
            <p class="chart-artist">${escapeHtml(s.artist)}</p>
          </div>
          <button class="chart-play" type="button"
            data-genre="${g.id}" data-idx="${i}"
            data-title="${escapeHtml(s.title)}" data-artist="${escapeHtml(s.artist)}"
            aria-label="Reproducir ${escapeHtml(s.title)} de ${escapeHtml(s.artist)}">
            <svg class="icon-play" viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><polygon points="6,4 20,12 6,20"/></svg>
            <svg class="icon-pause" viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            <svg class="icon-load" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><circle cx="12" cy="12" r="8" stroke-dasharray="36" stroke-dashoffset="14" stroke-linecap="round"/></svg>
          </button>
          <div class="vu-meter" aria-hidden="true">${vuBars}</div>
        </li>
      `).join("");

      return `
        <section class="genre-section gs-${g.id}" id="genero-${g.id}" data-genre="${g.id}" data-index="${idx}">
          <div class="gs-bg" aria-hidden="true"></div>
          <div class="container">
            <div class="row align-items-end gs-head">
              <div class="col-lg-8">
                <p class="gs-eyebrow">GÉNERO · ${g.number} / 05 · ${escapeHtml(g.origin.place)}</p>
                <h2 class="gs-title">${escapeHtml(g.name)}</h2>
                <p class="gs-tagline">${escapeHtml(g.tagline)}</p>
              </div>
              <div class="col-lg-4 text-lg-end mt-4 mt-lg-0">
                <a href="pages/${g.id}.html" class="btn-ghost-sonido">Ver género →</a>
              </div>
            </div>
            <div class="row g-5 mt-2">
              <div class="col-12">
                <p class="section-eyebrow">TOP 6 · BILLBOARD</p>
                <ul class="chart-list">${songs}</ul>
              </div>
            </div>
            <div class="text-center mt-5">
              <a href="pages/${g.id}.html" class="btn-sonido">
                <span>Explorar ${escapeHtml(g.name)} →</span>
              </a>
            </div>
          </div>
        </section>
      `;
    }).join("");

    host.innerHTML = html;
  }

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  // ---------- Animaciones de scroll variadas por género ----------
  function initGenreScrollAnimations() {
    if (reduced || !window.gsap || !window.ScrollTrigger) return;

    // Direcciones distintas por género: bg / title / items
    const recipes = {
      hiphop:   { bg: { x: -120 },           title: { x:  140, rotate: -2 }, items: { y:  60, stagger: .08 } },
      jazz:     { bg: { scale: 1.15, opacity: 0 }, title: { x: -160 },       items: { x:  80, stagger: .1  } },
      flamenco: { bg: { x:  120 },           title: { y:  80, rotate:  3 }, items: { x: -80, stagger: .09 } },
      pop:      { bg: { scale: .85, opacity: 0 },  title: { y: -100 },       items: { scale: .6, opacity: 0, stagger: .07 } },
      rock:     { bg: { y:  120 },           title: { x: -180, skewX: -6 }, items: { x:  100, stagger: .1  } }
    };

    document.querySelectorAll(".genre-section").forEach((section) => {
      const id = section.dataset.genre;
      const r = recipes[id] || recipes.hiphop;

      const bg    = section.querySelector(".gs-bg");
      const title = section.querySelector(".gs-title");
      const head  = section.querySelector(".gs-head");
      const items = section.querySelectorAll(".gs-item");

      const trig = { trigger: section, start: "top 80%", once: true };

      if (bg)    gsap.from(bg,    { ...r.bg,    duration: 1.4, ease: "expo.out", scrollTrigger: trig });
      if (title) gsap.from(title, { ...r.title, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: trig, delay: .1 });
      if (head)  gsap.from(head.querySelectorAll(".gs-eyebrow, .gs-tagline, .btn-ghost-sonido"),
                           { y: 30, opacity: 0, duration: .8, ease: "expo.out", stagger: .1, scrollTrigger: trig, delay: .25 });
      if (items.length) {
        gsap.from(items, {
          ...r.items,
          opacity: r.items.opacity != null ? r.items.opacity : 0,
          duration: .9, ease: "expo.out",
          scrollTrigger: { trigger: section, start: "top 70%", once: true },
          delay: .15
        });
      }
    });
  }

  // Función compartida para inicializar reproductor de botones en contenedores
  function initGenrePlayer(container) {
    const audio = document.createElement("audio");
    audio.preload = "none";
    audio.setAttribute("aria-hidden", "true");
    document.body.appendChild(audio);

    let activeBtn = null;

    function clearActive() {
      if (activeBtn) {
        activeBtn.classList.remove("is-playing", "is-loading");
        activeBtn = null;
      }
    }

    audio.addEventListener("play",  () => activeBtn && activeBtn.classList.add("is-playing"));
    audio.addEventListener("pause", () => activeBtn && activeBtn.classList.remove("is-playing"));
    audio.addEventListener("ended", () => clearActive());

    container.addEventListener("click", function (e) {
      const btn = e.target.closest(".genre-play");
      if (!btn) return;
      e.preventDefault();

      // Toggle si es la misma pista
      if (activeBtn === btn) {
        if (audio.paused) audio.play().catch(() => {});
        else audio.pause();
        return;
      }

      clearActive();
      activeBtn = btn;
      const url = btn.dataset.preview;
      if (!url) return;
      audio.src = url;
      audio.play().catch(() => {});
    });
  }
})();
