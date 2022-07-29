const path = require('path');
//merge
const { merge } = require('webpack-merge');
//require webpack config file
const config = require('./webpack.config.cjs');

//mode what enviroment this config is for
//inline-source-map used for tracking error origins
//write to disk
//where to outout the build
module.exports = merge(config, {
  mode: 'development',
  //used for inpescting website
  devtool: 'inline-source-map',

  devServer: {
    devMiddleware: {
      writeToDisk: true,
    },
  },

  output: {
    path: path.resolve(__dirname, 'public'),
  },
});
