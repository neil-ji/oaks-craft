import path from "path";
import { Configuration } from "webpack";

const mode =
  process.env.NODE_ENV === "production" ? "production" : "development";

/** Common Configuration */
const common: Configuration = {
  mode,
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
};

/** oaks-model */
const oaksModelConfig: Configuration = {
  ...common,
  entry: "./packages/oaks-model/src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist", "oaks-model"),
    filename: "index.js",
  },
};

export default [oaksModelConfig];
