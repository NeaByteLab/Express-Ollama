const ForgeID = require('forgeid')
const path = require('path')
const db = require('../config/db')
const parsePdf = require('../helpers/parsePdf')
const { getEmbedding } = require('../helpers/ollama')
const forge = new ForgeID('peratural-ollama-neabytelab')

/**
 * Process PDF File Into Database
 * Params: filePath (string)
 */
async function processFile(filePath) {
  const filename = path.basename(filePath)
  const findDocument = await db('documents').where({ filename }).first()
  if (findDocument) {
    await db('chunks').where({ id_document: findDocument.id }).del()
    await db('documents').where({ id: findDocument.id }).del()
  }
  const { pageCount, chunks } = await parsePdf(filePath)
  const documentId = forge.generate('doc')
  const timestampNow = Math.floor(Date.now() / 1000)
  await db('documents').insert({ id: documentId, filename, page_count: pageCount, timestamp: timestampNow })
  for (let i = 0; i < chunks.length; i++) {
    const chunkText = chunks[i]
    if (!(chunkText.trim())) {
      continue
    }
    const chunkId = forge.generate('chunk')
    const embeddingVector = await getEmbedding(chunkText)
    await db('chunks').insert({
      id: chunkId,
      id_document: documentId,
      id_chunk: i,
      doc_summary: chunkText,
      doc_page: 1,
      doc_embed: JSON.stringify(embeddingVector),
      timestamp: timestampNow
    })
  }
}

/**
 * Export Module
 */
module.exports = processFile