import React from 'react'
import styles from '../sass/main.scss'

export default function Greetings(props) {
  let self = {
    props
  };

  return (
    <p className={styles.library_greeting}>
        Hi,
        <span className={styles.library_yourName}>{self.props.userName}</span>
        {!self.props.booksAll ? 'Add your file first': 'what would you like to read today?'}
      </p>
  )
}
