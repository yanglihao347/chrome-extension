// import config from "./config.js";
import { apiAccepter } from "./App.js";

const sideDiv = document.createElement("div"); // 侧边栏容器
let dragbox = null;
// 插入根节点div
const createSideBar = () => {
  sideDiv.id = "sideDiv";
  sideDiv.className = "out";
  document.body.appendChild(sideDiv);
};

// 定义事件处理方法
const handleMouseDown = (e) => {
  // e.preventDefault();
  if (e.target.tagName === "A") {
    window.dragInfo = {
      href: e.target.href,
      innerText: e.target.innerText,
    };
  } else {
    let tag = null;
    for (let i = 0; i < e.path.length; i++) {
      if (e.path[i].tagName === "A") {
        tag = e.path[i];
        break;
      }
    }
    if (!!tag) {
      window.dragInfo = {
        href: tag.href,
        innerText: tag.innerText,
      };
    }
  }
  console.log(window.dragInfo);
  // let selectionText = window.getSelection().toString();
};

const handleMouseMove = (e) => {
  if (!dragbox) {
    return;
  }
  dragbox.style.top = e.pageY + "px";
  dragbox.style.left = e.pageX + "px";
};

const handleMouseUp = (e) => {
  console.log("from document...");
  if (!dragbox) {
    return;
  }
  document.body.removeChild(dragbox);
  dragbox = null;
  window.dragInfo = null;
};
const sideMouseUp = (e) => {
  if (window.dragInfo) {
    apiAccepter.addToDoc(window.dragInfo);
  }
};

const handleDragEnd = (e) => {
  e.preventDefault();
};
const handleDragStart = (e) => {
  console.log(e);
  console.log(e.target.currentSrc);
  e.preventDefault();
  if (e.target.tagName === "A") {
    window.dragInfo = {
      type: "link",
      href: e.target.href,
      selectionText: e.target.innerText,
    };
  } else {
    window.dragInfo = {
      type: "image",
      src: e.target.currentSrc,
      selectionText: "图片",
    };
  }

  dragbox = document.createElement("div");
  dragbox.id = "dragbox";
  dragbox.innerHTML = `${e.target.innerText}<br />${e.target.href}`;
  document.body.appendChild(dragbox);
};
const handleSelect = (e) => {
  console.log(e);
};
// document.addEventListener("mousedown", handleMouseDown);
document.addEventListener("mousemove", handleMouseMove);
document.addEventListener("mouseup", handleMouseUp);
sideDiv.addEventListener("mouseup", sideMouseUp);
document.addEventListener("dragend", handleDragEnd);
document.addEventListener("dragstart", handleDragStart);
document.addEventListener("select", handleSelect);

createSideBar();
