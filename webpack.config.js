module.exports = {
  entry: './js/index.js',
  output: {
    filename: './build/index.js'
  },
  devtool: 'source-map',
  resolveLoader: {
    modulesDirectories: [
      'node_packages',
      'web_loaders',
      'web_modules',
      'node_loaders',
      'node_modules'
    ]
  },
  stats: {
    colors: true,
    reasons: true
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      },{
        test: /\.json$/,
        loader: 'json'
      }
    ]
  }
}
