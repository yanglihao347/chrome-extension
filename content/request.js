import toast from "react-hot-toast";
const http = (apiName, params = {}) => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        type: "request",
        api: apiName,
        params,
      },
      (response) => {
        console.log("from request.js...", apiName, response);
        if (response.success) {
          resolve(response.data);
        } else {
          toast.error(response.msg);
        }
      }
    );
  });
};

const getStorage = (key) => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        type: "getStorage",
        key,
      },
      (response) => {
        // console.log("from request.js...", response);
        resolve(response);
      }
    );
  });
};

const setStorage = (key, value) => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        type: "setStorage",
        key,
        value,
      },
      (response) => {
        // console.log("from request.js...", response);
        resolve(response);
      }
    );
  });
};

const request = {
  http,
  getStorage,
  setStorage,
};

export default request;
