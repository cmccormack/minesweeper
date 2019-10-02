/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const Visualizer = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = (env, { mode = "production" }) => {
  const isProd = mode === "production";
  const { local: isLocal = !isProd, visualize = false } = env || {};
  console.info(`[ webpack mode: ${mode} ]`);
  return {
    context: path.join(__dirname, "./"),
    entry: { app: "./src/index.tsx" },
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "dist"),
      publicPath: isLocal ? "./" : "/",
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: "ts-loader",
        },
        {
          enforce: "pre",
          test: /\.js$/,
          loader: "source-map-loader",
        },
        {
          test: /\.(png|ico|jpe?g|gif)$/i,
          use: [
            "file-loader?name=assets/images/[name].[ext]",
            "image-webpack-loader",
          ],
        },
        {
          test: /\.s?[ac]ss$/i,
          use: [
            isProd ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader",
            {
              loader: "sass-loader",
              options: {
                outputStyle: isProd ? "compressed" : "expanded",
                sourceComments: !isProd,
                sourceMap: !isProd,
              },
            },
          ],
        },
        {
          test: /\.(woff|woff2|eot|ttf|svg)$/i,
          loader: "file-loader?name=assets/fonts/[name].[ext]",
        },
      ],
    },
    devtool: "source-map",
    devServer: {
      contentBase: path.join(__dirname, "dist"),
      compress: true,
      open: true,
      port: 8000,
      quiet: true,
    },
    plugins: [
      new CleanWebpackPlugin({ verbose: true }),
      new CompressionPlugin(),
      new HtmlWebpackPlugin({
        inject: "body",
        template: "public/index.html",
      }),
      visualize && new Visualizer(),
    ].filter(Boolean),
  };
};
