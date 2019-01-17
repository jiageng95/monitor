//index.js
import { getIndex, getArticleList } from '../../api/url.js'
import request from '../../api/http.js'
var wxCharts = require('../../libs/wxcharts-min.js')

Page({
  data: {
    indexInfo: {}
  },
  getBugList: function () {
    let data = {
      SDKVersion: "2.0.4",
      brand: "devtools",
      createTime: 1547742193,
      data: {},
      errFn: null,
      errMsg: null,
      errPath: null,
      errType: null,
      method: "GET",
      model: "iPhone 5",
      platform: "devtools",
      status: null,
      statusCode: 404,
      system: "iOS 10.0.1",
      type: "request",
      url: "http://127.0.0.1:7001/user/info1",
      version: "6.6.3"
    }
    new wxCharts({
      canvasId: 'pieCanvas',
      type: 'pie',
      series: [{
        name: 'script',
        data: 50,
      }, {
        name: 'request',
        data: 30,
      }],
      width: 360,
      height: 300,
      dataLabel: true
    });
    new wxCharts({
      canvasId: 'ringCanvas',
      type: 'ring',
      series: [{
        name: '成交量1',
        data: 15,
      }, {
        name: '成交量2',
        data: 35,
      }, {
        name: '成交量3',
        data: 78,
      }, {
        name: '成交量4',
        data: 63,
      }],
      width: 320,
      height: 200,
      dataLabel: false
    });
    new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: ['2012', '2013', '2014', '2015', '2016', '2017'],
      series: [{
        name: '成交量1',
        data: [0.15, 0.2, 0.45, 0.37, 0.4, 0.8],
        format: function (val) {
          return val.toFixed(2) + '万';
        }
      }, {
        name: '成交量2',
        data: [0.30, 0.37, 0.65, 0.78, 0.69, 0.94],
        format: function (val) {
          return val.toFixed(2) + '万';
        }
      }],
      yAxis: {
        title: '成交金额 (万元)',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0
      },
      width: 320,
      height: 200
    });
    new wxCharts({
      canvasId: 'areaCanvas',
      type: 'area',
      categories: ['2016-08', '2016-09', '2016-10', '2016-11', '2016-12', '2017'],
      series: [{
        name: '成交量1',
        data: [70, 40, 65, 100, 34, 18],
        format: function (val) {
          return val.toFixed(2) + '万';
        }
      }, {
        name: '成交量2',
        data: [15, 20, 45, 37, 4, 80],
        format: function (val) {
          return val.toFixed(2) + '万';
        }
      }],
      yAxis: {
        format: function (val) {
          return val + '万';
        }
      },
      width: 320,
      height: 200
    });
  },
  // 获取首页信息
  getIndex: function () {
    getIndex().then(res => {
      console.log(res)
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
    this.getBugList()
    this.getIndex()
    // this.getArticleList()
  },
  onShareAppMessage: function () {
    title.psu
    return {
      title: '2222'
    }
  }
})
