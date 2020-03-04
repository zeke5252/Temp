import React from "react";
import Book from "./book.js";
import Search_history from "./search_history.js";
import Tutorial from "./tutorial";
import { connect } from "react-redux";
import styles from "../sass/main.scss";
import SignOut from "./sign_out";
import Greetings from "../components/greeting";
import { savePrefToRedux } from "../actions/";

class Library extends React.Component {
  constructor(props) {
    super(props);
    this.addNewContent = this.addNewContent.bind(this);
    this.state = {
      isLoading: true,
      colors: [],
      bookContent: "",
      newDateGroups: "",
      searchedWords: 0,
      today: "",
      isSearchContainerVisible: false,
      isTutorialVisible: "none",
      browserWidth: 100,
      browserHeight: 100,
      booksAll: 0
    };
    this.generateBooks = this.generateBooks.bind(this);
    this.hideSearchContainer = this.hideSearchContainer.bind(this);
    this.showSearchContainer = this.showSearchContainer.bind(this);
    this.hideTutorial = this.hideTutorial.bind(this);
    this.showTutorial = this.showTutorial.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
  }

  hideTutorial() {
    console.log("hide");
    this.setState({
      isTutorialVisible: "none"
    });
  }

  showTutorial() {
    console.log("show");
    this.setState({
      isTutorialVisible: "block"
    });
  }

  updateDimensions() {
    if (window.innerWidth > 600) {
      this.setState({ isSearchContainerVisible: true });
    } else {
      this.setState({ isSearchContainerVisible: false });
    }
  }

  showSearchContainer() {
    this.setState({
      isSearchContainerVisible: true
    });
  }

  hideSearchContainer() {
    this.setState({
      isSearchContainerVisible: false
    });
  }

  generateBooks() {
    const { history } = this.props;
    const { newDateGroups, today } = this.state;
    if (newDateGroups.length) {
      return newDateGroups.map((date, index) => {
        return (
          <div key={index} className={styles.library_date_container}>
            <span className={date[0] === today ? styles.today : styles.date}>
              {date[0] === today ? "TODAY" : date[0]}
            </span>
            {date[1].map((book, index) => {
              return (
                <Book
                  key={index}
                  titleCover={
                    book.title.trim().split(" ").length < 5
                      ? book.title
                      : book.title.trim().split(" ")[0] +
                        " " +
                        book.title.trim().split(" ")[1] +
                        " " +
                        book.title.trim().split(" ")[2] +
                        " " +
                        book.title.trim().split(" ")[3] +
                        " " +
                        book.title.trim().split(" ")[4] +
                        "..."
                  }
                  searchedWords={book.searchedWords}
                  date={date[0]}
                  title={book.title}
                  color={book.coverColor}
                  id={book.id}
                  position={index}
                  history={history}
                  content={book.content}
                  note={book.note ? book.note : ""}
                  deleteBook={this.deleteBook.bind(this)}
                />
              );
            })}
          </div>
        );
      });
    } else {
      return (
        <div className={styles.empty}>
          <img
            src={require("../images/empty.png")}
            className={styles.empty_img}
          ></img>
          <span className={styles.empty_str}>The library is empty.</span>
        </div>
      );
    }
  }

  deleteBook(id, date, position) {
    let tempDates = this.state.newDateGroups;

    tempDates.map(eachDate => {
      if (eachDate[0] === date) {
        eachDate[1].map(book => {
          if (book.title === id) {
            eachDate[1].splice(position, 1);
          }
        });
      }
      return eachDate;
    });
    this.setState({
      newDateGroups: tempDates
    });
    let uid = this.props.userUID;
    let db = firebase.firestore();
    db.collection("users")
      .doc(`${uid}`)
      .collection("Library")
      .doc(id)
      .delete()
      .then(alert("The book has been deleted!"))
      .catch(error => console.log("Error removing document", error));
  }

  addNewContent() {
    this.props.history.push("/New_content");
  }

  componentDidMount() {
    const { userUID, dispatch, viewPreference } = this.props;
    let uid = userUID;
    let db = firebase.firestore();

    let getDate = new Date();
    let today =
      getDate.getFullYear() +
      "/" +
      (getDate.getMonth() + 1) +
      "/" +
      getDate.getDate();

    db.collection("users")
      .doc(`${uid}`)
      .collection("Library")
      .orderBy("createdTime", "asc")
      .get()
      .then(library => {
        let booksAll = [];
        library.forEach(book => {
          let tempData = book.data();
          tempData.id = book.id;
          booksAll.push(tempData);
        });
        this.setState({
          booksAll: booksAll.length
        });
        let dateAll = booksAll.map((book, index) => {
          var temp = new Date(book.createdTime);
          let n =
            temp
              .getFullYear()
              .toString()
              .concat("/") +
            (temp.getMonth() + 1).toString().concat("/") +
            temp.getDate().toString();
          book.createdTime = n;
          return book;
        });
        dateAll.reverse();
        let groupBy = require("lodash.groupby");
        let newDateGroups = Object.entries(
          groupBy(dateAll, function(el) {
            return el.createdTime;
          })
        );
        this.setState({
          today: today,
          newDateGroups: newDateGroups,
          isLoading: false
        });
      });
    db.collection("users")
      .doc(`${uid}`)
      .get()
      .then(res => {
        // Set preference to store, If user exists, get data and set to redux
        if (res.data()) {
          dispatch(savePrefToRedux(res.data().preference));
        } else {
          db.collection("users")
            .doc(`${uid}`)
            .set({ preference: viewPreference });
        }
      });
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  render() {
    const {
      isTutorialVisible,
      booksAll,
      isLoading,
      isSearchContainerVisible
    } = this.state;
    const { history, userName } = this.props;
    return (
      <div className={styles.container_library}>
        <header className={styles.header_library}>
          <div className={styles.logo_container}>
            {
              <img
                className={styles.logo_small}
                src={require("../images/logo_small.png")}
              />
            }
            <span className={styles.logo_wording}>Search easy. Read easy</span>
          </div>
          <Tutorial
            isTutorialVisible={isTutorialVisible}
            hideTutorial={this.hideTutorial}
          />
          <div className={styles.logo_topRight}>
            <a className={styles.tutorial} onClick={this.showTutorial}>
              <img
                className={styles.tutorial_img}
                src={require("../images/tutorial.png")}
              />
              <span className={styles.tutorial_wording}>Tutorial</span>
            </a>
            <a className={styles.contact} href="mailto:zeke5252@yahoo.com.tw">
              <img
                className={styles.contact_img}
                src={require("../images/contact.png")}
              />
              <span className={styles.contact_wording}>Contact me</span>
            </a>
            <SignOut history={history} />
          </div>
        </header>
        <div className={styles.library_left_container}>
          <div
            className={styles.search_panel_switch}
            onClick={this.showSearchContainer}
          >
            {"<"}
          </div>
          <div className={styles.library_left_top}>
            <Greetings userName={userName} booksAll={booksAll} />
            <button onClick={this.addNewContent} className={styles.addBtn}>
              <img
                src={require("../images/add.png")}
                className={styles.addImg}
              />
            </button>
          </div>
          <div className={styles.library_book_container}>
            {isLoading === true ? (
              <img
                className={styles.loading}
                src={require("../images/loading2.gif")}
              />
            ) : (
              this.generateBooks()
            )}
          </div>
        </div>
        <div className={styles.library_right_container}>
          <Search_history
            isSearchContainerVisible={isSearchContainerVisible}
            hideSearchContainer={this.hideSearchContainer}
          />
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
