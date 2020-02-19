import React from "react";
import styles from "./sass/main.scss";
import { connect } from "react-redux";
import { updateUID, updateDisplayName } from "./actions/";

class FacebookBtn extends React.Component {
  constructor(props) {
    super(props);
    this.fbLoginHandler=this.fbLoginHandler.bind(this, this.props.history)
  }

  fbLoginHandler(history){
    var provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {

        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        console.log(result);
        // ...
        //history.push("/library");
      }).catch(function(error) {
        console.error(`這個錯誤是 ${error.code}`);
        console.error(`這個錯誤是 ${error.message}`);
        console.error(`這個錯誤是 ${error.email}`);
        console.error(`這個錯誤是 ${error.credential}`);

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