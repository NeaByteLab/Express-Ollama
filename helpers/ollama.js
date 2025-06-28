
require('dotenv').config()
const axios = require('axios')
const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434'

/**
 * Get Answer From Ollama
 * Params: promptText (string)
 */
async function getAnswer(promptText) {
  const responseData = await axios.post(`${ollamaUrl}/api/generate`, { model: 'llama3.2', prompt: promptText, stream: false })
  return responseData.data.response
}

/**
 * Get Embedding From Ollama
 * Params: textValue (string)
 */
async function getEmbedding(textValue) {
  const responseData = await axios.post(`${ollamaUrl}/api/embeddings`, { model: 'nomic-embed-text', prompt: textValue })
  return responseData.data.embedding
}

/**
 * Export Module
 */
module.exports = {
  getAnswer,
  getEmbedding
}