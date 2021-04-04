import React, { Component } from "react";
import ReactDOM from "react-dom";
import Select from "react-select";
import { RadioGroup, Radio } from "react-radio-group";
import toast, { Toaster } from "react-hot-toast";
import "./dom.js";
import styles from "../css/content.css";
import request from "./request.js";

const sideDiv = document.getElementById("sideDiv");
let apiAccepter;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      isEdit: false,
      isSetting: false,
      docList: [],
      cardList: [],
      token: "",
      user: {},
      repos: null,
      repo: "",
      publicType: "0",
    };
  }

  componentDidMount() {
    let { apiRef } = this.props;
    // 给外部调用组件内方法
    apiRef({ addToDoc: this.addToDoc });

    const _this = this;
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "visible") {
        console.log("from visible...");
        _this.getInitValue();
      } else {
        console.log("from hidden...");
      }
    });

    this.getInitValue();
  }
  getInitValue = () => {
    request.getStorage('visible').then(visible => {
      this.setState({
        visible
      })
    })
    request.getStorage("repo").then((repo) => {
      if (repo) {
        this.setState({
          repo,
        });
      }
    });
    request.getStorage("publicType").then((publicType) => {
      if (publicType === "0" || publicType === "1") {
        this.setState({
          publicType,
        });
      } else {
        this.setState({
          publicType: "0",
        });
      }
    });
    request.getStorage("doc").then((doc) => {
      if (doc) {
        this.setState({
          docList: doc.docList,
          cardList: doc.cardList,
        });
      }
    });
    request.getStorage("token").then((token) => {
      if (token) {
        this.setState({
          token,
        });
        request.http("getUser").then((user) => {
          this.setState({
            user,
          });
          request
            .http("getRepos", {
              login: user.login,
            })
            .then((repos) => {
              if (repos) {
                this.setState({
                  repos: repos.map((repo) => {
                    return {
                      value: repo.namespace,
                      label: repo.name,
                    };
                  }),
                });
              }
            });
        });
      }
    });
  };
  addToDoc = (info) => {
    const { docList, cardList } = this.state;
    console.log(info, docList, cardList);
    const index = cardList.length;
    cardList.push({ type: "loading" });
    this.setState(
      {
        cardList,
      },
      () => {
        request.http("getLink", info.href).then((res = {}) => {
          cardList[index] = Object.assign(info, { content: res });
          const doc = `标题：[${res.title}](${res.url})\n链接：[${res.url}](${res.url})\n\n`;
          docList.push(doc);
          this.setState({
            cardList,
            docList,
          });
          request.setStorage("doc", { docList, cardList }).then((res) => {
            console.log(res);
          });
        });
      }
    );
  };
  saveSettings = () => {
    request.setStorage("token", this.state.token);
    // request.setStorage("repo", this.state.repo);
  };
  renderCardList = () => {
    const { cardList } = this.state;
    return cardList.map((item, index) => {
      let innerHTML = "";
      if (item.type === "link") {
        const { title, keywords, description, url } = item.content;
        innerHTML = (
          <a
            className={styles["link-wrap"]}
            myattr="no-drag"
            href={url}
            target="_blank"
          >
            <div className={styles["link-title"]}>{title}</div>
            <div className={styles["link-description"]}>{url}</div>
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
      } else if (item.type === "loading") {
        innerHTML = (
          <div className={styles["loading-card"]}>
            <img
              width="30px"
              src={chrome.runtime.getURL("images/loading.png")}
            />
          </div>
        );
      }
      return (
        <div className={styles["card-item"]}>
          {innerHTML}
          <div
            className={styles["close-icon"]}
            onClick={() => {
              const { docList, cardList } = this.state;
              docList.splice(index, 1);
              cardList.splice(index, 1);
              this.setState({
                docList,
                cardList,
              });
              request.setStorage('doc', { docList, cardList });
            }}
          >
            <img width="12px" src={chrome.runtime.getURL("images/close.png")} />
          </div>
        </div>
      );
    });
  };
  // renderDocList = () => {
  //   const { docList } = this.state;
  //   return docList.map((doc, index) => {
  //     return (
  //       <textarea
  //         onChange={(e) => {}}
  //         onBlur={(e) => {
  //           console.log(e.target.value);
  //           const { docList, cardList } = this.state;
  //           docList[index] = e.target.value;
  //           cardList[index] = this.setState({
  //             docList,
  //             cardList: [],
  //           });
  //         }}
  //         className={styles["input-textarea"]}
  //       >
  //         {doc}
  //       </textarea>
  //     );
  //   });
  // };
  renderUtilBar = () => {
    const { isEdit, publicType } = this.state;
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
        {/* <div className={styles["icon-btn"]}>
          <img
            src={chrome.runtime.getURL("images/edit.png")}
            className={styles["operate-img"]}
            onClick={() => {
              this.setState({
                isEdit: !isEdit,
              });
            }}
          />
        </div> */}
        <div className={styles["icon-btn"]}>
          <img
            src={chrome.runtime.getURL("images/clear.png")}
            className={styles["operate-img"]}
            onClick={() => {
              this.setState({
                docList: [],
                cardList: [],
              });
              request
                .setStorage("doc", { docList: [], cardList: [] })
                .then(() => {
                  toast.success("删除成功");
                });
            }}
          />
        </div>
        <div className={styles["icon-btn"]}>
          <img
            src={chrome.runtime.getURL("images/upload.png")}
            className={styles["operate-img"]}
            onClick={() => {
              const { docList } = this.state;
              if (!docList.length) {
                toast.error("请先创建文档");
                return;
              }
              request
                .http("uploadDoc", {
                  title: "速记",
                  // slug: "sexrq2", // 可不传，将自动生成随机slug,
                  public: publicType,
                  format: "markdown",
                  body: docList.join(""),
                })
                .then((res) => {
                  if (res) {
                    toast.success("上传成功");
                  }
                  console.log("from upload callback...", res);
                  this.setState({
                    docList: [],
                    cardList: [],
                  });
                  request.setStorage("doc", { docList: [], cardList: [] });
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
        {/* <div onClick={(e) => {}}>请求测试</div> */}
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
          request.setStorage('visible', !visible).then(res => {
            console.log(res);
          })
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
    const { repos, repo, publicType } = this.state;
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
          {/* <div
            className={styles["operate-btn"]}
            onClick={() => {
              this.saveSettings();
            }}
          >
            保存
          </div> */}
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
              onBlur={(e) => {
                if (e.target.value) {
                  request.setStorage("token", e.target.value).then(() => {
                    toast.success("设置用户token成功");
                    request.http("getUser").then((user) => {
                      this.setState({
                        user,
                      });
                      request
                        .http("getRepos", {
                          login: user.login,
                        })
                        .then((repos) => {
                          if (repos) {
                            this.setState({
                              repos: repos.map((repo) => {
                                return {
                                  value: repo.namespace,
                                  label: repo.name,
                                };
                              }),
                            });
                          }
                        });
                    });
                  });
                } else {
                  toast.error("token不能为空");
                }
              }}
            />
          </div>
        </div>
        <div className={styles["setting-item"]}>
          <div className={styles["setting-title"]}>选择知识库：</div>
          <div className={styles["setting-content"]}>
            <Select
              className={styles["select-input"]}
              value={repo}
              options={repos || []}
              onChange={(value) => {
                console.log("from onchange...", value);
                this.setState({
                  repo: value,
                });
                request.setStorage("repo", value).then((res) => {
                  console.log("set repo success...");
                });
              }}
            />
          </div>
        </div>
        <div className={styles["setting-item"]}>
          <div className={styles["setting-title"]}>上传文档公开类型：</div>
          <div className={styles["setting-content"]}>
            <RadioGroup
              className={styles["radio-group"]}
              name="publicType"
              selectedValue={publicType}
              onChange={(value) => {
                this.setState({
                  publicType: value,
                });
                request.setStorage("publicType", value);
              }}
            >
              <label className={styles["radio-label"]}>
                <Radio value="0" />
                私密
              </label>
              <label className={styles["radio-label"]}>
                <Radio value="1" />
                公开
              </label>
            </RadioGroup>
          </div>
        </div>
      </div>
    );
  };
  render() {
    const { visible, isEdit, cardList, isSetting } = this.state;
    if (visible) {
      sideDiv.className = "out";
    } else {
      sideDiv.className = "in";
    }
    return (
      <div className={styles["sidebar-container"]}>
        {this.renderUtilBar()}
        <div className={styles["main-bar"]}>
          <div className={styles["main-title"]}>速记</div>
          <div className={styles["main-container"]}>
            {isSetting ? (
              this.renderSetting()
            ) : (
              <div className={styles["list-wrap"]}>
                {/* {isEdit ? this.renderDocList() : this.renderCardList()} */}
                {cardList.length ? (
                  this.renderCardList()
                ) : (
                  <div className={styles["empty-tips"]}>
                    拖拽链接至此处
                    <br />
                    创建新文档
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {this.renderArrow()}
        <Toaster />
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

// 解决百度等页面重新渲染导致根节点被移除的问题
sideDiv.addEventListener("DOMNodeRemoved", (e) => {
  console.log("from domremoved...", e.target);
  if (e.target.id === "sideDiv") {
    const styleTags = document.getElementsByTagName('style');
    let contentStyle = null;
    for(let i = 0; i < styleTags.length; i ++) {
      if(styleTags[i].innerHTML.indexOf('#content-flag-tag-sideDiv') !== -1) {
        contentStyle = styleTags[i];
        break;
      }
    }
    setTimeout(() => {
      document.head.appendChild(contentStyle);
      document.body.appendChild(e.target);
    }, 200);
  }
});

// 组件内方法给外部js文件调用
export { apiAccepter };
