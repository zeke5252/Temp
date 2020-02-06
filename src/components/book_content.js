import React from 'react'
import SignOut from './sign_out'
import { connect } from 'react-redux'

import styles from '../sass/main.scss'
import { createHashHistory } from 'history'
const history = createHashHistory()

class Book_content extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      dictionaryGoogleAPI: 'http://googledictionaryapi.eu-gb.mybluemix.net/',
      transGoogleAPI:
        'https://translation.googleapis.com/language/translate/v2',
      apiKeyGoogle: 'AIzaSyBr4QB1H8JxbgRnSOLvCH2g3rCN691RwqM',
      hightlightMode: true
    }
  }

  turnOffHighlight(){
    console.log(this.state)
    this.setState({
        hightlightMode: false
      })
  }

  hightlightHandler (data) {
    if (this.state.hightlightMode) {
      document.onmouseup = () => {
        //Get the hightlight text
        let hightlightText = window
          .getSelection()
          .toString()
          .trim()
        if (hightlightText.split(' ').length === 1 && hightlightText !== '') {
          let uid = this.props.userUID
          let db = firebase.firestore()
          fetch(`${this.state.dictionaryGoogleAPI}?define=${hightlightText}`)
            .then(res => res.json())
            .then(res => {
              db.collection('users')
                .doc(`${uid}`)
                .collection('Search_history')
                .doc(`${hightlightText}`)
                .set(res[0])
              db.collection('users')
                .doc(`${uid}`)
                .set({
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
                console.log(doc.id, ' => ', doc.data())
              })
            })
        } else if (
          hightlightText.split(' ').length > 1 &&
          hightlightText !== ''
        ) {
          // Use Google translate api
          fetch(
            `${this.state.transGoogleAPI}?key=${this.state.apiKeyGoogle}&source=en&target=zh-CN&q=${hightlightText}`
          )
            .then(res => res.json())
            .then(res => {
              console.log('Google translate result=', res)
            })
        }
      }
    } else {
      // TBD
      document.onmouseup = () => {}
    }
  }

  componentDidMount () {
    this.hightlightHandler(this.state)
  }

  componentWillUnmount(){
    this.hightlightHandler(this.state)
  }

  render () {
    return (
      <div className={styles.container_library}>
        <SignOut
          turnOffHighlight={this.turnOffHighlight.bind(this)}
        />
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
