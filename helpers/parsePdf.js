const PDFParser = require('pdf2json')

/**
 * Extract Text From Single Page
 * Params: page (object)
 */
function extractTextFromPage(page) {
  if (page.Texts) {
    return page.Texts.map(t => decodeURIComponent(t.R.map(r => r.T).join(''))).join(' ')
  } else {
    return ''
  }
}

/**
 * Parse PDF File
 * Params: pdfPath (string)
 */
async function parsePdf(pdfPath) {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser()
    pdfParser.on('pdfParser_dataReady', (pdfData) => {
      const pages = pdfData.Pages || []
      const pageTexts = pages.map(extractTextFromPage)
      const text = pageTexts.join('\n')
      const chunks = splitChunks(text)
      const pageCount = pages.length
      const title = pdfData.Info && pdfData.Info.Title ? pdfData.Info.Title : ''
      resolve({ title, info: pdfData.Info, pageCount, chunks })
    })
    pdfParser.on('pdfParser_dataError', (err) => {
      reject(err)
    })
    pdfParser.on('error', (err) => {
      reject(err)
    })
    pdfParser.loadPDF(pdfPath)
  })
}

/**
 * Split Text Into Chunk
 * Params: text (string), chunkSize (number, default 500)
 */
function splitChunks(text, chunkSize = 500) {
  const wordList = text.split(/\s+/)
  let chunkResult = []
  for (let i = 0; i < wordList.length; i += chunkSize) {
    chunkResult.push(wordList.slice(i, i + chunkSize).join(' '))
  }
  return chunkResult
}

/**
 * Export Module
 */
module.exports = parsePdf