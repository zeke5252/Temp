import React from "react";
import { connect } from "react-redux";
import styles from "../sass/main.scss";
import {} from "../actions/";

// For search history only first
// Use props or state from firestore as an parameter of showPopup function to return an jsx snippet 

class Word extends React.Component {
  constructor(props) {
    super(props);
    this.showPopup = this.showPopup.bind(this);
    this.showAllContent = this.showAllContent.bind(this);
  }

  showPopup(showContent) {
    if (showContent === "word") {
      // declare all
      let data = this.props.resDetails;
      // Full content
      let renderFull = Object.keys(data).map((catogory, index1) => (
        <div key={index1}>
          <div className={styles.s_word}>{catogory}</div>
          <div>
            {typeof Object.values(data)[index1] === "string" ? (
              Object.values(data)[index1]
            ) : (
              <div>{Object.keys(data.meaning).map((catogory, index) => {
                return (
                  <div key={index}>
                    <span className={styles.s_speech}>{catogory}</span>
                    {data.meaning[catogory].map((detailObj, i) => {
                      return (
                        <div key={i}>
                          .{Object.keys(detailObj).map((eachDetailObjName, i) => {
                            return <div key={i}>{eachDetailObjName}
                            <div>{typeof Object.values(detailObj)[i] === "string" ? Object.values(detailObj)[i] : Object.values(detailObj)[i].map((synonym,i)=>{
                              return <span key={i}>{synonym}</span>
                            })}</div>
                            </div>;
                          })}
                        </div>
                      );
                    })}
                  </div>
                );
              })}</div>
            )}
          </div>
        </div>
      ));

      return (
        <div
          className={styles.popupSearchContainer}
        >
          {this.props.searchContent === "partial" ? renderPartial : renderFull}
        </div>
      );
    }
  }

  render() {
    return this.showPopup(this.props.showContent);
  }
}

function mapStateToProps(state) {
  return {
    userUID: state.userUID
  };
}

export default connect(mapStateToProps)(Word);
