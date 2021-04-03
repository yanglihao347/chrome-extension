// let color = "#3aa757";

// chrome.runtime.onInstalled.addListener(() => {
//   chrome.storage.sync.set({ color });
//   console.log("Default background color set to %cgreen", `color: ${color}`);
// });

import models from "./models.js";
import utils from "./utils.js";

const { getStorage, setStorage } = utils;

// chrome.contextMenus.create(
//   {
//     type: "normal",
//     title: "添加进文档",
//     contexts: ["all"],
//     onclick: (info) => {
//       console.log(info);
//       // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//       //   chrome.tabs.sendMessage(tabs[0].id, info, function (response) {
//       //     console.log(response);
//       //   });
//       // });
//     },
//   },
//   () => {}
// );

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "request") {
    models[message.api](message.params).then((res) => {
      sendResponse(res);
    });
  }
  if (message.type === "getStorage") {
    getStorage(message.key).then((res) => {
      sendResponse(res);
    });
  }
  if (message.type === "setStorage") {
    setStorage(message.key, message.value).then((res) => {
      sendResponse(res);
    });
  }
  return true;
});
