const webpack = require('webpack');
const path = require('path');
const withCss = require('@zeit/next-css');


module.exports = withCss({
  webpack(config) {
    config.node = {
      __dirname: false
    }
    config.target = 'electron-renderer'
    config.plugins.push(new webpack.IgnorePlugin(/vertx/))
    config.plugins = config.plugins.filter(
      (plugin) => (plugin.constructor.name !== 'UglifyJsPlugin')
    )
    return config
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
