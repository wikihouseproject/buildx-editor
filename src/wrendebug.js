const Wren = require('./lib/wren')
const { h, render, Component } = require('preact')

class App extends Component {
  constructor() {
    super()

    const defaultDimensions = new Wren().inputs.dimensions
    // ignore any keys that don't point to a number
    const keys = Object.keys(defaultDimensions).filter(k => typeof defaultDimensions[k] === "number")
    // return new object of key,value pairs
    const defaults = keys.reduce( (obj, key) => {
      obj[key] = defaultDimensions[key]
      return obj
    }, {})

    this.state = defaults
  }
  updateInputs(e) {
    this.setState({[e.target.name]: Number(e.target.value)})
  }
  render(props, {inputs}) {
    const w = new Wren({dimensions: this.state})
    document.getElementById('svgs').innerHTML = w.toSVG()
    document.getElementById('outputs').innerHTML = JSON.stringify(w.outputs, null, 2)
    return (<Form inputs={this.state} updateInputs={this.updateInputs.bind(this)}/>)
  }
}

const Form = ({inputs, updateInputs}) => {
  return (
    <form>
      {Object.keys(inputs).map(name =>
        <Input name={name} value={inputs[name]} updateInputs={updateInputs} />
      )}
    </form>
  )
}

const Input = ({name, value, updateInputs}) => {
  return (
    <div className="input">
      <label>{name}</label>
      <input type="number" name={name} value={value} onInput={updateInputs}></input>
    </div>
  )
}

render(<App />, document.getElementById('inputs'))
