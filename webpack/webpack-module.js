const ExtractTextPlugin = require('extract-text-webpack-plugin')
const relative = require('../lib/relative')
const config = require('../config')
const constant = require('../config/constant')

const loadToExtMap = { css: /\.css$/, less: /\.less$/, stylus: /.styl$/ }
const cssRule = []

for (let [ loaderName, ext ] of Object.entries(loadToExtMap)) {
  const loaders = [{
    loader: 'css-loader',
    options: {
      importLoaders: 1,
      minimize: config.minimize && process.NODE_ENV === constant.PRODUCTION
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
      loader: 'babel-loader',
      exclude: /node_modules/
    }, {
      test: /\.tsx?$/,
      use: [{
        loader: 'ts-loader',
        options: {
          context: relative.PATH_CWD,
          configFile: relative.cmd('tsconfig.json')
        }
      }]
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
    }, {
      test: /\.pug$/,
      use: [{
        loader: 'pug-loader',
        options: {
          pretty: true
        }
      }]
    }, {
      test: /\.(hbs|jade)$/,
      loader: 'handlebars-loader'
    }
  ]
}
