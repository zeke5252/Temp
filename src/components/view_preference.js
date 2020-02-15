import React from "react";
import { connect } from "react-redux";
import styles from "../sass/main.scss";
import {
  changeViewFontType,
  changeViewBG,
  changeViewFontSize,
  changeViewLineHeight,
  changeDictionary
} from "../actions/";

class ViewPreference extends React.Component {
  constructor(props) {
    super(props);
    this.onFontTypeChange = this.onFontTypeChange.bind(this);
    this.onBgChange = this.onBgChange.bind(this);
    this.onLineHeightChange = this.onLineHeightChange.bind(this);
    this.onDictionaryChange = this.onDictionaryChange.bind(this);
  }

  changeViewFontSize(calc) {
    let value = this.props.font_size;
    if (calc === "+") {
      value < 25 ? (value += 1) : value;
    }
    if (calc === "-") {
      value > 17 ? (value -= 1) : value;
    }
    this.props.dispatch(changeViewFontSize(value));
    let uid = this.props.userUID;
    let db = firebase.firestore();
    db.collection("users")
      .doc(`${uid}`)
      .update({
        "preference.font_size": value
      });
  }

  onFontTypeChange() {
    // 如果我先更新redux，再更新firestore，這樣資料永遠會慢一步更新，釐清這件事為什麼，這跟非同步的連結在哪
    let value = event.target.value;
    this.props.dispatch(changeViewFontType(value));
    let uid = this.props.userUID;
    let db = firebase.firestore();
    db.collection("users")
      .doc(`${uid}`)
      .update({
        "preference.font_type": value
      })
      .then(res => {
        console.log("all saved");
      });
  }

  onBgChange() {
    let value = event.target.value;
    this.props.dispatch(changeViewBG(value));
    let uid = this.props.userUID;
    let db = firebase.firestore();
    db.collection("users")
      .doc(`${uid}`)
      .update({
        "preference.background_color": value
      });
  }

  onLineHeightChange() {
    changeViewBG;

    let value = event.target.value;
    this.props.dispatch(changeViewLineHeight(value));
    let uid = this.props.userUID;
    let db = firebase.firestore();
    db.collection("users")
      .doc(`${uid}`)
      .update({
        "preference.line_height": value
      });
  }

  onDictionaryChange(){
    let value = event.target.value;
    console.log('the value=', value)
    this.props.dispatch(changeDictionary(value));
    let uid = this.props.userUID;
    let db = firebase.firestore();
    db.collection("users")
      .doc(`${uid}`)
      .update({
        "preference.dictionary": value
      });
  }

  render() {
    return (
      <div
        className={styles.viewContainer}
        style={{ display: this.props.isVisible }}
      >
        <div className={styles.view_item}>
          <span className={styles.view_item_title}>Font size:</span>
          <div className={styles.view_item_size}>
            <span
              className={styles.view_item_A_big}
              onClick={this.changeViewFontSize.bind(this, "+")}
            >
              A
            </span>
            <span
              className={styles.view_item_A_small}
              onClick={this.changeViewFontSize.bind(this, "-")}
            >
              A
            </span>
          </div>
        </div>
        <div className={styles.view_item}>
          <span className={styles.view_item_title}>Font type:</span>
          <div>
            {
              <input
                type="radio"
                name="fontType"
                value={`"Muli", sans-serif`}
                onChange={this.onFontTypeChange}
                checked={this.props.font_type === `"Muli", sans-serif`}
              />
            }{" "}
            Muli
            {
              <input
                type="radio"
                name="fontType"
                value={`"Bitter", serif`}
                onChange={this.onFontTypeChange}
                checked={this.props.font_type === `"Bitter", serif`}
              />
            }{" "}
            Bitter
            {
              <input
                type="radio"
                name="fontType"
                value={`"Lora", serif`}
                onChange={this.onFontTypeChange}
                checked={this.props.font_type === `"Lora", serif`}
              />
            }{" "}
            Lora
          </div>
        </div>
        <div className={styles.view_item}>
          <span className={styles.view_item_title}>Background:</span>
          <div className={styles.view_item_bg}>
            {
              <input
                type="radio"
                name="bgColor"
                value={"#eeeeee"}
                onChange={this.onBgChange}
                checked={this.props.background_color === "#eeeeee"}
              />
            }
            <span className={styles.view_item_bg_color_grey}></span>
            {
              <input
                type="radio"
                name="bgColor"
                value={"#f6efdc"}
                onChange={this.onBgChange}
                checked={this.props.background_color === "#f6efdc"}
              />
            }
            <span className={styles.view_item_bg_color_yellow}></span>
            {
              <input
                type="radio"
                name="bgColor"
                value={"#edd1b0"}
                onChange={this.onBgChange}
                checked={this.props.background_color === "#edd1b0"}
              />
            }
            <span className={styles.view_item_bg_color_peach}></span>
          </div>
        </div>
        <div className={styles.view_item}>
          <span className={styles.view_item_title}>Line height:</span>
          <div>
            {
              <input
                type="radio"
                name="lineHeight"
                value={1.5}
                onChange={this.onLineHeightChange}
                checked={this.props.line_height == 1.5}
              />
            }
            Short
            {
              <input
                type="radio"
                name="lineHeight"
                value={2}
                onChange={this.onLineHeightChange}
                checked={this.props.line_height == 2}
              />
            }
            Normal
            {
              <input
                type="radio"
                name="lineHeight"
                value={2.5}
                onChange={this.onLineHeightChange}
                checked={this.props.line_height == 2.5}
              />
            }
            Tall
          </div>
        </div>
        <div className={styles.view_item}>
          <span className={styles.view_item_title}>dictionary:</span>
          <div className={styles.view_item_size}>
          <div>
            {
              <input
                type="radio"
                name="dictionary"
                value="English"
                onChange={this.onDictionaryChange}
                checked={this.props.dictionary === 'English'}
              />
            }
            English
            {
              <input
                type="radio"
                name="dictionary"
                value="Chinese"
                onChange={this.onDictionaryChange}
                checked={this.props.dictionary === 'Chinese'}
              />
            }
            Chinese
          </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    userUID: state.userUID,
    font_type: state.viewPreference.font_type,
    font_size: state.viewPreference.font_size,
    background_color: state.viewPreference.background_color,
    line_height: state.viewPreference.line_height,
    dictionary: state.viewPreference.dictionary,
    viewPreference: state.viewPreference
  };
}

export default connect(mapStateToProps)(ViewPreference);
