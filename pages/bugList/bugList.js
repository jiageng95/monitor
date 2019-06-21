// pages/bugList/bugList.js
import { getIndex, getArticleList, getBugList } from '../../api/url.js'
import { formatTime } from '../../utils/util.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bugList: [],
    typeList: ['全部', '执行错误', '接口请求'],
    type: 0,
    dateArr: [],
    page: 1,
    pageLimit: 10,
    counts: 0,
    nodata: false,
    appKey: '',
    title: ''
  },
  // 重置表单
  resetForm: function () {
    let dateArr = []
    let bugList = []
    let page = 1
    let nodata = false
    this.setData({ dateArr, bugList, page, nodata })
  },
  // 切换类型
  changeType: function (e) {
    let type = +e.currentTarget.dataset.type
    this.resetForm()
    this.setData({ type })
    this.getBugList()
  },
  // 获取bug列表
  getBugList: function () {
    let { type, page, pageLimit, appKey } = this.data
    let data = {
      appKey,
      type,
      page,
      pageLimit
    }
    getBugList(data).then(res => {
      let bugObj = res.data.bugList.find(item => item.url && item.url) || {}
      let x = 0;
      if (bugObj.url) {
        for (let i = 0; i < 3; i++) {
          x = bugObj.url.indexOf('/', x + 1);
        }
      }
      let title = bugObj.url ? bugObj.url.substr(0, x) : this.data.title
      res.data.bugList.forEach(item => {
        item.url = item.url ? item.url.substr(x) : item.url
        item.createTime = formatTime(new Date(item.createTime * 1000))
        item.errType = item.errType && item.errType.replace(/(^\s*)|(\s*$)/g, '')
        if (this.data.dateArr.includes(item.createTime.split(' ')[0])) {
          item.date = ''
        } else {
          let dateArr = this.data.dateArr
          let createTime = item.createTime.split(' ')[0]
          let time = `${createTime.split('/')[0]}年${createTime.split('/')[1]}月${createTime.split('/')[2]}号`
          item.date = time
          dateArr.push(createTime)
          this.setData({ dateArr })
        }
      })
      let newBugList = this.data.bugList.concat(res.data.bugList)
      if (res.data.bugList.length < this.data.pageLimit) {
        this.setData({ nodata: true })
      }
      this.setData({ bugList: newBugList, counts: res.data.counts, title })
    })
  },
  jumpDetail: function (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../bugDetail/bugDetail?id=' + id
    })
  },
  jumpLogs: function () {
    wx.navigateTo({
      url: '../logs/logs?appKey=' + this.data.appKey
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getRepos()
    let appKey = options.appKey
    this.setData({ appKey })
    this.getBugList()

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
      this.getBugList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})