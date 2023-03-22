/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('users', table => {
      table.increments('userId').primary().index('users_userId')
      table.string('username').unique()
      table.string('password')
    })
    .createTable('stories', table => {
      table.increments('storyId').primary().index('stories_storyId')
      table.string('name').unique()
      table.boolean('open')
      table.boolean('readable').defaultTo(false)
      table.integer('endings').defaultTo(0)
      table.integer('userId')
      table.foreign('userId').references('userId').inTable('users')
    })
    .createTable('paragraphs', table => {
      table.integer('storyId')
      table.integer('paraNum')
      table.integer('userId')
      table.string('text')
      table.integer('writeOngoing')
      table.foreign('storyId').references('storyId').inTable('stories')
      table.foreign('userId').references('userId').inTable('users')
      table.foreign('writeOngoing').references('userId').inTable('users')
      table.primary(['storyId', 'paraNum'])
      table.index(['storyId', 'paraNum'], 'paragraphs_id')
    })
    .createTable('guests', table => {
      table.integer('storyId')
      table.integer('userId')
      table.foreign('storyId').references('storyId').inTable('stories')
      table.foreign('userId').references('userId').inTable('users')
      table.primary(['storyId', 'userId'])
    })
    .createTable('choices', table => {
      table.string('text')
      table.integer('storyId')
      table.integer('paraNum1')
      table.integer('paraNum2')
      table.string('conditions').defaultTo('N---N')
      table.foreign('storyId').references('storyId').inTable('stories')
      table.foreign('paraNum1').references('paraNum').inTable('paragraphs')
        .onDelete('CASCADE')
      table.foreign('paraNum2').references('paraNum').inTable('paragraphs')
        .onDelete('SET NULL')
      table.primary(['storyId', 'paraNum1', 'paraNum2'])
      table.index(['storyId', 'paraNum1'], 'choices_id')
    })
    .createTable('conclusion', table => {
      table.integer('storyId')
      table.integer('paraNum')
      table.foreign('storyId').references('storyId').inTable('stories')
      table.foreign('paraNum').references('paraNum').inTable('paragraphs')
        .onDelete('CASCADE')
      table.primary(['storyId', 'paraNum'])
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTable('users')
    .dropTable('paragraphs')
    .dropTable('stories')
    .dropTable('guests')
    .dropTable('conclusion')
    .dropTable('choices')
};
