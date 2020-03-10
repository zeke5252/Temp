import React from "react";
import styles from "../sass/main.scss";
import Button from "./button";

function closeDialogue() {
  this.setState({
    isDialogueVisible: "none"
  });
}

function showDialogue() {
  this.setState({
    isDialogueVisible: "flex"
  });
  this.setState({
    errorMsgDialogue: ""
  });
}

class Dialogue extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      title,
      clickHandler,
      btnStr,
      isDialogueVisible,
      closeDialogue,
      onMailChangeHandler,
      errorMsgDialogue
    } = this.props;
    return (
      <div
        className={styles.dialogueContainer}
        style={{ display: isDialogueVisible }}
      >
        <div onClick={closeDialogue} className={styles.btnBackground}></div>
        <div className={styles.dialogueStyle}>
          <div className={styles.dialogueTitle}>{title}</div>
          {onMailChangeHandler ? (
            <div>
              <input
                type="text"
                className={styles.diaLogueInput}
                onChange={onMailChangeHandler}
                autoFocus
              />
              <span className={styles.message}>{errorMsgDialogue}</span>
            </div>
          ) : (
            ""
          )}
          <Button
            clickHandler={clickHandler}
            str={btnStr}
            btnContainerStyle={styles.dialogueBtnStyle}
          />
        </div>
      </div>
    );
  }
}

export { Dialogue, closeDialogue, showDialogue };
