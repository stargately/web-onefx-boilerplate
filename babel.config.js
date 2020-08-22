const path = require("path");

module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current"
        }
      }
    ],
    ["@babel/preset-react"],
    ["@babel/preset-typescript"]
  ],
  plugins: [
    [
      "module-resolver",
      {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        root: ["./src"],
        alias: {
          "@": path.resolve(__dirname, "src")
        }
      }
    ]
  ],
  ignore: [/node_modules\/(?!onefx)/g]
};
