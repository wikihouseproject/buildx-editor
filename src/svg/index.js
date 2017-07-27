import { h, render, Component } from 'preact';

class Clock extends Component {
  render() {
    return h('svg', null, [
      h('path', { d: 'M0,0 L10,0 20,20 0,20', fill: 'red' })
    ])
  }
}

render(h(Clock), document.getElementById('container'));
