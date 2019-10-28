const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";
console.log(isDev, process.env.NODE_ENV);

module.exports = {
  entry: {
    main: ["./src/index.ts"]
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      // rule for JS
      {
        test: /\.ts$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-typescript"]
            }
          }
        ]
      },
      // rule for CSS
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDev
            }
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              sourceMap: true
            }
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: true
            }
          }
        ]
      },
      // rule for sass
      {
        test: /\.s(a|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDev
            }
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 2,
              sourceMap: true
            }
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: true
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true
            }
          }
        ]
      },
      // rules for less
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDev
            }
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 2,
              sourceMap: true
            }
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: true
            }
          },
          {
            loader: "less-loader",
            options: {
              sourceMap: true,
              javascriptEnabled: true
            }
          }
        ]
      },
      // rule for files
      {
        test: /\.(woff|woff2|eot|ttf|otf|png|jpg|gif)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: `[name]-[hash:8].[ext]`,
              outputPath: "assets/",
              publicPath: "assets/"
            }
          }
        ],
        issuer: location => /\.(sa|sc|c|le)ss$/.test(location)
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|png|jpg|gif)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: `[name]-[hash:8].[ext]`,
              outputPath: "assets/",
              publicPath: undefined
            }
          }
        ],
        issuer: location => !/\.(sa|sc|c|le)ss$/.test(location)
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `[name].css`,
      ignoreOrder: false,
      publicPath: ""
    }),
    new ForkTsCheckerWebpackPlugin({
      tslint: undefined,
      async: isDev,
      silent: false,
      formatter: "codeframe",
      useTypescriptIncrementalApi: true,
      checkSyntacticErrors: true,
      formatterOptions: {
        highlightCode: true
      }
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000
  },
  mode: isDev ? "development" : "production",
  devtool: "source-map"
};
