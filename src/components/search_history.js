import React from 'react'
import styles from '../sass/main.scss'

export default class Search_history extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return(
        <div className={styles.search_container}>
            <span className={styles.search_title}>Search history</span>
            <select>
                <option>by frequency</option>
                <option>by time</option>
            </select>
            <div className={styles.search_radio_container}>
                <input type="radio" name="" value="" id="" className={styles.search_radio}></input>
                <span> All </span>
                <span className={styles.search_radio_divider}> | </span>
                <input type="radio" name="" value="" id="" className={styles.search_radio}></input>
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
