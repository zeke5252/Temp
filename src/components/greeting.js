import React from 'react'
import styles from '../sass/main.scss'

export default class Greetings extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <p className={styles.library_greeting}>
        Hi,
        <span className={styles.library_yourName}>{this.props.userName}</span>
        what would you like to read today?
      </p>
    )
  }
}
