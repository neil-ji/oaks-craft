import path from "path";
import { Configuration } from "webpack";
import { merge } from "webpack-merge";
import CopyWebpackPlugin from "copy-webpack-plugin";

const OAKS_MODEL = "oaks-model";

/** Common Configuration */
const injectModuleName = (moduleName: string): Configuration => {
  const mode =
    process.env.NODE_ENV === "production" ? "production" : "development";

  return {
    target: "node",
    entry: `./packages/${moduleName}/src/index.ts`,
    output: {
      path: path.resolve(__dirname, "dist", moduleName),
      filename: "index.js",
      clean: true,
    },
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
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: `packages/${moduleName}/package.json`,
            to: "package.json",
          },
        ],
      }),
    ],
  };
};

/** oaks-model */
const oaksModelConfig: Configuration = merge(injectModuleName(OAKS_MODEL), {
  externals: ["typeorm", "reflect-metadata"],
  externalsType: "commonjs",
  externalsPresets: {
    node: true,
  },
});

export default [oaksModelConfig];
