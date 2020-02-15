import React from "react";
import styles from "./sass/main.scss";

class FacebookBtn extends React.Component {
  constructor(props) {
    super(props);
    this.fbLoginHandler=this.fbLoginHandler.bind(this)
  }

  fbLoginHandler(){
    var provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
        console.log(result)
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
      }).catch(function(error) {
          console('some thing wrong')
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

    
  }

  render() {
    return <button className={styles.fb_btn} onClick={this.fbLoginHandler}>Facebook login</button>;
  }
}

export default FacebookBtn