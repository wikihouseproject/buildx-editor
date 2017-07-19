import {h, div} from '@cycle/dom'
import xs from 'xstream'

import * as wren from '../lib/wren'
import {intent, model, renderControls} from '../extras/functions'

export default function renderCutsheets(sources) {

  const actions = intent(sources.DOM)
  const state$ = model(actions)

  const vtree$ = state$.map(([width, height, wallHeight, spacing, bayCount]) => {

    var p = wren.parameters.defaults;
    p.width = width;
    p.height = height;
    p.wallHeight = wallHeight;
    p.bayCount = bayCount;
    p.bayLength = spacing;

    var chassis = wren.chassis(p);

    const svg = wren.SVG.export(chassis); 
    const svgDataUri = "data:image/svg+xml;base64," + btoa(svg);   

    const metrics = wren.geometrics(p);

    const csv = wren.CSV.dumpKeyValues(metrics);
    const csvDataUri = "data:text/csv;base64," + btoa(csv);

    return div([
      wren.SVG.render(chassis, { id: 'svgview' }),
      h('a', { attrs: { id: 'svgdata', href: svgDataUri }}, ['Cutsheets (.SVG)']),
      h('a', { attrs: { id: 'csvdata', href: csvDataUri }}, ['Data (.CSV)']),
      ...renderControls(p),
    ])
  })

  return { DOM: vtree$ }
}
