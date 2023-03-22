const Model = require('./model.js')

class Conclusion extends Model {
  static get tableName() {
    return 'conclusion'
  }
  static get idColumn() {
    return ['storyId', 'paraNum']
  }
}
module.exports = Conclusion