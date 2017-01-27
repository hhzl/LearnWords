'use strict';

const NODE_ENV = process.env.NODE_ENV || 'development';
console.log(NODE_ENV);
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  context: __dirname + '/app',
  entry: __dirname + '/app/js/main',
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: '[name].js', //'[name]-[hash].js',
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
      exclude: /node_modules/,
      loader: 'babel?presets[]=es2015'
    },
    {
      test: /\.html$/,
      loader: 'html'
    },
    {
      test: /\.css$/,
      loader: 'style!css!scss' //!autoprefixer?browser=last 2 versions'
    },
    {
      test: /\.(ico|png|jpg|svg|ttf|eot|woff|woff2)$/,
      loader: 'file?name=[path][name].[ext]'
      // loader: 'file?name=[1].[ext]&regExp=node_modules/(.*)'
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
