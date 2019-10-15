const Board = require('./board')
const LeaderBoard = require('./leaderboard')

module.exports = class Game {
  constructor(width, height) {
    this.board = new Board(width, height);
    this.leaderBoard = new LeaderBoard()
    this.board.on('over', (score) => {
      console.log('Game over')
      this.leaderBoard.addScore(score)
      this.leaderBoard.save().catch((err) => {
        console.log(err)
      }).finally(() => {
        process.exit(0)
      })
    })
  }

  handleInput(input) {
    this.board.handleInput(input)
  }

}
