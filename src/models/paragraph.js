const Model = require('./model.js')
const Redirect = require('./redirect.js')
const User = require('./user.js')

class Paragraph extends Model {
  static get tableName() {
    return 'paragraphs'
  }
  static get idColumn() {
    return ['storyId', 'paraNum']
  }
  static modifiers = {
    openingSelect(query) {
      const { ref } = Paragraph
      query.select(ref('storyId'), ref('text'))
        .where(ref('paraNum'), 1)
    },
    authors(query) {
      const { ref } = Paragraph
      query.distinct('username')
        .join('users', 'users.userId', '=', ref('userId'))
    }
  }
  static relationMappings = {
    choices: {
      relation: Model.HasManyRelation,
      modelClass: Redirect,
      join: {
        from: [
          'paragraphs.storyId',
          'paragraphs.paraNum'
        ],
        to: [
          'choices.storyId',
          'choices.paraNum1'
        ]
      }
    },
    author: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'paragraphs.userId',
        to: 'users.userId'
      }
    }
  }
}
module.exports = Paragraph