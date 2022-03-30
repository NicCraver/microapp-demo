module.exports = {
  outputDir: 'dist',
  publicPath: '/manageModule2/',
  productionSourceMap: false,
  devServer: {
    hot: false,
    disableHostCheck: true,
    port: 4104,
    open: false,
    overlay: {
      warnings: false,
      errors: true,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  lintOnSave: false,
  // 自定义webpack配置
  configureWebpack: {},
  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule.use('svg-sprite-loader').loader('svg-sprite-loader').options({
      symbolId: 'icon-[name]',
    })
    config.module
      .rule('images')
      .use('url-loader')
      .tap((options) => {
        return {
          limit: 4096,
          fallback: {
            loader: 'file-loader',
            options: {
              name: 'img/[name].[ext]',
            },
          },
        }
      })
  },
}
