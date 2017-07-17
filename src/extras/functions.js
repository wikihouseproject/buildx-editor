import xs from 'xstream'
import config from './config'
import {div, input, span} from '@cycle/dom'

const floorArea = (width, bayCount) => width*(bayCount*config.BAY_LENGTH)

const intent = domSource => {
  return {
    width$: domSource.select('input#width')
              .events('input')
              .map(ev => Number(ev.target.value))
              .startWith(config.width),

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
    actions.bayCount$
  )
}

const renderControls = (width, height, wallHeight, bayCount) => {
  return [
    div({attrs: { id: 'controls'}}, [
      div([
        input({attrs: { id: 'width', value: width, type: 'range', min: 4, max: 7, step: 0.1 }}),
        span(`Width: ${width}m`)
      ]),
      div([
        input({attrs: { id: 'height', value: height, type: 'range', min: (wallHeight+0.1), max: 5.5, step: 0.1 }}),
        span(`Height: ${height}m`)
      ]),
      div([
        input({attrs: { id: 'wallHeight', value: wallHeight, type: 'range', min: 2.5, max: (height-0.1), step: 0.1 }}),
        span(`wallHeight: ${wallHeight}m`)
      ]),
      div([
        input({attrs: { id: 'bayCount', value: bayCount, type: 'range', min: 5, max: 15, step: 1 }}),
        span(`Bays #: ${bayCount}`)
      ]),
    ]),
    div({attrs: { id: 'figures'}}, [
      span(`Floor Area: ${floorArea(width, bayCount).toFixed(2)}m²`)
    ])
  ]
}

module.exports = { floorArea, intent, model, renderControls }