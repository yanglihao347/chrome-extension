const path = require("path");

module.exports = {
  entry: "./content/App.js",
  output: {
    path: path.resolve(__dirname, "js"),
    filename: "content.js",
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
