import 'aframe-orbit-controls-component-2'
import './lib/aframe-hello-component'

import {run} from '@cycle/run'
import {makeDOMDriver} from '@cycle/dom'
import {App} from './app'

const main = App

const drivers = {
  DOM: makeDOMDriver('#app')
}

run(main, drivers)
