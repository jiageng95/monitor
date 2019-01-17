import { appConfigs } from '../utils/config.js'
import { getCurrentPageUrl } from '../utils/util.js'
const md5 = require('../utils/md5.js')

function request (url, data = {}, method) {
  return new Promise((resolve, reject) => {
    let timesTamp = parseInt(new Date().getTime() / 1000)
    let { appKey, appSecret } = appConfigs
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json',
        'Accept': 'application/json',
        // 'Lc-Appkey': appKey,
        // 'Lc-Sign': md5.hexMD5(appKey + timesTamp + appSecret),
        // 'Lc-Timestamp': timesTamp,
        'Session': wx.getStorageSync('sessionId') || ''
      },
      data: data,
      method: method,
      success: res => {
        if (res.data.status === 403 || res.data.code === 1004) {
          wx.showToast({
            title: '请先登录',
            icon: 'none',
            duration: 1000
          })
          wx.setStorageSync('currentPage', getCurrentPageUrl())
          setTimeout(() => {
            wx.redirectTo({
              url: '../login/login'
            })
          }, 1000)
          reject(res.data)
          return;
        }
        resolve(res.data)
      },
      fail: err => {
        reject(err.data)
      }
    })
  })
}
export default request