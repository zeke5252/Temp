import React from "react"
import styles from "../sass/main.scss"

class Back extends React.Component {
  constructor (props) {
    super(props)
    this.backHandler = this.backHandler.bind(this, this.props.history)
  }
  backHandler (history) {
    history.push("./library")
  }

  render () {
    return (
      <button className={styles.back} onClick={this.backHandler}>
        <img
          src={require("../images/back.png")}
          className={styles.back_img}
        />
      </button>
    )
  }
}

export default Back
