import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./dom.js";
import styles from "../css/content.css";
import axios from "axios";
import config from "./config.js";
// createSideBar();
const sideDiv = document.getElementById("sideDiv");
let apiAccepter;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      isEdit: false,
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
  renderCardList = () => {
    const { cardList } = this.state;
    return cardList.map((item, index) => {
      let innerHTML = "";
      if (item.type === "link") {
        if (item.childElement) {
        }
        innerHTML = (
          <a href={item.href} target="_blank">
            {item.childElement ? (
              <img src={item.childElement.src} width="100%" />
            ) : (
              item.selectionText
            )}
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
      return (
        <div className={styles["card-item"]}>
          {innerHTML}
          <div
            className={styles["delete-icon"]}
            onClick={() => {
              const { docList, cardList } = this.state;
              docList.splice(index, 1);
              cardList.splice(index, 1);
              this.setState({
                docList,
                cardList,
              });
            }}
          >
            <img
              width="20px"
              src={chrome.runtime.getURL("images/delete.png")}
            />
          </div>
        </div>
      );
    });
  };
  renderDocList = () => {
    const { docList } = this.state;
    return docList.map((doc) => {
      return <textarea className={styles["input-textarea"]}>{doc}</textarea>;
    });
  };
  render() {
    const { visible, isEdit } = this.state;
    if (visible) {
      sideDiv.className = "out";
    } else {
      sideDiv.className = "in";
    }
    return (
      <div className={styles["sidebar-container"]}>
        <div className={styles["utils-bar"]}>
          <div
            className={styles["operate-btn"]}
            onClick={() => {
              window.open("https://www.yuque.com/dashboard");
            }}
          >
            <img
              src={chrome.runtime.getURL("images/yuque.png")}
              className={styles["operate-img"]}
            />
          </div>
          <div
            className={styles["operate-btn"]}
            onClick={() => {
              this.setState({
                isEdit: !isEdit,
              });
            }}
          >
            <img
              src={chrome.runtime.getURL("images/edit.png")}
              className={styles["operate-img"]}
            />
          </div>
          <div
            className={styles["operate-btn"]}
            onClick={() => {
              this.setState({
                docList: [],
                cardList: [],
              });
            }}
          >
            <img
              src={chrome.runtime.getURL("images/delete.png")}
              className={styles["operate-img"]}
            />
          </div>
          <div
            onClick={() => {
              axios
                .get("https://www.yuque.com/api/v2/users/yanglihao347", {
                  headers: {
                    "Content-Type": "application/json",
                    "User-Agent": "chrome-extension-demo",
                    "X-Auth-Token": config.token,
                  },
                })
                .then((res) => {
                  console.log("from axios...", res);
                });
            }}
          >
            请求测试
          </div>
        </div>
        <div className={styles["main-bar"]}>
          <div className={styles["main-title"]}>Document</div>
          <div className={styles["main-container"]}>
            <div className={styles["list-wrap"]}>
              {isEdit ? this.renderDocList() : this.renderCardList()}
            </div>
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
