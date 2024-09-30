const fs = require('fs');
const path = require('path');
const { PdfParser } = require('./src/PdfParser');
const { ReceiptParser } = require('./src/ReceiptParser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const OUTPUT_DIRECTORY = './receipts-parsed';
const PDF_DIRECTORY = './costco-receipt-pdfs';

class ReceiptProcessor {
    constructor(pdfDirectory, outputDirectory) {
        this.pdfDirectory = pdfDirectory;
        this.outputDirectory = outputDirectory;
    }

    async run() {
        this.resetOutputDir();
        const pdfFiles = this.getPdfFiles();
        const transactionsWithDate = [];

        for (const pdf of pdfFiles) {
            const { transactions, date } = await this.parsePdf(pdf);

            transactionsWithDate.push(...transactions.map(transaction => ({
                ...transaction,
                date: date
            })));
        }

        this.writeCSV(transactionsWithDate);
    }

    resetOutputDir() {
        if (fs.existsSync(OUTPUT_DIRECTORY)) {
            fs.rmSync(OUTPUT_DIRECTORY, { recursive: true });
        }

        fs.mkdirSync(OUTPUT_DIRECTORY);
    }

    getPdfFiles() {
        return fs
            .readdirSync(PDF_DIRECTORY, { withFileTypes: true })
            .filter(file => file.isFile())
            .filter(file => path.extname(file.name) === '.pdf')
            .map(file => `${PDF_DIRECTORY}/${file.name}`);
    }

    async parsePdf(pdf) {
        const pdfParser = new PdfParser();
        const receiptParser = new ReceiptParser();

        const pdfData = await pdfParser.parse(pdf);

        return this.extractTransactions(pdfData, receiptParser);
    }

    extractTransactions(data, receiptParser) {
        const lines = data.text.split('\n');

        lines.forEach(line => {
            receiptParser.parseLine(line);
        });

        const receiptData = receiptParser.getReceiptData();

        return {
            transactions: receiptData.transactions,
            date: receiptData.metadata.date,
        };
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
        });

        csvWriter
            .writeRecords(transactions)
            .then(() => {
                console.log('CSV file was written successfully');
            })
            .catch((err) => {
                console.error('Error writing CSV:', err);
            });
    }
}

const processor = new ReceiptProcessor(PDF_DIRECTORY, OUTPUT_DIRECTORY);
processor.run();
