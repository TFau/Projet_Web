const { Model } = require('objection')
const Story = require('../models/story.js')
const Paragraph = require('../models/paragraph.js')
const Guest = require('../models/guest.js')
const Conclusion = require('../models/conclusion.js')
const Redirect = require('../models/redirect.js')

module.exports = {
  async updateStoryPrivate (body) {
    try {
      const privateStory = await Model.transaction(async transact => {
        const storyUpdate = await Story.query(transact)
          .patch({ open: 0 })
          .findById(body.storyId)
        const authors = await Paragraph.query(transact)
          .select('storyId', 'userId')
          .where('storyId', body.storyId)
        for (const author of authors) {
          if (author.userId != body.userId) {
            await Guest.query(transact).insert({
              storyId: author.storyId,
              userId: author.userId
            })
          }
        }
        return storyUpdate
      })
      return privateStory
    } catch (error) {
      throw error
    }
  },

  async updateStoryPublic (body) {
    try {
      const publicStory = await Model.transaction(async transact => {
        const storyUpdate = await Story.query(transact)
          .patch({ open: 1 })
          .findById(body.storyId)
        await Guest.query(transact)
          .delete()
          .where('storyId', body.storyId)
        return storyUpdate
      })
      return publicStory
    } catch (error) {
      throw error
    }
  },

  async getParagraphs (body) {
    try {
      const paraWithEndStat = await Model.transaction(async transact => {
        const conclusions = await Conclusion.query(transact)
          .where('storyId', body.storyId)
        const data = []
        const alreadyVisited = new Set()
        for (const concl of conclusions) {
          const endPara = await Paragraph.query(transact)
            .findById([body.storyId, concl.paraNum])
            .withGraphFetched('choices')
          const stack = [endPara]
          alreadyVisited.clear()
          alreadyVisited.add(endPara.paraNum)
          while (stack.length > 0) {
            let current = stack.pop()
            current.leadsToEnd = true
            if (data.find(element => element.paraNum == current.paraNum) == null)
              data.push(current)
            alreadyVisited.add(current.paraNum)
            const parents = await Redirect.query(transact)
              .where('storyId', body.storyId)
              .where('paraNum2', current.paraNum)
            for (const choice of parents) {
              if (!alreadyVisited.has(choice.paraNum1)) {
                const para = await Paragraph.query(transact)
                  .findById([body.storyId, choice.paraNum1])
                  .withGraphFetched('choices')
                stack.push(para)
              }
            }
          }
        }
        const noEndings = await Paragraph.query(transact)
          .where('storyId', body.storyId)
          .whereNotIn('paraNum', [...alreadyVisited])
          .withGraphFetched('choices')
        for (const para of noEndings) {
          para.leadsToEnd = false
          data.push(para)
        }
        return data
      })
      return paraWithEndStat
    } catch (error) {
      throw error
    }
  },

  async updateStoryPublish (body) {
    try {
      const published = await Model.transaction(async transact => {
        const conclusion = (await Story.query(transact)
          .select('endings')
          .findById(body.storyId)).endings
        if (conclusion == 0)
          return conclusion
        await Story.query(transact)
          .patch({ readable: 1 })
          .findById(body.storyId)
        return conclusion
      })
      return published
    } catch (error) {
      throw error
    }
  }
}