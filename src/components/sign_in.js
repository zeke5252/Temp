import React from 'react'
import { Link } from 'react-router-dom'
import styles from '../sass/main.scss'
import { connect } from 'react-redux'
import { createHashHistory } from 'history'

const history = createHashHistory()

class Sign_in extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      userID: '',
      userPW: '',
      userName: '',
      errorMsg: ''
    }
    this.signUpHandler = this.signUpHandler.bind(
      this,
      this.props.dispatch
      )
    this.signInHandler = this.signInHandler.bind(
      this,
      this.props.hightlightHandler,
      this.props.dataAll,
      this.props.dispatch
    )
    this.onNameChange = this.onNameChange.bind(this)
    this.onIDChange = this.onIDChange.bind(this)
    this.onPWChange = this.onPWChange.bind(this)
  }

  signUpHandler (propsDispatch) {
    console.log(this.state)
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.userID, this.state.userPW)
      .then(res => {
        firebase.auth().currentUser.updateProfile({
          displayName: this.state.userName
        })
      })
      .then(res => {
        console.log(
          'Sign up done, the user data is=',
          firebase.auth().currentUser
        )
        propsDispatch(updateID(firebase.auth().currentUser.uid))
        history.push('/library')
      })
      .catch(error => {
        this.setState({
          errorMsg: error.message
        })
      }) // Add warning message here
  }

  signInHandler (handler, data, propsDispatch) {
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.userID, this.state.userPW)
      .then(res => {
        console.log('res=', res)
        let user = firebase.auth().onAuthStateChanged(function (user) {
          if (user) {
            console.log('the user is signed in, the data is = ', user)
            //handler(data)
            propsDispatch(updateID(firebase.auth().currentUser.uid))
            history.push('/library')
          } else {
            // No user is signed in.
            console.log('No one signed in')
          }
        })
      })
      .catch(error => {
        this.setState({
          errorMsg: error.message
        })
      }) // Add warning message here
  }

  onNameChange () {
    this.setState({
      userName: event.target.value
    })
  }

  onIDChange () {
    this.setState({
      userID: event.target.value
    })
  }

  onPWChange () {
    this.setState({
      userPW: event.target.value
    })
  }

  render () {
    return (
      <div className={styles.container}>
        <div className={styles.sign_in_container}>
          <img
            src={require('../images/logo_signin.png')}
            className={styles.logo_signin}
          />
          <span className={styles.sign_in_title}>Sign in / up</span>
          <input
            type='text'
            id='name'
            onChange={this.onNameChange}
            placeholder='Your name'
          ></input>
          <input
            type='text'
            id='email'
            onChange={this.onIDChange}
            placeholder='Your e-mail'
          ></input>
          <input
            type='password'
            id='password'
            onChange={this.onPWChange}
            placeholder='Your password'
          ></input>
          <button id='signupBtn' onClick={this.signUpHandler}>
            Sign up
          </button>
          <button id='signinBtn' onClick={this.signInHandler}>
            Sign in
          </button>
          <span className={styles.message}>{this.state.errorMsg}</span>
        </div>
      </div>
    )
  }
}

const updateID = function ( idData ) {
  return {
    type: 'UPDATE_ID',
    payload: idData
  }
}

function mapStateToProps (state) {
  return {
    userID: state.userID
  }
}

export default connect(mapStateToProps)(Sign_in)
