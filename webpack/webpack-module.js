const ExtractTextPlugin = require('extract-text-webpack-plugin')

const loadToExtMap = { css: /\.css$/, less: /\.less$/, stylus: /.styl$/ }
const cssRule = []

for (let [ loaderName, ext ] of Object.entries(loadToExtMap)) {
  const loaders = [{
    loader: 'css-loader'
  }]

  if (loaderName && loaderName !== 'css') {
    loaders.push({
      loader: `${loaderName}-loader`
    })
  }

  cssRule.push({
    test: ext,
    use: ExtractTextPlugin.extract({
      use: loaders,
      fallback: 'style-loader'
    })
  })
}

module.exports = {
  rules: [
    ...cssRule,
    {
      test: /\.jsx?$/,
      use: ['babel-loader'],
      exclude: /node_modules/
    }, {
      test: /\.(png|jpe?g|gif)$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'images/[name]-[hash:7].[ext]'
        }
      }]
    }
  ]
}
