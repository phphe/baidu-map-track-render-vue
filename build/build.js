var vue = require('rollup-plugin-vue')
const CleanCSS = require('clean-css')
var rollupHelper = require('rollup-helper')
rollupHelper.package = require('../package.json')
rollupHelper.compileFile('./src/BaiduMapTrackRender.vue', './dist', {
  moduleName: 'BaiduMapTrackRender',
  plugins: [
    vue({
      compileTemplate: true,
      css (styles, stylesNodes) {
        rollupHelper.write('dist/BaiduMapTrackRender.css', styles.replace(/\n+/g, '\n'))
        rollupHelper.write('dist/BaiduMapTrackRender.min.css', new CleanCSS().minify(styles).styles)
      }
    }),
  ]
})
