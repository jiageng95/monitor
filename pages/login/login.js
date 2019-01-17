// pages/login/login.js
import { login } from '../../api/url.js'
import { getCurrentPageUrl } from '../../utils/util.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  // 微信登录
  wxlogin: function () {
    wx.login({
      success: res => {
        wx.setStorageSync('code', res.code)
      }
    })
  },
  // 获取微信用户信息
  onGotUserInfo: function (e) {
    let { encryptedData, iv } = e.detail
    this.login(encryptedData, iv)
  },
  login: function (encryptedData, iv) {
    let data = {
      code: wx.getStorageSync('code'),
      encryptedData,
      iv
    }
    wx.showLoading({
      title: '正在登录...',
    })
    login(data).then(res => {
      wx.hideLoading()
      if (res.code === 500) {
        wx.showToast({
          title: '登录失败',
          icon: 'none',
          duration: 1000
        })
        return;
      }
      wx.showToast({
        title: '登录成功',
        icon: 'none',
        duration: 1000
      })
      let { session_id } = res.data
      let currentPage = `..${wx.getStorageSync('currentPage').route.split('pages')[1]}`
      let url = currentPage || '../index/index'
      wx.setStorageSync('sessionId', session_id)
      setTimeout(() => {
        wx.redirectTo({
          url: url
        })
      }, 1000)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.wxlogin()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})