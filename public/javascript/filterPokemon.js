let pokemonContainers = document.querySelectorAll('.pokemon-container');
let searchBar = document.querySelector('#search')

searchBar.addEventListener('keyup', function() {
    let searchOptions = new RegExp();
    if (searchBar.value != null && searchBar.value !== '') {
        searchOptions = new RegExp(searchBar.value, 'i')
    }
    pokemonContainers.forEach(c => {
        let pokemonName = c.querySelector('.pokemon-name-text').innerText;
        if (searchOptions.test(pokemonName)) {
                c.classList.remove('hide');
        }
        else {
            c.classList.add('hide');
        }
    })
});