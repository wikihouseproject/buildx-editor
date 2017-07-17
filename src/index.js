import 'aframe-orbit-controls-component-2'

import {run} from '@cycle/run'
import {makeDOMDriver} from '@cycle/dom'
import {App} from './three_d'

const main = App

const drivers = {
  DOM: makeDOMDriver('#app')
}

run(main, drivers)
