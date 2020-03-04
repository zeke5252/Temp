import React from "react";
import { connect } from "react-redux";
import styles from "../sass/main.scss";
import Word from "./word";
import {} from "../actions/";

class PopupSearch extends React.Component {
  constructor(props) {
    super(props);
    this.showPopup = this.showPopup.bind(this);
    this.state = {
      allWords: [],
      styleParent: {
        s_container: styles.s_container,
        s_times: styles.s_times,
        s_times_init: styles.s_times_init,
        s_word: styles.s_word,
        s_phonetic: styles.s_phonetic,
        s_detail: styles.s_detail,
        s_meaning: styles.s_meaning,
        s_block: styles.s_block,
        s_definition: styles.s_definition,
        s_synonyms: styles.s_synonyms,
        s_speech: styles.s_speech,
        s_origin: styles.s_origin
      }
    };
  }
  showPopup(showContent) {
    const {styleParent} = this.state
    const {
      resDetails,
      contentPosition,
      isPopupVisible,
      width,
      showAllContent,
      searchContent,
      isHintMoreVisible
    } = this.props;
    if (showContent === "word") {
      let renderFull = (
        <Word
          resDetails={resDetails}
          styleParent={styleParent}
          isFull={true}
          isReverse={false}
        />
      );
      let renderPartial = (
        <Word
          resDetails={resDetails}
          styleParent={styleParent}
          isFull={false}
        />
      );
      return (
        <div
          className={styles.popupSearchContainer}
          style={
            contentPosition === "top"
              ? {
                  display: isPopupVisible,
                  left: "50%",
                  top: "2rem",
                  transform: "translate(-50%, 0)"
                }
              : {
                  display: isPopupVisible,
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  width: width,
                  height: "60%"
                }
          }
          onClick={showAllContent}
        >
          <div className={styles.holdScroll}>
            {searchContent === "partial" ? renderPartial : renderFull}
          </div>
          <div
            className={styles.popup_more}
            style={{ display: isHintMoreVisible }}
          >
            ›
          </div>
        </div>
      );
    }
    if (showContent === "phrase") {
      return (
        <div
          className={styles.popupSearchContainer}
          style={{
            display: isPopupVisible,
            left: "50%",
            top: "2rem",
            transform: "translate(-50%, 0)"
          }}
        >
          <p>{resDetails}</p>
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
