import React from 'react'
import Search_history from './search_history.js'

export default class Book_content extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return(
        <div>
            <h1>This is the content of the book</h1>
            <Search_history />
        </div>        
    )
  }
}
