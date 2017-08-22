const Point = require('../utils/point')
const SVG = require('./formats/svg')

const { flatMap } = require('lodash')

export function isPartGeometry(o) {
  const hasPoints = o.pts && Array.isArray(o.pts) && o.pts.length > 0 
  const hasPosition = o.pos && typeof o.pos.x == 'number' && typeof o.pos.y == 'number' && typeof o.pos.z == 'number'
  const hasRotation = o.rot && typeof o.rot.order == 'string' &&
    typeof o.rot.x == 'number' && typeof o.rot.y == 'number' && typeof o.rot.z == 'number'
  return hasPoints && hasPosition && hasRotation
}

export function traverseDepthFirst(root, path, isLeaf, leafCallback) {

  // Allow stopping early, for finding compund objects/values
  if (isLeaf(root)) {
    return leafCallback(root, path, true);
  }

  if (Array.isArray(root)) {
    for (var idx=0; idx<root.length; idx++) {
      const val = root[idx];
      traverseDepthFirst(val, path.concat([idx]), isLeaf, leafCallback)
    }
  } else if (root && typeof root == 'object') {
    for (var key in root) {
      if (root.hasOwnProperty(key)) {
        const val = root[key];
        traverseDepthFirst(val, path.concat([key]), isLeaf, leafCallback)
      }
    }
  } else {
    // leaf which does not meet classifier
    return leafCallback(root, path, false)
  }
}

export function getParts(pieces) {

  var ret = [];
  const addPart = (geometry, ancestors, matched) => {
    if (!isPartGeometry(geometry)) {
      throw new Error("Not a proper part: " + JSON.stringify(geometry));
    }
    const p = {
      geometry: {
        pts: geometry.pts.slice(0) // ensure unique
        // don't care about other things
      },
      path: ancestors,
    }
    ret.push(p)
    return p
  }

  traverseDepthFirst(pieces, [], isPartGeometry, addPart)
  return ret
}

const addPoints = (a, b) => {
  return [ a[0] + b[0], a[1] + b[1] ]
}

function layoutPartsWithoutOverlap(parts, separation=50) {
  // Can make this as complicated as one wants, right up to full-blown nesting...
  // So doing a trivial 1-column vertical layout
  // NOTE: SVG coordinate conventions, downwards = positive Y
  var currentY = 0
  var maxWidth = 0
  for (var part of parts) {
    const bounds = Point.getBounds(part.geometry.pts)
    const moveY = currentY - bounds.minY
    const displacement = [0, moveY]
    const movedPoints = part.geometry.pts.map((xy) => addPoints(xy, displacement))

    const height = bounds.maxY - bounds.minY
    const width = bounds.maxX - bounds.minX
    maxWidth = (width > maxWidth) ? width : maxWidth
    currentY += (height + separation)
    part.geometry.pts = movedPoints
  }

  const bounds = {
    x: 0,
    y: 0,
    width: maxWidth,
    height: currentY,
  }

  return bounds
}

// https://stackoverflow.com/questions/19269545/how-to-get-n-no-elements-randomly-from-an-array
function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len;
    }
    return result;
}

function calculateViewBox(points, padding=0) {
    const {minX, minY, maxX, maxY} = Point.getBounds(points)
    return [
      minX-padding,
      minY-padding,
      Math.abs(maxX-minX)+padding*2,
      Math.abs(maxY-minY)+padding*2
    ].join(" ")
}

export function layout(pieces, options={}) {

  const assignId = (part) => {
    part.id = part.path.join("-")
    return part
  }

  // TODO: check that no parts are too big to be produced
  var parts = getParts(pieces).map(assignId)

  if (options.onlyN) {
    parts = getRandom(parts, options.onlyN)
  }

  layoutPartsWithoutOverlap(parts)

  return parts;
}

export function exportSVG(layedoutParts, options={}) {

  if (!options.stroke) {
    options.stroke = 6.0
  }

  const svgPart = (part) => {
    const style = `fill:none;stroke:#000000;stroke-opacity:1;stroke-width:${options.stroke}`
    return SVG.path(part.geometry.pts, { id: part.id, style })
  }

  const viewBox = calculateViewBox(flatMap(layedoutParts, (p) => p.geometry.pts))
  const document = SVG.svg(layedoutParts.map(svgPart), { viewBox })

  return document
}
