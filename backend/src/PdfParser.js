const pdfParse = require('pdf-parse')
const fs = require('fs')

class PdfParser {
  constructor () {}

  parse(pdf) {
    const pdfBuffer = fs.readFileSync(pdf)
    return pdfParse(pdfBuffer)
  }
}

module.exports = { PdfParser }