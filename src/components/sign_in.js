import React from "react";
import styles from "../sass/main.scss";
import { connect } from "react-redux";
import { updateUID, updateDisplayName } from "../actions/";
import { slangCollection } from "../components/slangs";
import Button from "../components/button";
import { Dialogue, closeDialogue, showDialogue } from "../components/dialogue";
import { auth } from "../firebaseConfig";

class Sign_in extends React.Component {
  constructor(props) {
    super(props);
    let { dispatch, history } = props;
    this.state = {
      userID: "",
      userPW: "",
      userPW_re: "",
      userName: "",
      errorMsg: "",
      errorMsgDialogue: "",
      mode: "signIn",
      quoteNumSlang: 0,
      isDialogueVisible: "none"
    };
    this.switchMode = this.switchMode.bind(this);
    this.signUpHandler = this.signUpHandler.bind(this, dispatch, history);
    this.signInHandler = this.signInHandler.bind(this, dispatch, history);
    this.onNameChange = this.onNameChange.bind(this);
    this.onIDChange = this.onIDChange.bind(this);
    this.onPWChange = this.onPWChange.bind(this);
    this.onPWChange_re = this.onPWChange_re.bind(this);
    this.fbLoginHandler = this.fbLoginHandler.bind(this, dispatch, history);
    this.forgetPW = this.forgetPW.bind(this);
    this.showDialogue = showDialogue.bind(this);
    this.closeDialogue = closeDialogue.bind(this);
    this.onMailChangeHandler = this.onMailChangeHandler.bind(this);
  }

  onMailChangeHandler() {
    this.setState(
      {
        eMail: event.target.value
      }
    );
  }

  forgetPW() {
    if(!this.state.eMail){
      this.setState({
        errorMsgDialogue:"Fill in your e-mail"
      })
    } else {
      this.setState({
        errorMsgDialogue: ""
      }, ()=>{
        auth
        .sendPasswordResetEmail(this.state.eMail)
        .then(function() {
          alert("Email sent.");
        })
        .catch(error => {
          this.setState({
            errorMsgDialogue: error.message
          });
        });
      });
    }
  }

  fbLoginHandler(propsDispatch, history) {
    var provider = new firebase.auth.FacebookAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function(result) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        // var token = result.credential.accessToken;
        propsDispatch(updateUID(auth.currentUser.uid));
        propsDispatch(updateDisplayName(auth.currentUser.displayName));
        history.push("/library");
      })
      .catch(function(error) {
        console.error(`Facebook error.${error.message}`);
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
      });
  }

  componentDidMount() {
    var user = auth.currentUser;
    if (user) {
      history.push("/library");
    }
    const tempQuoteNumSlang = Math.floor(
      Math.random() * slangCollection.length
    );
    this.setState({
      quoteNumSlang: tempQuoteNumSlang
    });
  }
  switchMode() {
    if (this.state.mode === "signIn") {
      this.setState({
        mode: "signUp",
        userID: "",
        userPW: "",
        userName: "",
        errorMsg: ""
      });
    } else if (this.state.mode === "signUp") {
      this.setState({
        mode: "signIn",
        userID: "",
        userPW: "",
        userName: "",
        errorMsg: ""
      });
    }
  }

  signUpHandler(propsDispatch, history) {
    this.state.userPW !== this.state.userPW_re
      ? this.setState({
          errorMsg: "Passwords do not match."
        })
      : firebase
          .auth()
          .createUserWithEmailAndPassword(this.state.userID, this.state.userPW)
          .then(res => {
            auth.currentUser.updateProfile({
              displayName: this.state.userName
            });
          })
          .then(res => {
            propsDispatch(updateUID(auth.currentUser.uid));
          })
          .then(res => {
            console.log("signup!");
            propsDispatch(updateDisplayName(this.state.userName));
          })
          .then(res => {
            history.push("/library");
          })
          .catch(
            error => {
              this.setState({
                errorMsg: error.message
              });
            }
            // Add warning message here
          );
  }
  signInHandler(propsDispatch, history) {
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.userID, this.state.userPW)
      .then(res => {
        var user = auth.currentUser;
        if (user) {
          propsDispatch(updateUID(auth.currentUser.uid));
          propsDispatch(updateDisplayName(auth.currentUser.displayName));
          history.push("/library");
        } else {
          console.log("No one signed in");
        }
      })
      .catch(
        error => {
          this.setState({
            errorMsg: error.message
          });
        }
        // Add warning message here
      );
  }

  onNameChange() {
    this.setState({
      userName: event.target.value
    });
  }

  onIDChange() {
    this.setState({
      userID: event.target.value
    });
  }

  onPWChange() {
    this.setState({
      userPW: event.target.value
    });
  }

  onPWChange_re() {
    this.setState({
      userPW_re: event.target.value
    });
  }

  render() {
    const {
      errorMsg,
      errorMsgDialogue,
      mode,
      quoteNumSlang,
      isDialogueVisible
    } = this.state;
    return (
      <div className={styles.container_init}>
        <div className={styles.container_sign_in}>
          {mode === "signIn" ? (
            <div className={styles.sign_in_container_left}>
              <img
                src={require("../images/logo_animation.gif")}
                className={styles.logo_signin}
              />
              <span className={styles.sign_in_slogan}>
                Search easy. Read easy.
              </span>
              <span className={styles.sign_in_title}>Sign in</span>
              <input
                type="text"
                onChange={this.onIDChange}
                placeholder="Your e-mail"
                autoComplete="off"
              ></input>
              <input
                type="password"
                onChange={this.onPWChange}
                placeholder="Your password"
                autoComplete="new-password"
              ></input>
              <Button
                clickHandler={this.signInHandler}
                str="Sign in"
                img="signIn.png"
              />
              <Button
                clickHandler={this.fbLoginHandler}
                btnContainerStyle={styles.fb_btn}
                img="facebook.png"
                str="Facebook login"
              />
              <div className={styles.sign_switch_container}>
                <span className={styles.sign_switch} onClick={this.switchMode}>
                  Sign up
                </span>
                <span
                  className={styles.sign_switch}
                  onClick={this.showDialogue}
                >
                  Forget password?
                </span>
              </div>
              <span className={styles.message}>{errorMsg}</span>
            </div>
          ) : (
            <div className={styles.sign_in_container_left}>
              <img
                src={require("../images/logo_signin.png")}
                className={styles.logo_signin}
              />
              <span className={styles.sign_in_slogan}>
                Search easy. Read easy.
              </span>
              <span className={styles.sign_in_title}>Sign up</span>
              <input
                type="text"
                onChange={this.onNameChange}
                placeholder="Your name"
                autoComplete="off"
              ></input>
              <input
                type="text"
                onChange={this.onIDChange}
                placeholder="Your e-mail"
              ></input>
              <input
                type="password"
                onChange={this.onPWChange}
                placeholder="Your password"
                autoComplete="new-password"
              ></input>
              <input
                type="password"
                onChange={this.onPWChange_re}
                placeholder="Enter your password again"
                autoComplete="new-password"
              ></input>
              <Button
                clickHandler={this.signUpHandler}
                str="Sign up"
                img="signIn.png"
              />
              <span className={styles.sign_switch} onClick={this.switchMode}>
                Sign in with the existing account
              </span>
              <span className={styles.message}>{errorMsg}</span>
            </div>
          )}
          <div className={styles.sign_in_container_right}>
            <div>
              <span className={styles.sign_in_slang}>
                {slangCollection[quoteNumSlang].slang}
              </span>
              <span className={styles.sign_in_slang_author}>
                {slangCollection[quoteNumSlang].author}
              </span>
            </div>
          </div>
        </div>
        <Dialogue
          title="Your verification e-mail address"
          clickHandler={this.forgetPW}
          btnStr="Send"
          isDialogueVisible={isDialogueVisible}
          closeDialogue={this.closeDialogue}
          onMailChangeHandler={this.onMailChangeHandler}
          errorMsgDialogue={errorMsgDialogue}
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

export default connect(mapStateToProps)(Sign_in);
