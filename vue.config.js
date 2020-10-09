module.exports = {
  // 基本路径 baseURL已经过时
  publicPath: './',
  // 输出文件目录
  outputDir: 'dist',
  // eslint-loader 是否在保存的时候检查
  lintOnSave: true,
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  // 开发环境
  devServer: {
    host: 'localhost', //表示启动的时候使用的域名，默认可以不写，则是使用localhost和本机IP
    port: '8080', // 设置端口号
    https: false, //是否使用https协议
    hotOnly: true, //是否开启热更新
    proxy: {
      '/api/v1': {
        target: 'http://192.168.3.254:8182',

        changeOrigin: true, //是否跨域
        secure: false, // 如果是https接口，需要配置这个参数
        pathRewrite: {} //路劲重写
        // logLevel: 'debug' //如果代理成功，会打印出代理地址
      }
    }
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          // 定制主题
          modifyVars: {
            // 初始默认色
            'primary-color': '#3e91f7'
          },
          javascriptEnabled: true
        }
      }
    }
  }
}
