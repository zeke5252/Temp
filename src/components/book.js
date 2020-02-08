import React from 'react'
import styles from '../sass/main.scss'
import { addTempContent } from '../actions/'
import { connect } from 'react-redux'

class Book extends React.Component {
  constructor (props) {
    super(props)
    this.openBook = this.openBook.bind(this, this.props.dispatch, this.props.history)
  }

  openBook(propsDispatch){
    propsDispatch(addTempContent(this.props.content))
    this.props.history.push('/Book_content')
  }

  render () {
    let theColor = {
      backgroundColor:this.props.color
    }
    return (
      <div className={styles.book_cover} onClick={this.openBook}>
        <span className={styles.book_cover_color} style={theColor}></span>
        <span className={styles.book_title}>{this.props.title}</span>
        <div className={styles.book_page_container}>
          <span className={styles.book_page}>36 </span> / 100
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    userUID: state.userUID,
    userName: state.userName,
    bookContent: state.bookContent
  }
}
export default connect(mapStateToProps)(Book)
