import React from "react";
import { connect } from "react-redux";
import styles from "../sass/main.scss";
import Greetings from "../components/greeting";
import Button from "../components/button";
import {db} from "../firebaseConfig"
import { Dialogue, showDialogue, closeDialogue } from "./dialogue";

class New_content extends React.Component {
  constructor(props) {
    super(props);
    let { history } = this.props;
    this.onContentChange = this.onContentChange.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.resetContent = this.resetContent.bind(this);
    this.cancelContent = this.cancelContent.bind(this, history);
    this.saveBook = this.saveBook.bind(this, history);
    this.assignBookAttr = this.assignBookAttr.bind(this);
    this.gotoLibrary = this.gotoLibrary.bind(
      this,
      this.props.history,
      );
    this.state = {
      title: "",
      content: "",
      coverColor: "",
      createdTime: "",
      searchedWords: 0,
      warningMsg: "",
      isDialogueVisible: "none",
      note:''
    };
  }

  gotoLibrary(history){
    history.push("./library");
  }

  componentDidMount() {
    this.assignBookAttr();
  }

  assignBookAttr() {
    let bookCoverColorSet = [
      "#6A4A3C",
      "#CC333F",
      "#EB6841",
      "#EDC951",
      "#00A0B0",
      "#EB6841",
      "#333333"
    ];
    let color =
      bookCoverColorSet[Math.floor(Math.random() * bookCoverColorSet.length)];
    this.setState({
      coverColor: color,
      createdTime: Date.now()
    });
  }

  saveBook(history) {
    const { content, title } = this.state;
    const LanguageDetect = require("languagedetect");
    const lngDetector = new LanguageDetect();
    let detectResult = lngDetector.detect(content, 1);
    if (content === "" || title === "") {
      this.setState({
        warningMsg: `Fill out all the contents.`
      });
    } else if (!detectResult.length) {
      this.setState({
        warningMsg: `It is recommemded that the content is primarily composed of English.`
      });
    } else if (detectResult[0][0] !== "english") {
      this.setState({
        warningMsg: `What you have pasted could be ${detectResult[0][0]
          .charAt(0)
          .toUpperCase() +
          detectResult[0][0].slice(
            1
          )}. It is recommemded that the content is primarily composed of English.`
      });
    } else {
      let uid = this.props.userUID;
      db.collection("users")
        .doc(`${uid}`)
        .collection("Library")
        .doc(`${title}`)
        .set(this.state)
        .then(() => {
          this.setState({
            isDialogueVisible:"flex"
          })
        });
    }
  }

  cancelContent(history) {
    history.push("/library");
  }

  onContentChange() {
    this.setState({
      content: event.target.value
    });
  }

  resetContent(evn) {
    this.setState({
      content: "",
      title: ""
    });
  }

  onTitleChange() {
    this.setState({
      title: event.target.value
    });
  }

  render() {
    const { warningMsg, title, content, isDialogueVisible } = this.state;
    return (
      <div className={styles.container_library}>
        <div className={styles.library_new_content}>
          <div className={styles.library_left_top_new_content}>
            <Greetings userName={this.props.userName} />
            <div className={styles.groupBtn}>
              <button className={styles.cancelBtn} onClick={this.cancelContent}>
                <img
                  className={styles.cancelBtn_img}
                  src={require("../images/cancel.png")}
                />
              </button>
              <button className={styles.resetBtn} onClick={this.resetContent}>
                <img
                  className={styles.resetBtn_img}
                  src={require("../images/reset.png")}
                />
              </button>
              <Button
                clickHandler={this.saveBook}
                btnContainerStyle={styles.saveBtn}
                img="save.png"
                str="Save"
              />
            </div>
          </div>
          <div className={styles.warningMsg}>{warningMsg}</div>
          <input
            type="text"
            className={styles.library_new_title}
            onChange={this.onTitleChange}
            value={title}
          />
          <textarea
            className={styles.library_new_content_container}
            onChange={this.onContentChange}
            value={content}
            autoComplete="off"
          />
        </div>
        <Dialogue
          title="File saved"
          btnStr="OK"
          isDialogueVisible={isDialogueVisible}
          closeDialogue={this.gotoLibrary}
          clickHandler={this.gotoLibrary}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    userUID: state.userUID,
    userName: state.userName
  };
}

export default connect(mapStateToProps)(New_content);
