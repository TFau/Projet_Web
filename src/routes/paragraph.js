const express = require('express')
const router = express.Router()
const para = require('../controller/paragraph.js')
const story = require('../controller/story.js')
const backend = '/youarethehero'

router.get(`${backend}/:storyname/:paraNum/get`, story.openAccess, para.getParagraph)
router.post(`${backend}/registered/:username/:storyname/:paraNum/*`, para.decode)
router.put(`${backend}/registered/:username/:storyname/:paraNum/*`, para.decode)
router.put(`${backend}/registered/:username/:storyname/:paraNum/write`, para.lockParagraph)
router.delete(`${backend}/registered/:username/:storyname/:paraNum/unwrite`, para.userParagraph, para.unlockParagraph, para.removeParagraph)
router.put(`${backend}/registered/:username/:storyname/:paraNum/validate`, para.validateParagraph, para.addConclusion, para.createChoices)
router.put(`${backend}/registered/:username/:storyname/:paraNum/edit`, para.userParagraph, para.editParagraph)
router.get(`${backend}/registered/:username/:storyname/:paraNum/get`, para.getParagraph)
router.delete(`${backend}/registered/:username/:storyname/:paraNum/del`, para.userParagraph, para.removeParagraph)
router.post(`${backend}/registered/:username/:storyname/:paraNum/addChoice`, para.createChoices)

module.exports = router