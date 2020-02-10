import React from "react";
import { connect } from "react-redux";
import styles from "../sass/main.scss";
import {} from "../actions/";

class PopupSearch extends React.Component {
  constructor(props) {
    super(props);
  }

  showWordDetails() {
    // declare all
    let data = this.props.resDetails;
    // layer 2
    // none
    // [{definition:...},{definition...}]
    // 吐陣列就是用map, data.meaning[index].map((obj,i)=>{return(<div>{obj.definition}</div>)})(代表第一組詞性，值為陣列) 不需要title,title取每個值首位的definition用
    let renderLayer2 = Object.keys(data.meaning).map((catogory, index) => {
      // console.log('>>>>>',data.meaning)
      return (
        // 下面是一組詞性，詞性裡可能會數種不同的解釋，幾種合起來就是陣列
        
        <div key={index}>
          {catogory}
          {data.meaning[catogory].map((obj,i)=>{return(<div key={i}>{obj.definition}</div>)})}
        </div>
      );
    });
    // layer 1
    let renderLayer1 = Object.keys(data).map((catogory, index1) => (
      <div key={index1}>
        {catogory}
        <div>
          {typeof Object.values(data)[index1] === "string" ? (
            Object.values(data)[index1]
          ) : (
            <div>{renderLayer2}</div>
          )}
        </div>
      </div>
    ));
    return (
      // 總共五層
      // 首層確定只有四個key
      // 在meaning這個key第二層是動態的，會列出詞性作為key
      // 不要從firestore上去做處理跟判斷，全部抓下來，再從local去分析
      <div
        className={styles.popupSearchContainer}
        // style={{ display: this.props.isVisible }}
      >
        {renderLayer1}
        {/* <p>{this.props.resDetails.meaning.noun[0].definition}</p> */}
      </div>
    );
  }

  showWordMeaning() {
    return (
      <div
        className={styles.popupSearchContainer}
        // style={{ display: this.props.isVisible }}
      >
        <span className={styles.popupSearchWord}>
          {this.props.highlightText}
        </span>
        <p>{this.props.resDetails.meaning.noun[0].definition}</p>
      </div>
    );
  }

  showPhraseMeaning() {
    return (
      <div
        className={styles.popupSearchContainer}
        // style={{ display: this.props.isVisible }}
      >
        <p>{this.props.resDetails}</p>
      </div>
    );
  }

  render() {
    console.log("showContent=", this.props.resDetails);
    if (this.props.showContent === "word") {
      // 之後再改成showWordMeaning();
      return this.showWordDetails();
    }
    if (this.props.showContent === "phrase") {
      return this.showPhraseMeaning();
    }
  }
}

function mapStateToProps(state) {
  return {
    userUID: state.userUID
  };
}

export default connect(mapStateToProps)(PopupSearch);
