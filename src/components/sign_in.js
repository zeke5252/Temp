import React from "react";
import styles from "../sass/main.scss";
import { connect } from "react-redux";
import { updateUID, updateDisplayName } from "../actions/";
import  FacebookBtn  from "../facebookSetup"

class Sign_in extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: "",
      userPW: "",
      userName: "",
      errorMsg: "",
      mode: "signIn"
    };
    this.onModeSwitch = this.onModeSwitch.bind(this);
    this.signUpHandler = this.signUpHandler.bind(
      this,
      this.props.dispatch,
      this.props.history
    );
    this.signInHandler = this.signInHandler.bind(
      this,
      this.props.dispatch,
      this.props.history
    );
    this.onNameChange = this.onNameChange.bind(this);
    this.onIDChange = this.onIDChange.bind(this);
    this.onPWChange = this.onPWChange.bind(this);
  }

  onModeSwitch(text) {
    if (this.state.mode === "signIn") {

      this.setState({
        mode: "signUp",
        userID: "",
        userPW: "",
        userName: ""
      });
    } else {
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
        console.log("sign up name at line 42 =", this.state.userName);
        firebase.auth().currentUser.updateProfile({
          displayName: this.state.userName
        });
      })
      .then(res => {
        propsDispatch(updateUID(firebase.auth().currentUser.uid));
      })
      .then(res => {
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

  componentDidMount() {
    // console.log('history=', this.props)
  }

  signInHandler(propsDispatch, history) {
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.userID, this.state.userPW)
      .then(res => {
        let user = firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            propsDispatch(updateUID(firebase.auth().currentUser.uid));
            propsDispatch(
              updateDisplayName(firebase.auth().currentUser.displayName)
            );
            history.push("/library");
          } else {
            console.log("No one signed in");
          }
        });
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
    // console.log('change=', this.state)
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
    if (this.state.mode === "signIn") {
      return (
        <div className={styles.container_init}>
          <div className={styles.sign_in_container}>
            <img
              src={require("../images/logo_signin.png")}
              className={styles.logo_signin}
            />
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
            <button onClick={this.signInHandler}>
              Sign in
            </button>
            <FacebookBtn />
            <span className={styles.sign_switch} onClick={this.onModeSwitch}>
              Create an account
            </span>
            <span className={styles.message}>{this.state.errorMsg}</span>
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.container_init}>
          <div className={styles.sign_in_container}>
            <img
              src={require("../images/logo_signin.png")}
              className={styles.logo_signin}
            />
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
            <button onClick={this.signUpHandler}>
              Sign up
            </button>
            <span
              className={styles.sign_switch}
              onClick={this.onModeSwitch}
              text="signIn"
            >
              Sign in with the existing account
            </span>
            <span className={styles.message}>{this.state.errorMsg}</span>
          </div>
        </div>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    userUID: state.userUID,
    userName: state.userName
  };
}

export default connect(mapStateToProps)(Sign_in);
