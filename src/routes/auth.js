const express = require('express')
const router = express.Router()
const auth = require('../controller/auth.js')
const backend = '/youarethehero'

router.use(`${backend}/registered/:username/*`, auth.tokenAuth)

module.exports = router