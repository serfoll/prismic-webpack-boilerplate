const path = require('path');

//merge
const { merge } = require('webpack-merge');
//require webpack config file
const config = require('./webpack.config.cjs');

//mode production mode
//output path
//plugin to use
module.exports = merge(config, {
  mode: 'production',
  output: {
    publicPath: '/',
    path: path.join(__dirname, 'public'),
  },
});
