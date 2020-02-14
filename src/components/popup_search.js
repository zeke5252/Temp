import React from "react";
import { connect } from "react-redux";
import styles from "../sass/main.scss";
import Word from "./word"
import {} from "../actions/";

// 從firebase上抓下來的需要重排。(可置後)
// 先載入簡單版 然後執行showAllContent在切換成完整版
// 把我的最愛拿

class PopupSearch extends React.Component {
  constructor(props) {
    super(props);
    this.showPopup = this.showPopup.bind(this);
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
        s_synonyms: styles.s_synonyms,
        s_speech: styles.s_speech
      }
    };
  }
  showPopup(showContent) {
    if (showContent === "word") {

      // Full content ( 後方帶參數進去顯示full )
      let renderFull = <Word 
      resDetails={this.props.resDetails}
      styleParent={this.state.styleParent}
      isFull= {true}
      isReverse={false}
      />;
      // Partial content ( 後方帶參數進去顯示partial )
      let renderPartial = <Word 
      resDetails={this.props.resDetails}
      styleParent={this.state.styleParent}
      isFull= {false}
      />
      return (
        <div
          className={styles.popupSearchContainer}
          style={
            this.props.contentPosition === "cursor"
              ? {
                  display: this.props.isPopupVisible,
                  left: this.props.posX,
                  top: this.props.posY,
                }
              : {
                  display: this.props.isPopupVisible,
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  width: this.props.width
                }
          }
          onClick={this.props.showAllContent}
        >
          {this.props.searchContent === "partial" ? renderPartial : renderFull}
        </div>
      );
    }
    if (showContent === "phrase") {
      return (
        <div
          className={styles.popupSearchContainer}
          style={{
            display: this.props.isPopupVisible,
            left: this.props.posX,
            top: this.props.posY,
          }}
        >
          <p>{this.props.resDetails}</p>
        </div>
      );
    }
  }

  render() {
    return this.showPopup(this.props.showContent);
  }
}

function mapStateToProps(state) {
  return {
    userUID: state.userUID
  };
}

export default connect(mapStateToProps)(PopupSearch);
