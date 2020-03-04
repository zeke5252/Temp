import React from "react";
import styles from "../sass/main.scss";
import { connect } from "react-redux";
import { updateUID, updateDisplayName } from "../actions/";
import { slangCollection } from "../components/slangs";
import Button from "../components/button";

class Sign_in extends React.Component {
  constructor(props) {
    super(props);
    let { dispatch, history } = props;
    this.state = {
      userID: "",
      userPW: "",
      userName: "",
      errorMsg: "",
      mode: "signIn",
      quoteNumSlang: 0
    };
    this.switchMode = this.switchMode.bind(this);
    this.signUpHandler = this.signUpHandler.bind(this, dispatch, history);
    this.signInHandler = this.signInHandler.bind(this, dispatch, history);
    this.onNameChange = this.onNameChange.bind(this);
    this.onIDChange = this.onIDChange.bind(this);
    this.onPWChange = this.onPWChange.bind(this);
    this.fbLoginHandler = this.fbLoginHandler.bind(this, dispatch, history);
    this.forgetPW = this.forgetPW.bind(this);
  }

  forgetPW() {
    var auth = firebase.auth();
    var emailAddress = this.state.userID;

    auth
      .sendPasswordResetEmail(emailAddress)
      .then(function() {
        alert("Email sent.");
      })
      .catch(error => {
        this.setState({
          errorMsg: error.message
        });
      });
  }

  fbLoginHandler(propsDispatch, history) {
    var provider = new firebase.auth.FacebookAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function(result) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        // var token = result.credential.accessToken;
        propsDispatch(updateUID(firebase.auth().currentUser.uid));
        propsDispatch(
          updateDisplayName(firebase.auth().currentUser.displayName)
        );
      })
      .then(res => {
        history.push("/library");
      })
      .then()
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
    var user = firebase.auth().currentUser;
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
        userName: ""
      });
    } else if (this.state.mode === "signUp") {
      this.setState({
        mode: "signIn",
        userID: "",
        userPW: "",
        userName: ""
      });
    }
  }

  signUpHandler(propsDispatch, history) {
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.userID, this.state.userPW)
      .then(res => {
        firebase.auth().currentUser.updateProfile({
          displayName: this.state.userName
        });
      })
      .then(res => {
        propsDispatch(updateUID(firebase.auth().currentUser.uid));
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
        var user = firebase.auth().currentUser;
        if (user) {
          propsDispatch(updateUID(firebase.auth().currentUser.uid));
          propsDispatch(
            updateDisplayName(firebase.auth().currentUser.displayName)
          );
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

  render() {
    const { errorMsg, mode, quoteNumSlang } = this.state;
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
              />
              <Button
                clickHandler={this.fbLoginHandler}
                btnContainerStyle={styles.fb_btn}
                img="facebook.png"
                str="Facebook login"
              />
              <span className={styles.sign_switch} onClick={this.switchMode}>
                Create an account
              </span>
              <span className={styles.sign_switch} onClick={this.forgetPW}>
                Forget password?
              </span>
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
              <button onClick={this.signUpHandler}>Sign up</button>
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
