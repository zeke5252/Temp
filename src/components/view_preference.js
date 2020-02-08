import React from "react";
import { connect } from "react-redux";
import styles from "../sass/main.scss";
import {
  changeViewFontType,
  changeViewBG,
  changeViewFontSize,
  changeViewLineHeight
} from "../actions/";

class ViewPreference extends React.Component {
  constructor(props) {
    super(props);
    this.onFontTypeChange = this.onFontTypeChange.bind(this);
    this.onBgChange = this.onBgChange.bind(this);
    this.onLineHeightChange = this.onLineHeightChange.bind(this);
  }

  changeViewFontSize(calc) {
    let num = this.props.font_size;
    if (calc === "+") {
      num < 25 ? (num += 1) : num;
    }
    if (calc === "-") {
      num > 17 ? (num -= 1) : num;
    }
    this.props.dispatch(changeViewFontSize(num));
  }

  onFontTypeChange() {
    this.props.dispatch(changeViewFontType(event.target.value));
  }

  onBgChange() {
    this.props.dispatch(changeViewBG(event.target.value));
  }

  onLineHeightChange() {
    console.log(event.target.value);
    this.props.dispatch(changeViewLineHeight(event.target.value));
  }

  componentDidMount() {
    console.log("after pref mount = ", this.props);
  }

  render() {
    return (
      <div className={styles.viewContainer}>
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
                value={"#edd1b0"}
                onChange={this.onBgChange}
                checked={this.props.background_color === "#edd1b0"}
              />
            }
            <span className={styles.view_item_bg_color_yellow}></span>
            {
              <input
                type="radio"
                name="bgColor"
                value={"#f6efdc"}
                onChange={this.onBgChange}
                checked={this.props.background_color === "#f6efdc"}
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
                value={2}
                onChange={this.onLineHeightChange}
                checked={this.props.line_height === '2'}
              />
            }{" "}
            Short
            {
              <input
                type="radio"
                name="lineHeight"
                value={2.5}
                onChange={this.onLineHeightChange}
                checked={this.props.line_height === '2.5'}
              />
            }{" "}
            Normal
            {
              <input
                type="radio"
                name="lineHeight"
                value={3}
                onChange={this.onLineHeightChange}
                checked={this.props.line_height === '3'}
              />
            }{" "}
            Tall
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    font_type: state.viewPreference.font_type,
    font_size: state.viewPreference.font_size,
    background_color: state.viewPreference.background_color,
    line_height: state.viewPreference.line_height
  };
}

export default connect(mapStateToProps)(ViewPreference);
