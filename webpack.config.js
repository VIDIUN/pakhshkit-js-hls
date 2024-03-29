'use strict';

const webpack = require('webpack');
const path = require('path');
const PROD = process.env.NODE_ENV === 'production';
const packageData = require('./package.json');

let plugins = [
  new webpack.DefinePlugin({
    __VERSION__: JSON.stringify(packageData.version),
    __NAME__: JSON.stringify(packageData.name)
  })
];

if (PROD) {
  plugins.push(new webpack.optimize.UglifyJsPlugin({sourceMap: true}));
}

module.exports = {
  context: __dirname + '/src',
  entry: {'pakhshkit-hls': 'index.js'},
  output: {
    path: __dirname + '/dist',
    filename: '[name].js',
    library: ['pakhshkit', 'hls'],
    libraryTarget: 'umd',
    umdNamedDefine: true,
    devtoolModuleFilenameTemplate: './hls/[resource-path]'
  },
  devtool: 'source-map',
  plugins: plugins,
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ],
        exclude: [/node_modules/]
      },
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        enforce: 'pre',
        use: [
          {
            loader: 'eslint-loader',
            options: {
              rules: {
                semi: 0
              }
            }
          }
        ]
      }
    ]
  },
  devServer: {
    contentBase: __dirname + '/src'
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  },
  externals: {
    '@pakhshkit-js/pakhshkit-js': {
      commonjs: '@pakhshkit-js/pakhshkit-js',
      commonjs2: '@pakhshkit-js/pakhshkit-js',
      amd: 'pakhshkit-js',
      root: ['pakhshkit', 'core']
    },
    'hls.js': {
      commonjs: 'hls.js',
      commonjs2: 'hls.js',
      amd: 'hls.js',
      root: 'Hls'
    }
  }
};
