'use strict';

const NODE_ENV = process.env.NODE_ENV || 'development';
console.log(NODE_ENV);
const webpack = require('webpack');

module.exports = {
  entry: './app/js/main',
  output: {
    path: __dirname + '/app/js/',
    filename: 'bundle.js',
    library: 'bundle'
  },

  watch: 'development' === NODE_ENV,

  watchOptions: {
    aggregateTimeout: 100
  },

  devtool: 'development' === NODE_ENV ? 'source-map' : null,

  plugins: [
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV)
    })
  ],

  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel?presets[]=es2015'
    }]
  }
};
