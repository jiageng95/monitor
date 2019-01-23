//app.js
import debug from './libs/debug.js'
debug.config.appKey = 'wx09aa326f2ed38651'
debug.config.appName = '个人'

App({
  onLaunch: function () {
  },
  globalData: {
    userInfo: null
  },
  onError: function () {
  }
})