//app.js
import Debug from './libs/debug.js'
let options = {
  appKey: 'wx09aa326f2ed38651',
  appName: '个人',
  debug: false,
  ignoreCode: [200, 1004, 1007],
  ignoreApp: true,
  env: 'dev',
  ignoreConsole: false
}
let debug = new Debug(options)

App({
  onLaunch: function () {
  },
  globalData: {
    userInfo: null
  },
  onError: function () {
  }
})