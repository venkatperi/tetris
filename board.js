const shapes = require('./shapes')
const Piece = require('./piece')
const Input = require('./input')
const theme = require('./theme')
const _ = require('lodash')
const chalk = require('chalk')
const { EventEmitter } = require('events')

const { stdout } = process;

module.exports = class Board extends EventEmitter {

  constructor(width, height) {
    super()
    this.width = width;
    this.height = height;
    this.cells = [];
    this.anchoredPieces = []
    this.piece = undefined
    this.dropInterval = 1000
    this.refreshRate = 100
    this.nextPiece = this.getRandomPiece()
    this.level = 1
    this._score = 0

    this.draw = _.throttle(this._doDraw, this.refreshRate)
    this.clear()
    this.start()
    this.introduceNewPiece()

    this.on('clear', () => {
      this.score += this.width
    })

    this.on("anchor", () => {
      this.score++
    })
  }

  get running() {
    return this.timer
  }

  get score() {
    return this._score
  }

  set score(val) {
    this._score = val

    let level = Math.ceil(this._score / 25)
    if (level > this.level) {
      this.level = level
      this.stop()
      this.dropInterval -= 25
      if (this.dropInterval < 250) this.dropInterval = 250
      this.start()
    }
  }

  /**
   * Returns a random piece
   * @returns {Piece|*}
   */
  getRandomPiece() {
    let keys = Object.keys(shapes)
    let key = keys[Math.floor(Math.random() * keys.length)]
    return new Piece(key, 0, 0)
  }

  /**
   * Introduce a new piece
   */
  introduceNewPiece() {
    this.emit('piece')
    this.piece = this.nextPiece
    this.nextPiece = this.getRandomPiece()

    this.piece.x = Math.floor((this.width - this.piece.width) / 2)
    this.piece.y = 0

    if (this.collides(this.piece)) {
      this.emit('over')
      return this.stop()
    }

    this.drawPiece(this.piece)
    this.draw()
  }

  /**
   * Starts the animation
   */
  start() {
    this.emit('start')
    this.timer = setInterval(() => {
      this.movePieceDown()
      this.draw()
    }, this.dropInterval)
  }

  stop() {
    if (this.running) {
      clearInterval(this.timer)
      this.timer = undefined
    }
    this.emit('stop')
  }

  /**
   * Returns true of the given piece will collide with board cells if drawn
   * at (x,y)
   * @param piece
   * @param x 
   * @param y
   * @returns {boolean}
   */
  collides(piece, x, y) {
    x = x || piece.x
    y = y || piece.y

    if (y + piece.height > this.height || x + piece.width > this.width)
      return true

    for (let i = 0; i < piece.height; i++) {
      for (let j = 0; j < piece.width; j++) {
        if (this.cells[y + i][x + j] && piece.getCell(j, i))
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
  movePieceDown() {
    this.clearPiece(this.piece)
    if (!this.collides(this.piece, this.piece.x, this.piece.y + 1)) {
      this.piece.y++
      this.drawPiece(this.piece)
      return true
    } else {
      this.drawPiece(this.piece)
      this.anchoredPieces.push(this.piece)
      this.introduceNewPiece()
      this.clearFullRows()
      this.emit('anchor')
      return false
    }
  }

  /**
   * Drop this piece to the bottom
   */
  dropPiece() {
    while (this.movePieceDown()) {
    }
  }

  /**
   * Rotate the main piece 90 deg to the left
   */
  rotatePieceLeft90() {
    this.clearPiece(this.piece)
    let res = this.piece.rotateLeft90()
    if (!this.collides(res, this.piece.x, this.piece.y))
      this.piece = res
    this.drawPiece(this.piece)
  }

  /**
   * Move the main piece one step to the left
   */
  movePieceLeft() {
    if (this.piece.x > 0) {
      this.clearPiece(this.piece)
      if (!this.collides(this.piece, this.piece.x - 1, this.piece.y))
        this.piece.x--
      this.drawPiece(this.piece)
    }
  }

  /**
   * Move the main piece one step to the right
   */
  movePieceRight() {
    if (this.piece.x + this.piece.width < this.width) {
      this.clearPiece(this.piece)
      if (!this.collides(this.piece, this.piece.x + 1, this.piece.y))
        this.piece.x++
      this.drawPiece(this.piece)
    }
  }

  /**
   * Clears full rows 
   */
  clearFullRows() {
    let count = 0
    this.clearPiece(this.piece)
    for (let row = 0; row < this.height; row++) {
      if (this.cells[row].every(cell => !!cell)) {
        count++
        this.cells.splice(row, 1)
        this.cells.unshift(Array(this.width).fill(0))
        this.emit('clear')
      }
    }
    this.drawPiece(this.piece)
    if (count)
      this.draw()
  }

  /**
   * Process input
   * @param input
   */
  handleInput(input) {
    switch (input) {
      case Input.LEFT:
        this.movePieceLeft();
        this.draw()
        break;

      case Input.RIGHT:
        this.movePieceRight();
        this.draw()
        break;

      case Input.DOWN:
        this.movePieceDown();
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
    this.cells = Array(this.height).fill(0).map(x => Array(this.width).fill(0))
  }

  squarePixels(c1, c2) {
    let _c1 = c1 ? 1 : 0
    let _c2 = c2 ? 1 : 0
    let out = ' '
    switch (_c1 * 10 + _c2) {
      case 0: return ' ';
      case 10: out = '▀'; break;
      case 1: out = '▄'; break;
      case 11: out = '█'; break;
    }
    let c = c1 || c2
    return chalk.keyword(theme.colors[c - 1])(out)
  }

  /**
   * Draw contents of board with border
   */
  _doDraw() {
    if (!this.running) return

    let lines = ['']

    lines.push(`Level: ${this.level}`)
    lines.push(`Score: ${this.score}`)
    lines.push('', '')

    let dw = Math.round((this.width - this.nextPiece.width) / 2)
    let prefix = Array(dw).fill(' ').join('')
    for (let i = 0; i < this.nextPiece.height; i += 2) {
      let line = [prefix]
      for (let j = 0; j < this.nextPiece.width; j++) {
        let c1 = this.nextPiece.getCell(j, i)
        let c2 = i < this.nextPiece.height - 1 ? this.nextPiece.getCell(j, i + 1) : 0
        line.push(this.squarePixels(c1, c2))
      }
      lines.push(line.join(''))
    }

    if (this.nextPiece.height < 2)
      lines.push('')

    lines.push('')
    lines.push(Array(this.width + 2).fill('▄').join(''))

    for (let row = 0; row < this.height; row += 2) {
      let line = [theme.fullBlock]
      for (let col = 0; col < this.width; col++) {
        let c1 = this.cells[row][col]
        let c2 = this.cells[row + 1][col]
        line.push(this.squarePixels(c1, c2))
      }
      line.push(theme.fullBlock)
      lines.push(line.join(''))
    }

    lines.push(Array(this.width + 2).fill('▀').join(''))
    lines.push('')
    lines.push('← left, → right, ↓ down, ↑ rotate, SPACE: drop, q: quit ')
    lines.push('')

    stdout.write('\x1B[2J' + lines.join('\n'))
  }

  /**
   * Clear the screen
   */
  clearScreen() {
    stdout.write('\x1B[2J');
  }

  /**
   * Set cell value at (x,y) to the given value
   * @param x
   * @param y
   * @param val
   */
  setCell(x, y, val) {
    this.cells[y][x] = val;
  }

  /**
   * Draw given piece at coordinates (x,y)
   * @param piece
   */
  drawPiece(piece) {
    let x = piece.x
    let y = piece.y
    for (let i = 0; i < piece.height; i++) {
      for (let j = 0; j < piece.width; j++) {
        let c = piece.getCell(j, i)
        if (c !== 0)
          this.setCell(x + j, y + i, c)
      }
    }
  }

  /**
   * Clears (removes) piece from the board
   * @param piece
   */
  clearPiece(piece) {
    let x = piece.x
    let y = piece.y
    for (let i = 0; i < piece.height; i++) {
      for (let j = 0; j < piece.width; j++) {
        let c = piece.getCell(j, i)
        if (c !== 0)
          this.setCell(x + j, y + i, 0)
      }
    }
  }
}

