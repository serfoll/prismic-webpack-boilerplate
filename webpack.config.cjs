//path
const path = require('path');
//core webpack
const webpack = require('webpack');

//clean up public/build folder before building
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
//copies files from one place to another (e.g dev files copied to build files)
const CopyWebpackPlugin = require('copy-webpack-plugin');
//extracts css from js files
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//image minimizer
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
// JS compressor
const TerserPlugin = require('terser-webpack-plugin');
//check if in development mode
const IS_DEVELOPMENT = process.env.NODE_ENV === 'dev';

//correct path to the app folder
//__dirname by default is the current dir where node.js (package.json) is used
const dirApp = path.join(__dirname, 'app');
const dirShared = path.join(__dirname, 'shared');
const dirStyles = path.join(__dirname, 'styles');

const dirNode = 'node_modules';

module.exports = {
  //entry: The point or points where to start the application bundling process
  entry: [path.join(dirApp, 'index.js'), path.join(dirStyles, 'index.scss')],
  //resolve: helps in locating a module by its absolute path. A module can be required as a dependency from another module
  resolve: {
    //modules: Tell webpack what directories should be searched when resolving modules
    modules: [dirApp, dirShared, dirStyles, dirNode],
  },
  //plugins: serve the purpose of doing anything else that a loader cannot do
  plugins: [
    new CleanWebpackPlugin(),
    //define: replaces variables with other values or expressions at compile time
    new webpack.DefinePlugin({
      IS_DEVELOPMENT,
    }),
    //CopyWebpackPlugin: Copies individual files or entire directories, which already exist, to the build directory
    new CopyWebpackPlugin({
      patterns: [{ from: '/.shared', to: '', noErrorOnMissing: true }],
    }),
    //MiniCssExtractPlugin: extracts CSS into separate files. It creates a CSS file per JS file which contains CSS.
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
  //module: determine how the different types of modules within a project will be treated
  module: {
    //rules: array of Rules which are matched to requests when modules are created
    rules: [
      //use babel loader to compile .js files
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
        },
      },
      //dealing with .scss (sass) files
      {
        test: /\.scss$/,
        use: [
          {
            //extrac css and include in the root of the build folder
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '/',
            },
          },
          {
            //css-loader: interprets @import and url() like import/require() and will resolve them
            loader: 'css-loader',
          },
          {
            //postcss-loder: proccess css with postCss
            loader: 'postcss-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      // dealing with images and fonts
      {
        test: /\.(png|jpe?g|gif|svg|woff2?|fnt|webp)$/,
        loader: 'file-loader',
        type: 'asset',
        options: {
          //always get the latest images, no caching it
          name() {
            return '[hash].[ext]';
          },
        },
      },
      {
        test: /\.(glsl|frag|vert)$/,
        loader: 'raw-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(glsl|frag|vert)$/,
        loader: 'glslify-loader',
        exclude: /node_modules/,
      },
    ], //rules
  }, //modules,
  optimization: {
    minimizer: [
      '...',
      new TerserPlugin(),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            // Lossless optimization with custom option
            // Feel free to experiment with options for better result for you
            plugins: [
              ['gifsicle', { interlaced: true }],
              ['jpegtran', { progressive: true }],
              ['optipng', { optimizationLevel: 5 }],
              ['webp', { quality: 80 }],
              // Svgo configuration here https://github.com/svg/svgo#configuration
              [
                'svgo',
                {
                  params: {
                    overrides: {
                      addAttributesToSVGElement: {
                        params: {
                          attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }],
                        },
                      },
                      removeViewBox: {
                        active: false,
                      },
                    },
                  },
                },
              ],
            ],
          },
        },
      }),
    ],
  }, //optimization
};
