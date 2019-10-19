const shapes = require('./shapes')
const { randomInt } = require('./util')

class RandomGenerator {
  constructor() {
    this.initBag()
  }

  initBag() {
    this.bag = Object.keys(shapes)
  }

  * tetrominoes() {
    while (true) {
      if (this.bag.length === 0)
        this.initBag()

      let idx = randomInt(0, this.bag.length - 1)
      let res = this.bag[idx]
      this.bag.splice(idx, 1)
      yield res
    }
  }

}

/*let gen = new RandomGenerator()
let iter = gen.tetromino()
let t = iter.next()
for (let i = 0; i < 10; i++) {
  console.log(t.value)
  t = iter.next()
}
*/

module.exports = RandomGenerator