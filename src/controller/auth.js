const User = require('../models/user.js')
const has = require('has-keys')
const jwt = require('jsonwebtoken')

module.exports = {
  async tokenAuth (req, res, next) {
    if (!has(req.params, 'username'))
      return res.status(400).json({status: false, message: 'Missing user.'})
    const { username } = req.params
    if (!has(req.headers, 'token'))
      return res.status(400).json({status: false, message: 'Access token is missing.'})
    const token = req.get('token')
    if (jwt.verify(token, process.env.SECRET, {algorithm: 'HS256'})) {
      const login = jwt.decode(token)['payload']
      if (username != login)
        return res.status(403).json({status: false, message: 'Access denied.'})
      const data = await User.query().where('username', login)
      if (data.length == 0)
        return res.status(403).json({status: false, message: 'Access denied.'})
    }
    else return res.status(403).json({status: false, message: 'Access denied.'})
    next()
  }
}