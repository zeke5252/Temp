import React from "react";
import styles from "../sass/main.scss";
import Button from "./button";

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
      onMailChangeHandler
    } = this.props;
    return (
      <div
        className={styles.dialogueContainer}
        style={{ display: isDialogueVisible }}
      >
        <div className={styles.dialogueStyle}>
          <div className={styles.dialogueTitle}>{title}</div>
          <input
            type="text"
            className={styles.diaLogueInput}
            onChange={onMailChangeHandler}
            autoFocus
          />
          <Button
            clickHandler={clickHandler}
            str={btnStr}
            btnContainerStyle={styles.dialogueBtnStyle}
          />
        </div>
        <div onClick={closeDialogue} className={styles.btnBackground}></div>
      </div>
    );
  }
}

export default Dialogue;
