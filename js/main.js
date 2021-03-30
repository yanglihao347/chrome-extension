import { createSideBar, addList } from "./dom.js";
createSideBar();

const sideDiv = document.getElementById("sideDiv");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message);
  addList(message);
  sendResponse("woshi");
});

document.onmouseup = (e) => {
  let selectionText = window.getSelection().toString();
  if (selectionText) {
  }
};

const handleMouseDown = (e) => {
  let selectionText = window.getSelection().toString();
  console.log(e, window.getSelection());
  const flag = window.getSelection().containsNode(e.target, false);
  console.log(flag);
  if (selectionText) {
    e.preventDefault();
    // addList({ selectionText });
  }
};

document.addEventListener("mousedown", handleMouseDown);
sideDiv.addEventListener("mouseup", () => {
  let selectionText = window.getSelection().toString();
  if (selectionText) {
    addList({ selectionText });
  }
  window.getSelection().removeAllRanges();
});
