import React from 'react'
import { connect } from 'react-redux'
import styles from '../sass/main.scss'
import Search_history from './search_history'
import { createHashHistory } from 'history'
import Greetings from '../components/greeting'
import SignOut from './sign_out'
const history = createHashHistory()

class New_content extends React.Component {
  constructor (props) {
    super(props)
    this.saveBook = this.saveBook.bind(this)
    this.onContentChange = this.onContentChange.bind(this)
    this.resetContent = this.resetContent.bind(this)
    this.cancelContent = this.cancelContent.bind(this)
    this.saveBook = this.saveBook.bind(this);
    this.assignBookAttr = this.assignBookAttr.bind(this);
    this.state = { 
      content: '',
      coverColor:'',
      createdTime:''
    }
  }

  componentDidMount(){
    this.assignBookAttr()
  }

  assignBookAttr(){
    let bookCoverColorSet = [ '#6A4A3C', '#CC333F', '#EB6841', '#EDC951', '#00A0B0', '#EB6841', '#333333' ];
    let color = bookCoverColorSet[Math.floor(Math.random()*bookCoverColorSet.length)];
    this.setState({
      coverColor: color,
      createdTime: Date.now()
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
    this.setState({
      content: ''
    })
  }

  render () {
    return (
      <div className={styles.container_library}>
      <SignOut />
      <div className={styles.library_left_container}>
        <div className={styles.library_left_top}>
        <Greetings userName={this.props.userName} />
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
