/* ================================================================
   SONIDO · Cliente de iTunes Search API con Axios
   ================================================================ */

window.SonidoAPI = (function () {
  const BASE = "https://itunes.apple.com/search";

  const client = axios.create({
    baseURL: BASE,
    timeout: 10000
  });

  /**
   * Busca en iTunes Search API.
   * @param {Object} params
   *   term, media, entity, limit, country, attribute
   */
  function search(params) {
    return client
      .get("", {
        params: Object.assign(
          { media: "music", limit: 20, country: "ES", lang: "es_es" },
          params
        )
      })
      .then((res) => res.data.results || []);
  }

  // Helpers de alto nivel
  function tracksByGenre(genre, limit = 12) {
    return search({ term: genre, entity: "song", limit });
  }
  // Combina término de búsqueda + filtro por nombre de género (client-side).
  function tracksByTermFilteredByGenre(term, genreNames, limit = 12) {
    const names = (genreNames || []).map((n) => n.toLowerCase());
    return search({ term, entity: "song", limit: 100 }).then((tracks) => {
      const filtered = names.length
        ? tracks.filter((t) => {
            const g = (t.primaryGenreName || "").toLowerCase();
            return names.some((n) => g.includes(n));
          })
        : tracks;
      return filtered.slice(0, limit);
    });
  }
  function artistTopTracks(artist, limit = 8) {
    return search({ term: artist, entity: "song", attribute: "artistTerm", limit });
  }
  function randomFromGenres(genres) {
    const g = genres[Math.floor(Math.random() * genres.length)];
    return tracksByGenre(g, 25).then((tracks) => {
      if (!tracks.length) return null;
      const t = tracks[Math.floor(Math.random() * tracks.length)];
      return { genre: g, track: t };
    });
  }

  /* ============================================================
     MusicBrainz: filtrado real por género (tag)
     ============================================================ */
  const MB_BASE = "https://musicbrainz.org/ws/2";
  const mbClient = axios.create({ baseURL: MB_BASE, timeout: 15000 });

  // Devuelve recordings tageados con el género indicado.
  function mbRecordingsByTag(tag, limit = 50) {
    return mbClient
      .get("/recording", {
        params: {
          query: `tag:"${tag}" AND status:official`,
          fmt: "json",
          limit
        }
      })
      .then((res) => res.data.recordings || []);
  }

  // Normaliza una cadena para comparar artistas/títulos.
  function norm(s) {
    return String(s || "")
      .normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  }

  // Busca un único track en iTunes que case con artista+título.
  function itunesLookupTrack(artist, title) {
    return search({ term: `${artist} ${title}`, entity: "song", limit: 5 })
      .then((results) => {
        const na = norm(artist), nt = norm(title);
        return results.find((t) => {
          if (!t.previewUrl) return false;
          const ia = norm(t.artistName), it = norm(t.trackName);
          const artistOk = ia.includes(na) || na.includes(ia);
          const titleOk = it.includes(nt) || nt.includes(it);
          return artistOk && titleOk;
        }) || null;
      })
      .catch(() => null);
  }

  /**
   * Flujo completo en vivo:
   * 1) Pide recordings a MusicBrainz filtrados por tag (género real).
   * 2) Por cada uno, hace lookup en iTunes para obtener previewUrl + artwork.
   * 3) Devuelve los primeros `limit` que tengan match con preview.
   *
   * Limita la concurrencia a `concurrency` lookups simultáneos para no saturar iTunes.
   */
  function tracksByMbTagWithPreviews(tag, limit = 9, candidates = 30, concurrency = 4) {
    return mbRecordingsByTag(tag, candidates).then((recs) => {
      // Deduplica por artista+título y descarta entradas sin datos válidos.
      const seen = new Set();
      const seedList = [];
      for (const rec of recs) {
        const title = rec.title;
        const credit = (rec["artist-credit"] || [])[0];
        const artist = credit && (credit.name || (credit.artist && credit.artist.name));
        if (!title || !artist) continue;
        const k = norm(artist) + "::" + norm(title);
        if (seen.has(k)) continue;
        seen.add(k);
        seedList.push({ artist, title });
      }

      // Procesa en lotes con concurrencia limitada hasta alcanzar `limit` matches.
      const results = [];
      let idx = 0;

      function worker() {
        if (results.length >= limit || idx >= seedList.length) return Promise.resolve();
        const seed = seedList[idx++];
        return itunesLookupTrack(seed.artist, seed.title).then((track) => {
          if (track && results.length < limit) results.push(track);
          return worker();
        });
      }

      const workers = Array.from({ length: concurrency }, worker);
      return Promise.all(workers).then(() => results);
    });
  }

  return {
    search,
    tracksByGenre,
    tracksByTermFilteredByGenre,
    artistTopTracks,
    randomFromGenres,
    mbRecordingsByTag,
    itunesLookupTrack,
    tracksByMbTagWithPreviews
  };
})();

/* ================================================================
   Renderizadores compartidos
   ================================================================ */
window.SonidoRender = {
  trackCard(t) {
    const img = (t.artworkUrl100 || "").replace("100x100", "400x400");
    const hasPreview = !!t.previewUrl;
    return `
      <article class="track-card" style="background-image: url('${img}');">
        <div class="track-overlay">
          <div class="track-meta">
            <h4>${escapeHtml(t.trackName || t.collectionName || "Sin título")}</h4>
            <p>${escapeHtml(t.artistName || "—")}</p>
          </div>
          ${hasPreview ? `<button class="genre-play" data-preview="${t.previewUrl}" aria-label="Reproducir ${escapeHtml(t.trackName || '')}"></button>` : `<span class="no-preview">SIN PREVIEW</span>`}
        </div>
      </article>`;
  },
  loader() {
    return `<div class="loader" role="status" aria-label="Cargando"></div>`;
  },
  empty(msg) {
    return `<p class="state-msg">${escapeHtml(msg || "Sin resultados.")}</p>`;
  },
  error(msg) {
    return `<p class="state-msg error">${escapeHtml(msg || "Algo falló al consultar la API.")}</p>`;
  }
};

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}
window.escapeHtml = escapeHtml;
