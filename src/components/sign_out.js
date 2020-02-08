import React from 'react'
import styles from '../sass/main.scss'
import { connect } from 'react-redux'
import { cleanStoreData } from '../actions/'

class SignOut extends React.Component {
  constructor (props) {
    super(props)
    this.signOut = this.signOut.bind(this, this.props.dispatch, this.props.history)
  }
  signOut (propsDispatch, history) {
    this.props.turnOffHighlight ? this.props.turnOffHighlight() : {}

    firebase
      .auth()
      .signOut()
      .then(function () {
        // Clean all store data
        propsDispatch(cleanStoreData())
        alert('Sign-out successful.')
        history.push('/')
      })
      .catch(function (error) {
        console.log('An error happened')
      })
  }

  render () {
    return (
      <button className={styles.signout} onClick={this.signOut}>
        <img
          src={require('../images/signout.png')}
          className={styles.signout_img}
        />
      </button>
    )
  }
}

function mapStateToProps (state) {
  return {
    initState: state
  }
}

export default connect(mapStateToProps)(SignOut)
