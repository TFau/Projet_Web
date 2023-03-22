const Story = require('../models/story.js')
const User = require('../models/user.js')
const Guest = require('../models/guest.js')
const para = require('../util/paragraph.js')
const story = require('../util/story.js')
const transact = require('../util/transaction.js')
const multiple = 3

module.exports = {
  /**
   * Create a new story, including its starting paragraph and choices.
   */
  async createStory (req, res, next) {
    const body = JSON.parse(JSON.stringify(req.body['data']))
    const existing = await Story.query().modify('nameToId', body['name'])
    if (existing.length > 0)
      return res.status(409).json({status: false, message: 'Story name already taken.'})
    if (body['choices'].length == 0)
      return res.status(400).json({status: false, message: 'Missing choices.'})
    const storyId = (await Story.query().insert({
        name: body['name'],
        open: body['open'],
        userId: body['userId']
    })).storyId
    const insertion = await transact.retryTransaction(
      multiple,
      await para.insertParagraph({
        storyId: storyId,
        paraNum: 1,
        text: body['text'],
        userId: body['userId']
      }))
    if (!insertion.success)
      return res.status(409).json({status: false, message: 'Server conflict. Please retry.'})
    next()
  },

  /**
   * Get stories, their starting paragraph, its text and choices
   * from the database.
   */
  async getStories (req, res) {
    const { username } = req.params
    const userId = (await User.query().modify('nameToId', username))[0].userId
    let getQuery = Story.query()
      .where('open', true)
      .orWhere('stories.userId', userId)
    if (req.originalUrl.search('edit') == -1)
      getQuery.orWhere('readable', true)
    getQuery.union([
      Guest.query()
        .select('stories.storyId', 'name', 'open', 'readable', 'endings', 'stories.userId')
        .join('stories', 'guests.storyId', '=', 'stories.storyId')
        .where('guests.userId', userId)
    ])
    .select('stories.storyId', 'stories.name', 'stories.open', 'stories.readable',
    'stories.endings', 'stories.userId')
    .withGraphFetched('paragraphs(openingSelect) as firstParagraph.[choices(graphSelect)]')
    .withGraphFetched('paragraphs(authors) as authors')
    let data = await getQuery
    res.json({status: true, message: 'Stories found.', data})
  },

  async getPublishedStories (req, res) {
    let data = await Story.query()
      .where('readable', true)
      .withGraphFetched('paragraphs(openingSelect) as firstParagraph.[choices(graphSelect)]')
      .withGraphFetched('paragraphs(authors) as authors')
    res.json({status: true, message: 'Stories found.', data})
  },

  /**
   * Check whether current user (from URL) is authorized to access current
   * story (from URL).
   */
  async storyAccess (req, res, next) {
    const { username, storyname } = req.params
    const userId = (await User.query().modify('nameToId', username))[0].userId
    let storyId = await Story.query().modify('nameToId', storyname)
    if (storyId.length == 0)
      return res.status(400).json({status: false, message: 'Story does not exist.'})
    storyId = storyId[0].storyId
    let accessQuery = Story.query()
      .select('stories.storyId', 'stories.userId')
      .where('storyId', storyId)
    if (req.method == 'GET')
      accessQuery.where(builder => {
        builder.where('readable', true).orWhere('open', true).orWhere('stories.userId', userId)
      })
    else
    accessQuery.where(builder => {
      builder.where('open', true).orWhere('stories.userId', userId)
    })
    accessQuery.union([
      Guest.query()
        .select('guests.storyId', 'guests.userId')
        .join('stories', 'guests.storyId', '=', 'stories.storyId')
        .where('guests.userId', userId)
        .where('guests.storyId', storyId)
    ])
    const access = await accessQuery
    if (access.length == 0)
      return res.status(403).json({status: false, message: 'Access denied.'})
    req.userId = userId
    req.storyId = storyId
    next()
  },

  async openAccess (req, res, next) {
    const { storyname } = req.params
    let story = await Story.query()
      .select('storyId', 'readable')
      .where('name', storyname)
    if (story.length == 0)
      return res.status(400).json({status: false, message: 'Story does not exist.'})
    if (!story[0].readable)
      return res.status(403).json({status: false, message: 'Access denied.'})
    req.storyId = story[0].storyId
    next()
  },

  async findParagraphs (req, res) {
    const paraWithEnding = await transact.retryTransaction(
      multiple,
      await story.getParagraphs({ storyId: req.storyId })
    )
    if (!paraWithEnding.success)
      return res.status(409).json({status: false, message: 'Server conflict. Please retry.'})
    const data = paraWithEnding.result
    res.json({status: true, message: 'Paragraphs found.', data})
  },

  /**
   * Check whether current story belongs to current user.
   */
  async userStory (req, res, next) {
    const userStory = await Story.query()
      .select('storyId', 'userId')
      .where('userId', req.userId)
      .where('storyId', req.storyId)
    if (userStory.length == 0)
      return res.status(403).json({status: false, message: 'Access denied.'})
    next()
  },

  /**
   * Switch a public story to private. Story authors are automatically invited
   * as guests.
   */
  async makePrivate (req, res) {
    const status = (await Story.query()
      .select('open')
      .findById(req.storyId)).open
    if (status == 0)
      return res.status(400).json({status: false, message: 'Story is already private.'})
    const privateStory = await transact.retryTransaction(
      multiple,
      await story.updateStoryPrivate({
        storyId: req.storyId,
        userId: req.userId
      })
    )
    if (!privateStory.success)
     return res.status(409).json({status: false, message: 'Server conflict. Please retry.'})
    res.json({status: true, message: 'Story made private. Current authors have been automatically invited.'})
  },

  async makePublic (req, res) {
    const status = (await Story.query()
      .select('open')
      .findById(req.storyId)).open
    if (status == 1)
      return res.status(400).json({status: false, message: 'Story is already public.'})
    const publicStory = await transact.retryTransaction(
      multiple,
      await story.updateStoryPublic({ storyId: req.storyId })
    )
    if (!publicStory.success)
      return res.status(409).json({status: false, message: 'Server conflict. Please retry.'})
    res.json({status: true, message: 'Story made public.'})
  },

  /**
   * Invite a user to a story, allowing them to view and edit it.
   */
  async inviteGuest (req, res) {
    const body = JSON.parse(JSON.stringify(req.body['data']))
    const storyStatus = (await Story.query()
      .select('open')
      .findById(req.storyId)).open
    if (storyStatus) {
      return res.status(400).json({status: false, message: 'Cannot invite guests to a public story.'})
    }
    let userId = await User.query()
      .select('userId')
      .where('username', body['name'])
    if (userId.length == 0)
      return res.status(400).json({status: false, message: 'User does not exist.'})
    userId = userId[0].userId
    await Guest.query().insert({
      storyId: req.storyId,
      userId: userId
    })
    res.json({status: true, message: 'Guest invited.'})
  },

  async publishStory (req, res) {
    const published = await transact.retryTransaction(
      multiple,
      await story.updateStoryPublish({ storyId: req.storyId })
    )
    if (!published.success)
      return res.status(409).json({status: false, message: 'Server conflict. Please retry.'})
    if (published.result == 0)
      return res.status(400).json({status: false, message: 'Story cannot be published without at least one ending.'})
    res.json({status: true, message: 'Story published.'})
  },

  async unpublishStory (req, res) {
    await Story.query()
      .patch({ readable: 0 })
      .findById(req.storyId)
    res.json({status: true, message: 'Story unpublished.'})
  }
}