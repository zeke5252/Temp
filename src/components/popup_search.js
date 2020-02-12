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
      let renderLayer2 = Object.keys(data.meaning).map((catogory, index) => {
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
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)"
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
