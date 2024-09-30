class Utils {
  constructor() {}

  static extractAmount(line) {
    const amountRegex = /(\d+\.\d{2})(-)?/
    const match = amountRegex.exec(line)

    // check if last char is '-', example: 336118 /BEEF 7.00-
    // this means it's a refund or a discount
    return match[2] === '-' ? -parseFloat(match[1]) : parseFloat(match[1])    
  }
}

module.exports = { Utils }
