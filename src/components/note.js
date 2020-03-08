import React from "react";
import styles from "../sass/main.scss";
import { connect } from "react-redux";

class Note extends React.Component {
  constructor(props) {
    super(props);
    this.noteHandler = this.noteHandler.bind(this);
  }
  noteHandler() {
    this.props.showNote();
  }
  render() {
    return (
      <button className={styles.note} onClick={this.noteHandler}>
        <img src={require("../images/note.png")} className={styles.note_img} />
      </button>
    );
  }
}

function mapStateToProps(state) {
  return {
    initState: state
  };
}

export default connect(mapStateToProps)(Note);
