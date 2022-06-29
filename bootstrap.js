const path = require('path')
const fs = require('fs')

const proxyFile = path.resolve(__dirname, 'dev_proxy.js')

if (!fs.existsSync(proxyFile)) {
  fs.writeFileSync(
    proxyFile,
    `module.exports = {
  ['/lighthouse']: {
    target: 'http://10.10.14.123:8086',
    changeOrigin: true,
    secure: false,
    ws: true,
    pathRewrite: {
      ['^/lighthouse']: ''
    }
  }
}`
  )
}

exports.proxyFile = proxyFile
