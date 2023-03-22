const express = require('express')
const router = express.Router()
const back = require('../controller/backend.js')
const backend = '/youarethehero'

router.post(`${backend}/*`, back.enforce)
router.put(`${backend}/*`, back.enforce)

module.exports = router