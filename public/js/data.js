/* ================================================================
   SONIDO · Datos estáticos de géneros
   (Mismos datos que la versión anterior, ahora en JS plano)
   ================================================================ */

window.SONIDO_GENRES = {
  hiphop: {
    id: "hiphop", name: "Hip Hop", number: "01",
    tagline: "Rimas afiladas, beats que cuentan ciudades.",
    origin: { place: "Bronx, Nueva York", decade: "1970s" },
    fontClass: "font-hiphop",
    searchTerm: "hip hop",
    genreNames: ["Hip-Hop/Rap", "Rap"],
    mbTag: "hip hop",
    songs: [
      { title: "Shook Ones, Pt II", artist: "Mobb Deep" },
      { title: "Big Poppa", artist: "The Notorious B.I.G." },
      { title: "N.Y. State of Mind", artist: "Nas" },
      { title: "Lose Yourself", artist: "Eminem" },
      { title: "Money Trees", artist: "Kendrick Lamar" },
      { title: "Miseducation", artist: "Lauryn Hill" }
    ],
    highlights: [
      { label: "Gangsta Rap", value: "Tupac" },
      { label: "Comercial", value: "Travis Scott" },
      { label: "Storytelling", value: "Kendrick Lamar" },
      { label: "Máximo exponente", value: "Nas" },
      { label: "Mención honorífica", value: "Eminem · Jay-Z · Kanye · J. Cole · Lauryn Hill" }
    ],
    history: [
      "Nace en los block parties del Bronx a principios de los 70, cuando DJ Kool Herc empieza a aislar los breaks de los discos de funk para que los bailarines pudieran extender sus pasos.",
      "En los 80, grupos como Run-DMC, Public Enemy y N.W.A. transforman el género en un altavoz político y callejero. La rivalidad costa este vs costa oeste de los 90 (Tupac, Biggie) lo convierte en cultura global.",
      "El siglo XXI lo lleva al mainstream absoluto: Eminem rompe barreras raciales, Kanye redefine la producción y Kendrick Lamar gana el Pulitzer en 2018, consagrándolo como literatura sonora."
    ]
  },
  jazz: {
    id: "jazz", name: "Jazz", number: "02",
    tagline: "Improvisación elegante, humo y madrugada.",
    origin: { place: "Nueva Orleans, Luisiana", decade: "1900s" },
    fontClass: "font-jazz",
    searchTerm: "jazz",
    genreNames: ["Jazz"],
    mbTag: "jazz",
    songs: [
      { title: "Strangers in the Night", artist: "Frank Sinatra" },
      { title: "So What", artist: "Miles Davis" },
      { title: "What a Wonderful World", artist: "Louis Armstrong" },
      { title: "My Favorite Things", artist: "John Coltrane" },
      { title: "Take Five", artist: "Dave Brubeck" },
      { title: "Georgia On My Mind", artist: "Ray Charles" }
    ],
    highlights: [
      { label: "Trompetista", value: "Miles Davis" },
      { label: "Pianista", value: "Herbie Hancock" },
      { label: "Saxofón", value: "Wayne Shorter" },
      { label: "Contrabajo", value: "Ron Carter" },
      { label: "Batería", value: "Tony Williams" }
    ],
    history: [
      "El jazz emerge a comienzos del s. XX en Nueva Orleans, fusionando blues, ragtime y tradiciones africanas. Louis Armstrong populariza la improvisación solista en los años 20.",
      "El swing domina los 30 y 40 con big bands como las de Duke Ellington y Count Basie. En los 50, el bebop de Charlie Parker y el cool jazz de Miles Davis revolucionan la armonía.",
      "Kind of Blue (1959) marca un antes y un después. Coltrane explora lo espiritual, Herbie Hancock cruza al funk, y hoy artistas como Robert Glasper mantienen vivo el lenguaje."
    ]
  },
  flamenco: {
    id: "flamenco", name: "Flamenco", number: "03",
    tagline: "Duende, compás y fuego en las cuerdas.",
    origin: { place: "Andalucía, España", decade: "1700s" },
    fontClass: "font-flamenco",
    searchTerm: "flamenco",
    genreNames: ["Latin", "Flamenco", "Spanish"],
    mbTag: "flamenco",
    songs: [
      { title: "Entre dos aguas", artist: "Paco de Lucía" },
      { title: "Como el agua", artist: "Camarón de la Isla" },
      { title: "Dame veneno", artist: "Los Chunguitos" },
      { title: "Canastera", artist: "El Canelita" },
      { title: "El Alba", artist: "José Mercé" },
      { title: "Malamente", artist: "Rosalía" }
    ],
    highlights: [
      { label: "Mejor guitarrista", value: "Paco de Lucía" },
      { label: "Mejor grupo", value: "Los Chichos" },
      { label: "Mejor vocalista", value: "Camarón de la Isla" },
      { label: "Mención honorífica", value: "Los Chunguitos · Omar Montes · Los Chichos" }
    ],
    history: [
      "El flamenco nace en Andalucía como fusión de tradiciones gitanas, moriscas, judías y castellanas. Su forma moderna se consolida en los cafés cantantes del s. XIX en Sevilla, Cádiz y Jerez.",
      "El s. XX trae la edad dorada con Antonio Mairena, La Niña de los Peines y, sobre todo, la revolución de Camarón de la Isla y Paco de Lucía, que llevan el género al jazz y al rock.",
      "Declarado Patrimonio Inmaterial de la Humanidad por la UNESCO en 2010. Hoy Rosalía, Israel Fernández o C. Tangana lo proyectan globalmente con producciones contemporáneas."
    ]
  },
  pop: {
    id: "pop", name: "Pop", number: "04",
    tagline: "Estribillos imposibles de olvidar.",
    origin: { place: "Reino Unido / EE. UU.", decade: "1950s" },
    fontClass: "font-pop",
    searchTerm: "pop",
    genreNames: ["Pop"],
    mbTag: "pop",
    songs: [
      { title: "Billie Jean", artist: "Michael Jackson" },
      { title: "Like a Prayer", artist: "Madonna" },
      { title: "Believer", artist: "Imagine Dragons" },
      { title: "Starboy", artist: "The Weeknd" },
      { title: "Oops!… I Did It Again", artist: "Britney Spears" },
      { title: "Diamonds", artist: "Rihanna" }
    ],
    highlights: [
      { label: "Reina del pop", value: "Madonna" },
      { label: "Rey del pop", value: "Michael Jackson" },
      { label: "Producción moderna", value: "The Weeknd" }
    ],
    history: [
      "El pop nace en los 50 como evolución del rock & roll, simplificando estructuras para llegar a las masas. The Beatles transforman la fórmula en arte y lanzan la Invasión Británica en los 60.",
      "Los 80 son la era MTV: Michael Jackson, Madonna, Prince. Thriller (1982) sigue siendo el álbum más vendido de la historia con más de 70M de copias.",
      "El s. XXI digitaliza el género: streaming, redes sociales y producción global. Taylor Swift, The Weeknd, Billie Eilish y Bad Bunny dominan listas y rompen récords cada semana."
    ]
  },
  rock: {
    id: "rock", name: "Rock", number: "05",
    tagline: "Volumen, rebeldía y guitarras eternas.",
    origin: { place: "EE. UU. / Reino Unido", decade: "1950s" },
    fontClass: "font-rock",
    searchTerm: "rock",
    genreNames: ["Rock"],
    mbTag: "rock",
    songs: [
      { title: "Sultans of Swing", artist: "Dire Straits" },
      { title: "Stairway to Heaven", artist: "Led Zeppelin" },
      { title: "Smells Like Teen Spirit", artist: "Nirvana" },
      { title: "Jailhouse Rock", artist: "Elvis Presley" },
      { title: "Sweet Child o' Mine", artist: "Guns N' Roses" },
      { title: "Highway to Hell", artist: "AC/DC" }
    ],
    highlights: [
      { label: "Mejor voz", value: "Johnny Cash · Elvis · Axl Rose · Chester Bennington · Bryan Adams" },
      { label: "Mejor guitarra", value: "Eddie Van Halen · Mark Knopfler · Hendrix · Clapton · Jimmy Page" }
    ],
    history: [
      "El rock & roll explota en los 50 con Chuck Berry, Little Richard y Elvis, fusionando blues y country. Es la primera música pensada para la juventud y rompe tabúes raciales.",
      "Los 60 y 70 son la era dorada: Beatles, Stones, Hendrix, Led Zeppelin, Pink Floyd. El género se ramifica en hard rock, prog, punk (Sex Pistols, Ramones) y heavy metal (Black Sabbath).",
      "El grunge de los 90 (Nirvana, Pearl Jam) reinventa el género tras los excesos del glam. Hoy bandas como Foo Fighters, Arctic Monkeys o Greta Van Fleet mantienen viva la llama."
    ]
  }
};

window.SONIDO_GENRE_LIST = ["hiphop","jazz","flamenco","pop","rock"];
