const SUBMIT_URL = 'debug/submit'
const NOTIFY_URL = 'debug/notify'
const originApp = App // 保存原有的App方法
const originPage = Page // 保存原有的Page方法
const originRequest = wx.request // 保存原有的request方法

class debugLog {
  constructor(options = {}) {
    // super()
    this.config = {
      appKey: '', // 小程序的appKey
      appName: 'test', // 小程序的名字
      debug: false, // 是否为调试模式,默认为false,即开启监控
      ignoreCode: [], // 忽略的code码数组,即服务端返回的code码不存在与ignoreCode中,则上报
      ignoreApp: false, // 忽略对App方法的监控
      env: 'prod', // 接口环境
      ignoreConsole: true // 不劫持console.log
    }
    Object.assign(this.config, options)
    this.breadcrumbs = []
    this.logArr = [] // 记录console.log
    this.notifyQueue = [] // 待上报的log队列
    this.baseURL = this.config.env === 'dev' ? 'http://127.0.0.1:7001/' : 'https://www.api.yuncjs.cn/'
    this.startTime = Math.floor(+new Date() / 1000)
    this.systemInfo = this.getSystemInfo()
    if (!this.config.debug) {
      this.interceptApp()
      this.interceptPage()
      this.interceptRequest()
      !this.config.ignoreConsole && this.interceptConsole()
    }
  }
  // 劫持小程序App方法
  interceptApp() {
    const _self = this
    App = function (app) {
      let methodArr = _self.config.ignoreApp ? ['onError'] : ['onLaunch', 'onShow', 'onHide', 'onError']
      methodArr.forEach(methodName => {
        let defineMethod = app[methodName] // 保存用户定义的方法
        app[methodName] = function (options) {
          let breadcrumb = {
            type: 'function', // 类型
            time: Math.floor(+new Date() / 1000), // 触发时间
            belong: 'App', // 来源
            method: methodName, // 方法名
            path: options && options.path, // 页面路径
            query: options && options.query, // 页面参数
            scene: options && options.scene // 场景编号
          }
          _self.pushToBreadCrumbs(breadcrumb)
          methodName === 'onError' && _self.notifyError(options, 1)
          return defineMethod && defineMethod.call(this, options)
        }
      })
      return originApp(app) // 执行用户定义的方法
    }
  }

  // 劫持小程序page方法
  interceptPage() {
    Page = (page) => {
      Object.keys(page).forEach((methodName) => {
        typeof page[methodName] === 'function' && this.recordPageFn(page, methodName)
      })
      // 强制记录onLoad
      page.onLoad || this.recordPageFn(page, 'onLoad')
      return originPage(page)
    }
  }

  // 劫持小程序request方法
  interceptRequest() {
    let _self = this
    Object.defineProperty(wx, 'request', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function () {
        let config = arguments[0] || {}
        let failFn = config.fail
        let successFn = config.success
        let data = {
          type: 2,
          data: config.data,
          method: config.method || 'GET',
          url: config.url,
          header: config.header,
          status: null,
          statusCode: null,
          msg: ''
        }
        config.fail = function (err) {
          data.msg = err.errMsg
          _self.notifyError(data, 2)
          return failFn.apply(this, arguments)
        }
        config.success = function (res) {
          data.statusCode = res.statusCode
          if (res.statusCode === 500) return
          if (res.statusCode !== 200) {
            data.msg = res.message || ''
            _self.notifyError(data, 2)
          } else if (res.data && !_self.config.ignoreCode.includes(res.data.code)) {
            data.status = res.data.code || null
            data.msg = res.data.msg || ''
            _self.notifyError(data, 2)
          }
          return successFn.apply(this, arguments)
        }
        return originRequest.apply(this, arguments);
      }
    })
  }

  // 上报bug
  notifyError(errRow, type) { // type: 1. script  2. request
    let { appKey, appName } = this.config
    let { brand, model, version, system, platform, SDKVersion } = this.systemInfo
    let data = {
      type,
      appKey,
      appName,
      createTime: Math.floor(+new Date() / 1000),
      errMsg: null,
      errType: null,
      errFn: null,
      errPath: null,
      data: null,
      method: null,
      url: null,
      header: null,
      status: null,
      statusCode: null,
      msg: null,
      brand,
      model,
      version,
      system,
      platform,
      SDKVersion,
      breadcrumbs: this.breadcrumbs
    }
    if (type === 1) {
      let errArr = errRow.split('at ')
      let errType = errArr[1].split('\n')[1].split(':')[0]
      let errMsg = errArr[0].split('\n')[1]
      let errFn = errArr[2].split('(')[0]
      let errPath = errArr[2].split('appservice/')[1].split(':')[0]
      if (errFn.replace(/(^\s*)|(\s*$)/g, '') === 'e') return
      Object.assign(data, {
        errMsg,
        errType,
        errFn,
        errPath
      })
    } else if (type === 2) {
      Object.assign(data, errRow)
    }
    originRequest({
      url: this.baseURL + SUBMIT_URL,
      data: data,
      method: 'POST',
      success: () => {
        this.breadcrumbs = []
      }
    })
  }
  // 上报console
  notifyConsole() {
    while (this.notifyQueue.length) {
      let logArr = this.notifyQueue.shift()
      let data = {
        logArr,
        appKey: this.config.appKey,
        createTime: Math.floor(+new Date() / 1000)
      }
      originRequest({
        url: this.baseURL + NOTIFY_URL,
        data: data,
        method: 'POST',
        success: () => { }
      })
    }
  }

  // 获取系统信息
  getSystemInfo() {
    return wx.getSystemInfoSync()
  }

  // 记录执行的方法栈, 最多记录20个
  pushToBreadCrumbs(obj) {
    this.breadcrumbs.push(obj)
    this.breadcrumbs.length > 20 && this.breadcrumbs.shift()
  }

  // 获取当前显示的页面
  getActivePage() {
    let curPages = getCurrentPages()
    if (curPages.length) {
      return curPages[curPages.length - 1]
    }
    return {}
  }

  // 记录Page执行信息
  recordPageFn(page, methodName) {
    const _self = this
    const defineMethod = page[methodName]
    page[methodName] = function () {
      // if (methodName === 'onLoad' || methodName === 'onShow') {
      _self.activePage = _self.getActivePage()
      // }
      let breadcrumb = {
        type: 'function',
        time: Math.floor(+new Date() / 1000),
        belong: 'Page',
        method: methodName,
        route: _self.activePage && _self.activePage.route,
        options: _self.activePage && _self.activePage.options
      }
      methodName === 'onLoad' && (breadcrumb.args = arguments)
      _self.pushToBreadCrumbs(breadcrumb)
      return defineMethod && defineMethod.apply(this, arguments)
    }
  }

  // 劫持console.log
  interceptConsole() {
    const logFn = console.log
    const _self = this
    console.log = function (...args) {
      let logs = args.map(item => {
        if (typeof item === 'object') {
          return Object.keys(item).length > 10 ? Object.prototype.toString.call(item) : JSON.stringify(item)
        }
        return item
      })
      logs = logs.join('    ')
      if (logs.includes('request begin') || logs.includes('request success')) {
        return logFn && logFn.apply(this, args)
      }
      let endTime = Math.floor(+new Date() / 1000)
      let timeStep = 60 * 10
      let oLog = {
        createTime: endTime,
        logs
      }
      _self.logArr.push(oLog)
      if (_self.logArr.length >= 30 || (endTime - _self.startTime) === timeStep) {
        _self.startTime = endTime
        _self.notifyQueue.push(JSON.parse(JSON.stringify(_self.logArr)))
        _self.logArr = []
        _self.notifyConsole()
      }
      return logFn && logFn.apply(this, args)
    }
  }
}
export default debugLog