const { Random } = require('random-js')

const random = new Random()

function randomInt(a, b) {
    return random.integer(a, b)
}

function repeatString(ch, length) {
    return Array(length).fill(ch).join('')
}

module.exports = {
    random,
    randomInt,
    repeatString
}