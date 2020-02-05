import React from 'react'
import styles from '../sass/main.scss'
import { addTempContent } from '../actions/'
import { connect } from 'react-redux'
import { createHashHistory } from 'history'
const history = createHashHistory()

class Book extends React.Component {
  constructor (props) {
    super(props)
    this.openBook = this.openBook.bind(this, this.props.dispatch)
  }

  openBook(propsDispatch){
    propsDispatch(addTempContent(this.props.content))
    history.push('./Book_content')
  }

  render () {
    let theColor = {
      backgroundColor:this.props.color
    }
    return (
      // 從這邊開連結到book content頁面，在這邊把bookContent設到redux上。再到Book_content那頁的時候抓取。
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
