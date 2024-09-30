class MembershipParser {
    constructor() {
        this.isDone = false
        this.membershipId = []
    }

    isParsing() {
        return !this.isDone
    }

    parse(line) {
        if (line.includes('Member')) {
            this.membershipId.push(line)
                return
        }

        if (this.membershipId.length === 1 && /[0-9]/.test(line)) {
            this.membershipId.push(line.trim())
            this.isDone = true
        }
    }


    getMembershipNumber() {
        return this.membershipId[1]
    }
}

module.exports = { MembershipParser }