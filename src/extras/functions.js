import xs from 'xstream'
import config from './config'
import {div, input, span, h} from '@cycle/dom'

import * as wren from '../lib/wren'

const intent = domSource => {
  return {
    width$: domSource.select('input#width')
              .events('input')
              .map(ev => Number(ev.target.value))
              .startWith(config.width),

    spacing$: domSource.select('input#spacing')
              .events('input')
              .map(ev => Number(ev.target.value))
              .startWith(config.spacing),

    height$: domSource.select('input#height')
              .events('input')
              .map(ev => Number(ev.target.value))
              .startWith(config.height),

    wallHeight$: domSource.select('input#wallHeight')
              .events('input')
              .map(ev => Number(ev.target.value))
              .startWith(config.wallHeight),

    bayCount$: domSource.select('input#bayCount')
              .events('input')
              .map(ev => Number(ev.target.value))
              .startWith(config.bayCount)
  }
}

const model = actions => {
  return xs.combine(
    actions.width$,
    actions.height$,
    actions.wallHeight$,
    actions.spacing$,
    actions.bayCount$,
  )
}

const renderControls = (params) => {
  const m = wren.geometrics(params); // TODO: move out metrics calc/render

  return [
    div({attrs: { id: 'controls'}}, [
      div([
        input({attrs: { id: 'width', value: params.width, type: 'range', min: 4, max: 7, step: 0.1 }}),
        span(`Width: ${params.width}m`)
      ]),
      div([
        input({attrs: { id: 'height', value: params.height, type: 'range', min: (params.wallHeight+0.1), max: 5.5, step: 0.1 }}),
        span(`Height: ${params.height}m`)
      ]),
      div([
        input({attrs: { id: 'wallHeight', value: params.wallHeight, type: 'range', min: 2.5, max: (params.height-0.1), step: 0.1 }}),
        span(`wallHeight: ${params.wallHeight}m`)
      ]),
      div([
        input({attrs: { id: 'spacing', value: params.bayLength, type: 'range', min: 0.6, max: 1.5, step: 0.1 }}),
        span(`Spacing: ${params.bayLength}m`)
      ]),
      div([
        input({attrs: { id: 'bayCount', value: params.bayCount, type: 'range', min: 5, max: 15, step: 1 }}),
        span(`Bays #: ${params.bayCount}`)
      ]),
    ]),
    h('ul', {attrs: { id: 'figures'}}, [
      h('li', `Total Area: ${m.footprintArea.toFixed(2)}m²`),
      h('li', `Chassis costs: ${wren.estimateCosts(m).toFixed(2)} GPD`),
    ])
  ]
}

module.exports = { intent, model, renderControls }
