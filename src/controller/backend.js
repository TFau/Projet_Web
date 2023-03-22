const {raw} = require('objection')
const User = require('../models/user.js')
const has = require('has-keys')

module.exports = {
  async enforce(req, res, next) {
    raw('PRAGMA foreign_keys=ON')
    if (!has(req.body, 'data'))
      return res.status(400).json({status: false, message: 'Missing data.'})
    next()
  }
}