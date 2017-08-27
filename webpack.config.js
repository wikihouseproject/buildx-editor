const path = require('path');
const webpack = require('webpack');
module.exports = {
  context: path.resolve(__dirname, './src'),
  entry: {
    editor: './editor/index.js',
    wrendebug: './wrendebug.js',
    svgnest: './svgnest.js'
  },
  output: {
    filename: '[name].bundle.js',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, './dist/js/'),
    publicPath: '/js/'
  },
  externals: {
    'noflo': 'commonjs: noflo',
    'noflo-runtime-postmessage': 'commonjs noflo-runtime-postmessage',
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
  },
  plugins: [
    new webpack.IgnorePlugin(/noflo/),
  ]
}
