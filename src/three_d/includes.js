import xs from 'xstream'
import config from './config'

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

const model = ({ width$, height$, wallHeight$, bayCount$ }) => {
  return xs.combine(
    width$, height$, wallHeight$, bayCount$
  )
}

module.exports = { intent, model }
