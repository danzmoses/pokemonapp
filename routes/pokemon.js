const express = require('express')
const router = express.Router()
const axios = require('axios')
const BASE_URL = "https://pokeapi.co/api/v2"

const generationMap = [
    {
        name: "Kanto",
        generation: 1,
        limit: 151,
        offset: 0
    },
    {
        name: "Johto",
        generation: 2,
        limit: 100,
        offset: 151
    },
    {
        name: "Hoenn",
        generation: 3,
        limit: 135,
        offset: 251,
    },
    {
        name: "Sinnoh",
        generation: 4,
        limit: 108,
        offset: 386
    },
    {
        name: "Unova",
        generation: 5,
        limit: 155,
        offset: 494
    },
    {
        name: "Kalos",
        generation: 6,
        limit: 72,
        offset: 649
    },
    {
        name: "Alola",
        generation: 7,
        limit: 88,
        offset: 721
    },
    {
        name: "Galar",
        generation: 8,
        limit: 89,
        offset: 809
    }
]

const typeToColor = {
	normal: '#A8A77A',
	fire: '#EE8130',
	water: '#6390F0',
	electric: '#F7D02C',
	grass: '#7AC74C',
	ice: '#96D9D6',
	fighting: '#C22E28',
	poison: '#A33EA1',
	ground: '#E2BF65',
	flying: '#A98FF3',
	psychic: '#F95587',
	bug: '#A6B91A',
	rock: '#B6A136',
	ghost: '#735797',
	dragon: '#6F35FC',
	dark: '#705746',
	steel: '#B7B7CE',
	fairy: '#D685AD',
};

// Make first character uppercase
function capitalizeFirstChar(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

function feetToInches(num) {
    return num * 12
}

// Convert decimeters to feet inches
function decimetersToFeetInches(height) {
    height = height / 3.048
    const feet = Math.floor(height)
    const inches = Math.floor(feetToInches(height % 1))
    return `${feet}' ${inches}"`
}

// Convert hectograms to pounds
function hectogramsToPounds(weight) {
    return weight / 4.536
}

// All pokemon / Search pokemon
router.get('/', async (req, res, next) => {

    try {
        // search query
        let searchOptions = new RegExp()
        if (req.query.name != null && req.query.name !== '') {
            searchOptions = new RegExp(req.query.name, 'i')
        }

        let limit = 151
        let offset = 0
        generationMap.forEach((gen) => {
            if (gen.generation === parseInt(req.query.generation)) {
                limit = gen.limit
                offset = gen.offset
            }
        })

        // make API call to get list of all pokemon
        const pokemon = await axios.get(BASE_URL + `/pokemon?limit=${limit}&offset=${offset}`)

        console.log(pokemon.data.results)

        // push URLs of pokemon that match regex to an array
        endpoints = []
        pokemon.data.results.forEach((res) => {
            if (searchOptions.test(res.name))
                endpoints.push(res.url)
        })

        // map each url to a promise
        promises = endpoints.map(url => axios(url).then(
            (({data}) => data)
        ))

        // display loading while waiting for promises to resolve
        // console.log('Loading...')

        // get each individual pokemon from the list
        const pokeList = await Promise.all(promises)
        
        // console.log(promises.length)
        
        
        // add types and colors to each pokemon using promises
        await Promise.all(pokeList.map(async (p) => {
            p['type1'] = capitalizeFirstChar(p['types'][0]['type']['name']);
            p['color1'] = capitalizeFirstChar(typeToColor[p['types'][0]['type']['name']]);
            if (Object.keys(p['types']).length > 1) {
                p['type2'] = capitalizeFirstChar(p['types'][1]['type']['name']);
                p['color2'] = capitalizeFirstChar(typeToColor[p['types'][1]['type']['name']]);
            }}
        ));

        // render main page with retrieved pokemon
        res.render('pokemon/index', {
            pokemon: pokeList ? pokeList : [],
            searchOptions: req.query.name != 'undefined' ? req.query.name : '',
            prevRegion: req.query.generation != 'undefined' ? req.query.generation : 1,
        })
        next()

        // remove loading after all promises resolve
        console.log('Finished!')
    } catch (err) {
        next(err)
    }
})

// Show one pokemon
router.get('/:name', async (req, res, next) => {
    try {
        const pokemon = await axios.get(BASE_URL + `/pokemon/${req.params.name}`)
        const species = await axios.get(pokemon.data.species.url)
        const evoChain = await axios.get(species.data.evolution_chain.url)

        let temp = evoChain.data.chain
        const chain = []
        while (temp) {
            chain.push(capitalizeFirstChar(temp.species.name))
            temp = temp.evolves_to[0]
        }
        pokemon.data.chain = chain
        species.data.flavor_text_entries.forEach(entry => {
            if (entry.language.name === 'en') {
                pokemon.data.description = entry.flavor_text
            }
        })
        pokemon.data.name = capitalizeFirstChar(pokemon.data.name)

        pokemon.data.types[0].type.name = capitalizeFirstChar(pokemon.data.types[0].type.name)
        if (pokemon.data.types.length > 1) {
            pokemon.data.types[1].type.name = capitalizeFirstChar(pokemon.data.types[1].type.name)
        }

        species.data.genera.forEach(genera => {
            if (genera.language.name === 'en') {
                pokemon.data.genus = genera.genus
            }
        })
    
        pokemon.data.height = decimetersToFeetInches(pokemon.data.height)
        pokemon.data.weight = hectogramsToPounds(pokemon.data.weight).toFixed(1)
        
        console.log(pokemon)

        res.render('pokemon/show', {
            pokemon: pokemon.data
        })
    } catch (err) {
        next(err)
        res.send('Error: Pokemon ' + req.params.name + ' does not exist')
    }
})

module.exports = router