const Wren = require('./lib/wren')
const { h, render, Component } = require('preact')

const w = new Wren()

class Input extends Component {
  render({name, value, updateInputs}) {
    return (
      <div className="input">
        <label>{name}</label>
        <input type="text" value={value} onInput={updateInputs}></input>
      </div>
    )
  }
}

class Form extends Component {
  constructor() {
    super()
    this.state = {
      inputs: []
    }
  }
  componentDidMount() {
    const {ob} = this.props
    const keys = Object.keys(ob).filter(k => typeof ob[k] === "number")
    this.setState({inputs: keys.map(k => ([k, ob[k]]))})
  }
  updateInputs(e) {
    console.log(e.target.value)
  }
  render(props, state) {
    return (
      <form>
        {state.inputs.map(([name, value]) =>
          <Input name={name} value={value} updateInputs={this.updateInputs} />
        )}
      </form>
    )
  }
}


document.getElementById('svgs').innerHTML = w.toSVG()

// document.getElementById('inputs').innerHTML = JSON.stringify(w.inputs.dimensions, null, 2)
document.getElementById('outputs').innerHTML = JSON.stringify(w.outputs, null, 2)

render(<Form ob={w.inputs.dimensions} />, document.getElementById('inputs'));
