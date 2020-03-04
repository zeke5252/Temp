import React from "react";
import styles from "../sass/main.scss";

class Button extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { clickHandler, btnContainerStyle, img, str } = this.props;
    return (
      <button className={btnContainerStyle} onClick={clickHandler}>
        <div className={styles.btnInnerStyle}>
          {img ? <img src={require("../images/" + img)} className={styles.btnImg} /> : ''}
          {str}
        </div>
      </button>
    );
  }
}

export default Button;
