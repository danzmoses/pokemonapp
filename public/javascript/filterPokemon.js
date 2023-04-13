let pokemonContainers = document.querySelectorAll('.pokemon-container');
let searchBar = document.querySelector('#search');
let typeContainer = document.querySelector('#type');
let generationContainer = document.querySelector('#generation')

searchBar.addEventListener('keyup', filterPokemon);
typeContainer.addEventListener('input', filterPokemon);
generationContainer.addEventListener('input', changeGeneration);

function filterPokemon() {
    // reset pokemon before applying filters
    pokemonContainers.forEach(c => {
        c.classList.remove('hide')
    })

    let searchOptions = new RegExp();
    if (searchBar.value != null && searchBar.value !== '') {
        searchOptions = new RegExp(searchBar.value, 'i')
    }
    let selectedType = typeContainer.value;
    pokemonContainers.forEach(c => {
        let pokemonName = c.querySelector('.pokemon-name-text').innerText;
        let pokemonTypes = c.querySelectorAll('table td')
        let hasSelectedType = false
        if (selectedType === 'All') {
            hasSelectedType = true
        }
        else {
            pokemonTypes.forEach(t => {
                if (selectedType === t.innerText)
                    hasSelectedType = true;
            })
        }
        if (searchOptions.test(pokemonName) && hasSelectedType) {
                c.classList.remove('hide');
        }
        else {
            c.classList.add('hide');
        }
    })
}

function changeGeneration() {
    window.location.href = '/pokemon?generation=' + generationContainer.value;
}