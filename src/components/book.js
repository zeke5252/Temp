import React from 'react'
import styles from '../sass/main.scss'

export default class Book extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    let theColor = {
      backgroundColor:this.props.color
    }
    return (
      <div className={styles.book_cover}>
        <span className={styles.book_cover_color} style={theColor}></span>
        <span className={styles.book_title}>{this.props.title}</span>
        <div className={styles.book_page_container}>
          <span className={styles.book_page}>36 </span> / 100
        </div>
      </div>
    )
  }
}
