const _areas = require('./figures/areas')
const estimates = require('./figures/estimates')
const _volumes = require('./figures/volumes')
const _points = require('./points')
const _dimensions = require('./figures/dimensions')
const _pieces = require('./pieces')
const Point = require('../utils/point')
const SVG = require('./formats/svg')
// const CSV = require('./formats/csv')

const { flatMap } = require('lodash')

function isPartGeometry(o) {
  const hasPoints = o.pts && Array.isArray(o.pts) && o.pts.length > 0 
  const hasPosition = o.pos && typeof o.pos.x == 'number' && typeof o.pos.y == 'number' && typeof o.pos.z == 'number'
  const hasRotation = o.rot && typeof o.rot.order == 'string' &&
    typeof o.rot.x == 'number' && typeof o.rot.y == 'number' && typeof o.rot.z == 'number'
  return hasPoints && hasPosition && hasRotation
}

function getParts(pieces) {

  var ret = [];
  const addPart = (geometry, ancestors) => {
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

  // Basically just extracting leaves, keeping track of the path down to the leaf
  for (var structureType in pieces) {
    const list = pieces[structureType];
    for (var structureIdx in list) {
      const parts = list[structureIdx]
      for (var partType in parts) {
        if (partType == 'sides') {
          for (var sideName in parts[partType]) {
            const features = parts[sideName];
            for (var featureName in features) {
              const parents = [ featureName, sideName, partType, structureIdx, structureType ]
              features[featureName].map((g, i) => addPart(g, [i].concat(parents)))
            }
          }
        } else {
          for (var partIdx in parts[partType]) {
            const parents = [ partIdx, partType, structureIdx, structureType ]
            parts[partType][partIdx].map((g, i) => addPart(g, [i].concat(parents)) )
          }
        }
      }
    }
  }
  return ret
}

const addPoints = (a, b) => {
  return [ a[0] + b[0], a[1] + b[1] ]
}

function layoutPartsWithoutOverlap(parts, separation=0.1) {
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

  console.log('parts layout aspect ratio', currentY/maxWidth)
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

const outputs = inputs => {
  const points = _points(inputs.dimensions)
  const dimensions = _dimensions(inputs, points)
  const pieces = _pieces(points, inputs)
  const areas = _areas(inputs, dimensions, points)
  const volumes = _volumes(inputs, dimensions, points, areas)
  return {
    figures: {
      areas,
      dimensions,
      volumes,
      estimates: estimates(inputs, volumes),
    },
    formats: {
      csv: null,
      svg: (options={}) => {
        const assignId = (part) => {
          part.id = part.path.reverse().join("-")
          return part
        }
        const svgPart = (part) => {
          const style = "fill:none;stroke:#000000;stroke-opacity:1;stroke-width:0.00377953"
          return SVG.path(part.geometry.pts, { id: part.id, style })
        }

        // TODO: check that no parts are too big to be produced
        var parts = getParts(pieces).map(assignId)

        if (options.onlyN) {
          parts = getRandom(parts, options.onlyN)
        }

        layoutPartsWithoutOverlap(parts)

        const viewBox = calculateViewBox(flatMap(parts, (p) => p.geometry.pts));
        const document = SVG.svg(parts.map(svgPart), { viewBox });

        return document

      }
    },
    pieces,
    points
  }
}

module.exports = outputs
