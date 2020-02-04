import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Route, Link, Switch } from 'react-router-dom'
import './sass/main.scss'
import Sign_in from './components/sign_in'
import New_content from './components/new_content'
import Library from './components/library'
import Book_content from './components/book_content'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor} from './configureStore'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.dataAll = {
      hightlightText: '',
      dictionaryGoogleAPI: 'http://googledictionaryapi.eu-gb.mybluemix.net/',
      transGoogleAPI:
        'https://translation.googleapis.com/language/translate/v2',
      apiKeyGoogle: 'AIzaSyBr4QB1H8JxbgRnSOLvCH2g3rCN691RwqM',
      // This should be in 
      bookContent: `Aili said she was told that the reason `,
      signInRoute: '',
      newContentRoute: 'new_content',
      libraryRoute: 'library',
      bookContentRoute: 'book_content'
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
                  line_height: '25'
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

  render () {
    return (
      <div>
        <Switch>
          <Route
            path='/'
            component={() => (
              <Sign_in
                hightlightHandler={this.hightlightHandler.bind(this)}
                dataAll={this.dataAll}
              />
            )}
            exact
          />
          <Route
            path={'/' + this.dataAll.libraryRoute}
            component={() => <Library />}
          />
          <Route
            path={'/' + this.dataAll.newContentRoute}
            component={() => <New_content />}
          />
          <Route
            path={'/' + this.dataAll.bookContentRoute}
            component={() => <Book_content />}
          />
        </Switch>
      </div>
    )
  }
}

ReactDOM.render(
  <Provider store={store}>
  <PersistGate loading={null} persistor={persistor}>  
    <HashRouter>
      <App />
    </HashRouter>
  </PersistGate>
  </Provider>,
  document.getElementById('root')
)
