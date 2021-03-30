// let color = "#3aa757";

// chrome.runtime.onInstalled.addListener(() => {
//   chrome.storage.sync.set({ color });
//   console.log("Default background color set to %cgreen", `color: ${color}`);
// });

// chrome.runtime.onInstalled.addListener(function () {

// });

chrome.contextMenus.create(
  {
    type: "normal",
    title: "添加进文档",
    contexts: ["all"],
    // id: "123",
    onclick: (info) => {
      console.log(info);
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, info, function (response) {
          console.log(response);
        });
      });
    },
  },
  () => {}
);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message);
  sendResponse("nihao");
});
