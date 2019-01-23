// pages/bugDetail/bugDetail.js
import { getBugInfo } from '../../api/url.js'

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
      res.data.createTime = new Date(res.data.createTime * 1000).toLocaleString()
      if (res.data.type === 2) {
        let dataParams = res.data.data
        let headerParams = res.data.header
        res.data.dataArr = Object.keys(dataParams).map((item, index) => `${item} = ${dataParams[item]}${index === (Object.keys(dataParams).length - 1) ? '' : ';'}`)
        res.data.headerArr = Object.keys(headerParams).map((item, index) => `${item} = ${headerParams[item]}${index === (Object.keys(headerParams).length - 1) ? '' : ';'}`)
      }
      this.setData({ bugData: res.data })
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