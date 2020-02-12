import React from "react";
import Book from "./book.js";
import Search_history from "./search_history.js";
import { connect } from "react-redux";
import styles from "../sass/main.scss";
import SignOut from "./sign_out";
import Greetings from "../components/greeting";
import { savePrefToRedux } from "../actions/";

// get name from redux

class Library extends React.Component {
  constructor(props) {
    super(props);
    this.addNewContent = this.addNewContent.bind(this);
    this.state = {
      isLoading: true,
      books: [],
      colors: [],
      bookContent: ""
    };
  }

  deleteBook(id) {
    let tempbooks = this.state.books;
    let tempName = tempbooks[id];
    console.log(tempName);
    tempbooks.splice(id, 1);
    this.setState({
      books: tempbooks
    });
    let uid = this.props.userUID;
    let db = firebase.firestore();
    db.collection("users")
      .doc(`${uid}`)
      .collection("Library")
      .doc(tempName)
      .delete()
      .then(alert("The book has been deleted!"))
      .catch(error => console.log("Error removing document", error));
  }

  addNewContent() {
    this.props.history.push("/New_content");
  }

  componentDidMount() {
    let uid = this.props.userUID;
    let db = firebase.firestore();
    db.collection("users")
      .doc(`${uid}`)
      .collection("Library")
      .orderBy("createdTime", "desc")
      .get()
      .then(library => {
        let tempBooks = [];
        let tempColors = [];
        let tempBookContent = [];
        library.forEach(book => {
          tempColors.push(book.data().coverColor);
          tempBooks.push(book.id);
          tempBookContent.push(book.data().content);
        });
        this.setState({
          books: tempBooks,
          colors: tempColors,
          bookContent: tempBookContent,
          isLoading: false
        });
      });
    db.collection("users")
      .doc(`${uid}`)
      .get()
      .then(res => {
        // Set preference to store
        if (res.data()) {
          this.props.dispatch(savePrefToRedux(res.data().preference));
        }
      });
  }

  render() {
    // Get data from firebase, if library array is not 0
    // If library array is 0
    // Tell user to add some thing by clicking the button above
    return (
      <div className={styles.container_library}>
        <SignOut history={this.props.history} />
        <div className={styles.library_left_container}>
          <div className={styles.library_left_top}>
            <Greetings userName={this.props.userName} />
            <button onClick={this.addNewContent} className={styles.addBtn}>
              <img
                src={require("../images/add.png")}
                className={styles.addImg}
              />
            </button>
          </div>
          <div className={styles.library_book_container}>
            {this.state.isLoading === true ? (
              <img
                className={styles.loading}
                src={require("../images/loading2.gif")}
              />
            ) : (
              this.state.books.map((booktitle, index) => (
                <Book
                  title={booktitle}
                  color={this.state.colors[index]}
                  key={index}
                  id={index}
                  history={this.props.history}
                  content={this.state.bookContent[index]}
                  deleteBook={this.deleteBook.bind(this)}
                />
              ))
            )}
          </div>
        </div>
        <div className={styles.library_right_container}>
          <Search_history />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    userUID: state.userUID,
    userName: state.userName,
    viewPreference: state.viewPreference
  };
}
export default connect(mapStateToProps)(Library);

//      Organize the search result from the search api.
//      loop through the search history, render words on search panel. ( firebase & Redux )
//      Switch the dropdown list, re-arrange the order of the words. ( Redux )
//      toggle the all/Favorite to filter out the words ( Redux )
