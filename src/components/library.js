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
    // firebase已經幫我們整理好怎麼排了，
    // 我應該要從每一個排好的資料的裡去抓時間出來，
    // 一遇到不一樣的就往下一個陣列裝。
    // 首先map這個陣列，剛開始先創立一個新的日期陣列，取出第一個元素放進去，
    // 再來如果第二個元素的createdTime值與第一個一樣，那也把它放入這個日期陣列
    // 
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
        let tempBookCreatedTime = [];
        let booksAll = []
        library.forEach(book => {
          booksAll.push(book.data())
          tempColors.push(book.data().coverColor);
          tempBooks.push(book.id);
          tempBookContent.push(book.data().content);
          tempBookCreatedTime.push(book.data().createdTime);
        });
        console.log('所有書籍資料為', booksAll)
        this.setState({
          books: tempBooks,
          colors: tempColors,
          bookContent: tempBookContent,
          isLoading: false
        });
      });
    // 在這裡把使用者在firebase上的資料抓下來，然後特別針對preference，把它設進redux裡
    db.collection("users")
      .doc(`${uid}`)
      .get()
      .then(res => {
        // Set preference to store
        // 如果這個user的資料存在的話，就把資料抓下來，然後把資料裡的preference設進redux
        // console.log('首次進入圖書館，然後此時從firestore上抓下來該使用者的資料是...',res.data() )
        if (res.data()) {
          this.props.dispatch(savePrefToRedux(res.data().preference));
        } else {
          db.collection("users")
            .doc(`${uid}`)
            .set({ preference: this.props.viewPreference });
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
                    titleCover={
                      booktitle.trim().split(" ")[0] +
                      " " +
                      booktitle.trim().split(" ")[1] +
                      " " +
                      booktitle.trim().split(" ")[2] +
                      " " +
                      booktitle.trim().split(" ")[3] +
                      " " +
                      booktitle.trim().split(" ")[4] +
                      "..."
                    }
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
        <footer className={styles.footer}></footer>
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
