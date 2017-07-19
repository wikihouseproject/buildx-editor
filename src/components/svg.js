import {h, div} from '@cycle/dom'
import xs from 'xstream'

import * as wren from '../lib/wren'
import {intent, model, renderControls} from '../extras/functions'

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

export default function renderCutsheets(sources) {

  const actions = intent(sources.DOM)
  const state$ = model(actions)

  const vtree$ = state$.map(([width, height, wallHeight, length]) => {
    const workarea = { width: 1.2, height: 2.4 }; // TODO: pass as parameters
    const cutsheet = rectangle(workarea.width*100, workarea.height*100);

    const geometry = {
      'frame': wren.frame({width: width*100, height: height*100, wallHeight: wallHeight*100, frameWidth: 10}),
      'boundary': cutsheet
    };

    const svg = wren.SVG.export(geometry); 
    const svgDataUri = "data:image/svg+xml;base64," + btoa(svg);   

    return div([
      wren.SVG.render(geometry, { id: 'svgview' }),
      h('a', { attrs: { id: 'svgdata', href: svgDataUri }}, ['Download']),
      ...renderControls(width, height, wallHeight, length),
    ])
  })

  return { DOM: vtree$ }
}
