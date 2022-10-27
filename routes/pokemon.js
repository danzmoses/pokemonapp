const express = require('express')
const router = express.Router()
const axios = require('axios')
const BASE_URL = "https://pokeapi.co/api/v2"

// All pokemon / Search pokemon
router.get('/', async (req, res, next) => {

    try {
        // search query
        let searchOptions = new RegExp()
        if (req.query.name != null && req.query.name !== '') {
            searchOptions = new RegExp(req.query.name, 'i')
        }

        // make API call to get list of all pokemon
        const pokemon = await axios.get(BASE_URL + `/pokemon?limit=1200&offset=0`)

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
        console.log('Loading...')

        // get each individual pokemon from the list
        const pokeList = await Promise.all(promises)
        
        console.log(promises.length)

        // render main page with retrieved pokemon
        res.render('pokemon/index', {
            pokemon: pokeList
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
        res.render('pokemon/index', {
            pokemon: pokemon.data
        })
    } catch (err) {
        next(err)
        res.send('Error: Pokemon ' + req.params.name + ' does not exist')
    }
})

module.exports = router