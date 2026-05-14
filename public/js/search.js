/* ================================================================
   SONIDO · search.js (página buscador.html)
   Buscador de iTunes con Axios + jQuery (validación)
   ================================================================ */

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const $form    = $("#searchForm");
    const $term    = $("#term");
    const $country = $("#country");
    const $out     = $("#results");
    const $count   = $("#resultCount");

    $form.on("submit", function (e) {
      e.preventDefault();
      const term = $term.val().trim();
      $term.removeClass("is-invalid");
      if (!term) { $term.addClass("is-invalid").focus(); return; }

      $out.html(window.SonidoRender.loader());
      $count.text("");

      window.SonidoAPI.search({
        term: term,
        entity: "song",
        country: $country.val(),
        limit: 20
      })
        .then((items) => {
          if (!items.length) {
            $out.html(window.SonidoRender.empty(`No se han encontrado resultados para "${term}".`));
            return;
          }
          $count.text(items.length + " resultados");
          $out.html(items.map((t) =>
            `<div class="col-12 col-sm-6 col-md-4 col-xl-3">${window.SonidoRender.trackCard(t)}</div>`
          ).join(""));
          // Inicializar reproductor para botones
          initSearchPlayer($out[0]);
        })
        .catch((err) => {
          console.error(err);
          $out.html(window.SonidoRender.empty(`No se han encontrado resultados para "${term}".`));
        });
    });

    // Búsqueda inicial sugerida
    $term.val("Rosalía");
    $form.trigger("submit");
  });

  function initSearchPlayer(container) {
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
