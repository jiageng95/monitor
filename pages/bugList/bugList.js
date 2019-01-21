// pages/bugList/bugList.js
import { getIndex, getArticleList, getBugList, getBugInfo } from '../../api/url.js'
import { formatTime } from '../../utils/util.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [{
      type: 'radio',
      label: '类型',
      value: 'type',
      children: [{
        label: 'script',
        value: '1',
      },
      {
        label: 'request',
        value: '2',
      },
      ],
      groups: ['001'],
    },
      {
        type: 'sort',
        label: '日期',
        value: 'date',
        groups: ['002'],
      },
      {
        type: 'filter',
        label: '筛选',
        value: 'filter',
        children: [{
          type: 'radio',
          label: 'Languages（单选）',
          value: 'language',
          children: [{
            label: 'JavaScript',
            value: 'javascript',
          },
          {
            label: 'HTML',
            value: 'html',
          },
          {
            label: 'CSS',
            value: 'css',
          },
          {
            label: 'TypeScript',
            value: 'typescript',
          },
          ],
        },
        {
          type: 'checkbox',
          label: 'Query（复选）',
          value: 'query',
          children: [{
            label: 'Angular',
            value: 'angular',
          },
          {
            label: 'Vue',
            value: 'vue',
          },
          {
            label: 'React',
            value: 'react',
          },
          {
            label: 'Avalon',
            value: 'avalon',
          },
          ],
        },
        {
          type: 'checkbox',
          label: '配送方式',
          value: 'away',
          children: [{
            label: '京东配送',
            value: '1',
          },
          {
            label: '货到付款',
            value: '2',
          },
          {
            label: '仅看有货',
            value: '3',
          },
          {
            label: '促销',
            value: '4',
          },
          {
            label: '全球购',
            value: '5',
          },
          {
            label: 'PLUS专享价',
            value: '6',
          },
          {
            label: '新品',
            value: '7',
          },
          {
            label: '配送全球',
            value: '8',
          },
          ],
        },
        {
          type: 'radio',
          label: '性别',
          value: 'gander',
          children: [{
            label: '男',
            value: '0',
          },
          {
            label: '女',
            value: '1',
          },
          {
            label: '通用',
            value: '2',
          },
          ],
        },
        {
          type: 'checkbox',
          label: '闭合方式',
          value: 'closed_mode',
          children: [{
            label: '卡扣',
            value: '0',
          },
          {
            label: '拉链',
            value: '1',
          },
          {
            label: '其他',
            value: '2',
          },
          ],
        },
        {
          type: 'checkbox',
          label: '轮子种类',
          value: 'wheel_type',
          children: [{
            label: '万向轮',
            value: '0',
          },
          {
            label: '单向轮',
            value: '1',
          },
          {
            label: '飞机轮',
            value: '2',
          },
          {
            label: '其他',
            value: '3',
          },
          ],
        },
        {
          type: 'checkbox',
          label: '箱包硬度',
          value: 'wheel_type',
          children: [{
            label: '硬箱',
            value: '0',
          },
          {
            label: '软硬结合',
            value: '1',
          },
          {
            label: '软箱',
            value: '2',
          },
          {
            label: '其他',
            value: '3',
          },
          ],
        },
        {
          type: 'checkbox',
          label: '适用场景',
          value: 'wheel_type',
          children: [{
            label: '旅行',
            value: '0',
          },
          {
            label: '婚庆',
            value: '1',
          },
          {
            label: '出差',
            value: '2',
          },
          {
            label: '其他',
            value: '3',
          },
          ],
        },
        ],
        groups: ['001', '002'],
      }
    ],
    bugList: []
  },
  onChange(e) {
    const { checkedItems, items } = e.detail
    const params = {}

    console.log(checkedItems, items)

    checkedItems.forEach((n) => {
      if (n.checked) {
        if (n.value === 'type') {
          const selected = n.children.filter((n) => n.checked).map((n) => n.value).join(' ')
          params.sort = n.value
          params.order = selected
        } else if (n.value === 'date') {
          params.sort = n.value
          params.order = n.sort === 1 ? 'asc' : 'desc'
        } else if (n.value === 'forks') {
          params.sort = n.value
        } else if (n.value === 'filter') {
          n.children.filter((n) => n.selected).forEach((n) => {
            if (n.value === 'language') {
              const selected = n.children.filter((n) => n.checked).map((n) => n.value).join(' ')
              params.language = selected
            } else if (n.value === 'query') {
              const selected = n.children.filter((n) => n.checked).map((n) => n.value).join(' ')
              params.query = selected
            }
          })
        }
      }
    })

    // this.getRepos(params)
  },
  // getRepos(params = {}) {
  //   const language = params.language || 'javascript'
  //   const query = params.query || 'react'
  //   const q = `${query}+language:${language}`
  //   const data = Object.assign({
  //     q,
  //   }, params)
  // },
  onOpen(e) {
    this.setData({
      pageStyle: 'height: 100%; overflow: hidden',
    })
  },
  onClose(e) {
    this.setData({
      pageStyle: '',
    })
  },
  // 获取bug列表
  getBugList: function () {
    let data = {
      type: 0,
      page: 1,
      pageLimit: 20
    }
    getBugList(data).then(res => {
      res.data.forEach(item => {
        item.createTime = new Date(item.createTime * 1000).toLocaleString()
      })
      this.setData({ bugList: res.data })
      // this.showCanvas()
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getRepos()
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
    this.getBugList()
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