const app = require('../app.js')
const request = require('supertest')
const userModel = require('../models/user.js')
const Model = require('../models/model.js')
const env = require("dotenv").config()

describe('Users managment', (done) => {
  test('Mauvais Lien', async () => {
      const wronglink = await request(app)
                .get(`/youarethehero/wronglink`)
            expect(wronglink.statusCode).toBe(404)
  })
  test('Adding one user', async () => {
        await request(app)
                  .post('/youarethehero/signup')
                  .send({data :{name: 'test1', password: 'test1'}})


    })

    test('Trying to add the same', async () => {
            const getusers = await request(app)
                      .post('/youarethehero/signup')
                      .send({data :{name: 'test1', password: 'test1'}})
                  expect(getusers.statusCode).toBe(409)
                  expect(getusers.body.message).toBe('User already exists.')
        })


    test('Wrong logging', async () => {
                         const login = await request(app)
                                  .post('/youarethehero/login')
                                  .send({data : {name: 'test1', password: 'taist1'}})
                         expect(login.body.message).toBe('Incorrect login information.')
                         expect(login.statusCode).toBe(401)
    })

    test('logging + stories creation', async () => {
                        //Logging and taking token, userId and userStatus
                         const login = await request(app)
                                   .post('/youarethehero/login')
                                   .send({data : {name: 'test1', password: 'test1'}})
                               expect(login.statusCode).toBe(200)
                               token = login.body.data.token
                               userId = login.body.data.userId
                               userStatus = login.body.data.userStatus
    })

      test('Adding some users', async () => {
            await request(app)
                      .post('/youarethehero/signup')
                      .send({data :{name: 'test2', password: 'test2'}})

            await request(app)
                      .post('/youarethehero/signup')
                      .send({data :{name: 'test3', password: 'test3'}})

        })

})

describe('Public story Managment', (done) => {
        test('logging + stories creation', async () => {
                        //Logging and taking token, userId and userStatus
                         const login = await request(app)
                                   .post('/youarethehero/login')
                                   .send({data : {name: 'test1', password: 'test1'}})
                               expect(login.statusCode).toBe(200)
                               token = login.body.data.token
                               userId = login.body.data.userId
                               userStatus = login.body.data.userStatus

                         //Creating a new story
                         const newstory = await request(app)
                                    .post('/youarethehero/registered/test1/story/new')
                                    .send({data : {name: 'histoire0', choices: ['droite', 'gauche'],open: true, userId: userId, text: 'histoire 0 paragraphe 1'}})
                                    .set({token : token})
                             expect(newstory.statusCode).toBe(200)
                             expect(newstory.body.message).toBe("Story created.")

                         //Trying to recreate the same story
                         const newnewstory = await request(app)
                                     .post('/youarethehero/registered/test1/story/new')
                                     .send({data : {name: 'histoire0', choices: ['droite', 'gauche'], open: true, userId: userId, text: 'Histoire 0 paragraphe 1'}})
                                     .set({token : token})
                              expect(newnewstory.statusCode).toBe(409)
                              expect(newnewstory.body.message).toBe("Story name already taken.")

                         //Creating stories without choices
                         const storywithoutchoices = await request(app)
                                     .post('/youarethehero/registered/test1/story/new')
                                     .send({data : {name: 'histoireSansChoix', choices: [], open: true, userId: userId, text: 'Histoire 1 paragraphe 1'}})
                                     .set({token : token})
                              expect(storywithoutchoices.statusCode).toBe(400)
                              expect(storywithoutchoices.body.message).toBe("Missing choices.")

                         //Checking the stories existing for this user
                         const getstories = await request(app)
                                     .get('/youarethehero/registered/test1/story/get')
                                     .set({token : token})
                              expect(getstories.statusCode).toBe(200)
                              expect(getstories.body.message).toBe('Stories found.')
                              expect(getstories.body.data).toHaveLength(1)

                         //Writting
                         const getparagraphs = await request(app)
                                     .get('/youarethehero/registered/test1/histoire0/get')
                                     .set({token : token})
                              expect(getparagraphs.statusCode).toBe(200)
                              expect(getparagraphs.body.message).toBe('Paragraphs found.')
                              expect(getparagraphs.body.data[0].choices).toHaveLength(2)

                         const selectwrite = await request(app)
                                     .put('/youarethehero/registered/test1/histoire0/2/write')
                                     .send({data : {userId : userId}})
                                     .set({token : token})
                              expect(selectwrite.statusCode).toBe(200)
                              expect(selectwrite.body.message).toBe('Paragraph selected for writing.')

                         const writeright = await request(app)
                                     .put('/youarethehero/registered/test1/histoire0/2/validate')
                                     .send({data : {userId : userId, text: 'histoire 0 paragraphe 2', choices : [], existingPara : [], conclusion : true}})
                                     .set({token : token})
                              expect(writeright.statusCode).toBe(200)
                              expect(writeright.body.message).toBe('Paragraph validated.')
            })
        test('Writting left by another user', async () => {
                        //Logging and taking token, userId and userStatus
                         const login = await request(app)
                                   .post('/youarethehero/login')
                                   .send({data : {name: 'test2', password: 'test2'}})
                               expect(login.statusCode).toBe(200)
                               token = login.body.data.token
                               userId = login.body.data.userId
                               userStatus = login.body.data.userStatus

                         const selectleft = await request(app)
                                     .put('/youarethehero/registered/test2/histoire0/3/write')
                                     .send({data : {userId : userId}})
                                     .set({token : token})
                              expect(selectleft.statusCode).toBe(200)
                              expect(selectleft.body.message).toBe('Paragraph selected for writing.')

                         const writeleft = await request(app)
                                     .put('/youarethehero/registered/test2/histoire0/3/validate')
                                     .send({data : {userId : userId, text: 'histoire 0 paragraphe 3', choices : ['droite', 'gauche'], existingPara : [0, 0]}})
                                     .set({token : token})
                              expect(writeleft.statusCode).toBe(200)
                              expect(writeleft.body.message).toBe('Paragraph validated.')
          })
          
          test('Writting some paragraphs ', async () => {
                                  //Logging and taking token, userId and userStatus
                                   const login = await request(app)
                                             .post('/youarethehero/login')
                                             .send({data : {name: 'test1', password: 'test1'}})
                                         expect(login.statusCode).toBe(200)
                                         token = login.body.data.token
                                         userId = login.body.data.userId
                                         userStatus = login.body.data.userStatus
                                         
                         const select4 = await request(app)
                                     .put('/youarethehero/registered/test1/histoire0/4/write')
                                     .send({data : {userId : userId}})
                                     .set({token : token})
                              expect(select4.statusCode).toBe(200)
                              expect(select4.body.message).toBe('Paragraph selected for writing.')

                         const write4 = await request(app)
                                     .put('/youarethehero/registered/test1/histoire0/4/validate')
                                     .send({data : {userId : userId, text: 'histoire 1 paragraphe 4', choices : ['droite', 'gauche'], existingPara : [0, 0]}})
                                     .set({token : token})
                              expect(write4.statusCode).toBe(200)
                              expect(write4.body.message).toBe('Paragraph validated.')

                         const select6 = await request(app)
                                     .put('/youarethehero/registered/test1/histoire0/6/write')
                                     .send({data : {userId : userId}})
                                     .set({token : token})
                              expect(select6.statusCode).toBe(200)
                              expect(select6.body.message).toBe('Paragraph selected for writing.')

                         const write6 = await request(app)
                                     .put('/youarethehero/registered/test1/histoire0/6/validate')
                                     .send({data : {userId : userId, text: 'histoire 1 paragraphe 6', choices : [], existingPara : [], conclusion : true}})
                                     .set({token : token})
                              expect(write6.statusCode).toBe(200)
                              expect(write6.body.message).toBe('Paragraph validated.')

                         const select5 = await request(app)
                                     .put('/youarethehero/registered/test1/histoire0/5/write')
                                     .send({data : {userId : userId}})
                                     .set({token : token})
                              expect(select5.statusCode).toBe(200)
                              expect(select5.body.message).toBe('Paragraph selected for writing.')

                         const write5 = await request(app)
                                     .put('/youarethehero/registered/test1/histoire0/5/validate')
                                     .send({data : {userId : userId, text: 'histoire 0 paragraphe 5', choices : ['tout droit'], existingPara : [6]}})
                                     .set({token : token})
                              expect(write5.statusCode).toBe(200)
                              expect(write5.body.message).toBe('Paragraph validated.')

                         const select7 = await request(app)
                                     .put('/youarethehero/registered/test1/histoire0/7/write')
                                     .send({data : {userId : userId}})
                                     .set({token : token})
                              expect(select7.statusCode).toBe(200)
                              expect(select7.body.message).toBe('Paragraph selected for writing.')

                         const write7 = await request(app)
                                     .put('/youarethehero/registered/test1/histoire0/7/validate')
                                     .send({data : {userId : userId, text: 'histoire 0 paragraphe 7', choices : ['droite', 'gauche'], existingPara : [0, 0]}})
                                     .set({token : token})
                              expect(write7.statusCode).toBe(200)
                              expect(write7.body.message).toBe('Paragraph validated.')

                         const select8 = await request(app)
                                     .put('/youarethehero/registered/test1/histoire0/8/write')
                                     .send({data : {userId : userId}})
                                     .set({token : token})
                              expect(select8.statusCode).toBe(200)
                              expect(select8.body.message).toBe('Paragraph selected for writing.')

                         const write8 = await request(app)
                                     .put('/youarethehero/registered/test1/histoire0/8/validate')
                                     .send({data : {userId : userId, text: 'histoire 0 paragraphe 8', choices : [], existingPara : [], conclusion : true}})
                                     .set({token : token})
                              expect(write8.statusCode).toBe(200)
                              expect(write8.body.message).toBe('Paragraph validated.')
                                         
                         const select9 = await request(app)
                                     .put('/youarethehero/registered/test1/histoire0/9/write')
                                     .send({data : {userId : userId}})
                                     .set({token : token})
                              expect(select9.statusCode).toBe(200)
                              expect(select9.body.message).toBe('Paragraph selected for writing.')

                         const write9 = await request(app)
                                     .put('/youarethehero/registered/test1/histoire0/9/validate')
                                     .send({data : {userId : userId, text: 'histoire 1 paragraphe 9', choices : [], existingPara : [], conclusion : true}})
                                     .set({token : token})
                              expect(write9.statusCode).toBe(200)
                              expect(write9.body.message).toBe('Paragraph validated.')

                         //Publishing the story
                         const publish = await request(app)
                                     .put('/youarethehero/registered/test1/histoire0/publish')
                                     .send({data :{}})
                                     .set({token : token})
                              expect(publish.statusCode).toBe(200)
                              expect(publish.body.message).toBe('Story published.')
          })
                                         
          
})

describe('Private story managment', (done) => {
          test('Logging/Creating/Inviting ', async () => {
                                  //Logging and taking token, userId and userStatus
                                   const login = await request(app)
                                             .post('/youarethehero/login')
                                             .send({data : {name: 'test1', password: 'test1'}})
                                         expect(login.statusCode).toBe(200)
                                         token = login.body.data.token
                                         userId = login.body.data.userId
                                         userStatus = login.body.data.userStatus

                                 const newstory = await request(app)
                                            .post('/youarethehero/registered/test1/story/new')
                                            .send({data : {name: 'histoire1', choices: ['droite', 'milieu'], open: false, userId: userId, text: 'Histoire 1 paragraphe 1'}})
                                            .set({token : token})
                                     expect(newstory.statusCode).toBe(200)
                                     expect(newstory.body.message).toBe("Story created.")

                                 const invit = await request(app)
                                            .post('/youarethehero/registered/test1/histoire1/invite')
                                            .send({data: {name: 'test2'}})
                                            .set({token : token})
                                      expect(invit.statusCode).toBe(200)
                                      expect(invit.body.message).toBe('Guest invited.')

                                 //Selecting paragraph to write
                                 const select = await request(app)
                                             .put('/youarethehero/registered/test1/histoire1/2/write')
                                             .send({data : {userId : userId}})
                                             .set({token : token})
                                      expect(select.statusCode).toBe(200)
                                      expect(select.body.message).toBe('Paragraph selected for writing.')

                                 //Trying selecting another one
                                 const selectanother = await request(app)
                                             .put('/youarethehero/registered/test1/histoire1/3/write')
                                             .send({data : {userId : userId}})
                                             .set({token : token})
                                      expect(selectanother.statusCode).toBe(400)
                                      expect(selectanother.body.message).toBe('You have already selected a paragraph to write.')

          })

          test('Logging test 2 and writing ', async () => {
                                  //Logging and taking token, userId and userStatus
                                   const login = await request(app)
                                             .post('/youarethehero/login')
                                             .send({data : {name: 'test2', password: 'test2'}})
                                         expect(login.statusCode).toBe(200)
                                         token = login.body.data.token
                                         userId = login.body.data.userId
                                         userStatus = login.body.data.userStatus

                                   //Trying to write the same than test1 (Erreur de BDD)
                                 const select = await request(app)
                                             .put('/youarethehero/registered/test2/histoire1/1/write')
                                             .send({data : {userId : userId}})
                                             .set({token : token})
                                      expect(select.statusCode).toBe(500)

                                 //Adding a choices
                                 const addchoice = await request(app)
                                             .post('/youarethehero/registered/test2/histoire1/1/addChoice')
                                             .send({data : {choices : ['gauche'], existingPara : [0]}})
                                             .set({token : token})
                                      expect(addchoice.statusCode).toBe(200)
                                      expect(addchoice.body.message).toBe('Choices created.')
          })

})


describe('Reading a beautiful story', (done) => {
          test('Logging and reading ', async () => {
                                  //Logging and taking token, userId and userStatus
                                   const login = await request(app)
                                             .post('/youarethehero/login')
                                             .send({data : {name: 'test3', password: 'test3'}})
                                         expect(login.statusCode).toBe(200)
                                         token = login.body.data.token
                                         userId = login.body.data.userId
                                         userStatus = login.body.data.userStatus

                                   const stories = await request(app)
                                            .get('/youarethehero/story/get')
                                         expect(stories.statusCode).toBe(200)
                                         expect(stories.body.data).toHaveLength(1)

                                   const para1 = await request(app)
                                            .get('/youarethehero/histoire0/1/get')
                                         expect(para1.statusCode).toBe(200)
                                         expect(para1.body.data[0].text).toBe('histoire 0 paragraphe 1')

                                   const para3 = await request(app)
                                            .get('/youarethehero/histoire0/3/get')
                                         expect(para3.statusCode).toBe(200)
                                         expect(para3.body.data[0].text).toBe('histoire 0 paragraphe 3')

                                   const para5 = await request(app)
                                            .get('/youarethehero/histoire0/5/get')
                                         expect(para5.statusCode).toBe(200)
                                         expect(para5.body.data[0].text).toBe('histoire 0 paragraphe 5')

                                   const para7 = await request(app)
                                            .get('/youarethehero/histoire0/7/get')
                                         expect(para7.statusCode).toBe(200)
                                         expect(para7.body.data[0].text).toBe('histoire 0 paragraphe 7')

                                   const para8 = await request(app)
                                            .get('/youarethehero/histoire0/8/get')
                                         expect(para8.statusCode).toBe(200)
                                         expect(para8.body.data[0].text).toBe('histoire 0 paragraphe 8')
    })

})