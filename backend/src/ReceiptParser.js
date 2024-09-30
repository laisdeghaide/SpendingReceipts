const { StoreInfoParser } = require('./StoreInfoParser')
const { MembershipParser } = require('./MembershipParser')
const { TransactionInfoParser } = require('./TransactionInfoParser')
const { MetadataParser } = require('./MetadataParser')

class ReceiptParser {
    constructor() {
        this.storeInfoParser = new StoreInfoParser() // store id, address 
        this.membershipParser = new MembershipParser() // membership id
        this.transactionInfoParser = new TransactionInfoParser() // list of product sku, product name, product price 
        this.metadataParser = new MetadataParser() // total amount spent, total number of items sold, instant savings, date
    }

    parseLine(line) {
        if (this.storeInfoParser.isParsing()) {
            this.storeInfoParser.parse(line)
        }

        else if (this.membershipParser.isParsing()) {
            this.membershipParser.parse(line)
        }

        else if (this.transactionInfoParser.isParsing()) {
            this.transactionInfoParser.parse(line)
        }

        else {
            this.metadataParser.parse(line)
        }
    }

    getReceiptData() {
        return {
            storeInfo: this.storeInfoParser.getStoreInfo(),
            membershipNumber: this.membershipParser.getMembershipNumber(),
            transactions: this.transactionInfoParser.transactions,
            metadata: {
                totalItemsSold: this.metadataParser.totalItemsSold,
                instantSavings: this.metadataParser.instantSavings,
                date: this.metadataParser.getDate(),
            }
        }
    }
}

module.exports = { ReceiptParser }

// Costco Receipt Example:
// {
//     numpages: 2,
//     numrender: 2,
//     info: {
//       PDFFormatVersion: '1.4',
//       IsAcroFormPresent: false,
//       IsXFAPresent: false,
//       Title: 'Orders & Purchases | Costco',
//       Creator: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
//       Producer: 'Skia/PDF m129',
//       CreationDate: "D:20240926173843+00'00'",
//       ModDate: "D:20240926173843+00'00'"
//     },
//     metadata: null,
//     text: '\n' +
//       '\n' +
//       'STRONGSVILLE #625\n' +
//       '16690 ROYALTON RD\n' +
//       'STRONGSVILLE, OH 44136\n' +
//       '21062500103032408291745\n' +
//       'Member\n' +
//       '123456789\n' +
//       'E1217294ETHIOPIAN17.89 N\n' +
//       'E1025795KS 5DZ EGGS13.99 N\n' +
//       'E1437087BRNBRRY 2/245.99 N\n' +
//       'E1548087GODIVA ASST10.99 N\n' +
//       'E251680ORG RASPBERY8.99 N\n' +
//       'E1015237KS STIR FRY9.99 N\n' +
//       'E29192TOP SIRLOIN49.18 N\n' +
//       '336118/BEEF7.00-\n' +
//       'E34777REGGIANO17.25 N\n' +
//       'E702669BLACKBERRIES4.49 N\n' +
//       'E39036ROMAINE5.39 N\n' +
//       'E1375333FLOUR 12 LB9.49 N\n' +
//       'E1450796CHKN CHUNKS17.89 N\n' +
//       'E1199652BUTER CROISS5.99 N\n' +
//       'E128914KS UNSLTD11.99 N\n' +
//       'E27003STRAWBERRIES4.49 N\n' +
//       'E1200200KS GS SCAMPI31.98 N\n' +
//       'E568915\n' +
//       'ORG\n' +
//       'CUCUMBER\n' +
//       '5.99 N\n' +
//       'E669434CAPE COD RF7.49 N\n' +
//       '1285702TOOTHPASTE16.99 Y\n' +
//       'E77053GRAPE TOMATO4.89 N\n' +
//       'SUBTOTAL254.34\n' +
//       'TAX1.36\n' +
//       '****TOTAL255.70\n' +
//       'XXXXXXXXXXXXX1234\n' +
//       'CHIP\n' +
//       'read\n' +
//       'APPROVED - PURCHASE\n' +
//       'AMOUNT: $255.70\n' +
//       '08/29/202417:45625130320\n' +
//       'DEBIT CARD255.70\n' +
//       'CHANGE0\n' +
//       '26/09/2024, 13:38Orders & Purchases | Costco\n' +
//       'https://www.costco.com/myaccount/#/app/4900eb1f-0c10-4bd9-99c3-c59e/ordersandpurchases1/2\n' +
//       '\n' +
//       'Member\n' +
//       '123456789\n' +
//       '(A) A1.36\n' +
//       'TOTAL TAX1.36\n' +
//       'TOTAL NUMBER OF ITEMS SOLD = 21\n' +
//       'INSTANT SAVINGS$7.00\n' +
//       '08/29/202417:45 625130320\n' +
//       'Thank You!\n' +
//       'Please Come Again\n' +
//       'P7 08/29/2024 05:45\n' +
//       'Whse: 625Trm: 1Trn: 303OPT: 20\n' +
//       'Items Sold: 21\n' +
//       '26/09/2024, 13:38Orders & Purchases | Costco\n' +
//       'https://www.costco.com/myaccount/#/app/4900eb1f-0c10-4bd9-99c3-c59e/ordersandpurchases2/2',
//     version: '1.10.100'
//   }