import {run} from '@cycle/run'
import {makeDOMDriver} from '@cycle/dom'

import SVG from './components/svg'
import ThreeD from './components/three_d'

const main = (window.location.hash === '#svg') ? SVG : ThreeD

const drivers = {
  DOM: makeDOMDriver('#app')
}

run(main, drivers)
