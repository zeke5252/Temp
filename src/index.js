import React from 'react'
import ReactDOM from 'react-dom'
import Sign_in from './components/sign_in.js'

class App extends React.Component {
  constructor (props) {
    super(props)

  }

  render () {
    return (
      <div>
        <Sign_in />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
