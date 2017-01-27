'use strict';

const NODE_ENV = process.env.NODE_ENV || 'development';
console.log(NODE_ENV);
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const rimraf = require('rimraf');

module.exports = {
  context: __dirname + '/app',
  // context: __dirname + '/app/js',
  entry: __dirname + '/app/js/main',
  // entry: './main',
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: '[name].[chunkhash].js',
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
        from: __dirname + '/public'
      }
    ]),
    new ExtractTextPlugin('[name].[contenthash].css', {allChunks: true}),
    {
      apply: (compiler) => {
        rimraf.sync(compiler.options.output.path);
      }
    // }
    },
    new HtmlWebpackPlugin({
      filename: './main.html',
      chunks: ['common', 'main']
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
      exclude: /node_modules/,
      loader: 'babel?presets[]=es2015'
    },
    {
      test: /\.html$/,
      loader: 'html'
    },
    {
      test: /\.?css$/,
      loader: ExtractTextPlugin.extract('css!sass') //!autoprefixer?browser=last 2 versions'
    },
    {
      test: /\.(ico|png|jpg|svg|ttf|eot|woff|woff2)$/,
      loader: 'file?name=[path][name].[hash:6].[ext]'
      // loader: 'file?name=[1].[ext]&options.regExp=node_modules/(.*)'
    }],

    noParse: /node_modules\/(bootstrap|jquery)/
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
