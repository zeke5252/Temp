import React from "react";
import styles from "../sass/main.scss";
import { connect } from "react-redux";
import Word_real from "./word";

// Import Word class. (done)
// Get data from firestore. (done)
// Compare style object in search_history with that in popup_search. (done)
// Syncronize the amount of classes. (done)
// Prepare a style object, pass to word component. (done)
// Use {expressions} and array to render components.
// Add remove word function
// Select By time to re-sort results
// Add my favorite function
// Review inifinite scroll.

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
        s_origin: styles.s_origin,
        s_meaning: styles.s_meaning,
        s_block: styles.s_block,
        s_definition: styles.s_definition,
        s_example: styles.s_example,
        s_synonyms: styles.s_synonyms,
        s_speech: styles.s_speech
      }
    };
  }

  componentDidMount() {
    let uid = this.props.userUID;
    let db = firebase.firestore();
    let tempWordArr = [];
    console.log("uid=", uid);
    db.collection("users")
      .doc(`${uid}`)
      .collection("Search_history")
      .get()
      .then(res =>
        res.forEach(eachWord => {
          tempWordArr.push(eachWord.data());
          this.setState({
            allWords: tempWordArr
          });
        })
      )
      .catch(function(error) {
        console.log("Error getting document:", error);
      });

    // db.collection("users")
    //   .doc(`${uid}`)
    //   .collection("Search_history")
    //   .doc("Sunday")
    //   .get()
    //   .then(word => {
    //     console.log(word.id, "=", word.data());
    //     this.setState({
    //       resDetails: word.data()
    //     });
    //   })
    //   .catch(function(error) {
    //     console.log("Error getting document:", error);
    //   });
  }

  render() {
    return (
      <div className={styles.search_container}>
        <span className={styles.search_title}>Search history</span>
        <select>
          <option>by frequency</option>
          <option>by time</option>
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
          {this.state.allWords.map((word, i) => {
            return (
              <li key={i}>
                <Word_real
                  resDetails={word}
                  styleParent={this.state.styleParent}
                />
              </li>
            );
          })}
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
