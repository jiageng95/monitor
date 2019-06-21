//index.js
import { getIndex, getArticleList, getBugCount, getAppList } from '../../api/url.js'
var wxCharts = require('../../libs/wxcharts-min.js')

Page({
  data: {
    indexInfo: {},
    appList: [],
    bugCountData: {},
    name: ''
  },
  // 获取首页信息
  getIndex: function () {
    getIndex().then(res => {
      this.setData({ indexInfo: res.data })
    })
  },
  // 获取文章列表
  getArticleList: function () {
    let data = {
      pageLimit: 10,
      page: 1
    }
    getArticleList(data).then(res => {
      console.log(res)
    })
  },
  jumpArticle: function () {
    wx.navigateTo({
      url: '../article/article',
    })
  },
  jumpBugList: function (e) {
    let appKey = e.currentTarget.dataset.appkey
    wx.navigateTo({
      url: '../bugList/bugList?appKey=' + appKey,
    })
  },
  jumpBugDetail: function () {
    wx.navigateTo({
      url: '../bugDetail/bugDetail',
    })
  },
  // 获取bug信息
  getBugCount: function () {
    getBugCount().then(res => {
      console.log(res.data)
      this.setData({ bugCountData: res.data })
    })
  },
  // 获取小程序列表
  getAppList: function () {
    let data = {
      name: this.data.name
    }
    getAppList(data).then(res => {
      this.setData({ appList: res.data })
    })
  },
  // 搜索小程序名称
  changeName: function (e) {
    this.setData({ name: e.detail.value })
  },
  // 确定搜索
  confirmSearch: function () {
    this.getAppList()
  },
  onLoad: function (options) {

  },
  onShow: function () {
    // this.getBugList()
    // this.getIndex()
    this.getAppList()
    // this.getBugCount()
    // this.getArticleList()
  },
  onShareAppMessage: function () {
    return {
      title: '2222'
    }
  }
})
