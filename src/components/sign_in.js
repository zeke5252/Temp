import React from "react";
import { Link } from "react-router-dom";
import styles from "../sass/main.scss";
import { connect } from "react-redux";
import { createHashHistory } from "history";
import { updateUID, updateDisplayName } from "../actions/";
const history = createHashHistory();

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
    this.signUpHandler = this.signUpHandler.bind(this, this.props.dispatch);
    this.signInHandler = this.signInHandler.bind(
      this,
      this.props.hightlightHandler,
      this.props.dataAll,
      this.props.dispatch
    );
    this.onNameChange = this.onNameChange.bind(this);
    this.onIDChange = this.onIDChange.bind(this);
    this.onPWChange = this.onPWChange.bind(this);
  }

  onModeSwitch(text) {
    if(this.state.mode === 'signIn'){
      this.setState({
        mode: 'signUp'
      })
    } else {
      this.setState({
        mode: 'signIn'
      })
    }
    
  }

  signUpHandler(propsDispatch) {
    console.log(this.state);
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.userID, this.state.userPW)
      .then(res => {
        firebase.auth().currentUser.updateProfile({
          displayName: this.state.userName
        });
      })
      .then(res => {
        console.log(
          "Sign up done, the user data is=",
          firebase.auth().currentUser
        );
        propsDispatch(updateUID(firebase.auth().currentUser.uid));
        propsDispatch(updateDisplayName(this.state.userName));
      })
      .then(res => {
        history.push("/library");
      })
      .catch(error => {
        this.setState({
          errorMsg: error.message
        });
      }); // Add warning message here
  }

  signInHandler(handler, data, propsDispatch) {
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.userID, this.state.userPW)
      .then(res => {
        console.log("res=", res);
        let user = firebase.auth().onAuthStateChanged(function (user) {
          if (user) {
            console.log("the user is signed in, the data is = ", user);
            //handler(data)
            propsDispatch(updateUID(firebase.auth().currentUser.uid));
            history.push("/library");
          } else {
            // No user is signed in.
            console.log("No one signed in");
          }
        });
      })
      .catch(error => {
        this.setState({
          errorMsg: error.message
        });
      }); // Add warning message here
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
    console.log('the start is=', this.state.mode)
    if (this.state.mode === "signIn") {
      console.log(this.state.mode)
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
              id="email"
              onChange={this.onIDChange}
              placeholder="Your e-mail"
            ></input>
            <input
              type="password"
              id="password"
              onChange={this.onPWChange}
              placeholder="Your password"
            ></input>
            <button id="signinBtn" onClick={this.signInHandler}>
              Sign in
            </button>
            <span
              className={styles.sign_switch}
              onClick={this.onModeSwitch}
            >
              Create an account
            </span>
            <span className={styles.message}>{this.state.errorMsg}</span>
          </div>
        </div>
      );
    } else {
      console.log(this.state.mode)
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
              id="name"
              onChange={this.onNameChange}
              placeholder="Your name"
            ></input>
            <input
              type="text"
              id="email"
              onChange={this.onIDChange}
              placeholder="Your e-mail"
            ></input>
            <input
              type="password"
              id="password"
              onChange={this.onPWChange}
              placeholder="Your password"
            ></input>
            <button id="signupBtn" onClick={this.signUpHandler}>
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
