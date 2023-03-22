const express = require('express')
const router = express.Router()
const login = require('../controller/login.js')
const backend = '/youarethehero'

router.post(`${backend}/signup`, login.userSignup, login.userLogin)
router.post(`${backend}/login`, login.userLogin)

module.exports = router