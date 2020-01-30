import React from 'react'
import styles from '../sass/main.scss'

export default class Sign_in extends React.Component {
  constructor (props) {
    super(props)
    this.state ={
      userID: '',
      userPW: '',
      userName: ''
    }
    this.signUpHandler = this.signUpHandler.bind(
      this
    )
    this.signInHandler = this.signInHandler.bind(
      this,
      this.props.hightlightHandler,
      this.props.dataAll
    )
    this.onNameChange = this.onNameChange.bind(this)
    this.onIDChange = this.onIDChange.bind(this)
    this.onPWChange = this.onPWChange.bind(this)
  }

  signUpHandler () {
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
      })
      .catch(error => console.log(error.message)) // Add warning message here
  }

  signInHandler (handler, data) {
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.userID, this.state.userPW)
      .then(res => {
        let user = firebase.auth().onAuthStateChanged(function (user) {
          if (user) {
            console.log('the user is signed in, the data is = ',user)
            handler(data);
          } else {
            // No user is signed in.
            console.log('No one signed in')
          }
        })
      })
      .catch(error => console.log(error.message)) // Add warning message here
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
    return(
        <div>
        Hi, I am...
        <input type='text' id='name' onChange={this.onNameChange}></input>
        ID
        <input type='text' id='email' onChange={this.onIDChange}></input>
        <br />
        Password
        <input type='password' id='password' onChange={this.onPWChange}></input>
        <br />
        <button id='signupBtn' onClick={this.signUpHandler}>
          Sign up
        </button>
        <button id='signinBtn' onClick={this.signInHandler}>
          Sign in
        </button>
      </div>        
    )
  }
}


// import React from 'react'
// import styles from '../sass/main.scss'

// export default class Sign_in extends React.Component {
//   constructor (props) {
//     super(props)
//   }

//   render () {
//     return(
//         <div >
//             <h1 className={styles.main}>This is a sign inup panel.</h1>
//         </div>        
//     )
//   }
// }