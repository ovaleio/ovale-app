const webpack = require('webpack');
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
    config.module.rules.push({
      test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 100000,
          name: '[name].[ext]'
        }
      }
    })
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
