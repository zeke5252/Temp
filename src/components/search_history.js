import React from "react";
import styles from "../sass/main.scss";
import { connect } from "react-redux";
import Word_real from './word'

class Word extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className={styles.s_container}>
        <div className={styles.s_times}>45</div>
        <div className={styles.s_word}>patient</div>
        <div className={styles.s_phonetic}>/ˈpeɪʃ(ə)nt/</div>
        <div className={styles.s_origin}>
          Middle English from Old French, from Latin patient- ‘suffering’, from
          the verb pati.
        </div>
        <div>
          <div className={styles.s_meaning}>
            adjective
            <div className={styles.s_block}>
              <div className={styles.s_definition}>
                Able to accept or tolerate delays, problems, or suffering
                without becoming annoyed or anxious.
              </div>
              <div className={styles.s_example}>
                be patient, your time will come
              </div>
              <div className={styles.s_synonyms}>
                forbearing, uncomplaining, tolerant, long-suffering, resigned,
                stoical
              </div>
            </div>
          </div>
          <div className={styles.s_meaning}>
            none
            <div className={styles.s_block}>
              <div className={styles.s_definition}>
                A person receiving or registered to receive medical treatment.
              </div>
              <div className={styles.s_example}>
                many patients in the hospital were more ill than she was
              </div>
              <div className={styles.s_synonyms}>
                sick person, case, sufferer, victim
              </div>
            </div>
            <div className={styles.s_block}>
              <div className={styles.s_definition}>
                The semantic role of a noun phrase denoting something that is
                affected or acted upon by the action of a verb.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class Search_history extends React.Component {
  constructor(props) {
    super(props);
  }

  
  componentDidMount() {
    let uid = this.props.userUID;
    let db = firebase.firestore();
    console.log('uid=', uid)
    db.collection("users")
      .doc(`${uid}`)
      .collection("Search_history")
      .doc("period")
      .get()
      .then(res => console.log(res.data()))
      .catch(function(error) {
        console.log("Error getting document:", error);
      });
  }

  render() {
    return (
      <div className={styles.search_container}>
        <span className={styles.search_title}>Search history</span>
        <select>
          <option>by frequency</option>
          <option>by time</option>
        </select>
        <div className={styles.search_radio_container}>
          <input
            type="radio"
            name=""
            value=""
            id=""
            className={styles.search_radio}
          ></input>
          <span> All </span>
          <span className={styles.search_radio_divider}> | </span>
          <input
            type="radio"
            name=""
            value=""
            id=""
            className={styles.search_radio}
          ></input>
          <span> Favorite </span>
        </div>
        <ul>
          <li>
            <Word />
          </li>
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    userUID: state.userUID
  };
}

export default connect(mapStateToProps)(Search_history);



// 觀察firestore上查過的字的結構是否等同於直接收到的response
