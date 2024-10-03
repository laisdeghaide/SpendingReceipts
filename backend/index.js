const fs = require('fs')
const path = require('path')
const express = require('express') 
const { PdfParser } = require('./src/PdfParser')
const { ReceiptParser } = require('./src/ReceiptParser')
const createCsvWriter = require('csv-writer').createObjectCsvWriter

const OUTPUT_DIRECTORY = './receipts-parsed'
const PDF_DIRECTORY = './costco-receipt-pdfs'

class ReceiptProcessor {
  constructor(pdfDirectory, outputDirectory) {
    this.pdfDirectory = pdfDirectory
    this.outputDirectory = outputDirectory
    this.transactionsWithDate = []
    this.fullTransactionsInfo = []
  }

  async run() {
    this.resetOutputDir()
    const pdfFiles = this.getPdfFiles()
    this.transactionsWithDate = [] // Clear previous transactions
    this.fullTransactionsInfo = []

    for (const pdf of pdfFiles) {
      const { transactions, metadata } = await this.parsePdf(pdf)

      // Used for CSV
      this.transactionsWithDate.push(...transactions.map(transaction => ({
        ...transaction,
        date: metadata.date
      })))

      // Used for API/dashboard
      this.fullTransactionsInfo.push({
        metadata: metadata,
        transactions: transactions
      })
    }

    this.writeCSV(this.transactionsWithDate)
  }

  resetOutputDir() {
    if (fs.existsSync(OUTPUT_DIRECTORY)) {
      fs.rmSync(OUTPUT_DIRECTORY, { recursive: true })
    }

    fs.mkdirSync(OUTPUT_DIRECTORY)
  }

  getPdfFiles() {
    return fs
      .readdirSync(PDF_DIRECTORY, { withFileTypes: true })
      .filter(file => file.isFile())
      .filter(file => path.extname(file.name) === '.pdf')
      .map(file => `${PDF_DIRECTORY}/${file.name}`)
  }

  async parsePdf(pdf) {
    const pdfParser = new PdfParser()
    const receiptParser = new ReceiptParser()

    const pdfData = await pdfParser.parse(pdf)

    return this.extractTransactions(pdfData, receiptParser)
  }

  extractTransactions(data, receiptParser) {
    const lines = data.text.split('\n')

    lines.forEach(line => {
      receiptParser.parseLine(line)
    })

    const receiptData = receiptParser.getReceiptData()

    return {
      transactions: receiptData.transactions,
      metadata: receiptData.metadata,
    }
  }

  writeCSV(transactions) {
    const csvWriter = createCsvWriter({
      path: `${this.outputDirectory}/costco-receipts.csv`,
      header: [
        { id: 'date', title: 'Date' },
        { id: 'itemIdentifier', title: 'Item Identifier' },
        { id: 'itemName', title: 'Item Name' },
        { id: 'amount', title: 'Amount' },
      ],
    })

    csvWriter
    .writeRecords(transactions)
    .then(() => {
      console.log('CSV file was written successfully')
      })
    .catch((err) => {
      console.error('Error writing CSV:', err)
      })
  }
}

const processor = new ReceiptProcessor(PDF_DIRECTORY, OUTPUT_DIRECTORY)
const app = express()
const port = 3001

// Create API endpoint to return the processed transactions
app.get('/api/receipts', async (req, res) => {
  try {
    await processor.run() // Process the PDFs and store the transactions
    res.json(processor.fullTransactionsInfo) // Send the transactions as a response
  } catch (error) {
    res.status(500).json({ error: 'Failed to process receipts' })
  }
})

app.listen(port, () => {
  console.log(`Backend API running at http://localhost:${port}`)
})