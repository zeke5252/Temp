import React from "react";
import styles from "../sass/main.scss";
import { connect } from "react-redux";
import { updateUID, updateDisplayName } from "../actions/";
import FacebookBtn from "../facebookSetup";

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

  componentDidMount() {
    var user = firebase.auth().currentUser;
    if(user){
      this.props.history.push("/library");
    }
  }
  onModeSwitch(text) {
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
    // 註冊
    // 把名稱更新
    // 把uid, name存入redux
    // 跳到library
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
  // 註冊
  // 把名稱更新
  // 把uid, name存入redux
  // 跳到library
  signInHandler(propsDispatch, history) {
    // 登入
    // 如果這個使用者存在
    // 把名稱更新
    // 把uid, name存入redux
    // 跳到library
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
            <button onClick={this.signInHandler}>Sign in</button>
            <FacebookBtn history={this.props.history}/>
            <span
              className={styles.sign_switch}
              onClick={this.onModeSwitch.bind(this, "signUp")}
            >
              Create an account
            </span>
            <span className={styles.message}>{this.state.errorMsg}</span>
          </div>
        </div>
      );
    } else if (this.state.mode === "signUp") {
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
            <button onClick={this.signUpHandler}>Sign up</button>
            <span
              className={styles.sign_switch}
              onClick={this.onModeSwitch.bind(this, "signIn")}
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
