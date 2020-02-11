import React from "react";
import { connect } from "react-redux";
import styles from "../sass/main.scss";
import {} from "../actions/";

class PopupSearch extends React.Component {
  constructor(props) {
    super(props);
    this.showPopup = this.showPopup.bind(this);
    this.showAllContent = this.showAllContent.bind(this);
  }

  showAllContent() {
    this.props.showAllContent();
  }

  showPopup(showContent) {
    if (showContent === "word") {
      // declare all
      let data = this.props.resDetails;
      // layer 2
      // none
      // [{definition:...},{definition...}]
      // 吐陣列就是用map, data.meaning[index].map((obj,i)=>{return(<div>{obj.definition}</div>)})(代表第一組詞性，值為陣列) 不需要title,title取每個值首位的definition用
      let renderLayer2 = Object.keys(data.meaning).map((catogory, index) => {
        return (
          // 下面是一組詞性，詞性裡可能會數種不同的解釋，幾種合起來就是陣列
          <div key={index}>
            <span className={styles.s_speech}>{catogory}</span>
            {data.meaning[catogory].map((obj, i) => {
              return <div key={i}>⋅ {obj.definition}</div>;
            })}
          </div>
        );
      });
      // Full content
      let renderFull = Object.keys(data).map((catogory, index1) => (
        <div key={index1}>
          <div className={styles.s_word}>{catogory}</div>
          <div>
            {typeof Object.values(data)[index1] === "string" ? (
              Object.values(data)[index1]
            ) : (
              <div>{renderLayer2}</div>
            )}
          </div>
        </div>
      ));
      // Partial content
      let renderPartial = Object.keys(data).map((catogory, index1) => (
        <div key={index1}>
          <div>
            {typeof Object.values(data)[index1] === "string" ? (
              ""
            ) : (
              <div>{renderLayer2}</div>
            )}
          </div>
        </div>
      ));

      return (
        // 不要從firestore上去做處理跟判斷，全部抓下來，再從local去分析
        <div
          className={styles.popupSearchContainer}
          style={
            this.props.contentPosition === "cursor"
              ? {
                  display: this.props.isPopupVisible,
                  left: this.props.posX,
                  top: this.props.posY
                }
              : {
                  display: this.props.isPopupVisible,
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }
          }
          onClick={this.showAllContent}
        >
          {this.props.searchContent === "partial" ? renderPartial : renderFull}
        </div>
      );
    }
    if (showContent === "phrase") {
      return (
        <div
          className={styles.popupSearchContainer}
          style={{
            display: this.props.isPopupVisible,
            left: this.props.posX,
            top: this.props.posY
          }}
        >
          <p>{this.props.resDetails}</p>
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

export default connect(mapStateToProps)(PopupSearch);
