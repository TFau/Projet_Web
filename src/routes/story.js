const express = require('express')
const router = express.Router()
const story = require('../controller/story.js')
const para = require('../controller/paragraph.js')
const backend = '/youarethehero'

router.get(`${backend}/story/get`, story.getPublishedStories)
router.get(`${backend}/:storyname/get`, story.openAccess, story.findParagraphs)
router.post(`${backend}/registered/:username/story/new`, story.createStory, para.decode, para.createParagraph, para.createChoices)
router.get(`${backend}/registered/:username/story/get`, story.getStories)
router.get(`${backend}/registered/:username/story/edit/get`, story.getStories)
router.use(`${backend}/registered/:username/:storyname/*`, story.storyAccess)
router.get(`${backend}/registered/:username/:storyname/get`, story.findParagraphs)
router.put(`${backend}/registered/:username/:storyname/private`, story.userStory, story.makePrivate)
router.put(`${backend}/registered/:username/:storyname/public`, story.userStory, story.makePublic)
router.post(`${backend}/registered/:username/:storyname/invite`, story.userStory, story.inviteGuest)
router.put(`${backend}/registered/:username/:storyname/publish`, story.userStory, story.publishStory)
router.put(`${backend}/registered/:username/:storyname/unpublish`, story.userStory, story.unpublishStory)

module.exports = router