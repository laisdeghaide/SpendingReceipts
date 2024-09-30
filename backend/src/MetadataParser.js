const { Utils } = require('./Utils')

class MetadataParser {
    constructor() {
        this.date = null
        this.totalItemsSold = 0
        this.instantSavings = 0
    }

    parse(line) {
        if (line.includes('TOTAL NUMBER OF ITEMS SOLD ='))
            this.totalItemsSold = this.extractTotalItemsSold(line)

        else if (line.includes('INSTANT SAVINGS'))
            this.instantSavings = Utils.extractAmount(line)

        else if (this.isDateLine(line)) 
            this.date = this.extractDate(line)
    }

    extractTotalItemsSold(line) {
        const itemsSoldRegex = /TOTAL NUMBER OF ITEMS SOLD =\s(\d+)/
        const match = itemsSoldRegex.exec(line)
        return parseInt(match[1])
    }

    isDateLine(line) {
        const dateRegex = /P7\s\d{1,2}\/\d{1,2}\/\d{4}/
        return dateRegex.test(line)
    }

    extractDate(line) {
        const dateRegex = /P7\s(\d{1,2}\/\d{1,2}\/\d{4})/
        const match = dateRegex.exec(line)
        return match[1]
    }

    getTotalSpent() {
        return this.subtotal + this.tax
    }

    getDate() {
        return this.date
    }

    getInstantSavings() {
        return this.instantSavings
    }
}

module.exports = { MetadataParser }
