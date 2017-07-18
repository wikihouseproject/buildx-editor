import {h, div} from '@cycle/dom'

const openPath = points => "M" + points.map(pair => pair.join(",")).join(" ")
const closedPath = points => openPath(points) + "z"

const circle = radius => point => (['circle', { cx: point[0], cy: point[1], r: radius}])

const frameCuts = (frame) => {
  // TODO: include naming and grouping
  var paths = [];
  for (var i=0; i<5; i++) {
    const p = closedPath(frame.points(i));
    paths.push(p);
  }
  return paths;
}

// Render as a SVG vdom tree
function renderSvg(geometry, options) {
  options = options || {};
  options.width = options.width || 600;
  options.height = options.height || 600; 

  var cuts = frameCuts(geometry.frame).map( (p) =>
    h('path', {attrs: { fill: 'none', stroke: 'red', d: p }})
  )
  const b = h('path', { attrs: { fill: 'none', stroke: 'grey', d: closedPath(geometry.boundary) }});
  const paths = cuts.concat([b]);

  return h('svg', {attrs:{ xmlns: 'http://www.w3.org/2000/svg', width: options.width, height: options.height }}, paths);
}

module.exports = {
  render: renderSvg,
  closedPath,
  circle,
}
