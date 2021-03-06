/*
 */ 
const path = require('path')
// require('babel-polyfill')

const resolve = dir => {
  return path.join(__dirname, dir)
}

const BASE_URL = process.env.NODE_ENV === 'production'
  ? './'
  : './'
module.exports = {
  transpileDependencies: [
    'iview',
    'axios'
  ],
  lintOnSave: false,
  // 设为false打包时不生成.map文件
  productionSourceMap: false,
  // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
  devServer: {
    // compress: true,
    port: 9000,
    // proxy: {
    //   '/login': {
    //     // target: 'http://172.20.83.50:8181',
    //     // target: 'https://view.inews.qq.com', // 腾讯接口代理
    //     // target: 'https://c.m.163.com', // 腾讯接口代理
    //     target: 'http://45.32.18.181:5000',
    //     changeOrigin: true,
    //     ws: true,
    //     pathRewrite: {
    //       '^/apis': ''
    //     }
    //   }
    // }
  }
}
