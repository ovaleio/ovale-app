const webpack = require('webpack')
const path = require('path')

module.exports = {
  context: path.join(__dirname, '../src'),
  entry: {
    app: [
      './app.js',
    ],
  },
  output: {
    path: path.resolve(__dirname, './app/build'),
    filename: 'app.bundle.js',
    publicPath: 'http://localhost:8080/',
	}
}
