import React from "react";
import styles from "../sass/main.scss";

function Button(props) {
  const { clickHandler, btnContainerStyle, img, str } = props;
  return (
    <button
      className={btnContainerStyle}
      onClick={clickHandler ? clickHandler : null}
    >
      <div className={styles.btnInnerStyle}>
        {img ? (
          <img
            src={require("../images/" + img)}
            className={styles.btnImg}
            style={str ? {} : { marginRight: "0" }}
          />
        ) : (
          ""
        )}
        {str ? str : ""}
      </div>
    </button>
  );
}

export default Button;
