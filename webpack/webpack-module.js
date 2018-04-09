const ExtractTextPlugin = require('extract-text-webpack-plugin')
const babelPresetEnv = require('babel-preset-env')
const babelPresetReact = require('babel-preset-react')
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
      minimize: config.minimize && process.env.NODE_ENV === constant.PRODUCTION
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
      test: /\.html$/,
      loader: 'html-loader'
    }, {
      test: /\.ejs$/,
      loader: 'ejs-loader'
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
    }, {
      test: /\.jsx?$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            babelPresetEnv,
            babelPresetReact
          ]
        }
      },
      include: relative.cwd('src')
    }, {
      test: /\.tsx?$/,
      use: [{
        loader: 'ts-loader',
        options: {
          context: relative.cwd(),
          configFile: relative.cmd('tsconfig.json')
        }
      }]
    }, {
      test: /-file\.(png|jpe?g|gif|svg)$/,
      use: [{
        loader: 'file-loader',
        options: {
          name: 'images/[name]-[hash:7].[ext]'
        }
      }, {
        loader: 'img-loader',
        options: {
          enabled: process.env.NODE_ENV === constant.PRODUCTION,
          gifsicle: {
            interlaced: false
          },
          mozjpeg: {
            progressive: true,
            arithmetic: false
          },
          optipng: false, // disabled
          pngquant: {
            floyd: 0.5,
            speed: 2
          },
          svgo: {
            plugins: [
              { removeTitle: true },
              { convertPathData: false }
            ]
          }
        }
      }]
    }, {
      test: filename => /\.(png|jpe?g|gif|svg)$/.test(filename) && !/-file\.(png|jpe?g|gif|svg)$/.test(filename),
      use: [{
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'images/[name]-[hash:7].[ext]'
        }
      }, {
        loader: 'img-loader',
        options: {
          enabled: process.env.NODE_ENV === constant.PRODUCTION,
          gifsicle: {
            interlaced: false
          },
          mozjpeg: {
            progressive: true,
            arithmetic: false
          },
          optipng: false, // disabled
          pngquant: {
            floyd: 0.5,
            speed: 2
          },
          svgo: {
            plugins: [
              { removeTitle: true },
              { convertPathData: false }
            ]
          }
        }
      }]
    }, {
      test: /\.(mp[34]|ogg|wav)$/,
      use: [{
        loader: 'file-loader',
        options: {
          name: 'media/[name]-[hash:7].[ext]'
        }
      }]
    }, {
      test: /\.(eot|ttf|woff2?)$/,
      use: [{
        loader: 'file-loader',
        options: {
          name: 'font/[name]-[hash:7].[ext]'
        }
      }]
    }
  ],
  noParse: content => /jquery|lodash/.test(content)
}
