const Password = require('objection-password')()
const Model = require('./model.js')

class User extends Password(Model) {
	static get tableName() {
		return 'users'
	}
  static get idColumn() {
    return 'userId'
  }
  static modifiers = {
    nameToId(query, name) {
      const { ref } = User
      query.select(ref('userId')).where('username', name)
    },
    authorSelect(query) {
      const { ref } = User
      query.select(ref('username'))
    }
  }
}
module.exports = User