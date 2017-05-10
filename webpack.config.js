const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackTemplate = require('html-webpack-template');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const outDir = path.resolve(__dirname, './dist');
const jsOutPath = 'js/[name].js';
const cssOutPath = 'css/[name].css';
const imgOutPath = 'img/[name].[ext]';

module.exports = {
  entry: './src/client/app',
  resolve: {
    extensions: ['.js', '.ts', '.json'],
    alias: { vue: 'vue/dist/vue.esm.js' }
  },
  output: {
    path: outDir,
    publicPath: '/',
    filename: jsOutPath,
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          esModule: true,
          loaders: {
            scss: ExtractTextPlugin.extract({
              use: 'css-loader!sass-loader',
              fallback: 'vue-style-loader'
            })
          }
        }
      },
      {
        test: /\.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }]
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: { silent: true, appendTsSuffixTo: [/\.vue$/] }
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: `url-loader?limit=10000&name=${imgOutPath}`
      },
      // {
      //   test: /\.(eot|svg|ttf|woff|woff2)$/,
      //   loader: `file-loader?name=fonts/[name].[ext]`
      // }
    ]
  },
  plugins: [
    new CleanWebpackPlugin([outDir], { verbose: false }),
    new HtmlWebpackPlugin({
      title: 'SemaPat',
      inject: false,
      template: HtmlWebpackTemplate,
      appMountId: 'app',
      favicon: './src/client/assets/favicon.png',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
      }
    }),
    // new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false }, sourceMap: false, comments: false }),
    new ExtractTextPlugin({ filename: cssOutPath }),
    new OptimizeCssAssetsPlugin({ canPrint: false }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: module => module.resource && /\.js$/.test(module.resource) && module.resource.indexOf(path.join(__dirname, './node_modules') === 0)
    }),
    new CompressionWebpackPlugin({ deleteOriginalAssets: true }),
  ]
};