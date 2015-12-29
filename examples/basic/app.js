import React from 'react'
import { render } from 'react-dom'
import { Form, Input } from 'formantify'

class Basic extends React.Component {
  constructor(props) {
    super(props)
  }

  submit(model) {
    alert(JSON.stringify(model))
  }

  render() {

    let schema = {
      simple: {
        displayName: "Simples"
      }
    }

    let model = {
      simple: "lemol"
    }

    return (
      <Form schema={schema} model={model} onSubmit={this.submit.bind(this)}>
        <Input name="simple" label="##" rightButton="home" />
        <button type="submit">OK</button>
      </Form>
    )
  }
}

render(<Basic />, document.getElementById('mount'))