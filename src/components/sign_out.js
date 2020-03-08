import React from "react";
import styles from "../sass/main.scss";
import { cleanStoreData } from "../actions/";
import { Dialogue, closeDialogue, showDialogue } from "./dialogue";

class SignOut extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      isDialogueVisible: "none"
    }
    this.closeDialogue = closeDialogue.bind(this);
    this.showDialogue = showDialogue.bind(this);
    this.gotoSignIn = this.gotoSignIn.bind(
      this,
      this.props.history,
      );
    this.signOut = this.signOut.bind(
      this,
      this.props.dispatch
    );
  }

  gotoSignIn(history){
    history.push("/");
  }

  signOut(propsDispatch) {
    this.setState({
      isDialogueVisible:'flex'
    })
    firebase
      .auth()
      .signOut()
      .then(function() {
        // Clean all store data
        propsDispatch(cleanStoreData());
        localStorage.clear();
      })
      .catch(function(error) {
        console.log("Error :", error);
      });
  }

  render() {
    let {isDialogueVisible}=this.state
    return (
      <div>
        <button className={styles.signout} onClick={this.signOut}>
          <img
            src={require("../images/signout.png")}
            className={styles.signout_img}
          />
        </button>
        <Dialogue
          title="Sign out successfully"
          btnStr="OK"
          isDialogueVisible={isDialogueVisible}
          closeDialogue={this.gotoSignIn}
          clickHandler={this.gotoSignIn}
        />
      </div>
    );
  }
}


export default SignOut;
