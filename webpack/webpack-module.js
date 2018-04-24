const babelPresetEnv = require('babel-preset-env')
const babelPresetReact = require('babel-preset-react')
const babelPresetStage = require('babel-preset-stage-3')
const babelPluginTransformVueJsx = require('babel-plugin-transform-vue-jsx')
const babelPluginTransformRuntime = require('babel-plugin-transform-runtime')
const genLoaders = require('./webpack-loader')
const relative = require('../lib/relative')
const config = require('../config')
const constant = require('../config/constant')

const loadToExtMap = { css: /\.css$/, less: /\.less$/, stylus: /.styl$/ }
const cssRule = []

for (let [ loaderName, reExt ] of Object.entries(loadToExtMap)) {
  cssRule.push({
    test: reExt,
    use: genLoaders(loaderName)
  })
}

const presets = [ [ babelPresetEnv, {
  targets: {
    browsers: config.browsers
  },
  modules: false
} ], babelPresetStage ]

const plugins = [ babelPluginTransformRuntime ]

if (config.multiple) {
  presets.push(babelPresetReact)
} else {
  plugins.push(babelPluginTransformVueJsx)
}

module.exports = {
  rules: [
    ...cssRule,
    {
      test: /\.vue$/,
      loader: 'vue-loader',
      include: relative.cwd('src'),
      options: {
        loaders: {
          css: genLoaders('css', true),
          less: genLoaders('less', true),
          stylus: genLoaders('stylus', true)
        },
        transformToRequire: {
          audio: 'src',
          video: 'src'
        }
      }
    }, {
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
          cacheDirectory: true,
          presets,
          plugins
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
      }],
      include: relative.cwd('src')
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
  noParse: content => /(?:jquery|vue|lodash)(?:\.min)?\.js$/.test(content)
}
