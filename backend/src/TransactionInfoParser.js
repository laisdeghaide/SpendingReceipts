const { Utils } = require('./Utils')

class TransactionInfoParser {
  constructor() {
    this.transactions = []
    this.currentTransaction = {} // Holds the current multiline transaction
    this.isMultilineMode = false
    this.isDone = false
    this.parsedMultiline = false
    this.subtotal = 0
  }

  isParsing() {
    return !this.isDone
  }

  parse(line) {
    if (line.includes('SUBTOTAL')) {
      this.subtotal = Utils.extractAmount(line)
      return
    }
    
    else if (line.includes('TAX')) {
      this.transactions.push({
        itemIdentifier: 'TAX',
        itemName: 'TAX',
        amount: Utils.extractAmount(line)
      })

      return
    }

    else if (line.includes('****TOTAL')) {
      this.isDone = true
      return
    }

    const multilineTransaction = this.parseMultilineTransaction(line)
    if (multilineTransaction) {
      return
    }
    
    this.parseSingleTransaction(line)
  }
  
  parseMultilineTransaction(line) {
    const hasMoneySpent = /\.[0-9]{2}/.test(line)
      
    // First part of the multiline transaction: doenst have the amount spent
    if (!this.isMultilineMode && !hasMoneySpent) {
      this.isMultilineMode = true

      // Remove all letters from the item identifier: example: E1217294 -> 1217294
      this.currentTransaction = {
        itemIdentifier: line.replace(/[A-Z]/g, ''),
        itemName: ''
      }  
    }    

      // Second, we are in the multilinemode and the line doenst have the amount spent
    else if (this.isMultilineMode && !hasMoneySpent) {
      this.currentTransaction.itemName += `${line.trim()}`
    }

      // Finally, we are in the multilinemode and the line has the amount
    else if (this.isMultilineMode && hasMoneySpent) {
      this.currentTransaction.amount = Utils.extractAmount(line) 
      this.transactions.push(this.currentTransaction)
      this.isMultilineMode = false
      this.currentTransaction = null
      this.parsedMultiline = true
    }

  }

  parseSingleTransaction(line) {

    // This regex gets itemName with numbers and ***, and also discoun/refund on the amount
    const transactionRegex = `([0-9]+)\\s*(.+?)\\s*(?:\\$ ?)?([1-9]?[0-9]{1,2}(?:,[0-9]{3})?\\.[0-9]{2})(-?)\\s*[A-Z]?`
    const match = line.match(new RegExp(transactionRegex))

    if (match) {
      let amount = parseFloat(match[3])
      // If there's a trailing '-', make the amount negative
      if (match[4] === '-') {
        amount = -amount
      }

      this.currentTransaction = {
        itemIdentifier: match[1], 
        itemName: match[2].trim(),
        amount: amount, 
      }
      this.transactions.push(this.currentTransaction)
      this.currentTransaction = null
    }
  }
}

module.exports = { TransactionInfoParser }
