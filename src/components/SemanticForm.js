import React from 'react'
import { Form } from 'formsy-react'

import { getValueFor, getSchemaFor } from '../utils/Expressions.js'

const Formsyie = Formsyied => class extends React.Component {

  static childContextTypes = {
    formsied: React.PropTypes.object
  }

  constructor(props) {
    super(props)
    this.canUpdate = false
    this.listeners = {}
    this.inputs = []
  }

  getChildContext() {
    return {
      formsied: {
        setup: ::this.setup,
        changing: ::this.changing,
        bindFor: ::this.bindFor,
        model: this.props.model
      }
    }
  }

  componentDidMount() {
    for(const i in this.inputs) {
      this.inputs[i].setInitialEnv(this.props.model)
    }
    this.canUpdate = true
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.canUpdate) {
      const res =
        super.shouldComponentUpdate ?
        super.shouldComponentUpdate (nextProps, nextState) :
        true

      return res
    }
    else {
      this.canUpdate = true
      return false
    }
  }

  changing(component, value) {

    if(!this.canUpdate)
      return

    const varname = component.getName()
    console.log(`Changing '${varname}' to '${value}'`)
    this.bindFor(varname, value)
  }

  saveEnv(component, env) {
    console.log(`Saving enviroment for '${component.getName()}' -> ${JSON.stringify(env)}`)

    for(const i in env) {
      const varName = component.getNameBase() + env[i].name
      this.listeners[varName] = this.listeners[varName] || []

      const fn = env[i].fn.bind(component)

      this.listeners[varName].push(fn)
    }
  }

  bindFor(varName, value) {
    for(const i in this.listeners[varName]) {
      const component = this.listeners[varName][i].component
      const fn = this.listeners[varName][i]
      fn(varName, value)
    }
  }

  setup(component) {

    const name = component.getName()
    const schema = getSchemaFor(this.props.schema, name)  //|| {listOptions: {}}
    let value = undefined

    value = component.props.initialValue || getValueFor(this.props.model, name)

    console.log(`setup: ${name} -> ${JSON.stringify(schema)}`)

    //alert(name)
    if (schema) {
      if (schema.placeholder === undefined)
        schema.placeholder = schema.displayName

      component.setSchema(schema, value)
    }

    this.inputs.push(component)
    component.setValue(value)
    component.setPristine(value)
    const env = component.getEnv(schema)
    this.saveEnv(component, env)
  }

  unsetup(component) {
    const q = this.inputs
      .map((c, i) => [i, c])
      .filter((ic, i) => ic[i].getName() === component.getName())

    const ix = q[0]
    delete this.inputs[ix]
  }

  render() {
    return (
      <div className="ui form">
        <Formsyied {...this.props} _state={this.state} />
      </div>
    )
  }

}

export default Formsyie(Form)

