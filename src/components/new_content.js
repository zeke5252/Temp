import React from "react";
import { connect } from "react-redux";
import styles from "../sass/main.scss";
import Greetings from "../components/greeting";

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
    this.state = {
      title: "",
      content: "",
      coverColor: "",
      createdTime: "",
      searchedWords: 0,
      warningMsg: ""
    };
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
      let db = firebase.firestore();
      db.collection("users")
        .doc(`${uid}`)
        .collection("Library")
        .doc(`${title}`)
        .set(this.state)
        .then(() => {
          alert("Save to your library successfully!");
          history.push("./library");
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
    const { warningMsg, title, content } = this.state;
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
              <button className={styles.saveBtn} onClick={this.saveBook}>
                Save
              </button>
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
