const { Model } = require('objection')
const knex = require('knex')
const db = require('../../knexfile.js')

Model.knex(knex(db))

module.exports = Model