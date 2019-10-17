const os = require('os')
const fs = require('fs')
const path = require('path')

module.exports = class LeaderBoard {
  constructor() {
    this.data = {}
    this.data.topScore = 0
    this.data.topScoreDate = undefined
    this.data.recent = []
    this.load()
  }

  get scoreFileName() {
    let homedir = os.homedir()
    return path.join(homedir, '.tetris-scores')
  }

  addScore(score) {
    this.data.recent.push([score, new Date()])
    if (score > this.data.topScore)
      this.data.topScore = score
    if (this.data.recent.length > 100)
      this.data.recent.shift()
  }

  load() {
    fs.exists(this.scoreFileName, (exists) => {
      if (exists)
        fs.readFile(this.scoreFileName, "utf8", (err, buf) => {
          try {
            this.data = JSON.parse(buf)
          }
          catch (err) {

          }
        })
    })
  }

  save() {
    return new Promise((resolve, reject) => {
      fs.writeFile(this.scoreFileName, JSON.stringify(this.data, null, 2), (err) => {
        if (err) return reject(err)
        resolve()
      })
    })
  }
}