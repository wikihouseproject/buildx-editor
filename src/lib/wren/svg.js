import {h, div} from '@cycle/dom'
import {run} from '@cycle/run'
import {makeHTMLDriver} from '@cycle/html'
import xs from 'xstream'

const openPath = points => "M" + points.map(pair => pair.join(",")).join(" ")
const closedPath = points => openPath(points) + "z"

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


// Export as SVG string
function exportSvg(geometry, options) {
  const rendered = renderSvg(geometry, options);

  var svg = null;
  const collectOutput = (out) => {
    svg = out;
  }
  const drivers = {
    HTML: makeHTMLDriver(collectOutput)
  }
  const outputRender = (sources) => {
    const stream = xs.of(rendered);
    return { HTML: stream };
  }
  run(outputRender, drivers);
  return svg;
}

module.exports = {
  export: exportSvg,
  render: renderSvg,
  closedPath,
}
