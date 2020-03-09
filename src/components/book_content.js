import React from "react";
import { connect } from "react-redux";
import styles from "../sass/main.scss";
import ViewPreference from "../components/view_preference";
import Back from "./back";
import Settings from "./settings";
import PopupSearch from "./popup_search";
import Note from "./note";
import convert from "htmr";
import { db } from "../firebaseConfig";

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
      contentPosition: "top",
      resDetails: {
        meaning: {
          noun: [
            {
              definition: "Loading..."
            }
          ]
        }
      },
      width: "auto",
      tempRes: {},
      tempNote: this.props.bookNote,
      chromeNote: "",
      isHintMoreVisible: "none"
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
      width: "60%",
      isHintMoreVisible: "none"
    });
  }

  showSettings() {
    this.highlightHandler("off");
    this.setState({
      isVisible: "block"
    });
  }

  turnOffNote() {
    this.highlightHandler("on");
    this.setState({
      isNoteVisible: "none",
      isNoteTextVisible: "block"
    });
    // Update note on firebase
    let uid = this.props.userUID;
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
    this.highlightHandler("off");
    var anchorme = require("anchorme").default; // if installed via NPM

    let uid = this.props.userUID;
    db.collection("users")
      .doc(`${uid}`)
      .collection("Library")
      .doc(`${this.props.bookTitle}`)
      .get()
      .then(res => {
        this.setState({
          tempNote: res.data().note
        });
        let someText = this.state.tempNote;
        let tempChrome = anchorme(someText, { truncate: 36 });
        this.setState({
          chromeNote: convert(tempChrome)
        });
      });
  }

  turnOffSettings() {
    this.highlightHandler("on");
    this.setState({
      isVisible: "none"
    });
  }

  turnOffPopup() {
    if (this.state.showContent === "word") {
      this.setState({
        isPopupVisible: "none",
        searchContent: "partial",
        contentPosition: "top",
        backgroundColor: "rgba(0,0,0,0)",
        width: "auto",
        isSearchBtnDisabled: ".3",
        isHintMoreVisible: "none",
        resDetails: {
          meaning: {
            noun: [
              {
                definition: "Loading..."
              }
            ]
          }
        }
      });
    } else {
      this.setState({
        isPopupVisible: "none",
        searchContent: "partial",
        contentPosition: "top",
        backgroundColor: "rgba(0,0,0,0)",
        isHintMoreVisible: "none",
        width: "auto",
        resDetails: "Loading..."
      });
    }
  }

  handleUpEvent() {
    let Chinese = require("chinese-s2t");
    const { viewPreference, userUID, bookTitle } = this.props;
    // Get the hightlight text
    let highlightText = window
      .getSelection()
      .toString()
      .trim();
    if (viewPreference.dictionary === "English") {
      if (highlightText.split(" ").length === 1 && highlightText !== "") {
        this.setState({
          highlightText: highlightText,
          isPopupVisible: "block"
        });
        let uid = userUID;

        fetch(`${this.state.dictionaryGoogleAPI}?define=${highlightText}`)
          // Get response without key of 'times';
          .then(res => res.json())
          .then(res => {
            this.setState({
              showContent: "word",
              resDetails: res[0],
              tempRes: res,
              isHintMoreVisible: "block"
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
              if (this.state.tempRes[0]) {
                // If connection is unstable, the response will be undefined, and error occurs.
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
            }
            // SearchWords increment
            db.collection("users")
              .doc(`${uid}`)
              .collection("Library")
              .doc(`${bookTitle}`)
              .update({
                searchedWords: firebase.firestore.FieldValue.increment(1)
              });

            return db.collection("users").get();
          })
          .catch(error => {
            if (this.state.showContent === "word") {
              this.setState({
                resDetails: {
                  meaning: {
                    noun: [
                      {
                        definition: "Loading... ⚠ Unstable signal"
                      }
                    ]
                  }
                }
              });
            } else {
              this.setState({
                resDetails: "Loading...  ⚠ Unstable signal"
              });
            }
          });
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
      viewPreference.dictionary === "Chinese" &&
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

  highlightHandler(switcher) {
    switch (switcher) {
      case "on":
        // For mobile system
        document.ontouchend = () => {
          let highlightText = window.getSelection().toString();
          console.log("highlightText=", highlightText);
        };
        // For desktop system
        document.onmouseup = () => {
          this.handleUpEvent();
        };
        break;
      case "off":
        document.ontouchend = null;
        document.onmouseup = null;
        break;
    }
  }

  componentDidMount() {
    this.highlightHandler("on");
  }

  componentWillUnmount() {
    this.highlightHandler("off");
  }

  render() {
    // Using store data
    const { viewPreference, history, bookTitle, bookContent } = this.props;
    const {
      isVisible,
      isNoteVisible,
      isNoteTextAreaVisible,
      tempNote,
      isNoteTextVisible,
      chromeNote,
      highlightText,
      showContent,
      resDetails,
      isPopupVisible,
      searchContent,
      contentPosition,
      width,
      isHintMoreVisible,
      backgroundColor
    } = this.state;
    let preferenceStyleTitle = {
      fontSize: viewPreference.font_size + 7,
      fontFamily: viewPreference.font_type,
      lineHeight: viewPreference.line_height - 0.5
    };
    let preferenceStyleContent = {
      fontSize: viewPreference.font_size, // 17, 19, 21, 23, 25
      fontFamily: viewPreference.font_type, // 'Lora', serif  ;  'Bitter', serif  ;  'Muli', sans-serif;
      backgroundColor: viewPreference.background_color, // #edd1b0, #f6efdc
      lineHeight: viewPreference.line_height, // 1.5 ; 2 ; 2.5
      dictionary: viewPreference.dictionary, // English ; Chinese
      whiteSpace: "pre-line"
    };
    return (
      <div
        className={styles.container_book}
        style={{ backgroundColor: viewPreference.background_color }}
      >
        <div className={styles.bookTitle} style={preferenceStyleTitle}>
          {bookTitle}
        </div>
        <div className={styles.bookContent} style={preferenceStyleContent}>
          {bookContent}
        </div>
        <div className={styles.btns_leftTop}>
          <Back history={history} />
          <Settings showSettings={this.showSettings.bind(this)} />
        </div>
        <div
          className={styles.turnOffSettings}
          style={{ display: isVisible }}
          onClick={this.turnOffSettings}
        ></div>
        <ViewPreference isVisible={isVisible} />
        <div
          className={styles.turnOffNote}
          style={{ display: isNoteVisible }}
          onClick={this.turnOffNote}
        ></div>
        <div className={styles.btns_rightTop}>
          <Note showNote={this.showNote.bind(this)} />
        </div>
        <div className={styles.note_panel} style={{ display: isNoteVisible }}>
          <textarea
            className={styles.note_textarea}
            style={{ display: isNoteTextAreaVisible }}
            value={tempNote}
            onChange={this.onNoteChange}
          />
          {tempNote === "" || tempNote === "undefined" ? (
            <div
              className={styles.add_note}
              onClick={this.editNote}
              style={
                isNoteTextVisible === "block"
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
              style={{ display: isNoteTextVisible }}
            >
              {chromeNote}
            </p>
          )}
        </div>
        <div
          className={styles.turnOffPopup}
          style={{
            display: isPopupVisible,
            backgroundColor: backgroundColor
          }}
          onClick={this.turnOffPopup.bind(this)}
        ></div>
        <PopupSearch
          highlightText={highlightText}
          showContent={showContent} // phrase or word
          resDetails={resDetails}
          isPopupVisible={isPopupVisible}
          searchContent={searchContent} // Full or partial
          contentPosition={contentPosition}
          showAllContent={this.showAllContent.bind(this)}
          width={width}
          isHintMoreVisible={isHintMoreVisible}
        />
        <div className={styles.mobileSearch} onClick={this.handleUpEvent}>
          <img
            src={require("../images/mobileSearch.png")}
            className={styles.mobileSearch_img}
          ></img>
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
