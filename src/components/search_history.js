import React from 'react'

export default class Search_history extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return(
        <div>
            <h1>Search history</h1>
            <select>
                <option>by frequency</option>
                <option>by time</option>
            </select>
            <div>
                <input type="radio" name="" value="" id=""></input>
                <span> all </span>
                <input type="radio" name="" value="" id=""></input>
                <span> Favorite </span>
            </div>
            <ul>
                <li>word</li>
                <li>word</li>
                <li>word</li>
                <li>word</li>
            </ul>
        </div>        
    )
  }
}
