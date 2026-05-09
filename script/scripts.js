const pokemonGrid = document.getElementById('grid');

let page = 1;
let allPokemon = [];
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

let limit = 12;
prevBtn.addEventListener('click', async () => {
  if (page > 1) {
    page--;
    await loadPokemon();
  }
});

nextBtn.addEventListener('click', async () => {
  page++;
  await loadPokemon();
});

async function loadAllPokemon() {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10000');
  const data = await res.json();
  allPokemon = data.results;
}

async function loadPokemon() {
  pokemonGrid.innerHTML = '';
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${(page - 1) * limit}`,
  );

  const data = await res.json();

  for (const entry of data.results) {
    const pokemon = await fetch(entry.url).then((r) => r.json());
    renderCard(pokemon);
    console.log(pokemon);
  }
}

function renderCard(pokemon) {
  const card = document.createElement('div');
  card.className = 'pokemon-card';
  card.innerHTML = `
    <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}" />
    <p class="pokemon-id">#${String(pokemon.id).padStart(3, '0')}</p>
    <p class="pokemon-name">${pokemon.name}</p>
  `;
  card.addEventListener('click', () => showDetails(pokemon));
  pokemonGrid.appendChild(card);
}

function showDetails(pokemon) {
  const panel = document.getElementById('dpanel');
  const content = document.getElementById('dcontent');
  const empty = document.getElementById('dempty');

  panel.innerHTML = `
    <div class="dcontent">

      <div class="dhero">
        <div class="dhero-top">
          <p class="panel-id">
            #${String(pokemon.id).padStart(3, '0')}
          </p>
        </div>

        <img 
          class="panel-image"
          src="${pokemon.sprites.other['official-artwork'].front_default}" 
          alt="${pokemon.name}" 
        />

        <h2 class="panel-name">${pokemon.name}</h2>

        <div class="panel-types">
          ${pokemon.types
            .map(
              (t) => `
              <span class="type-badge ${t.type.name}">
                ${t.type.name}
              </span>
            `,
            )
            .join('')}
        </div>
      </div>

      <div class="panel-section">
        <h3 class="section-title">Base Stats</h3>

        ${pokemon.stats
          .map(
            (s) => `
            <div class="stat-row">
              <span class="stat-name">${s.stat.name}</span>

              <div class="stat-bar-wrap">
                <div 
                  class="stat-bar"
                  style="width:${Math.min(s.base_stat, 100)}%"
                ></div>
              </div>

              <span class="stat-value">${s.base_stat}</span>
            </div>
          `,
          )
          .join('')}
      </div>

    </div>
  `;
}

function renderPokemonList(pokemonList) {
  pokemonGrid.innerHTML = '';
  pokemonList.forEach((pokemon) => {
    renderCard(pokemon);
  });
}

const searchInput = document.getElementById('srch');

searchInput.addEventListener('input', async (e) => {
  const query = e.target.value.toLowerCase().trim();

  /* EMPTY SEARCH */
  if (query === '') {
    await loadPokemon();

    return;
  }

  pokemonGrid.innerHTML = '';

  const filtered = allPokemon.filter((pokemon) => {
    const id = pokemon.url.split('/').filter(Boolean).pop();

    return pokemon.name.includes(query) || id.padStart(3, '0').includes(query);
  });

  for (const entry of filtered.slice(0, 20)) {
    const pokemon = await fetch(entry.url).then((r) => r.json());

    renderCard(pokemon);
  }
});

loadPokemon();
loadAllPokemon();
