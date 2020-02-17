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
      dictionaryGoogleAPI: "https://googledictionaryapi.eu-gb.mybluemix.net/",
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
      posY: 0,
      width: "25%",
      tempRes: {},
    };
    this.turnOffSettings = this.turnOffSettings.bind(this);
  }

  // 創立一個state紀錄捲動高度
  // 把捲動高度存到firestore上
  // 進到頁面先從firestore上讀取捲動高度
  // 然後把state依據捲動高度更新
  // 按下back與登出鍵的同時都要記錄捲動高度


  

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
    // let scrollTop = window.pageYOffset || document.documentElement.scrollTop; // 目前游標位置
        // let offsetTop = document.documentElement.offsetTop; // 內容總高度
    // let scrollHeight = document.documentElement.scrollHeight; // 內容總高度
    // let innerHeight = window.innerHeight // 螢幕可視高度
    // let thumbHeight = innerHeight*(innerHeight / scrollHeight) // 捲軸操控條高度
    // let scrollableArea = innerHeight-thumbHeight// 捲軸可拖曳的高度

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
      contentPosition: "cursor",
      backgroundColor: "rgba(0,0,0,0)",
      width: "25%"
    });
  }

  getCursorPos() {
    let posx = event.pageX;
    let posy = event.pageY;
    if(posx<200){posx=200}
    if(posy<200){posy=200}
    if(window.innerWidth-window.innerWidth*0.15<posx){
      posx=window.innerWidth-window.innerWidth*0.15
    }
    this.setState({
      posX: posx,
      posY: posy
    });
    console.log(posx,posy)
  }

  highlightHandler(data) {
    let Chinese = require('chinese-s2t')
    document.onmouseup = () => {
      this.getCursorPos();
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
            // 抓到API回傳的資料，沒有times
            .then(res => res.json())
            .then(res => {
              // 設成state,state就沒有times
              this.setState({
                showContent: "word",
                resDetails: res[0],
                isPopupVisible: "block",
                tempRes: res
              });
              // 如果firestore上沒有該筆關鍵字，就新增times欄位，然後放上firestore。
              // 如果有，就僅更新times
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
                console.log(this.state.tempRes);
                let newRes = Object.assign(
                  {},
                  this.state.tempRes,
                  (this.state.tempRes[0].times = 1)
                );
                console.log(newRes);
                let newDocRef = db
                  .collection("users")
                  .doc(`${uid}`)
                  .collection("Search_history")
                  .doc(`${highlightText}`)
                  .set(newRes[0]);
              }
              return db.collection("users").get();
            })
            .catch(error => console.log(error));
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
            console.log("Google translate result=", res);
          });
      }
    };
  }

  componentDidMount() {
    this.highlightHandler(this.state);    
  }

  componentWillUnmount() {
    // document.onmouseup = null;
  }

  render() {
    // Using store data
    let preferenceStyle = {
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
        <SignOut history={this.props.history} />
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
        <div className={styles.bookContent} style={preferenceStyle} >
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
