const fs = require('fs')
const webpack = require('webpack')

const proxyFile = require('./bootstrap').proxyFile
let proxy = {}

if (fs.existsSync(proxyFile)) {
  proxy = require(proxyFile)
}

module.exports = {
  productionSourceMap: false,
  chainWebpack: config => {
    config
      .plugin('ignore')
      .use(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/))

    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader')

    config.optimization.splitChunks({
      cacheGroups: {
        lib_vue: {
          name: 'vue_vue-router_vuex_axios',
          priority: 10,
          test: /[\\/]node_modules[\\/](vue|vue-router|vuex|axios)[\\/](.*)/,
          chunks: 'all'
        }
      }
    })

    config.optimization.minimizer('terser').tap(args => {
      const compress = args[0].terserOptions.compress
      compress.drop_console = true
      return args
    })
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            'primary-color': '#46BCA0',
            'link-color': '#46BCA0',
            'menu-bg': '#dbdbdb',
            'menu-item-color': '#666',
            'menu-item-height': '44px',
            'menu-inline-toplevel-item-height': '44px',
            'menu-item-vertical-margin': '0',
            'menu-item-boundary-margin': '0',
            'menu-item-active-bg': '#E8FFFA',
            'menu-item-active-border-width': '5px',
            'menu-collapsed-width': '55px',
            'ease-in-out': 'ease-in-out',
            'ease-in-out-back': 'ease-in-out'
          },
          javascriptEnabled: true
        }
      }
    }
  },
  devServer: {
    proxy,
    clientLogLevel: 'info'
  }
}
