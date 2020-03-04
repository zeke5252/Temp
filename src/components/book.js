import React from 'react'
import styles from '../sass/main.scss'
import { addTempContent, addTempTitle, addTempNote } from '../actions/'

import { connect } from 'react-redux'

class Book extends React.Component {
  constructor (props) {
    super(props)
    const {dispatch, history} = this.props
    this.openBook = this.openBook.bind(this, dispatch, history)
    this.showDeleteBtn = this.showDeleteBtn.bind(this)
    this.hideDeleteBtn = this.hideDeleteBtn.bind(this)
    this.state = {
      isVisible:'none'
    }
  }

  openBook(propsDispatch){
    const {content, title, note, history} = this.props
    propsDispatch(addTempContent(content))
    propsDispatch(addTempTitle(title))
    propsDispatch(addTempNote(note))
    history.push('/Book_content')
  }

  showDeleteBtn(){
    this.setState({
      isVisible:'flex'
    })
  }

  hideDeleteBtn(){
    this.setState({
      isVisible:'none'
    })
  }

  render () {
    const {color, deleteBook, id, date, position, titleCover, searchedWords } =this.props
    let theColor = {
      backgroundColor:color
    }
    return (
    <div className={styles.book_container_out}>
      <div className={styles.book_container} onMouseOver={this.showDeleteBtn} onMouseOut={this.hideDeleteBtn}>
        <div className={styles.deleteBtn} style={{display:this.state.isVisible}} onClick={deleteBook.bind(this, id, date, position)}>✕</div>
        <div className={styles.book_cover} onClick={this.openBook}>  
          <span className={styles.book_cover_color} style={theColor}></span>
          <span className={styles.book_title}>{titleCover}</span>
          <div className={styles.book_page_container}>
            <span className={styles.book_searchedWords}>{searchedWords} searches </span>
          </div>
        </div>
      </div>
      <div className={styles.book_container_bg} ></div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    userUID: state.userUID,
    bookContent: state.bookContent,
    bookTitle: state.bookTitle,
    bookNote: state.bookNote,
  }
}
export default connect(mapStateToProps)(Book)
