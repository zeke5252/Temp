import React from "react";
import styles from "./sass/main.scss";
import { connect } from "react-redux";
import { updateUID, updateDisplayName } from "./actions/";

class FacebookBtn extends React.Component {
  constructor(props) {
    super(props);
    this.fbLoginHandler=this.fbLoginHandler.bind(this)
  }

  fbLoginHandler(){

    // firebase
    //   .auth()
    //   .createUserWithEmailAndPassword(this.state.userID, this.state.userPW)
    //   .then(res => {
    //     console.log("sign up name at line 42 =", this.state.userName);
    //     firebase.auth().currentUser.updateProfile({
    //       displayName: this.state.userName
    //     });
    //   })
    //   .then(res => {
    //     propsDispatch(updateUID(firebase.auth().currentUser.uid));
    //   })
    //   .then(res => {
    //     propsDispatch(updateDisplayName(this.state.userName));
    //   })
    //   .then(res => {
    //     history.push("/library");
    //   })
    //   .catch(
    //     error => {
    //       this.setState({
    //         errorMsg: error.message
    //       });
    //     }
    //     // Add warning message here
    //   );

    var provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
        console.log('props=', this.props);
        console.log('token=', token)
        console.log('user=', user)
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
  }

  componentDidMount(){
 // 原生的登入系統我會在註冊登入成功之後用dispatch的方式把UID，
 // 可謂access token?存到redux(也可以抓取臉書上提供的個人訊息)，
 // 然後看一下sign in頁面後半內容，也是用history導到library。
  }

  render() {
    return <button className={styles.fb_btn} onClick={this.fbLoginHandler}>Facebook login</button>;
  }
}

export default FacebookBtn