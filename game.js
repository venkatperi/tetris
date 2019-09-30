const Board = require( './board' )

module.exports = class Game {
  constructor( width, height ) {
    this.board = new Board( width, height );
  }

  handleInput( input ) {
    this.board.handleInput( input )
  }

}
