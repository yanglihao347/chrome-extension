import axios from "axios";
import $ from "jquery";

const getStorage = (key) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(key, (data) => {
      if (data[key]) {
        resolve(data[key]);
      } else {
        resolve(null);
      }
    });
  });
};

const setStorage = (key, value) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ [key]: value }, () => {
      resolve("set storage success!");
    });
  });
};

const parseHtml = (htmlStr, url) => {
  const htmlDom = $.parseHTML(htmlStr);
  let title = "";
  let keywords = "";
  let description = "";
  for (let i = 0; i < htmlDom.length; i++) {
    if (htmlDom[i].tagName === "TITLE") {
      console.log("from title...", htmlDom[i]);
      title = htmlDom[i].innerText;
      console.log(htmlDom[i].innerHTML, htmlDom[i].innerText);
    }
    // if (htmlDom[i].tagName === "META" && htmlDom[i].name === "keywords") {
    //   console.log("from keywords...", htmlDom[i]);
    //   keywords = htmlDom[i].content;
    // }
    // if (
    //   htmlDom[i].tagName === "META" &&
    //   htmlDom[i].description === "keywords"
    // ) {
    //   console.log("from desc...", htmlDom[i]);
    //   description = htmlDom[i].content;
    // }
  }
  return {
    title,
    keywords,
    description,
    url,
  };
};

const yuque = {
  get: async (url, params = {}) => {
    const token = await getStorage("token");
    if (!token) {
      console.log("token error...", url, params);
      throw "请先设置用户token。";
    }
    const result = await axios
      .get(`https://www.yuque.com/api/v2${url}`, {
        params,
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": token,
        },
      })
      .catch((err) => {
        console.log("from http.get catch ...", err);
        throw "token有误或token权限不足，请检查token及权限。";
      });
    if (result) {
      // 返回值 result.data 格式为 { data: {} }
      return result.data;
    }
    return null;
  },
  post: async (url, params = {}) => {
    const token = await getStorage("token");
    if (!token) {
      throw "请先设置用户token。";
    }
    const result = await axios
      .post(`https://www.yuque.com/api/v2${url}`, params, {
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": token,
        },
      })
      .catch((err) => {
        console.log("from http.get catch ...", err);
        throw "token有误或token权限不足，请检查token及权限。";
      });
    if (result.status === 200) {
      // 返回值 result.data 格式为 { data: {} }
      return result.data;
    }
    return null;
  },
  put: async (url, params = {}) => {
    const token = await getStorage("token");
    if (!token) {
      throw "请先设置用户token。";
    }
    const result = await axios
      .put(`https://www.yuque.com/api/v2${url}`, params, {
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": token,
        },
      })
      .catch((err) => {
        console.log("from http.get catch ...", err);
        throw "token有误或token权限不足，请检查token及权限。";
      });
    if (result.status === 200) {
      // 返回值 result.data 格式为 { data: {} }
      return result.data;
    }
    return null;
  },
  delete: async (url) => {
    const token = await getStorage("token");
    if (!token) {
      throw "请先设置用户token。";
    }
    const result = await axios
      .delete(`https://www.yuque.com/api/v2${url}`, {
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": token,
        },
      })
      .catch((err) => {
        console.log("from http.get catch ...", err);
        throw "token有误或token权限不足，请检查token及权限。";
      });
    if (result.status === 200) {
      // 返回值 result.data 格式为 { data: {} }
      return result.data;
    }
    return null;
  },
};

export default { yuque, parseHtml, getStorage, setStorage };
