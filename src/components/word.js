import React from "react";
import {} from "../actions/";

// For search history only first

class Word extends React.Component {
  constructor(props) {
    super(props);
  }

  responseHandler() {
    let { isReverse, resDetails, styleParent, isFull } = this.props;
    let data = {};
    if (isReverse) {
      // Reverse the keys of data on Firestore to make the highlighted word shown at the top
      let oldData = resDetails;
      let keys = [];
      for (let key in oldData) {
        keys.push(key);
      }
      for (let i = keys.length - 1; i >= 0; i--) {
        let value = oldData[keys[i]];
        data[keys[i]] = value;
      }
    }

    if (!isReverse) {
      // Reverse the keys of data on Firestore to make the highlighted word shown at the top
      data = resDetails;
    }

    // Full content
    let renderFull = Object.keys(data).map((catogory, index1) => (
      <div key={index1}>
        {/* word, phonetic, origin, meaning */}
        {/* <div >{catogory}</div> */}
        <div
          className={
            /\s/.test(Object.values(data)[index1])
              ? styleParent.s_origin
              : Object.values(data)
                  [index1].toString()
                  .includes("/")
              ? styleParent.s_phonetic
              : styleParent.s_word
          }
        >
          {typeof Object.values(data)[index1] === "string" ? (
            // patient, kk pronounciation, middleEnglish from
            Object.values(data)[index1]
          ) : typeof Object.values(data)[index1] === "number" ? (
            <div
              className={
                data.times >= 5
                  ? styleParent.s_times_hot
                  : data.times > 1 && data.times < 5
                  ? styleParent.s_times
                  : styleParent.s_times_init
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
                    <span className={styleParent.s_speech}>{catogory}</span>
                    {data.meaning[catogory].map((detailObj, i) => {
                      return (
                        <div key={i}>
                          {Object.keys(detailObj).map(
                            (eachDetailObjName, i) => {
                              return (
                                <div key={i}>
                                  {/* definition, example, synonyms */}
                                  <div className={styleParent.s_block}>
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
                                                  styleParent.s_synonyms
                                                }
                                              >
                                                {synonym}, {' '}
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
      <div className={styleParent.s_word}>
        {data.word}
        <div className={styleParent.s_detail}>
          {Object.values(data.meaning)[0][0].definition}
        </div>
      </div>
    );

    // Use props as a source of css style
    return (
      <div className={styleParent.s_container}>
        {isFull ? renderFull : renderPartial}
      </div>
    );
  }

  render() {
    return this.responseHandler();
  }
}

export default Word;
