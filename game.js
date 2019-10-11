const Board = require('./board')

module.exports = class Game {
  constructor(width, height) {
    this.board = new Board(width, height);
    this.board.on('over', () => {
      console.log('Game over')
      process.exit(0)
    })
  }

  handleInput(input) {
    this.board.handleInput(input)
  }

}
