const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const { merge } = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const baseConfig = {
  entry: path.resolve(__dirname, './src/index.ts'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js'
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/i,
        use: [
          MiniCSSExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      },
      { 
        test: /\.ts$/i,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|svg|webp)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(?:mp3|wav|ogg|mp4)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html'),
      filename: 'index.html',
      favicon: path.resolve(__dirname, './src/assets/favicon.ico'),
    }),
    new CleanWebpackPlugin(),
    new MiniCSSExtractPlugin({
      filename: 'styles.[contenthash].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './src/assets/images/developers',
          to: '../dist/assets/images/developers'
        },
        {
          from: './src/assets/images/waves',
          to: '../dist/assets/images/waves'
        },
        {
          from: './src/assets/images/main',
          to: '../dist/assets/images/main'
        }
        ,
        {
          from: './src/assets/icons/rs_school_js.svg',
          to: '../dist/assets/icons/rs_school_js.svg'
        }
      ]
    }),
  ]
}

module.exports = (env, options) => {
  const isDevMode = options.mode === 'development';
  const envCfg = isDevMode ? require('./webpack.dev.config') : require('./webpack.prod.config');
  return merge(baseConfig, envCfg);
}
