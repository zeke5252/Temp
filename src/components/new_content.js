import React from 'react'
import { connect } from 'react-redux'
import styles from '../sass/main.scss'
import Search_history from './search_history'
import { createHashHistory } from 'history'
const history = createHashHistory()

class New_content extends React.Component {
  constructor (props) {
    super(props)
    this.saveBook = this.saveBook.bind(this)
    this.onContentChange = this.onContentChange.bind(this)
    this.resetContent = this.resetContent.bind(this)
    this.cancelContent = this.cancelContent.bind(this)
    this.saveBook = this.saveBook.bind(this);
    this.assignColor = this.assignColor.bind(this);
    this.state = { 
      content: '',
      coverColor:''
    }
  }

  componentDidMount(){
    this.assignColor()
  }

  assignColor(){
    let bookCoverColorSet = [ '#6A4A3C', '#CC333F', '#EB6841', '#EDC951', '#00A0B0', '#EB6841', '#333333' ];
    let color = bookCoverColorSet[Math.floor(Math.random()*bookCoverColorSet.length)];
    this.setState({
      coverColor: color
    })
  }

  saveBook () {
    let uid = this.props.userUID
    let db = firebase.firestore()
    let bookName = `${this.state.content.trim().split(' ')[0]} ${
      this.state.content.trim().split(' ')[1]
    } ${this.state.content.trim().split(' ')[2]}...`
    db.collection('users')
      .doc(`${uid}`)
      .collection('Library')
      .doc(`${bookName}`)
      .set(this.state).then(()=>{
        alert('Save to your library successfully!');
        history.push('./library')
      })
  }

  cancelContent(){
    history.push('/library')
  }

  onContentChange () {
    this.setState({
      content: event.target.value
    })
  }

  resetContent (evn) {
    console.log('try to clear')
    this.setState({
      content: ''
    })
  }

  logOut(){
    firebase.auth().signOut()
    .then(function() {
      alert('Sign-out successful.')
      history.push('/')
    }).catch(function(error) {
      console.log('An error happened')
    });
  }

  render () {
    return (
      <div className={styles.container_library}>
      <button className={styles.logout} onClick={this.logOut}>sign out</button>
      <div className={styles.library_left_container}>
        <div className={styles.library_left_top}>
          <p className={styles.library_greeting}>
            Hi,
            <span className={styles.library_yourName}>
             {this.props.userName}
            </span>
            <br /> what would you like to read today?
          </p>
          <div className={styles.groupBtn}>
            <button className={styles.cancelBtn} onClick={this.cancelContent}>Cancel</button>
            <button className={styles.resetBtn} onClick={this.resetContent}>Reset</button>
            <button className={styles.saveBtn} onClick={this.saveBook}>Save</button>
          </div>
        </div>
        <textarea className={styles.library_new_content_container} onChange={this.onContentChange} value={this.state.content}/>
      </div>
      <div className={styles.library_right_container}>
        <Search_history />
      </div>
    </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    userUID: state.userUID,
    userName: state.userName
  }
}

export default connect(mapStateToProps)(New_content)
