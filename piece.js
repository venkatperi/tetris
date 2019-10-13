const shapes = require('./shapes')
const theme = require('./theme')
const { randomInt } = require('./util')

module.exports = class Piece {

  constructor(shape, x, y, color) {
    this.cells = []
    this.color = color || randomInt(1, theme.colors.length)
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
        this.cells[i][j] = shape[i][j] ? this.color : 0
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
    let d = (this.height - this.width) / 2
    d = d < 0 ? Math.ceil(d) : Math.floor(d)
    return new Piece(res, (this.x - d), (this.y + d), this.color)
  }

  getCell(x, y) {
    return this.cells[y][x]
  }
}
