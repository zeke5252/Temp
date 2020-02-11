import React from "react";
import SignOut from "./sign_out";
import { connect } from "react-redux";
import styles from "../sass/main.scss";
import ViewPreference from "../components/view_preference";
import Back from "./back";
import Settings from "./settings";
import PopupSearch from "./popup_search";

class Book_content extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dictionaryGoogleAPI: "http://googledictionaryapi.eu-gb.mybluemix.net/",
      transGoogleAPI:
        "https://translation.googleapis.com/language/translate/v2",
      apiKeyGoogle: "AIzaSyBr4QB1H8JxbgRnSOLvCH2g3rCN691RwqM",
      isVisible: "none",
      isPopupVisible: "none",
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
      posX: 0,
      posY: 0
    };
    this.turnOffSettings = this.turnOffSettings.bind(this);
  }

  showAllContent() {
    this.setState({
      searchContent: "all",
      contentPosition: "center",
    });
  }

  showSettings() {
    this.setState({
      isVisible: "block"
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
      contentPosition: "cursor"
    });
  }

  getCursorPos() {
    let posx = 0;
    let posy = 0;
    if (event.pageX || event.pageY) {
      posx = event.pageX;
      posy = event.pageY;
    } else if (event.clientX || event.clientY) {
      posx = event.clientX;
      posy = event.clientY;
    }
    this.setState({
      posX: posx,
      posY: posy
    });
  }

  highlightHandler(data) {
      document.onmouseup = () => {
        this.getCursorPos();
        // Get the hightlight text
        let highlightText = window
          .getSelection()
          .toString()
          .trim();
        if (highlightText.split(" ").length === 1 && highlightText !== "") {
          this.setState({
            highlightText: highlightText
          });
          let uid = this.props.userUID;
          let db = firebase.firestore();
          fetch(`${this.state.dictionaryGoogleAPI}?define=${highlightText}`, {
            headers: {
              "Accept": "application/json"
            }
          })
            .then(res => res.json())
            .then(res => {
              this.setState({
                showContent: "word",
                resDetails: res[0],
                isPopupVisible: "block"
              });
              db.collection("users")
                .doc(`${uid}`)
                .collection("Search_history")
                .doc(`${highlightText}`)
                .set(res[0]);
              return db.collection("users").get();
            })
            .catch(error=>console.log(error));
        } else if (
          highlightText.split(" ").length > 1 &&
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
                resDetails: res.data.translations[0].translatedText,
                isPopupVisible: "block"
              });
              console.log("Google translate result=", res);
            });
        }
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
    let preferenceStyle = {
      fontSize: this.props.viewPreference.font_size, // 17, 19, 21, 23, 25
      fontFamily: this.props.viewPreference.font_type, // 'Lora', serif  ;  'Bitter', serif  ;  'Muli', sans-serif;
      backgroundColor: this.props.viewPreference.background_color, // #edd1b0, #f6efdc
      lineHeight: this.props.viewPreference.line_height, // 2 ; 2.5 ; 3
      whiteSpace: "pre-line"
    };
    return (
      <div className={styles.container_library}>
        <ViewPreference isVisible={this.state.isVisible} />
        <div className={styles.btns_leftTop}>
          <Back history={this.props.history} />
          <Settings
            showSettings={this.showSettings.bind(this)}
          />
        </div>
        <SignOut
          history={this.props.history}
        />
        <div
          className={styles.turnOffSettings}
          style={{ display: this.state.isVisible }}
          onClick={this.turnOffSettings}
        ></div>
        <PopupSearch
          highlightText={this.state.highlightText}
          showContent={this.state.showContent}
          resDetails={this.state.resDetails}
          isPopupVisible={this.state.isPopupVisible}
          posX={this.state.posX}
          posY={this.state.posY}
          searchContent={this.state.searchContent}
          contentPosition={this.state.contentPosition}
          showAllContent={this.showAllContent.bind(this)}
        />
        <div
          className={styles.turnOffPopup}
          style={{ display: this.state.isPopupVisible }}
          onClick={this.turnOffPopup.bind(this)}
        ></div>
        <div className={styles.bookContent} style={preferenceStyle}>
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
    viewPreference: state.viewPreference
  };
}

export default connect(mapStateToProps)(Book_content);
