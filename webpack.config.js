'use strict';

const NODE_ENV = process.env.NODE_ENV || 'development';
console.log(NODE_ENV);
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  // context: path.join(__dirname, 'app'),

  entry: './app/js/main',
  output: {
    path: __dirname + '/dist/',
    filename: '[name].js',
    library: '[name]'
  },

  watch: 'development' === NODE_ENV,

  watchOptions: {
    aggregateTimeout: 100
  },

  devtool: 'development' === NODE_ENV ? 'inline-source-map' : null,

  plugins: [
    new webpack.NoErrorsPlugin,
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV)
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      minChunk: 3
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      Materialize: 'materialize-css'
    }),
    new CopyWebpackPlugin([
      {
        from: 'public'
      }
    ])
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
      exclude: /\/node_modules\//,
      loader: 'babel?presets[]=es2015'
    },
    {
      test: /\.html$/,
      loader: 'html'
    }],

    noParse: /\/node_modules\/(bootstrap|jquery)/
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
