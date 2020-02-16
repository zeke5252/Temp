import React from "react";
import styles from "../sass/main.scss";
import { connect } from "react-redux";
import Word from "./word";

// Import Word class. (done)
// Get data from firestore. (done)
// Compare style object in search_history with that in popup_search. (done)
// Syncronize the amount of classes. (done)
// Prepare a style object, pass to word component. (done)
// Use {expressions} and array to render components.
// Add remove word function
// Select By time to re-sort results
// Review inifinite scroll.


// Use state to re render data
// where: add condition
// orderBy: order
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
      isLoading: false,
      sortBy: "times"
    };
    this.sortHandler=this.sortHandler.bind(this)
    this.renderWords=this.renderWords.bind(this)
  }

  sortHandler(){
    this.setState(function (preState){
      return{
        sortBy: event.target.value
      }
    })
    this.renderWords();
  }

  renderWords(){
    console.log(this.state.sortBy)
    let uid = this.props.userUID;
    let db = firebase.firestore();
    let tempWordArr = [];
console.log('re render')
    let historyRef = db.collection("users")
    .doc(`${uid}`)
    .collection("Search_history")

    historyRef.orderBy(this.state.sortBy, "desc")
      .get()
      .then(res =>
        res.forEach(eachWord => {
          tempWordArr.push(eachWord.data());
          this.setState({
            allWords: tempWordArr,
            isLoading: false
          });
        })
      )
      .catch(function(error) {
        console.log("Error getting document:", error);
      });
  }
  

  componentDidMount() {
    this.renderWords()
    
  }

  render() {
    return (
      <div className={styles.search_container}>
        <span className={styles.search_title}>Search history</span>
        <select className={styles.minimal} onChange={this.sortHandler}>
          <option value="times" >by frequency</option>
          <option  value="name">by alphabetic</option>
        </select>
        <div className={styles.search_radio_container}>
          <input
            type="radio"
            name=""
            value=""
            id=""
            className={styles.search_radio}
          ></input>
          <span> All </span>
          <span className={styles.search_radio_divider}> | </span>
          <input
            type="radio"
            name=""
            value=""
            id=""
            className={styles.search_radio}
          ></input>
          <span> Favorite </span>
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
                  <Word
                    resDetails={word}
                    styleParent={this.state.styleParent}
                    isFull={true}
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
