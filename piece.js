const shapes = require('./shapes')

module.exports = class Piece {

  constructor(shape, x, y, shade) {
    this.cells = []
    this.shade = shade || Math.ceil(Math.random() * 4)
    this.x = x
    this.y = y

    if (typeof (shape) === 'string') {
      if (Object.keys(shapes).indexOf(shape) < 0)
        throw new Error(`Invalid shape: ${shape}`)
      this.copy(shapes[shape])
    } else {
      this.copy(shape.cells || shape)
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

  /**
   * Clears the piece
   */
  clear() {
    this.cells = Array(this.height).fill(0).map(x => Array(this.width).fill(x))
  }

  copy(shape) {
    let height = shape.length
    let width = shape[0].length
    for (let i = 0; i < height; i++) {
      this.cells[i] = []
      for (let j = 0; j < width; j++) {
        this.cells[i][j] = shape[i][j] ? 1 : 0
      }
    }
  }

  rotateLeft90() {
    let res = []
    for (let j = 0; j < this.width; j++) {
      res[this.width - j - 1] = []
      for (let i = 0; i < this.height; i++) {
        res[this.width - j - 1][i] = this.cells[i][j]
      }
    }
    return new Piece(res, this.x, this.y, this.shade)
  }

  getCell(x, y) {
    return this.cells[y][x]
  }
}
