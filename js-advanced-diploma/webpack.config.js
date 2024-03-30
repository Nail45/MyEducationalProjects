/* eslint-disable no-undef */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');
const WriteFilePlugin = require('write-file-webpack-plugin');

module.exports = (env) => ({
  entry: './src/js/main.js',
  output: {
    path: path.resolve(process.cwd(), 'dist'),
    filename: 'main.[contenthash].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: 'defaults' }]],
          },
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.scss$/i,
        use: [
          // Creates `style` nodes from JS strings
          env.prod ? MiniCssExtractPlugin.loader : 'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
    ],
  },
  optimization: {
    minimizer: [
      '...',
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            // Lossless optimization with custom option
            // Feel free to experiment with options for better result for you
            plugins: [
              ['gifsicle', { interlaced: true }],
              ['jpegtran', { progressive: true }],
              ['optipng', { optimizationLevel: 5 }],
            ],
          },
        },
      }),
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Банк',
    }),
    new WorkboxPlugin.GenerateSW({
      // эти параметры побуждают ServiceWorkers быстро приступить к работе
      // и не позволяем торчать разбросанным ПО  "old"
      clientsClaim: true,
      skipWaiting: true,
      maximumFileSizeToCacheInBytes: 10485760,
    }),
    new MiniCssExtractPlugin({
      filename: 'main.[contenthash].css',
    }),
    new WebpackPwaManifest({
      name: 'Coin App',
      short_name: 'Coin App',
      theme_color: '#116acc',
      background_color: '#116acc',
      crossorigin: 'use-credentials', //can be null, use-credentials or anonymous
      icons: [
        {
          src: path.resolve('src/assets/images/Logo.svg'),
          sizes: [96, 128, 192, 256, 384, 512], // multiple sizes
        },
      ],
    }),
    new WriteFilePlugin(),
  ],
  devServer: {
    historyApiFallback: true,
    liveReload: false,
    hot: true,
    devMiddleware: {
      writeToDisk: true,
    },
  },
});
