import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./dom.js";
import styles from "../css/content.css";
import request from "./request.js";

const sideDiv = document.getElementById("sideDiv");
let apiAccepter;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      isEdit: false,
      isSetting: false,
      docList: [],
      cardList: [],
      token: "",
    };
  }

  componentDidMount() {
    let { apiRef } = this.props;
    //return internal method
    apiRef({ addToDoc: this.addToDoc });

    request("getToken").then((token) => {
      this.setState({
        token,
      });
    });
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
  saveSettings = () => {
    request("setToken", this.state.token);
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
  renderUtilBar = () => {
    const { isEdit } = this.state;
    return (
      <div className={styles["utils-bar"]}>
        <div className={styles["icon-btn"]}>
          <img
            src={chrome.runtime.getURL("images/yuque.png")}
            className={styles["operate-img"]}
            onClick={() => {
              window.open("https://www.yuque.com/dashboard");
            }}
          />
        </div>
        <div className={styles["icon-btn"]}>
          <img
            src={chrome.runtime.getURL("images/edit.png")}
            className={styles["operate-img"]}
            onClick={() => {
              this.setState({
                isEdit: !isEdit,
              });
            }}
          />
        </div>
        <div className={styles["icon-btn"]}>
          <img
            src={chrome.runtime.getURL("images/delete.png")}
            className={styles["operate-img"]}
            onClick={() => {
              this.setState({
                docList: [],
                cardList: [],
              });
            }}
          />
        </div>
        <div className={styles["icon-btn"]}>
          <img
            src={chrome.runtime.getURL("images/setting.png")}
            className={styles["operate-img"]}
            onClick={() => {
              const { isSetting } = this.state;
              this.setState({
                isSetting: !isSetting,
              });
            }}
          />
        </div>
        <div
          onClick={() => {
            request("getUser").then((res) => {
              console.log("from content.js ...", res);
            });
          }}
        >
          请求测试
        </div>
      </div>
    );
  };
  renderArrow = () => {
    const { visible } = this.state;
    return (
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
    );
  };
  renderSetting = () => {
    return (
      <div className={styles["setting-wrap"]}>
        <div className={styles["settings-operate"]}>
          <div
            className={styles["operate-btn"]}
            onClick={() => {
              this.setState({
                isSetting: false,
              });
            }}
          >
            返回
          </div>
          <div
            className={styles["operate-btn"]}
            onClick={() => {
              this.saveSettings();
            }}
          >
            保存
          </div>
        </div>
        <div className={styles["setting-item"]}>
          <div className={styles["setting-title"]}>用户token：</div>
          <div className={styles["setting-content"]}>
            <input
              value={this.state.token}
              className={styles["setting-input"]}
              type="text"
              onChange={(e) => {
                this.setState({
                  token: e.target.value,
                });
              }}
            />
          </div>
        </div>
      </div>
    );
  };
  render() {
    const { visible, isEdit, isSetting } = this.state;
    if (visible) {
      sideDiv.className = "out";
    } else {
      sideDiv.className = "in";
    }
    return (
      <div className={styles["sidebar-container"]}>
        {this.renderUtilBar()}
        <div className={styles["main-bar"]}>
          <div className={styles["main-title"]}>Document</div>
          <div className={styles["main-container"]}>
            {isSetting ? (
              this.renderSetting()
            ) : (
              <div className={styles["list-wrap"]}>
                {isEdit ? this.renderDocList() : this.renderCardList()}
              </div>
            )}
          </div>
        </div>
        {this.renderArrow()}
        {/* {this.renderUserDialog()} */}
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

// 组件内方法给外部js文件调用
export { apiAccepter };
