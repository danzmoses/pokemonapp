const express = require('express')
const router = express.Router()
const axios = require('axios')
const BASE_URL = "https://pokeapi.co/api/v2"

router.get('/', async (req, res, next) => {
    try {
        const pokemon = await axios.get(BASE_URL + '/pokemon/pikachu')
        res.render('pokemon/index', {
            pokemon: pokemon.data
        })
    } catch (err) {
        next(err)
    }
})

module.exports = router