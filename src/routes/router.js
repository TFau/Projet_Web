const router = require('express').Router()
router.use(require('./auth'))
router.use(require('./login'))
router.use(require('./backend'))
router.use(require('./story'))
router.use(require('./paragraph'))

module.exports = router