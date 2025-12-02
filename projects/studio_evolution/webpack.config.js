const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode:'development',
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: '/',
  },
  devtool: 'source-map',
  devServer: {
    static: [
      {
        directory: path.join(__dirname),
        staticOptions: {
          index: 'index.html',
        },
      },
      {
        directory: path.resolve(__dirname, 'dist'),
      }
    ],
    open: true,
    devMiddleware: {
      publicPath: '/',
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
        ],
      }, 
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]'
        }
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({ 
      filename: 'bundle.css',
    }),
    new CopyPlugin({
      patterns: [
        { from: "src/fonts", to: "fonts" },
      ],
    }),
  ],
};