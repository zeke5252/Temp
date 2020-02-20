import React from "react";
import { connect } from "react-redux";
import styles from "../sass/main.scss";
import {} from "../actions/";

// For search history only first

class Word extends React.Component {
  constructor(props) {
    super(props);
  }

  responseHandler() {
    let data = {};
    if (this.props.isReverse) {
      // Reverse the keys of data on Firestore to make the highlighted word shown at the top
      let oldData = this.props.resDetails;
      let keys = [];
      for (let key in oldData) {
        keys.push(key);
      }
      for (let i = keys.length - 1; i >= 0; i--) {
        let value = oldData[keys[i]];
        data[keys[i]] = value;
      }
    }

    if (!this.props.isReverse) {
      // Reverse the keys of data on Firestore to make the highlighted word shown at the top
      data = this.props.resDetails;
    }

    // 如果該元素是一個陣列，則跳過

    // Full content
    let renderFull = Object.keys(data).map((catogory, index1) => (
      <div key={index1}>
        {/* word, phonetic, origin, meaning */}
        {/* <div >{catogory}</div> */}
        <div
          className={
            /\s/.test(Object.values(data)[index1])
              ? ""
              : Object.values(data)
                  [index1].toString()
                  .includes("/")
              ? this.props.styleParent.s_phonetic
              : this.props.styleParent.s_word
          }
        >
          {typeof Object.values(data)[index1] === "string" ? (
            // patient, kk pronounciation, middleEnglish from
            Object.values(data)[index1]
          ) : typeof Object.values(data)[index1] === "number" ? (
            <div
              className={
                data.times >= 10
                  ? this.props.styleParent.s_times_hot
                  : data.times > 1 && data.times < 10
                  ? this.props.styleParent.s_times
                  : this.props.styleParent.s_times_init
              }
            >
              {data.times}
            </div>
          ) : (
            <div>
              {Object.keys(data.meaning).map((catogory, index) => {
                return (
                  <div key={index}>
                    {/* adjective, noun */}
                    <span className={this.props.styleParent.s_speech}>
                      {catogory}
                    </span>
                    {data.meaning[catogory].map((detailObj, i) => {
                      return (
                        <div key={i}>
                          {Object.keys(detailObj).map(
                            (eachDetailObjName, i) => {
                              return (
                                <div key={i}>
                                  {/* definition, example, synonyms */}
                                  <div
                                    className={this.props.styleParent.s_block}
                                  >
                                    {eachDetailObjName}
                                  </div>
                                  <div>
                                    {typeof Object.values(detailObj)[i] ===
                                    "string"
                                      ? // Able to accept..., be patient....
                                        Object.values(detailObj)[i]
                                      : Object.values(detailObj)[i].map(
                                          (synonym, i) => {
                                            return (
                                              // forbearing, uncomplaining,...
                                              <span
                                                key={i}
                                                className={
                                                  this.props.styleParent
                                                    .s_synonyms
                                                }
                                              >
                                                {synonym},{" "}
                                              </span>
                                            );
                                          }
                                        )}
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    ));

    // Partial content
    let renderPartial = (
      <div className={this.props.styleParent.s_word}>
        {data.word}
        <div className={this.props.styleParent.s_detail}>
          {Object.values(data.meaning)[0][0].definition}
        </div>
      </div>
    );

    // Use props as a source of css style
    return (
      <div className={this.props.styleParent.s_container}>
        {this.props.isFull ? renderFull : renderPartial}
      </div>
    );
  }

  render() {
    return this.responseHandler();
  }
}

function mapStateToProps(state) {
  return {
    state: state
  };
}

export default connect(mapStateToProps)(Word);
