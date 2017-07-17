import {div, span, input} from '@cycle/dom'

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
    ])
  ]
}

module.exports = { renderControls }
