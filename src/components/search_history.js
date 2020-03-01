import React from "react";
import styles from "../sass/main.scss";
import { connect } from "react-redux";
import Word from "./word";

class Search_history extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allWords: [],
      styleParent: {
        s_container: styles.s_container,
        s_times: styles.s_times,
        s_times_hot: styles.s_times_hot,
        s_times_init: styles.s_times_init,
        s_word: styles.s_word,
        s_phonetic: styles.s_phonetic,
        s_detail: styles.s_detail,
        s_meaning: styles.s_meaning,
        s_block: styles.s_block,
        s_definition: styles.s_definition,
        s_example: styles.s_example,
        s_synonyms: styles.s_synonyms,
        s_speech: styles.s_speech,
        s_origin: styles.s_origin
      },
      allDocNames: [],
      isLoading: true,
      sortBy: "times",
      isFull: true,
      isVisible: true
    };
    this.sortHandler = this.sortHandler.bind(this);
    this.renderWords = this.renderWords.bind(this);
    this.contentHandler = this.contentHandler.bind(this);
    this.generatePDF = this.generatePDF.bind(this);
  }

  generatePDF() {
    let text = this.state.allWords.map((word, index) => {
      return `${word.word} : ${Object.values(word.meaning)[0][0].definition}`;
    });

    var pageWidth = 8.5,
      lineHeight = 1.3,
      margin = 0.5,
      maxLineWidth = pageWidth - margin * 2,
      fontSize = 14,
      ptsPerInch = 72,
      oneLineHeight = (fontSize * lineHeight) / ptsPerInch,
      doc = new jsPDF({
        unit: "in",
        lineHeight: lineHeight
      }).setProperties({ title: "Search history" });

    var textLines = doc
      .setFont("courier")
      .setFontSize(fontSize)
      .splitTextToSize(text, maxLineWidth);
    doc.text(textLines, margin, margin + 2 * oneLineHeight);
    doc.save("Read_you_history.pdf");
  }

  deleteWord(id) {
    // console.log('id start=', id)
    let tempWords = this.state.allWords;
    let tempWord = tempWords[id];
    let tempDocNames = this.state.allDocNames;
    let tempDocName = tempDocNames[id];

    console.log("tempWord=", tempWord);
    console.log("tempDocName=", tempDocName);

    tempWords.splice(id, 1);
    tempDocNames.splice(id, 1);

    this.setState({
      tempWords: tempWords,
      tempDocNames: tempDocNames
    });

    let uid = this.props.userUID;
    let db = firebase.firestore();
    db.collection("users")
      .doc(`${uid}`)
      .collection("Search_history")
      .doc(tempDocName)
      .delete()
      .then(console.log("The word has been deleted!"))
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
      historyRef
        .orderBy(this.state.sortBy, "desc")
        .get()
        .then(res => {
          this.setState({
            isLoading: false
          });
          return res.forEach(eachWord => {
            tempWordArrIDs.push(eachWord.id);
            tempWordArr.push(eachWord.data());
            this.setState({
              allWords: tempWordArr,
              allDocNames: tempWordArrIDs
            });
          });
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
        });
    }
    if (this.state.sortBy === "alphabetic") {
      historyRef
        .get()
        .then(res =>
          res.forEach(eachWord => {
            tempWordArrIDs.push(eachWord.id);
            tempWordArr.push(eachWord.data());
            this.setState({
              allWords: tempWordArr,
              isLoading: false,
              allDocNames: tempWordArrIDs
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
      <div
        className={styles.search_container}
        style={
          this.props.isSearchContainerVisible
            ? { display: "flex" }
            : { display: "none" }
        }
      >
        <div
          className={styles.search_panel_switch}
          onClick={this.props.hideSearchContainer}
        >
          >
        </div>
        <div className={styles.search_history_head}>
          <span className={styles.search_title}>SEARCH HISTORY</span>
          <select
            className={styles.minimal}
            onChange={this.sortHandler}
            defaultValue="times"
          >
            <option value="times">by frequency</option>
            <option value="alphabetic">by alphabetic</option>
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
        </div>
        <div onClick={this.generatePDF} className={styles.downloadPDF}>
        <img
              className={styles.pdf_img}
              src={require("../images/downloadPDF.png")}
            />
        </div>
        <ul>
          {this.state.isLoading ? (
            <img
              className={styles.loading}
              src={require("../images/loading2.gif")}
            />
          ) : this.state.allWords.length === 0 ? (
            <div className={styles.empty_history}>
              <img
                src={require("../images/empty.png")}
                className={styles.empty_img}
              ></img>
              <span className={styles.empty_str}>
                The search history is empty.
              </span>
            </div>
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
