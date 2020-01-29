import React from 'react'

export default class New_content extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return(
        <div>
            <h1>Hi, Joanna</h1>
            <p>what would you like to read today?</p>
            <a>Clear</a>
            <a>Save</a>
            <textarea>Paste what you want to save here.</textarea>
        </div>        
    )
  }
}
