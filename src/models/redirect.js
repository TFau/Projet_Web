const Model = require('./model.js')

class Redirect extends Model {
  static get tableName() {
    return 'choices'
  }
  static get idColumn() {
    return ['storyId', 'paramNum1', 'paramNum2']
  }
  static modifiers = {
    graphSelect(query) {
      const { ref } = Redirect
      query.select(ref('text'), ref('paraNum1'), ref('paraNum2'))
    }
  }
}
module.exports = Redirect