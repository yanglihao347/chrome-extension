const request = (apiName, params = {}) => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        type: "request",
        api: apiName,
        params,
      },
      (response) => {
        // console.log("from request.js...", response);
        resolve(response);
      }
    );
  });
};

export default request;
