const { randomInt } = require('./util')


/**
 * Random Permutations Generator
 */
class RandomPermutationsGenerator {
  constructor(length) {
    this.length = length
    this._stats = {
      refills: 0,
      usage: 0
    }
    this.initBag()
  }

  get stats() {
    return this._stats
  }

  initBag() {
    this.bag = Array(this.length).fill(0).map((_, i) => i)
    this._stats.refills++
  }

  * iterator() {
    while (true) {
      if (this.bag.length === 0)
        this.initBag()

      let idx = randomInt(0, this.bag.length - 1)
      let res = this.bag[idx]
      this.bag.splice(idx, 1)
      this._stats.usage++
      yield res
    }
  }
}

module.exports = (length) => new RandomPermutationsGenerator(length).iterator()