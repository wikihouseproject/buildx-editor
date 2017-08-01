/**
 * Returns a side shape (wall, floor or roof), using top left as 0,0
 * @param {Number} height
 * @param {Number} width
 * @return {Array} side
 */
const side = ({height, width}) => {
  return [
    [0, height],
    [width, height],
    [width, 0],
    [0, 0]
  ]
}

module.exports = side
