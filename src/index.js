import React from 'react'
import ReactDOM from 'react-dom'
import styles from './sass/main.scss'
import Sign_in from './components/sign_in.js'
import New_content from './components/new_content.js'

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
    }
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

  componentDidMount () {}
  render () {
    return (
      <div>
        <Sign_in hightlightHandler= {this.hightlightHandler.bind(this)} dataAll={this.dataAll}/>
        <New_content />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))

// import React from 'react'
// import ReactDOM from 'react-dom'
// import Sign_in from './components/sign_in.js'
// import { createStore } from 'redux'

// function reducer(initialState, action){
//   // Think if it's a must to store id/pw data in the state tree
// }

// const store = createStore(reducer);

// const initialState = {
//   hightlightText: '',
//   bookContent: `Paste your book content here`,
// }

// const apiKeyGoogle = 'AIzaSyBr4QB1H8JxbgRnSOLvCH2g3rCN691RwqM'
// const transGoogleAPI = 'https://translation.googleapis.com/language/translate/v2'
// const dictionaryGoogleAPI = 'http://googledictionaryapi.eu-gb.mybluemix.net/'
// const apiKeyMerriam = '1c8b8f95-5745-4aae-834d-ad6674ea2f13'
// let userID= '';
// let userPW= '';

// class App extends React.Component {
//   constructor (props) {
//     super(props)
//   }

//   render () {
//     return (
//       <div>
//         <Sign_in />
//       </div>
//     )
//   }
// }

// ReactDOM.render(<App />, document.getElementById('root'))
