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

// SVG conventions
// origin = top-left, positive Y downwards, clockwise points
const rectangle = (width, height, o) => {
  o = o || {};
  o.x = o.x || 0;
  o.y = o.y || 0;
  return [
    [ o.x, o.y ],
    [ o.x+width, o.y ],
    [ o.x+width, o.y+height ],
    [ o.x, o.y+height ],
  ];
}

// Render as a SVG vdom tree
function renderSvg(geometry, options) {
  options = options || {};
  options.width = options.width || 600;
  options.height = options.height || 6000;
  options.gap = options.gap || 10;

  // Cutlines for frames
  const frames = geometry.frames.map( (frame, frameNo) => {
    const paths = frameCuts(frame).map( (p) => {
      return h('path', {attrs: { d: p }})
    });
    const totalHeight = geometry.parameters.height + geometry.parameters.frameWidth;
    const positionY = frameNo * ((totalHeight*100) + options.gap);
    return h('g', { attrs: { fill: 'none', stroke: 'red', transform: `translate(0, ${positionY})` }}, paths);
  });

  // Cutsheet outlines
  const sheetPoints = rectangle(geometry.parameters.sheetWidth*100, geometry.parameters.sheetLength*100);
  const sheet = h('path', { attrs: { fill: 'none', stroke: 'grey', d: closedPath(sheetPoints) }});

  // Toplevel
  const toplevels = frames.concat([sheet]);
  var attrs = { xmlns: 'http://www.w3.org/2000/svg', width: options.width, height: options.height };
  if (options.id) { attrs.id = options.id; }

  return h('svg', {attrs: attrs}, toplevels);
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
