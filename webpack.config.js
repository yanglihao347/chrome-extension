const path = require("path");

module.exports = {
  entry: {
    content: "./content/App.js",
    background: "./background/index.js",
  },
  output: {
    path: path.resolve(__dirname, "js"),
    filename: "[name].js",
  },
  module: {
    rules: [
      { test: /\.js|jsx$/, use: "babel-loader" },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: { localIdentName: "[local]__[hash:base64:5]" },
            },
          },
        ],
      },
    ],
  },
};
