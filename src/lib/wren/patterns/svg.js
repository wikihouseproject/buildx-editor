const getBounds = coords => {
  return coords.reduce( (bounds, coords) => {
    // const [x, y] = coords.split(",")
    const [x, y] = coords
    bounds.minX = Math.min(bounds.minX, x)
    bounds.minY = Math.min(bounds.minY, y)
    bounds.maxX = Math.max(bounds.maxX, x)
    bounds.maxY = Math.max(bounds.maxY, y)
    return bounds
  }, {
    minX: Infinity,
    minY: Infinity,
    maxX: -Infinity,
    maxY: -Infinity
  })
}

const getCoordsPairs = path => path.match(/(\d+),(\d+)/ig)

const reversePath = path => ["M",getCoordsPairs(path).reverse().join(" "),"z"].join("")

const attrs = as => Object.keys(as).reduce((str, key) => {return str + ` ${key}="${as[key]}"`}, "")
const parse = ([tagName, attributes={}, children]) => {
  let str = ""
  if (children) {
    str += `<${tagName}${attrs(attributes)}>`
    str += children.map(parse).join("")
    str += `</${tagName}>`
  } else {
    str += `<${tagName}${attrs(attributes)} />`
  }
  return str
}

const getViewBox = (bounds, padding=10) => [bounds.minX-padding, bounds.minY-padding, bounds.maxX - bounds.minX+padding*2, bounds.maxY - bounds.minY+padding*2].join(" ")

const joinPaths = (...paths) => paths.map(p => p.trim()).join(" ")

const openPath = points => "M" + points.map(pair => pair.join(",")).join(" ")
const closedPath = points => openPath(points) + "z"

const circle = radius => point => (['circle', { cx: point[0], cy: point[1], r: radius}])

module.exports = {
  closedPath,
  openPath,
  getBounds,
  getCoordsPairs,
  getViewBox,
  parse,
  reversePath,
  joinPaths,
  circle
}
