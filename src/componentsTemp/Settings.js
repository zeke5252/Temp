import React from "react";
import styles from "../sass/main.scss";

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.settingsHandler = this.settingsHandler.bind(
      this,
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

export default Settings;
