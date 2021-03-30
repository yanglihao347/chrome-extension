import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./dom.js";
import styles from "../css/content.css";
// createSideBar();
const sideDiv = document.getElementById("sideDiv");
let apiAccepter;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      docList: [],
      cardList: [],
    };
  }

  componentDidMount() {
    let { apiRef } = this.props;
    //return internal method
    apiRef({ addToDoc: this.addToDoc });
  }
  addToDoc = (info) => {
    const { docList, cardList } = this.state;
    console.log(info, docList, cardList);
    if (info) {
      cardList.push(info);
      let doc = "";
      switch (info.type) {
        case "link":
          doc = `[${info.selectionText}](${info.href}) \n`;
          break;
        case "text":
          doc = `${info.selectionText} \n`;
          break;
        case "image":
          doc = `![${info.selectionText}](${info.src})`;
          break;
        default:
          break;
      }
      docList.push(doc);
    }
    this.setState({
      docList,
      cardList,
    });
  };
  render() {
    const { visible, cardList } = this.state;
    if (visible) {
      sideDiv.className = "out";
    } else {
      sideDiv.className = "in";
    }
    return (
      <div className={styles["sidebar-container"]}>
        <div className={styles["utils-bar"]}>
          <div
            className={styles["add-btn"]}
            onClick={() => {
              const selectionText = window.getSelection().toString();
              if (!selectionText) {
                return;
              } else {
                this.addToDoc({ type: "text", selectionText });
              }
            }}
          >
            <img
              src={chrome.runtime.getURL("images/add.png")}
              className={styles["add-img"]}
            />
          </div>
        </div>
        <div className={styles["main-bar"]}>
          <div className={styles["main-title"]}>Document</div>
          <div className={styles["list-container"]}>
            {cardList.map((item) => {
              let innerHTML = "";
              if (item.type === "link") {
                innerHTML = (
                  <a href={item.href} target="_blank">
                    {item.selectionText}
                  </a>
                );
              } else if (item.type === "image") {
                innerHTML = (
                  <img
                    width="100%"
                    src={item.src}
                    target="_blank"
                    alt={item.innerText}
                  />
                );
              } else if (item.type === "text") {
                innerHTML = item.selectionText;
              }
              return <div className={styles["card-item"]}>{innerHTML}</div>;
            })}
          </div>
        </div>

        <div
          id="arrowIcon"
          onClick={() => {
            this.setState({
              visible: !visible,
            });
          }}
        >
          <img
            src={chrome.runtime.getURL(
              visible ? "images/right-arrow.png" : "images/left-arrow.png"
            )}
            className={styles["arrow-img"]}
          />
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  React.createElement(App, {
    apiRef: (apiRef) => {
      apiAccepter = apiRef;
    },
  }),
  sideDiv
);

console.log(apiAccepter);

export { apiAccepter };
