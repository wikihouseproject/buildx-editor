const _areas = require('./figures/areas')
const estimates = require('./figures/estimates')
const _volumes = require('./figures/volumes')
const _points = require('./points')
const _dimensions = require('./figures/dimensions')
const _pieces = require('./pieces')
// const Point = require('../utils/point')
const SVG = require('./formats/svg')
// const CSV = require('./formats/csv')

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
      geometry: geometry,
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
      svg: () => {
        const assignId = (part) => {
          part.id = part.path.reverse().join("-")
          return part
        }
        const throwAround = (part) => {
          const range = 5;
          const displacement = [
            Math.random()*range,
            Math.random()*range,
          ]
          const addPoints = (a, b) => {
            return [ a[0] + b[0], a[1] + b[1] ]
          }
          part.geometry.pts = part.geometry.pts.map((xy) => addPoints(xy, displacement))
          return part
        }
        const svgPart = (part) => {
          var path = SVG.path(part.geometry.pts)
          path = path.replace('<path', `<path id=${part.id}`) // XXX: crack. Should operate on vdom elements or pass in attributes
          return path
        }

        // TODO: check that no parts are too big to be produced
        // FIXME: inject geometry for board, used when nesting

        const parts = getParts(pieces).map(assignId).map(throwAround)

        const document = SVG.svg(parts.map(svgPart));

        return document

      }
    },
    pieces,
    points
  }
}

module.exports = outputs
