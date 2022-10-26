const express = require('express')
const router = express.Router()
const axios = require('axios')
const BASE_URL = "https://pokeapi.co/api/v2"

// All pokemon / Search pokemon
router.get('/', async (req, res, next) => {

    try {
        // make API call to get list of pokemon
        const pokemon = await axios.get(BASE_URL + `/pokemon?limit=50`)

        // from the result, push all URLs to an array
        endpoints = []
        for (let i = 0; i < pokemon.data.results.length; ++i) {
            endpoints.push(pokemon.data.results[i].url)
        }

        // display loading while waiting for promises to resolve
        console.log('Loading...')

        // get each individual pokemon from the list
        const temp = await Promise.all(endpoints.map(url => axios(url).then(({data}) => data)))
        
        // render main page with retrieved pokemon
        res.render('pokemon/index', {
            pokemon: temp
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