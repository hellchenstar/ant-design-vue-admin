const path = require('path')
const { generateTheme } = require('antd-theme-generator')
// ant-design-vue/dist/antd.less
const options = {
  antDir: path.join(__dirname, './node_modules/ant-design-vue'), //对应具体位置
  stylesDir: path.join(__dirname, './src/styles'), //对应具体位置
  varFile: path.join(__dirname, './src/styles/variables.less'), //对应具体位置
  mainLessFile: path.join(__dirname, './src/styles/index.less'), //对应具体位置
  themeVariables: [
    '@primary-color',
    '@secondary-color',
    '@text-color',
    '@text-color-secondary',
    '@heading-color',
    '@layout-body-background',
    '@btn-primary-bg',
    '@layout-header-background'
  ],
  indexFileName: 'index.html',
  outputFilePath: path.join(__dirname, './public/color.less')
}
generateTheme(options)
  .then(less => {
    console.log('Theme generated successfully')
  })
  .catch(error => {
    console.log('Error', error)
  })
