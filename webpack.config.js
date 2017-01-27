'use strict';

const NODE_ENV = process.env.NODE_ENV || 'development';
console.log(NODE_ENV);
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const rimraf = require('rimraf');

function addHash(template, hash) {
  return 'production' === NODE_ENV ? template.replace(/\.[^.]+$/, `.[${hash}]$&`) : `${template}?hash=[${hash}]`;
}

module.exports = {
  entry: __dirname + '/app/js/main',
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: addHash('[name].js', 'developemnt' === NODE_ENV ? 'hash' : 'chunkhash'),
    library: '[name]'
  },

  watchOptions: {
    aggregateTimeout: 100
  },

  devtool: 'production' !== NODE_ENV ? 'inline-source-map' : null,

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
    new CopyWebpackPlugin([{
      from: __dirname + '/public'
    }]),
    new ExtractTextPlugin(
      addHash('[name].css', 'contenthash'), {
        allChunks: true,
        disable: 'production' !== NODE_ENV
      }
    ),
    // ,
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
        loader: ExtractTextPlugin.extract('style', 'css!sass') //!autoprefixer?browser=last 2 versions'
      },
      {
        test: /\.(ico|png|jpg|svg|ttf|eot|woff|woff2)$/,
        loader: addHash('file?name=[path][name].[ext]', 'hash:6')
        // loader: 'file?name=[1].[ext]&options.regExp=node_modules/(.*)'
      }
    ],

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
  module.exports.plugins.push(
    {
      apply: (compiler) => {
        'production' === NODE_ENV && rimraf.sync(compiler.options.output.path);
      }
    }
  );
}
