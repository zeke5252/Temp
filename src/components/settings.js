import React from "react";
import styles from "../sass/main.scss";
import { connect } from "react-redux";

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.settingsHandler = this.settingsHandler.bind(
      this,
      this.props.dispatch,
      this.props.history
    );
  }
  settingsHandler() {
    this.props.showSettings();
  }

  render() {
    return (
      <button className={styles.settings} onClick={this.settingsHandler}>
        <img
          src={require("../images/settings.png")}
          className={styles.settings_img}
        />
      </button>
    );
  }
}

function mapStateToProps(state) {
  return {
    initState: state
  };
}

export default connect(mapStateToProps)(Settings);
