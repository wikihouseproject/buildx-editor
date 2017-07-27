// import {div, label, input, hr, h1, makeDOMDriver, svg, h} from '@cycle/dom'
import {div, button, h1, input} from '@cycle/dom'
import xs from 'xstream'

export default function main({DOM, HTTP}) {

  const input$ = DOM.select('.field').events('input')
  const name$ = input$.map(ev => ev.target.value).startWith('')

  const click$ = DOM.select('.get-first').events('click')

  const request$ = click$.map(ev => ({
    url: 'https://jsonplaceholder.typicode.com/users/1',
    method: 'GET',
    category: 'user-data'
  }))

  const response$ = HTTP
    .select('user-data')
    .flatten()
    .map(res => res.body)
    .startWith({})

  // const vtree$ = response$.map( response =>
  // const vtree$ = name$.map( name =>
  const vtree$ = xs.combine(response$, name$).map( ([response, name]) =>
    div([
      input('.field', {attrs: {type: 'text'}}),
      h1(name),
      button('.get-first', 'Get first user'),
      div('.user-details', [
        h1('.user-name', response.name),
        h1('.user-email', response.email)
      ])
    ])
  )

  const sinks = {
    DOM: vtree$,
    HTTP: request$
  }

  return sinks
}

