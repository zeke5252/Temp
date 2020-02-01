import React from 'react'
import ReactDOM from 'react-dom'
import styles from './sass/main.scss'

class App extends React.Component {
  constructor (props) {
    super(props)

    this.dataAll = {
      hightlightText: '',
      dictionaryGoogleAPI: 'http://googledictionaryapi.eu-gb.mybluemix.net/',
      transGoogleAPI:
        'https://translation.googleapis.com/language/translate/v2',
      apiKeyMerriam: '1c8b8f95-5745-4aae-834d-ad6674ea2f13',
      apiKeyGoogle: 'AIzaSyBr4QB1H8JxbgRnSOLvCH2g3rCN691RwqM',
      bookContent: `Aili said she was told that the reason why the Saudi patients insisted
      on receiving organs from Uyghur donors was that they wanted "Halal
      organs. " 
      real.`,
      userID: '',
      userPW: '',
      userName: ''
    }
    this.signUpHandler = this.signUpHandler.bind(
      this,
      this.hightlightHandler,
      this.dataAll
    )
    this.signInHandler = this.signInHandler.bind(
      this,
      this.hightlightHandler,
      this.dataAll
    )
    this.onNameChange = this.onNameChange.bind(this)
    this.onIDChange = this.onIDChange.bind(this)
    this.onPWChange = this.onPWChange.bind(this)
  }

  hightlightHandler (data) {
    document.onmouseup = () => {
      //Get the hightlight text
      data.hightlightText = window
        .getSelection()
        .toString()
        .trim()
      if (
        data.hightlightText.split(' ').length === 1 &&
        data.hightlightText !== ''
      ) {
        let uid = firebase.auth().currentUser.uid
        let disName = firebase.auth().currentUser.displayName
        let db = firebase.firestore()
        // Use Merriam-Webster dictionary api
        fetch(`${data.dictionaryGoogleAPI}?define=${data.hightlightText}`)
          .then(res => res.json())
          .then(res => {
            db.collection('users')
              .doc(`${uid}`)
              .collection('Search_history')
              .doc(`${data.hightlightText}`)
              .set(res[0])
            db.collection('users')
              .doc(`${uid}`)
              .set({
                displayName: `${disName}`,
                preference: {
                  background_color: '#E3C38A',
                  font_size: 16,
                  font_type: 'Roboto Sans',
                  line_height: '25',
                }
              })
            return db.collection('users').get()
          })
          .then(querySnapshot => {
            querySnapshot.forEach(function (doc) {
              // doc.data() is never undefined for query doc snapshots
              console.log(doc.id, ' => ', doc.data())
            })
          })
      } else {
        // Use Google translate api
        fetch(
          `${data.transGoogleAPI}?key=${data.apiKeyGoogle}&source=en&target=zh-CN&q=${data.hightlightText}`
        )
          .then(res => res.json())
          .then(res => {
            console.log('Google translate result=', res)
          })
      }
    }
  }

  signUpHandler (handler, data) {
    firebase
      .auth()
      .createUserWithEmailAndPassword(data.userID, data.userPW)
      .then(res => {
        firebase.auth().currentUser.updateProfile({
          displayName: data.userName
        })
      })
      .then(res => {
        console.log(
          'Sign up done, the user data is=',
          firebase.auth().currentUser
        )
        handler(data)
      })
      .catch(error => console.log(error.message)) // Add warning message here
  }

  signInHandler (handler, data) {
    console.log('data=', data)
    firebase
      .auth()
      .signInWithEmailAndPassword(data.userID, data.userPW)
      .then(res => {
        let user = firebase.auth().onAuthStateChanged(function (user) {
          if (user) {
            // User is signed in.
            handler(data)
          } else {
            // No user is signed in.
            console.log('No one signed in')
          }
        })
      })
      .catch(error => console.log(error.message)) // Add warning message here
  }

  onNameChange () {
    this.dataAll.userName = event.target.value
  }

  onIDChange () {
    this.dataAll.userID = event.target.value
  }

  onPWChange () {
    this.dataAll.userPW = event.target.value
  }

  componentDidMount () {}
  render () {
    return (
      <div>
        Hi, I am...
        <input type='text' id='name' onChange={this.onNameChange}></input>
        ID
        <input
          type='text'
          id='email'
          onChange={this.onIDChange.bind(this)}
        ></input>
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
        <br />
        <h1 className={styles.main}>{this.dataAll.bookContent}</h1>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))



// import React from 'react'

// export default class SignIn extends React.Component {
//   constructor (props) {
//     super(props)
//     this.signUpHandler = this.signUpHandler.bind(
//         this,
//         this.props.hightlightHandler,
//         this.props.dataAll
//       )
//       this.signInHandler = this.signInHandler.bind(
//         this,
//         this.props.hightlightHandler,
//         this.props.dataAll
//       )
//       this.onNameChange = this.onNameChange.bind(this)
//       this.onIDChange = this.onIDChange.bind(this)
//       this.onPWChange = this.onPWChange.bind(this)
//   }


//   signUpHandler (handler, data) {
//     firebase
//       .auth()
//       .createUserWithEmailAndPassword(data.userID, data.userPW)
//       .then(res => {
//         firebase.auth().currentUser.updateProfile({
//           displayName: data.userName
//         })
//       })
//       .then(res => {
//         console.log(
//           'Sign up done, the user data is=',
//           firebase.auth().currentUser
//         )
//         handler(data)
//       })
//       .catch(error => console.log(error.message)) // Add warning message here
//   }

//   signInHandler (handler, data) {
//     console.log('data=', data)
//     firebase
//       .auth()
//       .signInWithEmailAndPassword(data.userID, data.userPW)
//       .then(res => {
//         let user = firebase.auth().onAuthStateChanged(function (user) {
//           if (user) {
//             // User is signed in.
//             handler(data)
//           } else {
//             // No user is signed in.
//             console.log('No one signed in')
//           }
//         })
//       })
//       .catch(error => console.log(error.message)) // Add warning message here
//   }

//   onNameChange () {
//     this.props.dataAll.userName = event.target.value
//   }

//   onIDChange () {
//     this.props.dataAll.userID = event.target.value
//   }

//   onPWChange () {
//     this.props.dataAll.userPW = event.target.value
//   }

//   render () {
//     return(
//         <div>
//         Hi, I am...
//         <input type='text' id='name' onChange={this.onNameChange}></input>
//         ID
//         <input type='text' id='email' onChange={this.onIDChange.bind(this)}></input>
//         <br />
//         Password
//         <input type='password' id='password' onChange={this.onPWChange}></input>
//         <br />
//         <button id='signupBtn' onClick={this.signUpHandler}>
//           Sign up
//         </button>
//         <button id='signinBtn' onClick={this.signInHandler}>
//           Sign in
//         </button>
//         <br />
//         <h1 className={styles.main}>{this.props.dataAll.bookContent}</h1>

//       </div>        
//     )
//   }
// }