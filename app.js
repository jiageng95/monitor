//app.js
import { notifyError } from './api/url.js'

App({
  onLaunch: function () {

  },
  globalData: {
    userInfo: null
  },
  onError: function (err) {
    console.log(err)
    console.log(err.split('at')[0])
    // notifyError().then(res => {
    //   console.log(res)
    // })
  }
})