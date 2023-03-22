const Model = require('./model.js')
const Paragraph = require('./paragraph.js')

class Story extends Model {
  static get tableName() {
    return 'stories'
  }
  static get idColumn() {
    return 'storyId'
  }
  static modifiers = {
    nameToId(query, name) {
        const { ref } = Story
        query.select(ref('storyId')).where('name', name)
    }
  }
  static relationMappings = {
    paragraphs: {
      relation: Model.HasManyRelation,
      modelClass: Paragraph,
      join: {
        from: 'stories.storyId',
        to: 'paragraphs.storyId'
      }
    }
  }
}
module.exports = Story