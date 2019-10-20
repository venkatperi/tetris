const shapes = require('./shapes')
const theme = require('./theme')
const randomGenerator = require('./rpg')

const colors = {
  I: 'lightblue',
  J: 'darkblue',
  L: 'orange',
  O: 'yellow',
  S: 'green',
  Z: 'red',
  T: 'purple'
}

randomizer = randomGenerator(theme.colors.length)


module.exports = class Piece {

  constructor(shape, x, y, color) {
    this._prevRotation = 0
    this._rotation = 0
    this.x = x
    this.y = y
    this.cells = []
    this.color = color || (randomizer.next().value + 1)

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

  get rotation() {
    return this._rotation
  }

  set rotation(val) {
    this._prevRotation = this._rotation
    this._rotation = val
  }

  get prevRotation() {
    return this._prevRotation
  }

  /**
   * 0 = spawn state
   * 1 = state resulting from a clockwise rotation ("right") from spawn
   * 2 = state resulting from 2 successive rotations in either direction from spawn.
   * 3 = state resulting from a counter-clockwise ("left") rotation from spawn
   */
  get rotationState() {
    return Math.floor(this._rotation / 90)
  }

  get prevRotationState() {
    return Math.floor(this._prevRotation / 90)
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
    let p = new Piece(res, (this.x - d), (this.y + d), this.color)
    p.rotation = (p.rotation + 270) % 360
    return p
  }

  getCell(x, y) {
    return this.cells[y][x]
  }
}
