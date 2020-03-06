// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBi-vAP_csKhQv4vg3Md6XE1x0dnbujL10",
  authDomain: "readu-2cdda.firebaseapp.com",
  databaseURL: "https://readu-2cdda.firebaseio.com",
  projectId: "readu-2cdda",
  storageBucket: "readu-2cdda.appspot.com",
  messagingSenderId: "562113488919",
  appId: "1:562113488919:web:901494de1022d2d1139452",
  measurementId: "G-LKY4E12N8E"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const db = firebase.firestore();
const auth = firebase.auth()
export { db, auth };
