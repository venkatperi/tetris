let theme = {
  fullBlock: '█',
  fullBlockDark: '▓',
  fullBlockMedium: '▒',
  fullBlockLight: '░',
  blocks: [],
  colors: ['red', 'blue', 'yellow', 'green', 'magenta', 'cyan', 'orange']

}

theme.blocks[0] = theme.fullBlock
theme.blocks[1] = theme.fullBlockDark
theme.blocks[2] = theme.fullBlockMedium
theme.blocks[3] = theme.fullBlockLight


module.exports = theme
