// pages/bugDetail/bugDetail.js
import { getBugInfo } from '../../api/url.js'
import { formatTime } from '../../utils/util.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    bugData: {}
  },
  // 获取bug信息
  getBugInfo: function () {
    let data = {
      id: this.data.id
    }
    getBugInfo(data).then(res => {
      let bugData = res.data
      bugData.createTime = formatTime(new Date(bugData.createTime * 1000))
      bugData.header = bugData.header && Object.keys(bugData.header).length ? bugData.header : null
      bugData.data = bugData.data && Object.keys(bugData.data).length ? bugData.data : null
      this.setData({ bugData })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = +options.id || ''
    this.setData({ id })
    this.getBugInfo()
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