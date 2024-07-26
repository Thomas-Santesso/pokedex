document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search');
    const pokemonDetails = document.getElementById('pokemon-details');
    const pokemonInfo = document.getElementById('pokemon-info');
    const pokemonList = document.getElementById('pokemon-list');
    const prevButton = document.getElementById('prev-pokemon');
    const nextButton = document.getElementById('next-pokemon');
    
    let currentPokemonIndex = 0;
    let allPokemon = [];

    // Adiciona evento de input no campo de busca
    searchInput.addEventListener('input', fetchPokemonList);
    prevButton.addEventListener('click', showPrevPokemon);
    nextButton.addEventListener('click', showNextPokemon);

    function fetchPokemonList() {
        const query = searchInput.value.toLowerCase();
        fetch(`https://pokeapi.co/api/v2/pokemon?limit=151`)
            .then(response => response.json())
            .then(data => {
                allPokemon = data.results;
                const filteredPokemon = allPokemon.filter(pokemon => pokemon.name.includes(query));
                displayPokemonList(filteredPokemon);
            });
    }

    function displayPokemonList(pokemonArray) {
        pokemonList.innerHTML = '';
        pokemonArray.forEach((pokemon, index) => {
            const pokemonItem = document.createElement('div');
            pokemonItem.classList.add('pokemon-item');
            pokemonItem.innerHTML = `
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonId(pokemon.url)}.png" alt="${pokemon.name}">
                <span>${capitalizeFirstLetter(pokemon.name)}</span>
            `;
            pokemonItem.addEventListener('click', () => fetchPokemonDetails(pokemon.url, index));
            pokemonList.appendChild(pokemonItem);
        });
    }

    function fetchPokemonDetails(url, index) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                currentPokemonIndex = index;
                displayPokemonDetails(data);
            });
    }

    function displayPokemonDetails(pokemon) {
        pokemonDetails.classList.remove('hidden');
        pokemonInfo.classList.add('slide-out');
        setTimeout(() => {
            pokemonInfo.innerHTML = `
                <h2>${capitalizeFirstLetter(pokemon.name)}</h2>
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${pokemon.id}.gif" alt="${pokemon.name}">
                <p><strong>Altura:</strong> ${pokemon.height / 10}m</p>
                <p><strong>Peso:</strong> ${pokemon.weight / 10}kg</p>
                <p><strong>Tipo:</strong> ${pokemon.types.map(type => capitalizeFirstLetter(type.type.name)).join(', ')}</p>
                <p><strong>Habilidades:</strong> ${pokemon.abilities.map(ability => capitalizeFirstLetter(ability.ability.name)).join(', ')}</p>
                <div class="stats">
                    ${pokemon.stats.map(stat => `
                        <div class="stat">
                            <span>${capitalizeFirstLetter(stat.stat.name)}</span>
                            ${stat.base_stat}
                        </div>
                    `).join('')}
                </div>
            `;
            pokemonInfo.classList.remove('slide-out');
            pokemonInfo.classList.add('slide-in');
        }, 500);
    }

    function showPrevPokemon() {
        if (currentPokemonIndex > 0) {
            fetchPokemonDetails(allPokemon[currentPokemonIndex - 1].url, currentPokemonIndex - 1);
        }
    }

    function showNextPokemon() {
        if (currentPokemonIndex < allPokemon.length - 1) {
            fetchPokemonDetails(allPokemon[currentPokemonIndex + 1].url, currentPokemonIndex + 1);
        }
    }

    function getPokemonId(url) {
        const parts = url.split('/');
        return parts[parts.length - 2];
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    fetchPokemonList(); // Carrega a lista de Pokémon ao iniciar
});
