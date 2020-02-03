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
  }

  logOut(){
    console.log('start to log out')
    firebase.auth().signOut()
    .then(function() {
      alert('Sign-out successful.')
      history.push('/')
    }).catch(function(error) {
      console.log('An error happened')
    });
  }

  componentDidMount () {
    console.log('auth', firebase.auth())

  }
  render () {
    console.log('username=', this.props.userName)
    return (
      <div className={styles.container_library}>
        <button className={styles.logout} onClick={this.logOut}>Log out here</button>
        <div className={styles.library_left_container}>
          <div className={styles.library_left_top}>
            <p className={styles.library_greeting}>
              Hi,{' '}
              <span className={styles.library_yourName}>
               {this.props.userName}
              </span>
              <br /> what would you like to read today?
            </p>
            <img src={require('../images/add.png')} className={styles.add} />
          </div>
          <div className={styles.library_book_container}>
            <Book />
            <Book />
            <Book />
            <Book />
            <Book />
            <Book />
            <Book />
            <Book />
            <Book />
          </div>
        </div>
        <div className={styles.library_right_container}>
          <Search_history />
        </div>
      </div>
    )
  }
}

Library.defaultProps={
  greetingName:'My friend'
}

function mapStateToProps (state) {
  return {
    userUID: state.userUID,
    userName: state.userName
  }
}
export default connect(mapStateToProps)(Library)
