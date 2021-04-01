import utils from "./utils.js";
const { http, getStorage, setStorage } = utils;

const models = {
  getUser: async (params) => {
    // todo: 如果数据不是最新的需要进行处理
    const user = await getStorage("user");
    if (user) {
      return user;
    }
    return http.get("/user", params).then((res) => {
      // console.log("from model...", res);
      if (res && res.data) {
        setStorage("user", res.data);
        return res.data;
      }
    });
  },
  getToken: async () => {
    const token = await getStorage("xAuthToken");
    if (token) {
      return token;
    }
    return "";
  },
  setToken: async (token) => {
    const result = await setStorage("xAuthToken", token);
    return result;
  },
};

export default models;
