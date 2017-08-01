const path = require('path');
const webpack = require('webpack');
module.exports = {
  context: path.resolve(__dirname, './src'),
  entry: {
    editor: './editor/index.js',
    basic3d: './basic3d.js',
    wren2d: './wren2d.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './dist/js/'),
    publicPath: '/js/'
  },
  devServer: {
    contentBase: path.resolve(__dirname, './public')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader',
          options: { presets: ['es2015'] },
        }]
      }
    ]
  }
}
