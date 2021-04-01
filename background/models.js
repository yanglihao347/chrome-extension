import utils from "./utils.js";
const { http, getStorage, setStorage } = utils;

const models = {
  getUser: async (params) => {
    const user = await getStorage("user");
    if (user) {
      return user;
    }
    return http.get("/user", params).then((res) => {
      if (res.data) {
        setStorage("user", res.data);
        return res.data;
      }
    });
  },
  getDoc: () =>
    http.get(`/users/${login}/repos`, params).then((res) => {
      return res;
    }),
};

export default models;
