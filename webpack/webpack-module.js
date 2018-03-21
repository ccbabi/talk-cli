const ExtractTextPlugin = require('extract-text-webpack-plugin')
const relative = require('../lib/relative')

const loadToExtMap = { css: /\.css$/, less: /\.less$/, stylus: /.styl$/ }
const cssRule = []

for (let [ loaderName, ext ] of Object.entries(loadToExtMap)) {
  const loaders = [{
    loader: 'css-loader',
    options: {
      importLoaders: 1
    }
  }, {
    loader: 'postcss-loader',
    options: {
      config: {
        path: relative.cmd('postcss.config.js')
      },
      sourceMap: true
    }
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
    }, {
      test: /\.(mp[34]||ogg|wav)$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'media/[name]-[hash:7].[ext]'
        }
      }]
    }, {
      test: /\.(eot|ttf|woff2?)$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'font/[name]-[hash:7].[ext]'
        }
      }]
    }
  ]
}
