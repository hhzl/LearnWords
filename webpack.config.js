'use strict';

module.exports = {
  entry: './app/js/main',
  output: {
    path: __dirname + '/app/js/',
    filename: 'bundle.js',
    library: 'bundle'
  },

  watch: true,

  watchOptions: {
    aggregateTimeout: 100
  }
};
