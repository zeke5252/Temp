import React from "react";
import { connect } from "react-redux";
import styles from "../sass/main.scss";

function Tutorial(props) {
  let self = {
    props
  };

  return (
    <div className={styles.tutorial_bg} style={{display:self.props.isTutorialVisible}} onClick={self.props.hideTutorial}>
        <div
          className={styles.tutorial_panel}
          // style={{ display: this.props.isVisible }}
        >
          <div className={styles.tutorial_select}>
            <p>
              In your text file. Show explanations of a word by 
              <strong> selecting a word or a phrase. </strong> ( For mobile, long
              press the word, and press the search button to search )
            </p>
            <div className={styles.tutorial_select_container}>
              <img
                src={require("../images/tutorial_desktop.png")}
                className={styles.tutorial_desktop_img}
              />
              <img
                src={require("../images/tutorial_mobile.png")}
                className={styles.tutorial_mobile_img}
              />
            </div>
          </div>
          <div className={styles.tutorial_history}>
            <p>
              Check the vocabulary search times on 
              <strong> SEARCH HISTORY </strong>
            </p>
            <div className={styles.tutorial_history_container}>
            <img
              src={require("../images/tutorial_history.png")}
              className={styles.tutorial_history_img}
            />
            </div>
          </div>
        </div>
      </div>
  );
}

function mapStateToProps(state) {
  return {
    userUID: state.userUID
  };
}

export default connect(mapStateToProps)(Tutorial);
