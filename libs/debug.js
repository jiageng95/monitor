const URL = 'http://127.0.0.1:7001/debug/submit'
const originRequest = wx.request;
const originApp = App;
App = function (app) {
  let methodArr = ['onLaunch', 'onShow', 'onHide', 'onError']
  methodArr.forEach(methodName => {
    app[methodName] = function (options) {
      if (methodName === 'onError') {
        notifyError(options, 'script')
      }
    }
  })
  originApp(app) // 执行用户定义的方法
}
Object.defineProperty(wx, 'request', {
  configurable: true,
  enumerable: true,
  writable: true,
  value: function () {
    let config = arguments[0] || {}
    let failFn = config.fail
    let successFn = config.success
    let data = {
      type: 'request',
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
      notifyError(data, 'request')
      return failFn.apply(this, arguments)
    }
    config.success = function (res) {
      if (res.statusCode !== 200) {
        data.statusCode = res.statusCode
        data.msg = res.message
        notifyError(data, 'request')
      } else if (res.data && res.data.status !== 200) {
        data.status = res.data.status
        data.msg = res.data.msg
        notifyError(data, 'request')
      }
      return successFn.apply(this, arguments)
    }
    return originRequest.apply(this, arguments);
  }
})
export default function notifyError (errRow, type) {
  let { brand, model, version, system, platform, SDKVersion } = wx.getSystemInfoSync()
  let data = {
    type,
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
    SDKVersion
  }
  if (type === 'script') {
    let errArr = errRow.split('at ')
    let errType = errArr[1].split('\n')[1].split(':')[0]
    let errMsg = errArr[0].split('\n')[1]
    let errFn = errArr[2].split('(')[0]
    let errPath = errArr[2].split('appservice/')[1].split(':')[0]
    Object.assign(data, {
      errMsg,
      errType,
      errFn,
      errPath
    })
  } else if (type === 'request') {
    Object.assign(data, errRow)
  }
  originRequest({
    url: URL,
    data: data,
    method: 'POST'
  })
}