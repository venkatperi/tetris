const shapes = require( './shapes' )
const Piece = require( './piece' )
const Input = require( './input' )

const stdout = process.stdout;

module.exports = class Board {
  constructor( width, height ) {
    this.width = width;
    this.height = height;
    this.cells = [];
    this.pieces = []
    this.mainPiece = undefined
    this.animInterval = 1000
    this.nextPiece = this.getRandomPiece()

    this.clear()
    this.introduceNewPiece()
    this.startAnimation()
  }

  /**
   * Quit the game
   */
  quit() {
    process.exit( 0 )
  }

  /**
   * Returns a random piece
   * @returns {Piece|*}
   */
  getRandomPiece() {
    let shapesKeys = Object.keys( shapes )
    let shapeKey = shapesKeys[Math.floor( Math.random() * shapesKeys.length )]
    return new Piece( shapeKey )
  }

  /**
   * Introduce a new piece
   */
  introduceNewPiece() {
    this.mainPiece = this.nextPiece
    this.nextPiece = this.getRandomPiece()

    this.mainPiecePosX = Math.floor( (this.width - this.mainPiece.width) / 2 )
    this.mainPiecePosY = 0
    if ( this.collides( this.mainPiece, this.mainPiecePosX, this.mainPiecePosY ) ) {
      stdout.write( 'Game over' )
      this.quit()
    }

    this.drawPiece( this.mainPiecePosX, this.mainPiecePosY, this.mainPiece )
    this.draw()
  }

  /**
   * Starts the animation
   */
  startAnimation() {
    setInterval( () => {
      let cleared = false
      while ( this.clearBottomRow() ) {
        cleared = true
      }
      if ( !cleared )
        this.moveMainPieceDown()
      this.draw()
    }, this.animInterval )
  }

  /**
   * Returns true of the given piece will collide with board cells if drawn
   * at (x,y)
   * @param piece
   * @param x
   * @param y
   * @returns {boolean}
   */
  collides( piece, x, y ) {
    if ( y + piece.height > this.height || x + piece.width > this.width )
      return true

    for ( let i = 0; i < piece.height; i++ ) {
      for ( let j = 0; j < piece.width; j++ ) {
        if ( this.cells[y + i][x + j] === 1 && piece.getCell( j, i ) === 1 )
          return true
      }
    }
    return false
  }

  /**
   * Move the main piece one step down. Called on a timer to drop the piece. Also
   * called when the down arrow is pressed. Checks if the piece has reached
   * the bottom and fires off a new piece if so.
   */
  moveMainPieceDown() {
    this.clearPiece( this.mainPiecePosX, this.mainPiecePosY, this.mainPiece )
    if ( !this.collides( this.mainPiece, this.mainPiecePosX, this.mainPiecePosY + 1 ) ) {
      this.mainPiecePosY++
      this.drawPiece( this.mainPiecePosX, this.mainPiecePosY, this.mainPiece )
      return false
    } else {
      this.drawPiece( this.mainPiecePosX, this.mainPiecePosY, this.mainPiece )
      this.pieces.push( this.mainPiece )
      this.introduceNewPiece()
      return true
    }
  }

  /**
   * Drop this piece to the bottom
   */
  dropPiece() {
    while ( !this.moveMainPieceDown() ) {
    }
  }

  /**
   * Rotate the main piece 90 deg to the left
   */
  rotatePieceLeft90() {
    this.clearPiece( this.mainPiecePosX, this.mainPiecePosY, this.mainPiece )
    // this.mainPiece.rotateLeft90()
    let res = this.mainPiece.rotateLeft90()
    if ( !this.collides( res, this.mainPiecePosX, this.mainPiecePosY ) )
      this.mainPiece = res
    this.drawPiece( this.mainPiecePosX, this.mainPiecePosY, this.mainPiece )
  }

  /**
   * Move the main piece one step to the left
   */
  moveMainPieceLeft() {
    if ( this.mainPiecePosX > 0 ) {
      this.clearPiece( this.mainPiecePosX, this.mainPiecePosY, this.mainPiece )
      if ( !this.collides( this.mainPiece, this.mainPiecePosX - 1, this.mainPiecePosY ) )
        this.mainPiecePosX--
      this.drawPiece( this.mainPiecePosX, this.mainPiecePosY, this.mainPiece )
    }
  }

  /**
   * Move the main piece one step to the right
   */
  moveMainPieceRight() {
    if ( this.mainPiecePosX + this.mainPiece.width < this.width ) {
      this.clearPiece( this.mainPiecePosX, this.mainPiecePosY, this.mainPiece )
      if ( !this.collides( this.mainPiece, this.mainPiecePosX + 1, this.mainPiecePosY ) )
        this.mainPiecePosX++
      this.drawPiece( this.mainPiecePosX, this.mainPiecePosY, this.mainPiece )
    }
  }

  /**
   * Clears the bottom row if all cells are set
   */
  clearBottomRow() {
    let allSet = true
    for ( let i = 0; i < this.width; i++ ) {
      if ( this.cells[this.height - 1][i] === 0 )
        allSet = false
    }

    if ( allSet ) {
      this.clearPiece( this.mainPiecePosX, this.mainPiecePosY, this.mainPiece )
      this.cells.pop()
      this.cells.unshift( Array( this.width ).fill( 0 ) )
      this.drawPiece( this.mainPiecePosX, this.mainPiecePosY, this.mainPiece )
    }

    return allSet
  }

  /**
   * Process input
   * @param input
   */
  handleInput( input ) {
    switch ( input ) {
      case Input.LEFT:
        this.moveMainPieceLeft();
        this.draw()
        break;

      case Input.RIGHT:
        this.moveMainPieceRight();
        this.draw()
        break;

      case Input.DOWN:
        this.moveMainPieceDown();
        this.draw()
        break;

      case Input.UP:
        this.rotatePieceLeft90();
        this.draw()
        break;

      case Input.SPACE:
        this.dropPiece();
        this.draw()
        break;
    }
  }

  /**
   * Clear the board
   */
  clear() {
    for ( let r = 0; r < this.height; r++ ) {
      const row = [];
      for ( let c = 0; c < this.width; c++ ) {
        row.push( 0 );
      }
      this.cells.push( row );
    }
  }

  /**
   * Draw contents of board with border
   */
  draw() {
    this.clearScreen()

    stdout.write( `Score: ${ this.pieces.length }\n\n` )

    for ( let i = 0; i < this.nextPiece.height; i++ ) {
      for ( let j = 0; j < this.nextPiece.width; j++ ) {
        stdout.write( this.nextPiece.getCell( j, i ) === 0 ? ' ' : '#' )
      }
      stdout.write( '\n' );
    }

    if ( this.nextPiece.height < 2 )
      stdout.write( '\n' );

    stdout.write( '\n' );
    for ( let col = 0; col < this.width + 2; col++ ) {
      stdout.write( '*' );
    }

    stdout.write( '\n' );
    for ( let row = 0; row < this.height; row++ ) {
      stdout.write( '|' );
      for ( let col = 0; col < this.width; col++ ) {
        if ( this.cells[row][col] !== 0 ) {
          stdout.write( '#' );
        } else {
          stdout.write( ' ' );
        }
      }
      stdout.write( '|\n' );
    }
    for ( let col = 0; col < this.width + 2; col++ ) {
      stdout.write( '*' );
    }
    stdout.write( '\n' );
  }

  /**
   * Clear the screen
   */
  clearScreen() {
    stdout.write( '\x1B[2J' );
  }

  /**
   * Set cell value at (x,y) to the given value
   * @param x
   * @param y
   * @param val
   */
  setCell( x, y, val ) {
    this.cells[y][x] = val;
  }

  /**
   * Draw given piece at coordinates (x,y)
   * @param x
   * @param y
   * @param piece
   */
  drawPiece( x, y, piece ) {
    for ( let i = 0; i < piece.height; i++ ) {
      for ( let j = 0; j < piece.width; j++ ) {
        let c = piece.getCell( j, i )
        if ( c !== 0 )
          this.setCell( x + j, y + i, c )
      }
    }
  }

  /**
   * Clears (removes) piece from the board
   * @param x
   * @param y
   * @param piece
   */
  clearPiece( x, y, piece ) {
    for ( let i = 0; i < piece.height; i++ ) {
      for ( let j = 0; j < piece.width; j++ ) {
        let c = piece.getCell( j, i )
        if ( c !== 0 )
          this.setCell( x + j, y + i, 0 )
      }
    }
  }
}

