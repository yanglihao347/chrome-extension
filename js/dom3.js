import config from "./config.js";

const sideDiv = document.createElement("div"); // 侧边栏容器
const arrowIcon = document.createElement("div"); // 收起/展开 箭头
const listDiv = document.createElement("div"); // 收起/展开 箭头

// 创建侧边栏
const createSideBar = () => {
  sideDiv.id = "sideDiv";
  arrowIcon.id = "arrowIcon";
  listDiv.id = "listDiv";
  arrowIcon.onclick = () => {
    if (sideDiv.className.indexOf("in") !== -1) {
      sideDiv.className = "out";
      arrowIcon.innerHTML = `<svg t="1617081125550" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="879" width="128" height="128"><path d="M711.6 488.624L355.2 152.976a29.36 29.36 0 0 0-42.352 0 31.408 31.408 0 0 0 0 43.552L647.76 512 312.848 827.36a31.408 31.408 0 0 0 0 43.552 29.36 29.36 0 0 0 42.352 0l356.4-335.648a36.32 36.32 0 0 0 0-46.64z" p-id="880" fill="#ffffff"></path></svg>`;
    } else {
      sideDiv.className = "in";
      arrowIcon.innerHTML = `<svg t="1617080239982" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5668" width="128" height="128"><path d="M312.4 488.624L668.8 152.976a29.36 29.36 0 0 1 42.352 0 31.408 31.408 0 0 1 0 43.552L376.24 512l334.912 315.36a31.408 31.408 0 0 1 0 43.552 29.36 29.36 0 0 1-42.352 0L312.4 535.264a36.32 36.32 0 0 1 0-46.64z" p-id="5669" fill="#ffffff"></path></svg>`;
    }
  };

  // debug 默认展开
  if (config.debug) {
    sideDiv.className = "out";
    // arrowIcon.innerHTML = `<img src="images/left-arrow.png" />`;
    arrowIcon.innerHTML = `<svg t="1617081125550" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="879" width="128" height="128"><path d="M711.6 488.624L355.2 152.976a29.36 29.36 0 0 0-42.352 0 31.408 31.408 0 0 0 0 43.552L647.76 512 312.848 827.36a31.408 31.408 0 0 0 0 43.552 29.36 29.36 0 0 0 42.352 0l356.4-335.648a36.32 36.32 0 0 0 0-46.64z" p-id="880" fill="#ffffff"></path></svg>`;
  } else {
    sideDiv.className = "in";
    arrowIcon.innerHTML = `<svg t="1617080239982" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5668" width="128" height="128"><path d="M312.4 488.624L668.8 152.976a29.36 29.36 0 0 1 42.352 0 31.408 31.408 0 0 1 0 43.552L376.24 512l334.912 315.36a31.408 31.408 0 0 1 0 43.552 29.36 29.36 0 0 1-42.352 0L312.4 535.264a36.32 36.32 0 0 1 0-46.64z" p-id="5669" fill="#ffffff"></path></svg>`;
  }

  // 插入标签
  document.body.appendChild(sideDiv);
  sideDiv.appendChild(arrowIcon);
  sideDiv.appendChild(listDiv);

  // 添加测试通信按钮
  // const messageBtn = document.createElement("div");
  // messageBtn.id = "messageBtn";
  // messageBtn.innerText = "发送消息按钮";
  // messageBtn.onclick = () => {
  //   chrome.runtime.sendMessage(
  //     { msg: "你好，我是content-script呀，我主动发消息给后台！" },
  //     (response) => {
  //       console.log(response);
  //     }
  //   );
  // };
  // sideDiv.appendChild(messageBtn);
};

const addList = (info) => {
  // 创建列表项
  const listItem = document.createElement("div");
  listItem.id = `listItem-${listDiv.children.length + 1}`;
  listItem.className = "listItem";

  if (info.linkUrl) {
    listItem.innerHTML = `<a href="${info.linkUrl}" target="_blank">${info.selectionText}</a>`;
  } else if (info.selectionText) {
    listItem.innerText = info.selectionText;
  }
  listDiv.appendChild(listItem);
};

export { createSideBar, addList };
