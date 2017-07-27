import {run} from '@cycle/run'
import {makeDOMDriver} from '@cycle/dom'
import { makeHTTPDriver } from '@cycle/http'
import SVG from './svg'

const main = SVG

const drivers = {
  DOM: makeDOMDriver('#container'),
  HTTP: makeHTTPDriver()
}

run(main, drivers)
