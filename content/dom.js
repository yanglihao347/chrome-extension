import { apiAccepter } from "./App.js";
// import request from "./request.js";

const sideDiv = document.createElement("div"); // 侧边栏容器
let addBtn = null;
let dragbox = null;
// 插入根节点div
const createSideBar = () => {
  sideDiv.id = "sideDiv";
  sideDiv.className = "out";
  // sideDiv.addEventListener("DOMNodeRemoved", (e) => {
  //   // console.log("from domremoved...", e.target);
  //   if (e.target.id === "sideDiv") {
  //     window.location.reload();
  //   }
  // });
  document.body.appendChild(sideDiv);
};

const isDragable = (e) => {
  // ** 逻辑易混淆
  // 该方法判断 是否是(原本不可拖拽但需可拖拽的元素)
  if (e.target.tagName === "A" || e.target.tagName === "IMG") {
    return false;
  }
  let aNo = 0;
  for (let i = 0; i < e.path.length; i++) {
    if (
      e.path[i].tagName === "A" &&
      e.path[i].getAttribute("myattr") !== "no-drag"
    ) {
      aNo = i;
      break;
    }
  }
  if (!aNo) {
    return false;
  }
  let flag = false;
  for (let i = 0; i < aNo; i++) {
    const dis = window.getComputedStyle(e.path[i]).display;
    console.log(dis, "from isDragable ing ...");
    switch (dis) {
      case "inline":
      case "inline-block":
      case "inline-table":
      case "table-cell":
      case "table-row":
        break;
      default:
        flag = true;
        break;
    }
    if (flag) break;
  }
  return flag;
};

// const showAddBtn = (selectionText) => {
//   if (addBtn) {
//     sideDiv.removeChild(addBtn);
//     addBtn = null;
//   }
//   addBtn = document.createElement("div");
//   addBtn.id = "addBtn";
//   addBtn.innerText = "点此添加到文档";
//   addBtn.onclick = () => {
//     console.log("from addbtnclick", selectionText);
//     apiAccepter.addToDoc({ type: "text", selectionText });
//     sideDiv.removeChild(addBtn);
//     addBtn = null;
//   };
//   addBtn.onmouseup = (e) => {
//     e.stopPropagation();
//   };
//   sideDiv.appendChild(addBtn);
// };

// 定义事件处理方法
const handleMouseDown = (e) => {
  // e.stopPropagation();
  if (!isDragable(e)) {
    return;
  }
  let tag = null;
  for (let i = 0; i < e.path.length; i++) {
    if (e.path[i].tagName === "A") {
      tag = e.path[i];
      break;
    }
  }
  window.dragInfo = {
    type: "link",
    href: tag.href,
    selectionText: e.target.innerText,
  };
  dragbox = document.createElement("div");
  dragbox.id = "dragbox";
  dragbox.innerHTML = `${e.target.innerText}<br />${tag.href}`;
  document.body.appendChild(dragbox);
};

const handleMouseMove = (e) => {
  if (!dragbox) {
    return;
  }
  dragbox.style.top = e.pageY + "px";
  dragbox.style.left = e.pageX + "px";
};

const handleMouseUp = (e) => {
  // const selectionText = window.getSelection().toString();
  // if (selectionText) {
  //   showAddBtn(selectionText);
  // } else if (addBtn) {
  //   sideDiv.removeChild(addBtn);
  //   addBtn = null;
  // }

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
  e.preventDefault();
  if (e.target.tagName === "A") {
    // let childElement = null;
    // for (let i = 0; i < e.target.children.length; i++) {
    //   if (e.target.children[i].tagName === "IMG") {
    //     childElement = {
    //       type: "image",
    //       src: e.target.children[i].currentSrc,
    //       selectionText: "图片",
    //     };
    //     break;
    //   } else if (e.target.children[i].tagName === "SVG") {
    //     childElement = {
    //       type: "svg",
    //       src: e.target.children[i].currentSrc,
    //       selectionText: "图片",
    //     };
    //     break;
    //   }
    // }
    window.dragInfo = {
      type: "link",
      href: e.target.href,
      selectionText: e.target.innerText,
      // childElement,
    };
  }
  // else {
  //   window.dragInfo = {
  //     type: "image",
  //     src: e.target.currentSrc,
  //     selectionText: "图片",
  //   };
  // }

  if (dragbox) {
    return;
  }
  dragbox = document.createElement("div");
  dragbox.id = "dragbox";
  dragbox.innerHTML = `${e.target.innerText}<br />${e.target.href}`;
  document.body.appendChild(dragbox);
};

document.addEventListener("mousedown", handleMouseDown);
document.addEventListener("mousemove", handleMouseMove);
document.addEventListener("mouseup", handleMouseUp);
sideDiv.addEventListener("mouseup", sideMouseUp);
document.addEventListener("dragend", handleDragEnd);
document.addEventListener("dragstart", handleDragStart);

createSideBar();
