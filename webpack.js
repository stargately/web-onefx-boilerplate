const path = require("path");
const webpack = require("webpack");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const glob = require("glob");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const process = require("global/process");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

const ANALYZE = false;
const PROD = process.env.NODE_ENV === "production";
const OUTPUT_DIR = "dist/";

module.exports = {
  mode: PROD ? "production" : "development",
  entry: glob.sync("./src/client/javascripts/*.ts*").reduce(
    (entries, entry) =>
      Object.assign(entries, {
        [entry
          .replace("./src/client/javascripts/", "")
          .replace(/(\.ts|\.tsx)$/, "")]: entry,
      }),
    {}
  ),
  output: {
    filename: PROD ? "[name]-[chunkhash].js" : "[name].js",
    path: path.resolve(__dirname, OUTPUT_DIR),
    publicPath: "",
  },
  ...(PROD ? {} : { devtool: "source-map" }),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    plugins: [new TsconfigPathsPlugin({ configFile: "tsconfig.json" })],
    // options for resolving module requests
    // (does not apply to resolving to loaders)
    modules: ["node_modules", path.resolve(__dirname, "src")],
    mainFields: ["browser", "main", "module"],
    // directories where to look for modules
    extensions: [".js", ".json", ".jsx", ".ts", ".tsx"],
    // extensions that are used
    alias: {},
    /* Alternative alias syntax (click to show) */
    /* Advanced resolve configuration (click to show) */
  },
  plugins: [
    new WebpackManifestPlugin({
      basePath: "/",
      fileName: "asset-manifest.json",
    }),
    ...(ANALYZE ? [new BundleAnalyzerPlugin()] : []),
    ...(PROD
      ? [
          new webpack.DefinePlugin({
            "process.env": {
              NODE_ENV: JSON.stringify("production"),
            },
          }),
        ]
      : []),
  ],
};
