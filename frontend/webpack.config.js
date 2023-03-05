const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const srcFolder = path.resolve(__dirname, 'src');
const buildFolder = path.resolve(__dirname, 'build');

let mode = 'development';
if (process.env.NODE_ENV === 'production') {
  mode = 'production';
}

module.exports = {
  mode,
  entry: path.join(srcFolder, 'app.js'),
  output: {
    path: buildFolder,
    filename: 'script/[name].[contenthash].js',
    assetModuleFilename: 'assets/[hash][ext][query]',
    clean: true
  },
  devtool: 'source-map',
  devServer: {
    port: process.env.PORT || 9000,
    watchFiles: srcFolder
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(srcFolder, 'pages/index.pug')
    }),
    new MiniCssExtractPlugin({
      filename: './style/index.[contenthash].css'
    }),
    new CopyWebpackPlugin({
      patterns: [{
        from: path.join(srcFolder, 'fonts'),
        to: 'fonts/'
      }]
    })
  ],
  module: {
    rules: [
      {
        test: /\.(html)$/i,
        loader: 'html-loader'
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          pretty: true
        }
      },
      {
        test: /\.(js|jsx|tsx|ts)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(pcss|css)$/i,
        use: [
          mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              url: false
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                config: path.resolve(__dirname, 'postcss.config.js')
              }
            }
          }
        ]
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i
      })
    ]
  }
};
