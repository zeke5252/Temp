import React from "react";
import { connect } from "react-redux";
import styles from "../sass/main.scss";
import ViewPreference from "../components/view_preference";
import Back from "./back";
import Settings from "./settings";
import PopupSearch from "./popup_search";
import Note from "./note";

class Book_content extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dictionaryGoogleAPI: "https://googledictionaryapi.eu-gb.mybluemix.net/",
      transGoogleAPI:
        "https://translation.googleapis.com/language/translate/v2",
      apiKeyGoogle: "AIzaSyBr4QB1H8JxbgRnSOLvCH2g3rCN691RwqM",
      isVisible: "none",
      isPopupVisible: "none",
      isNoteVisible: "none",
      isNoteTextAreaVisible: "none",
      isNoteTextVisible: "block",
      highlightText: "",
      showContent: "word",
      searchContent: "partial",
      contentPosition: "cursor",
      resDetails: {
        meaning: {
          noun: [
            {
              definition: "means..."
            }
          ]
        }
      },
      width: "auto",
      tempRes: {},
      tempNote: this.props.bookNote
    };
    this.turnOffSettings = this.turnOffSettings.bind(this);
    this.handleUpEvent = this.handleUpEvent.bind(this);
    this.turnOffNote = this.turnOffNote.bind(this);
    this.editNote = this.editNote.bind(this);
    this.onNoteChange = this.onNoteChange.bind(this);
  }

  onNoteChange() {
    this.setState({
      tempNote: event.target.value
    });
  }

  editNote() {
    this.setState({
      isNoteTextAreaVisible: "block",
      isNoteTextVisible: "none"
    });
  }

  showAllContent() {
    this.setState({
      searchContent: "full",
      contentPosition: "center",
      backgroundColor: "rgba(0,0,0,.2)",
      overFlow: "auto",
      width: "60%"
    });
  }

  showSettings() {
    this.setState({
      isVisible: "block"
    });
  }

  turnOffNote() {
    this.setState({
      isNoteVisible: "none",
      isNoteTextVisible: "block"
    });
    // Update note on firebase
    let uid = this.props.userUID;
    let db = firebase.firestore();
    this.setState({
      isNoteTextAreaVisible: "none"
    });
    db.collection("users")
      .doc(`${uid}`)
      .collection("Library")
      .doc(`${this.props.bookTitle}`)
      .update({
        note: this.state.tempNote
      })
      .then(res => {
        console.log("update success");
      });
  }

  showNote() {
    this.setState({
      isNoteVisible: "block"
    });
  }

  turnOffSettings() {
    this.setState({
      isVisible: "none"
    });
  }

  turnOffPopup() {
    this.setState({
      isPopupVisible: "none",
      searchContent: "partial",
      contentPosition: "cursor",
      backgroundColor: "rgba(0,0,0,0)",
      width: "auto"
    });
  }

  handleUpEvent() {
    event.preventDefault();
    let Chinese = require("chinese-s2t");
    // this.getCursorPos();
    // Get the hightlight text
    let highlightText = window
      .getSelection()
      .toString()
      .trim();
    if (this.props.viewPreference.dictionary === "English") {
      if (highlightText.split(" ").length === 1 && highlightText !== "") {
        this.setState({
          highlightText: highlightText
        });
        let uid = this.props.userUID;
        let db = firebase.firestore();

        fetch(`${this.state.dictionaryGoogleAPI}?define=${highlightText}`)
          // Get response without key of 'times';
          .then(res => res.json())
          .then(res => {
            this.setState({
              showContent: "word",
              resDetails: res[0],
              isPopupVisible: "block",
              tempRes: res
            });
            // If the heighlighted word doesn't exist on firestore, add the 'times' column, and set to firestore
            // If it exists, update 'times' only.
            let docRef = db
              .collection("users")
              .doc(`${uid}`)
              .collection("Search_history")
              .doc(`${highlightText}`)
              .get();
            return docRef;
          })
          .then(docRef => {
            if (docRef.data()) {
              // Existed
              let newDocRef = db
                .collection("users")
                .doc(`${uid}`)
                .collection("Search_history")
                .doc(`${highlightText}`)
                .update({
                  times: firebase.firestore.FieldValue.increment(1)
                });
            } else {
              // Not existed
              let newRes = Object.assign(
                {},
                this.state.tempRes,
                (this.state.tempRes[0].times = 1)
              );
              let newDocRef = db
                .collection("users")
                .doc(`${uid}`)
                .collection("Search_history")
                .doc(`${highlightText}`)
                .set(newRes[0]);
            }
            // SearchWords increment
            db.collection("users")
              .doc(`${uid}`)
              .collection("Library")
              .doc(`${this.props.bookTitle}`)
              .update({
                searchedWords: firebase.firestore.FieldValue.increment(1)
              });

            return db.collection("users").get();
          })
          .catch(error => console.log("code in line 170,", error));
      } else if (highlightText.split(" ").length > 1 && highlightText !== "") {
        // Use Google translate api
        fetch(
          `${this.state.transGoogleAPI}?key=${this.state.apiKeyGoogle}&source=en&target=zh-CN&q=${highlightText}`
        )
          .then(res => res.json())
          .then(res => {
            this.setState({
              showContent: "phrase",
              resDetails: Chinese.s2t(res.data.translations[0].translatedText),
              isPopupVisible: "block"
            });
          });
      }
    } else if (
      this.props.viewPreference.dictionary === "Chinese" &&
      highlightText !== ""
    ) {
      // Use Google translate api
      fetch(
        `${this.state.transGoogleAPI}?key=${this.state.apiKeyGoogle}&source=en&target=zh-CN&q=${highlightText}`
      )
        .then(res => res.json())
        .then(res => {
          this.setState({
            showContent: "phrase",
            resDetails: Chinese.s2t(res.data.translations[0].translatedText),
            isPopupVisible: "block"
          });
          // console.log("Google translate result=", res);
        });
    }
  }

  highlightHandler(data) {
    window.oncontextmenu = function(event) {
      event.preventDefault();
      return false;
    };

    // For mobile system
    document.onpointercancel = () => {
      // or pointerout
      this.handleUpEvent();
    };
    // For desktop system
    document.onmouseup = () => {
      this.handleUpEvent();
    };
  }

  componentDidMount() {
    this.highlightHandler(this.state);
  }

  componentWillUnmount() {
    document.onmouseup = null;
  }

  render() {
    // Using store data
    let preferenceStyleTitle = {
      fontSize: this.props.viewPreference.font_size + 7,
      fontFamily: this.props.viewPreference.font_type,
      lineHeight: this.props.viewPreference.line_height - 0.5
    };
    let preferenceStyleContent = {
      fontSize: this.props.viewPreference.font_size, // 17, 19, 21, 23, 25
      fontFamily: this.props.viewPreference.font_type, // 'Lora', serif  ;  'Bitter', serif  ;  'Muli', sans-serif;
      backgroundColor: this.props.viewPreference.background_color, // #edd1b0, #f6efdc
      lineHeight: this.props.viewPreference.line_height, // 1.5 ; 2 ; 2.5
      dictionary: this.props.viewPreference.dictionary, // English ; Chinese
      whiteSpace: "pre-line"
    };
    return (
      <div
        className={styles.container_book}
        style={{ backgroundColor: this.props.viewPreference.background_color }}
      >
        <ViewPreference isVisible={this.state.isVisible} />
        <div className={styles.btns_leftTop}>
          <Back history={this.props.history} />
          <Settings showSettings={this.showSettings.bind(this)} />
        </div>
        <div
          className={styles.turnOffSettings}
          style={{ display: this.state.isVisible }}
          onClick={this.turnOffSettings}
        ></div>
        <div
          className={styles.note_panel}
          style={{ display: this.state.isNoteVisible }}
        >
          <textarea
            className={styles.note_textarea}
            style={{ display: this.state.isNoteTextAreaVisible }}
            value={this.state.tempNote}
            onChange={this.onNoteChange}
          />
          {this.state.tempNote === "" ? (
            <div
              className={styles.add_note}
              onClick={this.editNote}
              style={
                this.state.isNoteTextVisible === "block"
                  ? { display: "flex" }
                  : { display: "none" }
              }
            >
              <img
                src={require("../images/add_note.png")}
                className={styles.add_note_img}
              ></img>
              <span className={styles.add_note_str}>Click to add note.</span>
            </div>
          ) : (
            <p
              className={styles.note_text}
              onClick={this.editNote}
              style={{ display: this.state.isNoteTextVisible }}
            >
              {this.state.tempNote}
            </p>
          )}
        </div>
        <div className={styles.btns_rightTop}>
          <Note showNote={this.showNote.bind(this)} />
        </div>
        <div
          className={styles.turnOffNote}
          style={{ display: this.state.isNoteVisible }}
          onClick={this.turnOffNote}
        ></div>
        <PopupSearch
          highlightText={this.state.highlightText}
          showContent={this.state.showContent} // phrase or word
          resDetails={this.state.resDetails}
          isPopupVisible={this.state.isPopupVisible}
          searchContent={this.state.searchContent} // Full or partial
          contentPosition={this.state.contentPosition}
          showAllContent={this.showAllContent.bind(this)}
          width={this.state.width}
        />
        <div
          className={styles.turnOffPopup}
          style={{
            display: this.state.isPopupVisible,
            backgroundColor: this.state.backgroundColor
          }}
          onClick={this.turnOffPopup.bind(this)}
        ></div>
        <div className={styles.bookTitle} style={preferenceStyleTitle}>
          {this.props.bookTitle}
        </div>
        <div className={styles.bookContent} style={preferenceStyleContent}>
          {this.props.bookContent}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    userUID: state.userUID,
    bookContent: state.bookContent,
    bookTitle: state.bookTitle,
    bookNote: state.bookNote,
    viewPreference: state.viewPreference
  };
}

export default connect(mapStateToProps)(Book_content);
