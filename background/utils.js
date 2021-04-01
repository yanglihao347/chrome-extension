import axios from "axios";

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

const http = {
  get: async (url, params = {}) => {
    const xAuthToken = await getStorage("xAuthToken");
    const result = await axios.get(`https://www.yuque.com/api/v2${url}`, {
      params,
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Token": xAuthToken,
      },
    });
    if (result.status === 200) {
      // 返回值 result.data 格式为 { data: {} }
      return result.data;
    }
    return null;
  },
  post: async (url, params = {}) => {
    const xAuthToken = await getStorage("xAuthToken");
    const result = await axios.post(
      `https://www.yuque.com/api/v2${url}`,
      params,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": xAuthToken,
        },
      }
    );
    if (result.status === 200) {
      // 返回值 result.data 格式为 { data: {} }
      return result.data;
    }
    return null;
  },
  put: async (url, params = {}) => {
    const xAuthToken = await getStorage("xAuthToken");
    const result = await axios.put(
      `https://www.yuque.com/api/v2${url}`,
      params,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": xAuthToken,
        },
      }
    );
    if (result.status === 200) {
      // 返回值 result.data 格式为 { data: {} }
      return result.data;
    }
    return null;
  },
  delete: async (url) => {
    const xAuthToken = await getStorage("xAuthToken");
    const result = await axios.delete(`https://www.yuque.com/api/v2${url}`, {
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Token": xAuthToken,
      },
    });
    if (result.status === 200) {
      // 返回值 result.data 格式为 { data: {} }
      return result.data;
    }
    return null;
  },
};

export default { http, getStorage, setStorage };
