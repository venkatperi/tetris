class LeaderBoard {
    constructor() {
        this.topScore = 0
        this.topScoreDate = undefined
        this.recent = []
    }

    addScore(score) {
        this.recent.push([score, new Date()])
        if (score > this.topScore)
            this.topScore = score
        if (this.recent.length > 100)
            this.recent.shift()
    }

    load() { }

    save() { }
}