const Model = require('./model.js')

class Guest extends Model {
  static get tableName() {
    return 'guests'
  }
  static get idColumn() {
    return ['storyId', 'userId']
  }
}
module.exports = Guest