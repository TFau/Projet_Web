const { raw } = require('objection')
const { Model } = require('objection')
const Conclusion = require('../models/conclusion.js')
const Paragraph = require('../models/paragraph.js')
const Redirect = require('../models/redirect.js')
const Story = require('../models/story.js')

module.exports = {
  /**
   * Used for choice creation. Sets the id for the future paragraph
   * that will be created when a user chooses to write it.
   */
  async insertChoice(body) {
    try {
      const choice = await Model.transaction(async transact => {
        let paraNum2 = body.existingPara
        if (paraNum2 == 0) {
          paraNum2 = (await Redirect.query(transact)
            .max('paraNum2')
            .where('storyId', body.storyId))[0]['max(`paraNum2`)']
          paraNum2 = (paraNum2 ?? 1) + 1
        }
        paraNum2 = (await Redirect.query(transact).insert({
          text: body.text,
          storyId: body.storyId,
          paraNum1: body.paraNum,
          paraNum2: paraNum2,
          conditions: body.conditionPara
        })).paraNum2
        return paraNum2
      })
      return choice
    } catch (error) {
      throw error
    }
  },

  /**
   * Used for paragraph creation on story creation, and paragraph creation on
   * choice selection by writer (in which case body.text is null).
   */
  async insertParagraph(body) {
    try {
      const para = await Model.transaction(async transact => {
        const paraNum = (await Paragraph.query(transact).insert({
            storyId : body.storyId,
            paraNum: body.paraNum,
            userId: body.userId,
            text: body.text,
            writeOngoing: (body.paraNum == 1) ? null : body.userId
        })).paraNum
        return paraNum
      })
      return para
    } catch (error) {
      throw error
    }
  },

  /**
   * Used to register the associated paragraph as a conclusion, and to
   * increment the associated story's endings counter by 1.
   */
  async insertConclusion(body) {
    try {
      const update = await Model.transaction(async transact => {
        await Conclusion.query(transact).insert({
          storyId: body.storyId,
          paraNum: body.paraNum
        })
        const incrEnding = (await Story.query(transact)
          .patchAndFetchById(body.storyId, { endings: raw('endings + 1') })).storyId
        return incrEnding
      })
      return update
    } catch (error) {
      throw error
    }
  },

  /**
   * Used to delete a paragraph, after checking whether the paragraph has children. 
   */
  async deleteParagraph(body) {
    try {
      const deleted = await Model.transaction(async transact => {
        const paraChoices = await Paragraph.query(transact)
          .findById([body.storyId, body.paraNum])
          .withGraphFetched('choices')
        let del = -1
        let existingChoices = []
        if (paraChoices.choices.length != 0) {
          paraChoices.choices.forEach(function(item, index) {
            this[index] = item.paraNum2}, paraChoices.choices)
          existingChoices = await Redirect.query(transact)
            .join('paragraphs', 'choices.paraNum2', '=', 'paragraphs.paraNum')
            .whereIn('choices.paraNum2', paraChoices.choices)
            .whereNotNull('paragraphs.writeOngoing')
        }
        if (paraChoices.choices.length == 0 || existingChoices.length == 0)
          del = await Paragraph.query(transact).deleteById([body.storyId, body.paraNum])
        return del
      })
      return deleted
    } catch (error) {
      throw error
    }
  }
}