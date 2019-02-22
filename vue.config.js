const path = require('path');

module.exports = {

  publicPath: process.env.NODE_ENV === 'production'
    ? '/'
    : '/',

  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@comps': path.resolve(__dirname, './src/components'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@plugins': path.resolve(__dirname, './src/plugins'),
        '@imgs': path.resolve(__dirname, './public/images')
      }
    }
  },

  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,

  // css相关配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {
      less: {
        // 变量覆盖的方式来实现主题定制
        javascriptEnabled: true
      }
    },
    // 启用 CSS modules for all css / pre-processor files.
    modules: false
  },

  // 自定义全局样式和变量
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.resolve(__dirname, 'src/styles/constant.less'),
        path.resolve(__dirname, 'src/styles/common.less')]
    }
  }

};
