const express = require('express')
const router = express.Router()
const axios = require('axios')
const BASE_URL = "https://pokeapi.co/api/v2"

// All pokemon / Search pokemon
router.get('/', async (req, res, next) => {
    try {
        const pokemon = await axios.get(BASE_URL + `/pokemon/pikachu`)
        res.render('pokemon/index', {
            pokemon: pokemon.data
        })
    } catch (err) {
        res.send('Error: ' + req.params.name + ' does not exist')
        // next(err)
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