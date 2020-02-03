import React from 'react'
import styles from "../sass/main.scss";

export default class Book extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return(
        <div className={styles.book_cover}>
          <span className={styles.book_cover_color}></span>
            <span className={styles.book_title}>Title...</span>
            <div className={styles.book_page_container}>
              <span className={styles.book_page}>36 </span> / 100
            </div>
        </div>        
    )
  }
}
