const pokemonGrid = document.getElementById('grid');

async function loadPokemon() {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=500');
  const data = await res.json();

  for (const entry of data.results) {
    const pokemon = await fetch(entry.url).then((r) => r.json());
    renderCard(pokemon);
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
  grid.appendChild(card);
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

let allPokemon = [];

async function loadPokemon() {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=500');
  const data = await res.json();
  for (const entry of data.results) {
    const pokemon = await fetch(entry.url).then((r) => r.json());
    allPokemon.push(pokemon);
    renderCard(pokemon);
  }

  function renderPokemonList(pokemonList) {
    grid.innerHTML = '';
    pokemonList.forEach((pokemon) => {
      renderCard(pokemon);
    });
  }
  const searchInput = document.getElementById('srch');

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    const filteredPokemon = allPokemon.filter((pokemon) => {
      return (
        pokemon.name.toLowerCase().includes(query) ||
        String(pokemon.id).includes(query)
      );
    });

    renderPokemonList(filteredPokemon);
  });
}

loadPokemon();
