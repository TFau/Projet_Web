const User = require('../models/user.js')
const Story = require('../models/story.js')
const Conclusion = require('../models/conclusion.js')
const Paragraph = require('../models/paragraph.js')
const Redirect = require('../models/redirect.js')
const para = require('../util/paragraph.js')
const transact = require('../util/transaction.js')
const multiple = 3

module.exports = {
  /**
   * Decode body for next middleware.
   */
  async decode (req, res, next) {
    req.decodedBody = JSON.parse(JSON.stringify(req.body['data']))
    let { storyname, paraNum } = req.params
    storyname = storyname ?? req.decodedBody['name']
    req.paraNum = (paraNum == null) ? 1 : parseInt(paraNum, 10)
    req.storyId = (await Story.query().modify('nameToId', storyname))[0].storyId
    next()
  },

  /**
   * Transition middleware called during story creation.
   */
  async createParagraph (req, res, next) {
    req.first = 'Story created.'
    next()
  },

  /**
   * A user selects a paragraph for writing. Only one user per paragraph.
   */
  async lockParagraph (req, res) {
    const userStatus = await Paragraph.query()
      .select('writeOngoing')
      .where('writeOngoing', req.decodedBody['userId'])
    if (userStatus.length > 0)
      return res.status(400).json({status: false, message: 'You have already selected a paragraph to write.'})
    const update = await transact.retryTransaction(
      multiple,
      await para.insertParagraph({
        storyId: req.storyId,
        paraNum: req.paraNum,
        userId: req.decodedBody['userId'],
        text: null,
        writeOngoing: req.decodedBody['userId']
      })
    )
    if (!update.success)
      return res.status(409).json({status: false, message: 'Paragraph already selected by another writer.'})
    res.json({status: true, message: 'Paragraph selected for writing.'})
  },

  /**
   * A user releases a selected paragraph without completing it.
   */
  async unlockParagraph (req, res, next) {
    const userStatus = await Paragraph.query()
      .select('paraNum')
      .where('writeOngoing', req.decodedBody['userId'])
    if (userStatus.length == 0 || userStatus[0].paraNum != req.paraNum)
      return res.status(403).json({status: false, message: 'You cannot unlock this selected paragraph.'})
    next()
  },

  /**
   * A user validates a paragraph that they are writing, providing text
   * and choices.
   */
  async validateParagraph (req, res, next) {
    await Paragraph.query()
      .patch({ text: req.decodedBody['text'], writeOngoing: null })
      .findById([req.storyId, req.paraNum])
    req.first = 'Paragraph validated.'
    next()
  },

  /**
   * Update the database to register the new paragraph as a conclusion.
   */
  async addConclusion (req, res, next) {
    if (req.decodedBody['conclusion'] != null) {
      const update = await transact.retryTransaction(
        multiple,
        await para.insertConclusion({
          storyId: req.storyId,
          paraNum: req.paraNum
        })
      )
      if (!update.success)
        return res.status(409).json({status: false, message: 'Server conflict. Please retry.'})
    } else if (req.decodedBody['choices'].length == 0) {
      return res.status(400).json({status: false, message: 'Missing choices'})
    }
    next()
  },

  /**
   * Create choices and their associated empty paragraphs. Used by multiple
   * routes. NOTE: can fail. To maintain consistency, if chained with other
   * middleware must be retried on its own in case of failure.
   */
  async createChoices (req, res) {
    for (let i = 0; i < req.decodedBody['choices'].length; i++) {
      const numChoices = await Redirect.query()
        .count('* as count')
        .where('storyId', req.storyId)
        .where('paraNum1', req.paraNum)
      if (numChoices.length > 0 && numChoices[0].count == 5 )
        return res.status(409).json({status: false, message: 'A paragraph cannot have more than 5 choices.'})
      let existingPara = 0, conditionPara = 'N---N'
      if (req.decodedBody['existingPara'] != null)
        existingPara = req.decodedBody['existingPara'][i]
      if (req.decodedBody['conditions'] != null)
        conditionPara = req.decodedBody['conditions'][i]
      const paraNum2 = await transact.retryTransaction(
        multiple,
        await para.insertChoice({
          text: req.decodedBody['choices'][i],
          storyId: req.storyId,
          paraNum: req.paraNum,
          existingPara: existingPara,
          conditionPara: conditionPara
        })
      )
      if (!paraNum2.success)
        return res.status(409).json({status: false, message: 'Server conflict. Please revalidate choices.'})
    }
    if (req.first == null) {
      req.first = 'Choices created.'
    }
    res.json({status: true, message: req.first})
  },

  /**
   * Check whether current paragraph belongs to current user.
   */
  async userParagraph (req, res, next) {
    if (req.method == 'DELETE') {
      let { username, storyname, paraNum } = req.params
      req.decodedBody = { 'userId': (await User.query().modify('nameToId', username))[0].userId }
      req.storyId = (await Story.query().modify('nameToId', storyname))[0].storyId
      req.paraNum = parseInt(paraNum, 10)
    }
    const userPara = await Paragraph.query()
      .select('userId')
      .findById([req.storyId, req.paraNum])
      .where('userId', req.decodedBody['userId'])
    if (userPara == null)
      return res.status(403).json('Permission denied.')
    next()
  },

  /**
   * Edit an already validated paragraph. Can only be done by the paragraph's
   * writer.
   */
  async editParagraph (req, res) {
    await Paragraph.query()
      .patch({ text: req.decodedBody['text'] })
      .findById([req.storyId, req.paraNum])
    res.json({status: true, message: 'Paragraph successfully modified.'})
  },

  /**
   * Return the selected paragraph and its choices.
   */
  async getParagraph (req, res) {
    let { storyname, paraNum } = req.params
    paraNum = parseInt(paraNum, 10)
    const storyId = (await Story.query().modify('nameToId', storyname))[0].storyId
    const para = await Paragraph.query()
      .findById([storyId, paraNum])
      .withGraphFetched('choices')
      .withGraphFetched('author(authorSelect)')
    if (para == null)
      return res.status(400).json({status: false, message: 'Paragraph does not exist.'})
    const conclusion = await Conclusion.query().findById([storyId, paraNum])
    const data = [para, { conclusion: conclusion != null ? true : false }]
    res.json({status: true, message: 'Paragraph selected.', data})
  },

  /**
   * Deletes an already existing paragraph. Can only be done by the paragraph's
   * writer, and only if the paragraph does not lead to other paragraphs.
   */
  async removeParagraph (req, res) {
    if (req.paraNum != 1) {
      const deletion = await transact.retryTransaction(
        multiple,
        await para.deleteParagraph({
          storyId: req.storyId,
          paraNum: req.paraNum
        })
      )
      if (!deletion.success)
        return res.status(409).json({status: false, message: 'Server conflict. Please try again.'})
      if (deletion.result < 0)
        return res.status(400).json({status: false, message: 'This paragraph cannot be deleted.'})
    }
    else
      return res.status(400).json({status: false, message: 'This paragraph cannot be deleted.'})
    res.json({status: true, message: 'Paragraph successfully deleted.'})
  }
}
