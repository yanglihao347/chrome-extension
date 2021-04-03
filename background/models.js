import axios from "axios";
import utils from "./utils.js";

const { yuque, parseHtml, getStorage, setStorage } = utils;

const models = {
  getUser: (params) => {
    return yuque
      .get("/user", params)
      .then((res) => {
        console.log("from getUser model...", res);
        if (res && res.data) {
          // setStorage("user", res.data);
          return { ...res, success: true };
        }
      })
      .catch((e) => {
        console.log(e);
        return { success: false, msg: e };
      });
  },
  uploadDoc: async (params) => {
    const repo = await getStorage("repo"); // {label: '', value: ''}
    if (!repo) {
      return { success: false, msg: "请先选择知识库!" };
    }
    const result = await yuque
      .post(`/repos/${repo.value}/docs`, params)
      .catch((e) => {
        console.log(e);
        return { success: false, msg: e };
      });
    return { ...result, success: true };
  },
  getRepos: async (params) => {
    return yuque
      .get(`/users/${params.login}/repos`)
      .then((res) => {
        // console.log("from model...", res);
        if (res && res.data) {
          // setStorage("user", res.data);
          return { ...res, success: true };
        }
      })
      .catch((e) => {
        console.log(e);
        return { success: false, msg: e };
      });
  },
  getLink: async (url) => {
    let result = await axios.get(url).catch((e) => {
      console.log(e);
    });
    if (result && result.data.indexOf("</body>") === -1) {
      const Reg = /URL='.*?'/g;
      const matchArr = result.data.match(Reg);
      // 匹配到的字符串格式为 URL='*****',去掉头尾
      url = matchArr[0].slice(5, -1);

      result = await axios.get(url).catch((e) => {
        console.log(e);
      });
    }

    // 如果页面为gbk编码，重新用buffer格式请求一遍，进行转码，utf-8
    if (result && result.data.indexOf("charset=gbk") !== -1) {
      result = await axios
        .get(url, { responseType: "arraybuffer" })
        .catch((e) => {
          console.log(e);
        });
      var x = new Uint8Array(result.data);
      result.data = new TextDecoder("gbk").decode(x);
    }

    if (result) {
      return { success: true, data: parseHtml(result.data, url) };
    }
    return { success: true, data: { title: "该网页无法打开", url } };
  },
};

export default models;
