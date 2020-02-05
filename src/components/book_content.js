import React from 'react'
import { connect } from 'react-redux'
import styles from '../sass/main.scss'
import { createHashHistory } from 'history'
const history = createHashHistory()

class Book_content extends React.Component {
  constructor (props) {
    super(props)
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

  render () {
    return (
        <div className={styles.container_library}>
          <button className={styles.logout} onClick={this.logOut}>
            sign out
          </button>
        <div className={styles.bookContent}>{this.props.bookContent}</div>
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

export default connect(mapStateToProps)(Book_content)
