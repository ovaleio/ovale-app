const webpack = require('webpack');
const path = require('path');
const withCss = require('@zeit/next-css');
require('dotenv').config()


module.exports = withCss({
  webpack(config) {
    config.node = {
      __dirname: false
    }
    config.target = 'electron-renderer'
    //config.module.rules.push({
    //  test: /\.css$/,
    //  loader: 'style-loader!css-loader',
    //});
    config.plugins.push(new webpack.IgnorePlugin(/vertx/))
    config.plugins = config.plugins.filter(
      (plugin) => (plugin.constructor.name !== 'UglifyJsPlugin')
    )
    return config
  },
  env: {
    DEV_API: 'http://localhost:8200',
    PROD_API: 'https://api.ovale.io/api'
  },
  exportPathMap() {
    // Let Next.js know where to find the entry page
    // when it's exporting the static bundle for the use
    // in the production version of your app
    return {
      '/': { page: '/' }
    }
  }
});
