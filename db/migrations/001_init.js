/**
 * Create Documents And Chunks Table
 * Params: knex (object)
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('documents', (table) => {
      table.string('id').primary()
      table.string('filename').index('filename')
      table.integer('page_count').index('page_count')
      table.integer('timestamp').index('timestamp')
    })
    .createTable('chunks', (table) => {
      table.string('id').primary()
      table.string('id_document').index('id_document')
      table.integer('id_chunk').index('id_chunk')
      table.text('doc_summary').index('doc_summary')
      table.integer('doc_page').index('doc_page')
      table.json('doc_embed').index('doc_embed')
      table.integer('timestamp').index('timestamp')
    })
}

/**
 * Drop Documents And Chunks Table
 * Params: knex (object)
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('chunks')
    .dropTableIfExists('documents')
}