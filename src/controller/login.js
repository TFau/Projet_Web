const User = require('../models/user.js')
const Paragraph = require('../models/paragraph.js')
const jwt = require('jsonwebtoken')

module.exports = {
	async userSignup (req, res, next) {
	  const body = JSON.parse(JSON.stringify(req.body['data'])) //Transforme l'objet JSON reçu en string, puis parse
    const user = await User.query().where('username', body['name'])
    if (user.length > 0)
      return res.status(409).json({status: false, message: 'User already exists.'})
    await User.query().insert({
      username: body['name'],
      password: body['password'],
	  })
    req.signup = 'Successfully signed in. '
	  next()
  },

	async userLogin (req, res) {
		const body = JSON.parse(JSON.stringify(req.body['data']))
    const user = await User.query().first().where('username', body['name'])
    if (user == null)
      return res.status(401).json({status: false, message: 'Incorrect login information.'})
    const valid = await user.verifyPassword(body['password'])
		if (!valid)
      return res.status(401).json({status: false, message: 'Incorrect login information.'})
    const userId = user.userId
		const token = jwt.sign(
		  { payload: body['name'] },
		  process.env.SECRET,
		  {algorithm: 'HS256'}
    )
    let userStatus = await Paragraph.query()
      .select('name', 'paraNum')
      .join('stories', 'stories.storyId', '=', 'paragraphs.storyId')
      .where('writeOngoing', userId)
    if (userStatus.length > 0)
      userStatus = { storyName: userStatus[0].name, paraNum: userStatus[0].paraNum }
    else userStatus = null
    if (req.signup == null)
      req.signup = ''
    res.json({
      status: true,
      message: req.signup + 'Successfully logged in.',
      data: {token: token, userId: userId, userStatus: userStatus}
    })
	}
}