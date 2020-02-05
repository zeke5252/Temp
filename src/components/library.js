import React from 'react'
import Book from './book.js'
import Search_history from './search_history.js'
import { connect } from 'react-redux'
import styles from '../sass/main.scss'
import { createHashHistory } from 'history'
const history = createHashHistory()

// get name from redux

class Library extends React.Component {
  constructor (props) {
    super(props)
    this.addNewContent = this.addNewContent.bind(this)
    this.state = {
      isLoading: true,
      books: [],
      colors: [],
      bookContent: ''
    }
  }

  addNewContent () {
    history.push('/New_content')
  }

  logOut () {
    firebase
      .auth()
      .signOut()
      .then(function () {
        alert('Sign-out successful.')
        history.push('/')
      })
      .catch(function (error) {
        console.log('An error happened')
      })
  }
  componentDidMount () {
    let uid = this.props.userUID
    let db = firebase.firestore()
    db.collection('users')
      .doc(`${uid}`)
      .collection('Library')
      .orderBy('createdTime', 'desc')
      .get()
      .then(library => {
        let tempBooks = []
        let tempColors = []
        let tempBookContent = []
        library.forEach(book => {
          tempColors.push(book.data().coverColor)
          tempBooks.push(book.id)
          tempBookContent.push(book.data().content)
        })
        this.setState({
          books: tempBooks,
          colors: tempColors,
          bookContent: tempBookContent,
          isLoading: false
        })
      })
  }

  render () {
    // Get data from firebase, if library array is not 0
    // If library array is 0
    // Tell user to add some thing by clicking the button above
    return (
      <div className={styles.container_library}>
        <button className={styles.logout} onClick={this.logOut}>
          sign out
        </button>
        <div className={styles.library_left_container}>
          <div className={styles.library_left_top}>
            <p className={styles.library_greeting}>
              Hi,
              <span className={styles.library_yourName}>
                {this.props.userName}
              </span>
              <br /> what would you like to read today?
            </p>
            <button onClick={this.addNewContent} className={styles.addBtn}>
              <img
                src={require('../images/add.png')}
                className={styles.addImg}
              />
            </button>
          </div>
          <div className={styles.library_book_container}>
            {this.state.isLoading === true ? (
              <img
                className={styles.loading}
                src={require('../images/loading2.gif')}
              />
            ) : (
              this.state.books.map((booktitle, index) => (
                <Book
                  title={booktitle}
                  color={this.state.colors[index]}
                  key={index}
                  id={index}
                  content={this.state.bookContent[index]}
                />
              ))
            )}
          </div>
        </div>
        <div className={styles.library_right_container}>
          <Search_history />
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    userUID: state.userUID,
    userName: state.userName,
  }
}
export default connect(mapStateToProps)(Library)

// Add time stamp to each book when creating a new content

// If not,
//      Organize the search result from the search api.
//      loop through the search history, render words on search panel. ( firebase & Redux )
//      Switch the dropdown list, re-arrange the order of the words. ( Redux )
//      toggle the all/Favorite to filter out the words ( Redux )
// Click on the book, push route history to book content. ( firebase )
// Grab the view settings ( Redux )
// Render book content on the screen.
// Select one word, send request to api, get data, store the data ( Redux & firebase )
// Select a phrase, send request to api, get data.
// Change view settings, press save, ( Redux & fires ) close settings panel, render the change on the screen
