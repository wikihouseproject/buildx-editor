const side = ({height, width}) => {
  return [
    [0, height],
    [width, height],
    [width, 0],
    [0, 0]
  ]
}

module.exports = side
