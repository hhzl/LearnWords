'use strict';

const NODE_ENV = process.env.NODE_ENV || 'development';
console.log(NODE_ENV);
const webpack = require('webpack');

module.exports = {
  entry: './app/main',
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
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV)
    })
  ],

  resolve: {
    modulesDirectories: ['node_modules'],
    extentions: ['', 'js']
  },

  resolveLoader: {
    modulesDirectories: ['node_modules'],
    moduleTemplates: ['*-loader'],
    extentions: ['', 'js']
  },

  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel?presets[]=es2015'
    }]
  }
};

if ('production' === NODE_ENV) {
  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true,
        unsafe: true
      }
    })
  );
}
