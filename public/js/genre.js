/* ================================================================
   SONIDO · genre.js
   Construye dinámicamente la página de un género desde data.js
   Lee <body data-genre="hiphop"> para saber cuál renderizar.
   ================================================================ */

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const id = document.body.dataset.genre;
    if (!id || !window.SONIDO_GENRES || !window.SONIDO_GENRES[id]) return;
    const g = window.SONIDO_GENRES[id];

    document.title = `SONIDO · ${g.name}`;
    document.body.classList.add("theme-" + id);

    fillHero(g);
    fillHighlights(g);
    fillHistory(g);
    fillOrigin(g);
    loadITunes(g);
    markActiveNav(id);
  });

  function fillHero(g) {
    const eyebrow = document.querySelector("[data-fill='eyebrow']");
    const title = document.querySelector("[data-fill='title']");
    const tagline = document.querySelector("[data-fill='tagline']");
    if (eyebrow) eyebrow.textContent = `GÉNERO · ${g.number} / 05`;
    if (title) {
      title.textContent = g.name.toUpperCase();
      title.classList.add("gradient-text");
    }
    if (tagline) tagline.textContent = g.tagline;
  }

  function fillSetlist(g) {
    const ol = document.querySelector("[data-fill='setlist']");
    if (!ol) return;
    ol.innerHTML = g.songs.map((s, i) => `
      <li class="reveal">
        <span class="num accent">/${String(i + 1).padStart(2, "0")}</span>
        <div>
          <p class="title">${escapeHtml(s.title)}</p>
          <p class="artist">${escapeHtml(s.artist)}</p>
        </div>
        <span class="audio-bars accent" aria-hidden="true">
          ${Array(5).fill('<span style="height:60%"></span>').join("")}
        </span>
      </li>
    `).join("");
  }

  function fillHighlights(g) {
    const wrap = document.querySelector("[data-fill='highlights']");
    if (!wrap) return;
    wrap.innerHTML = g.highlights.map((h) => `
      <div class="card-sonido reveal">
        <p class="label">${escapeHtml(h.label)}</p>
        <p class="value">${escapeHtml(h.value)}</p>
      </div>
    `).join("");
  }

  function fillHistory(g) {
    const wrap = document.querySelector("[data-fill='history']");
    if (!wrap) return;
    wrap.innerHTML = g.history.map((p) => `
      <p class="reveal" style="font-family:'Playfair Display',serif;font-size:1.15rem;line-height:1.7;color:hsl(var(--foreground) / .9);margin-bottom:1.5rem;">
        ${escapeHtml(p)}
      </p>
    `).join("");
  }

  function fillOrigin(g) {
    const wrap = document.querySelector("[data-fill='origin']");
    if (!wrap) return;
    wrap.innerHTML = `
      <div class="col-sm-6 col-lg-4">
        <div class="card-sonido h-100">
          <p class="label">Origen</p>
          <p class="value">${escapeHtml(g.origin.place)}</p>
        </div>
      </div>
      <div class="col-sm-6 col-lg-4">
        <div class="card-sonido h-100">
          <p class="label">Década</p>
          <p class="value">${escapeHtml(g.origin.decade)}</p>
        </div>
      </div>
    `;
  }

  function loadITunes(g) {
    const wrap = document.querySelector("[data-fill='itunes']");
    if (!wrap) return;
    wrap.innerHTML = window.SonidoRender.loader();
    // Flujo en vivo:
    //  1) MusicBrainz devuelve recordings tageados con el género (filtro real).
    //  2) iTunes resuelve cada uno para conseguir previewUrl + artwork.
    //  3) Si MusicBrainz falla o no hay matches, fallback a búsqueda directa en iTunes.
    const fetcher = g.mbTag
      ? window.SonidoAPI.tracksByMbTagWithPreviews(g.mbTag, 9, 30, 4)
          .then((tracks) => {
            if (tracks && tracks.length) return tracks;
            // Fallback si MusicBrainz no rinde resultados utilizables
            return (g.genreNames && g.genreNames.length)
              ? window.SonidoAPI.tracksByTermFilteredByGenre(g.searchTerm, g.genreNames, 9)
              : window.SonidoAPI.tracksByGenre(g.searchTerm, 9);
          })
      : window.SonidoAPI.tracksByGenre(g.searchTerm, 9);
    fetcher
      .then((tracks) => {
        if (!tracks.length) { wrap.innerHTML = window.SonidoRender.empty(); return; }
        wrap.innerHTML = tracks
          .map((t) => `<div class="col-12 col-md-6 col-xl-4">${window.SonidoRender.trackCard(t)}</div>`)
          .join("");
        // Solo un reproductor activo a la vez
        wrap.querySelectorAll("audio").forEach((audio) => {
          audio.addEventListener("play", () => {
            wrap.querySelectorAll("audio").forEach((other) => {
              if (other !== audio) other.pause();
            });
          });
        });
      })
      .catch((err) => {
        console.error(err);
        wrap.innerHTML = window.SonidoRender.error();
      });
  }

  function markActiveNav(id) {
    document.querySelectorAll(`.navbar-sonido .nav-link[data-genre='${id}']`)
      .forEach((a) => a.classList.add("active"));
  }
})();
