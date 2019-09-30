const shapes = require( './shapes' )

module.exports = class Piece {

  constructor( shape ) {
    this.cells = []
    if ( typeof (shape) === 'string' ) {
      if ( Object.keys( shapes ).indexOf( shape ) < 0 )
        throw new Error( `Invalid shape: ${ shape }` )
      this.copy( shapes[shape] )
    } else {
      this.copy( shape.cells || shape )
    }
  }

  /**
   * Get the height of this piece
   * @returns {number}
   */
  get height() {
    return this.cells.length
  }


  /**
   * Returns the width of this piece
   * @returns {*}
   */
  get width() {
    return this.cells[0].length
  }

  clear() {
    for ( let i = 0; i < this.height; i++ ) {
      this.cells.push( Array( this.width ).fill( 0 ) )
    }
  }

  copy( shape ) {
    let height = shape.length
    let width = shape[0].length
    for ( let i = 0; i < height; i++ ) {
      this.cells[i] = []
      for ( let j = 0; j < width; j++ ) {
        this.cells[i][j] = shape[i][j]
      }
    }
  }

  rotateLeft90() {
    let res = []
    for ( let j = 0; j < this.width; j++ ) {
      res[this.width - j - 1] = []
      for ( let i = 0; i < this.height; i++ ) {
        res[this.width - j - 1][i] = this.cells[i][j]
      }
    }
    // this.cells = res
    return new Piece(res)
  }

  getCell( x, y ) {
    return this.cells[y][x]
  }
}
