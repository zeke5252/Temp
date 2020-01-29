import React from 'react'

export default class Library extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return(
        <div>
            <h1>Hi, Joanna</h1>
            <p>what would you like to read today?</p>
            <a>Add new book</a>
            <div>
                <Book />
            </div>
            <Search_history />
        </div>        
    )
  }
}
