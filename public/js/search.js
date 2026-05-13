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
            `<div class="col-12 col-md-6 col-xl-4">${window.SonidoRender.trackCard(t)}</div>`
          ).join(""));
          // Solo un reproductor activo a la vez
          const audios = $out[0].querySelectorAll("audio");
          audios.forEach((audio) => {
            audio.addEventListener("play", () => {
              audios.forEach((other) => { if (other !== audio) other.pause(); });
            });
          });
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
})();
