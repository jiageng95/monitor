// pages/logs/logs.js
import { getLogList } from '../../api/url.js'
import { formatTime } from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logList: [],
    page: 1,
    pageLimit: 10,
    counts: 0,
    nodata: false,
    appKey: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { appKey } = options
    this.setData({ appKey })
    this.getLogList()
  },

  // 获取log列表
  getLogList () {
    let { appKey, page, pageLimit } = this.data
    let data = {
      page,
      pageLimit,
      appKey
    }
    getLogList(data).then(res => {
      let logList = this.data.logList
      if (res.data.logList.length < this.data.pageLimit) {
        this.setData({ nodata: true })
      }
      res.data.logList.forEach(item => {
        item.logs.forEach(log => {
          log.time = log.createTime
          log.createTime = formatTime(new Date(log.createTime * 1000))
          log.hide = log.logs.length > 200
        })
        logList = logList.concat(...item.logs)
      })
      logList.sort((a, b) => b.time - a.time )
      this.setData({ logList, counts: res.data.count })
    })
  },
  showMore (e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      [`logList[${index}].hide`]: false
    })
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
    if (!this.data.nodata) {
      let page = ++this.data.page
      this.getLogList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})