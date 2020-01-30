import React from 'react'

export default class New_content extends React.Component {
  constructor (props) {
    super(props)
    this.saveBook = this.saveBook.bind(this);
    this.onChangeContent = this.onChangeContent.bind(this);
    this.tempContent={content:''};
  }
  saveBook (){
    let uid = firebase.auth().currentUser.uid
    let db = firebase.firestore()
    let bookName = `${this.tempContent.content.trim().split(' ')[0]} ${this.tempContent.content.trim().split(' ')[1]}...`
    db.collection('users')
              .doc(`${uid}`)
              .collection('Library')
              .doc(`${bookName}`)
              .set(this.tempContent)
  }

  onChangeContent (){
    this.tempContent.content=event.target.value
  }


  render () {
    return(
        <div>
            <h1>Hi, Joanna</h1>
            <p>what would you like to read today?</p>
            <a>Clear</a>
            <a onClick={this.saveBook}>Save</a>
            <textarea onChange={this.onChangeContent}></textarea>
        </div>        
    )
  }
}
