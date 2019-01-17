//index.js
import { getIndex, getArticleList } from '../../api/url.js'
import request from '../../api/http.js'

Page({
  data: {
    indexInfo: {}
  },
  // 获取首页信息
  getIndex: function () {
    throw(ddd)
    getIndex().then(res => {
      console.log(res.data)
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
  onLoad: function (options) {
  },
  onShow: function () {
    this.getIndex()
    this.getArticleList()
  }
})
