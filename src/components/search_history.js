import React from "react";
import styles from "../sass/main.scss";
import { connect } from "react-redux";
import Word from "./word";

// Add remove word function
// Review inifinite scroll.

// Use state to re render data
// where: add condition
// limit: partially display

class Search_history extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allWords: [],
      styleParent: {
        s_container: styles.s_container,
        s_times: styles.s_times,
        s_word: styles.s_word,
        s_phonetic: styles.s_phonetic,
        s_detail: styles.s_detail,
        s_meaning: styles.s_meaning,
        s_block: styles.s_block,
        s_definition: styles.s_definition,
        s_example: styles.s_example,
        s_synonyms: styles.s_synonyms,
        s_speech: styles.s_speech
      },
      allIDs: [],
      isLoading: false,
      sortBy: "times",
      isFull: true,
      isVisible: true
    };
    this.sortHandler = this.sortHandler.bind(this);
    this.renderWords = this.renderWords.bind(this);
    this.contentHandler = this.contentHandler.bind(this);
  }

  // 刪除此地
  // 刪除firestore

  deleteWord(id) {
    console.log(id);
    let tempWords = this.state.allWords;
    let tempWord = tempWords[id];
    console.log('tempWord=', tempWord.word, 'ID=' ,this.state.allIDs[id] )
    tempWords.splice(id, 1);
    this.setState({
      books: tempWords
    });

    console.log(tempWord.word)
    let uid = this.props.userUID;
    let db = firebase.firestore();
    db.collection("users")
      .doc(`${uid}`)
      .collection("Search_history")
      .doc(this.state.allIDs[id])
      .delete()
      .then(alert("The word has been deleted!"))
      .catch(error => console.log("Error removing document", error));
  }

  contentHandler() {
    let booleanValue = event.target.value === "true" ? true : false;
    this.setState({
      isFull: booleanValue
    });
  }

  sortHandler() {
    this.setState(
      {
        sortBy: event.target.value
      },
      () => this.renderWords()
    );
  }
  renderWords() {
    let uid = this.props.userUID;
    let db = firebase.firestore();
    let tempWordArr = [];
    let tempWordArrIDs = [];
    let historyRef = db
      .collection("users")
      .doc(`${uid}`)
      .collection("Search_history");

    if (this.state.sortBy === "times") {
      console.log("run=", "times");
      historyRef
        .orderBy(this.state.sortBy, "desc")
        .get()
        .then(res =>
          res.forEach(eachWord => {
            tempWordArrIDs.push(eachWord.id);
            tempWordArr.push(eachWord.data());
            this.setState({
              allWords: tempWordArr,
              isLoading: false,
              allIDs:tempWordArrIDs
            });
          })
        )
        .catch(function(error) {
          console.log("Error getting document:", error);
        });
    }
    if (this.state.sortBy === "") {
      console.log("run=", "alphabetic");
      historyRef
        .get()
        .then(res =>
          res.forEach(eachWord => {
            tempWordArrIDs.push(eachWord.id);
            tempWordArr.push(eachWord.data());
            this.setState({
              allWords: tempWordArr,
              isLoading: false,
              allIDs:tempWordArrIDs
            });
          })
        )
        .catch(function(error) {
          console.log("Error getting document:", error);
        });
    }
  }

  componentDidMount() {
    this.renderWords();
  }

  render() {
    return (
      <div className={styles.search_container}>
        <span className={styles.search_title}>Search history</span>
        <select className={styles.minimal} onChange={this.sortHandler}>
          <option value="times">by frequency</option>
          <option value="">by alphabetic</option>
        </select>
        <div className={styles.search_radio_container}>
          <input
            type="radio"
            name="content"
            value={true}
            className={styles.search_radio}
            checked={this.state.isFull === true}
            onChange={this.contentHandler}
          ></input>
          <span> Full </span>
          <span className={styles.search_radio_divider}> | </span>
          <input
            type="radio"
            name="content"
            value={false}
            className={styles.search_radio}
            checked={this.state.isFull === false}
            onChange={this.contentHandler}
          ></input>
          <span> Partial </span>
        </div>
        <ul>
          {this.state.isLoading ? (
            <img
              className={styles.loading}
              src={require("../images/loading2.gif")}
            />
          ) : (
            this.state.allWords.map((word, i) => {
              return (
                <li key={i}>
                  <div
                    className={styles.deleteBtn}
                    style={{ display: this.state.isVisible }}
                    onClick={this.deleteWord.bind(this, i)}
                  >
                    ✕
                  </div>
                  <Word
                    resDetails={word}
                    styleParent={this.state.styleParent}
                    isFull={this.state.isFull}
                    isReverse={true}
                  />
                </li>
              );
            })
          )}
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    userUID: state.userUID
  };
}

export default connect(mapStateToProps)(Search_history);
