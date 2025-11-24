const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const rimraf = require("rimraf");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const SvgSpriteLoaderPlugin = require("svg-sprite-loader/plugin");
// const SvgBatchLoader = require("./svg-batch-loader");

module.exports = (env, argv) => {
  const isDev = argv.mode !== "production";
  // const isDev = false;
  const isOnline = !!env.online;
  console.log("env", isOnline, isDev ? "development" : "production", argv.mode);

  rimraf.sync(path.join(__dirname, "dist"));
  const config = {
    // mode: isDev ? 'development' : 'production',
    mode: "development",
    context: __dirname,
    entry: "./index.tsx",
    resolve: {
      extensions: [".ts", ".js", ".json", ".tsx"], // 修改解析扩展名的顺序
      fallback: {
        path: require.resolve("path-browserify"),
      },
      alias: {
        src: path.resolve(__dirname, "src"),
        "@styles": path.resolve(__dirname, "src/styles"),
      },
    },
    module: {
      rules: [
        {
          test: /\.(woff2?|eot|ttf|otf)$/,
          type: "asset/resource", // 会把字体单独打包成文件，并返回 URL
        },
        {
          test: /\.(frag|vert|glsl|obj)$/,
          use: "raw-loader",
        },
        {
          test: /\.js$/, // 匹配所有 .js 文件
          exclude: /node_modules/, // 排除 node_modules
          use: {
            loader: "babel-loader", // 使用 babel-loader,
            options: {
              presets: [
                "@babel/preset-env",
                ["@babel/preset-react", { runtime: "automatic" }],
              ],
            },
          },
        },
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: "babel-loader",
              options: {
                presets: [
                  "@babel/preset-env", // 转换现代 JS 到兼容版本
                  ["@babel/preset-react", { runtime: "automatic" }], // 支持 JSX
                ],
                // plugins: [
                //   "@lingui/babel-plugin-lingui-macro",
                //   isDev && require.resolve("react-refresh/babel"),
                // ].filter(Boolean),
              },
            },
            {
              loader: require.resolve("ts-loader"),
              options: {
                transpileOnly: true,
                onlyCompileBundledFiles: true,
                compilerOptions: {
                  declaration: false,
                  skipLibCheck: true,
                },
                configFile: path.resolve(__dirname, "tsconfig.json"),
              },
            },
          ],
        },

        {
          test: /\.(png|jpe?g|gif|mp4|webm|ogg|avi)$/i,
          type: "asset/resource", // ✅ 始终生成文件（不会转成 base64）
          generator: {
            filename: "assets/[name][hash][ext]", // ✅ 控制输出文件名和路径
          },
        },
        // {
        //   test: /svg\.ts$/i,
        //   loader: SvgBatchLoader,
        // },
        {
          test: /\.svg$/i,
          oneOf: [
            // 命中 ?icon 的 svg → sprite 模式
            {
              resourceQuery: /icon/,
              use: [
               "svg-sprite-loader",
                "svg-transform-loader",
                "svgo-loader",
              ],
            },
            // ?react → React 组件模式
            {
              resourceQuery: /react/,
              use: [
                {
                  loader: "@svgr/webpack",
                  options: {
                    icon: true,
                  },
                },
              ],
            },
            // 普通 svg → asset 模式
            {
              type: "asset",
              parser: {
                dataUrlCondition: {
                  maxSize: 10 * 1024, // 10 KB 以下转 base64
                },
              },
              generator: {
                filename: "assets/svg/[name][hash][ext]",
              },
            },
          ],
        },

        // {
        //   test: /\.svg$/i,
        //   resourceQuery: { not: [/icon/] },
        //   type: 'asset',
        //   parser: {
        //     dataUrlCondition: {
        //       maxSize: 10 * 1024, // 10 KB 以下内联为 Base64，超过输出为文件
        //     },
        //   },
        //   generator: {
        //     filename: 'assets/svg/[name][hash][ext]', // 输出路径
        //   },
        // },

        // {
        //   test: /\.svg$/i,
        //   resourceQuery: /icon/,
        //   use: [
        //     {
        //       loader: 'svg-sprite-loader',
        //       options: {
        //         symbolId: filePath => {
        //           const name = path.basename(filePath, '.svg');
        //           return `IconSVG-${name}`;
        //         },
        //         extract: false,
        //       },
        //     },
        //     'svg-transform-loader',
        //     'svgo-loader',
        //   ],
        // },
        {
          // .less / .css 文件不开启 css module
          test: /\.(le|c)ss$/,
          exclude: /\.module\.(le|c)ss$/, // 排除 css module 文件
          use: [
            {
              loader: isDev
                ? require.resolve("style-loader")
                : MiniCssExtractPlugin.loader,
            },
            {
              loader: require.resolve("css-loader"),
              options: {
                sourceMap: true,
                modules: false,
                esModule: true,
              },
            },
            {
              loader: require.resolve("less-loader"),
              options: {
                sourceMap: true,
                lessOptions: {
                  javascriptEnabled: true,
                  math: "always",
                  paths: [path.resolve(__dirname, "src/styles")],
                },
              },
            },
          ],
        },
        {
          // xxxx.module.less / .css 文件开启 css module
          test: /\.module\.(le|c)ss$/,
          use: [
            {
              loader: isDev
                ? require.resolve("style-loader")
                : MiniCssExtractPlugin.loader,
            },
            {
              loader: require.resolve("css-loader"),
              options: {
                sourceMap: true,
                modules: {
                  mode: "local",
                  localIdentName: "[local]_[hash:base64]",
                  localIdentHashDigestLength: 10,
                  namedExport: false,
                  exportGlobals: true,
                },
                esModule: true,
              },
            },
            {
              loader: require.resolve("less-loader"),
              options: {
                sourceMap: true,
                lessOptions: {
                  javascriptEnabled: true,
                  math: "always",
                },
              },
            },
          ],
        },
      ],
    },
    stats: {
      warningsFilter: /export .* was not found in/,
    },
    // optimization: {
    //   usedExports: true, // 启用 Tree Shaking
    // },
    optimization: {
      // chunkIds: 'named',
      splitChunks: isDev ? false : { chunks: "all" },
      // : {
      //     cacheGroups: {
      //       defaultVendors: {
      //         name: 'vendor',
      //         minSize: 0,
      //         minChunks: 1,
      //         test: /[\\/]node_modules[\\/]/,
      //         chunks: 'all',
      //         priority: 1000,
      //         reuseExistingChunk: true,
      //         enforce: true,
      //       },
      //       default: {
      //         name: 'main',
      //         minSize: 0,
      //         minChunks: 1,
      //         priority: -20,
      //         reuseExistingChunk: true,
      //         enforce: true,
      //         chunks: 'all',
      //       },
      //       // default: false,
      //       styles: {
      //         name: 'styles',
      //         test: /\.(c|le)ss$/,
      //         chunks: 'all',
      //         enforce: true,
      //       },
      //     },
      //   },
      // minimize: false,
      // minimizer: [
      //   new TerserPlugin({
      //     extractComments: false,
      //   }),
      // ],
    },

    devServer: {
      port: 8081,
      hot: true,
      historyApiFallback: true,
      open: true,
      client: {
        overlay: false,
      },
    },
    plugins: [
      !isDev &&
        new MiniCssExtractPlugin({
          filename: "[name].css",
        }),
      // isDev && new ReactRefreshWebpackPlugin(),
      new webpack.DefinePlugin({
        CONFIG: JSON.stringify({
          dev: isDev,
        }),
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "index.html"),
      }),
      // new FaviconsWebpackPlugin({
      //   logo: path.resolve(__dirname, 'src/assets/IMG/logo1.png'),
      //   mode: 'webapp',
      //   devMode: 'webapp',
      //   inject: true,
      // }),
      // 注入 env 环境变量
      new Dotenv({
        path: isOnline ? "./.env.prod" : "./.env",
        safe: false,
      }),
      // new ReactRefreshWebpackPlugin(),
      // new NodeModulesPlugin(),
    ],
    output: {
      publicPath: "/",
      path: path.resolve(__dirname, isOnline ? "online-dist" : "dist"),
      filename: "[name].js",
      assetModuleFilename: "assets/[name][ext]",
    },
  };

  if (isDev) {
    config.devtool = "source-map";
  }

  return config;
};
