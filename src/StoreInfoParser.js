class StoreInfoParser {
    constructor() {
        this.storeLines = []
        this.isDone = false
        this.receiptIdentifier = undefined
    }

    isParsing() {
        return !this.isDone
    }

    parse(line) {
        if (line.trim() !== '') {
            if (this.storeLines.length < 3)  {
                this.storeLines.push(line)
            }
            else if (this.storeLines.length === 3) {
                this.receiptIdentifier = line
                this.isDone = true
            }
        }
    }

    getStoreInfo() {
        const splitCityInfo = this.storeLines[2].split(',')
        return {
            store: this.storeLines[0],
            street: this.storeLines[1],
            city: splitCityInfo[0],
            state: splitCityInfo[1].slice(1, 3),
            zipCode: splitCityInfo[1].slice(-5)
        }
    }

    getReceiptIdentifier() {
        return this.receiptIdentifier
    }
}

module.exports = { StoreInfoParser }