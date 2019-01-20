const URL = 'http://127.0.0.1:7001/debug/submit'
const originRequest = wx.request;
const originApp = App;

App = function (app) {
  // let onErrorFn = app.onError
  // app.onError = function (err) {
  //   notifyError(err, 1)
  //   return onErrorFn.apply(this, arguments)
  // }
  let methodArr = ['onLaunch', 'onShow', 'onHide', 'onError']
  methodArr.forEach(methodName => {
    app[methodName] = function (options) {
      console.log(methodName,options)
      if (methodName === 'onError') {
        notifyError(options, 1)
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
      notifyError(data, 2)
      return failFn.apply(this, arguments)
    }
    config.success = function (res) {
      data.statusCode = res.statusCode
      if (res.statusCode !== 200) {
        data.msg = res.message || ''
        notifyError(data, 2)
      } else if (res.data && res.data.status !== 200) {
        data.status = res.data.status || null
        data.msg = res.data.msg || ''
        notifyError(data, 2)
      }
      return successFn.apply(this, arguments)
    }
    return originRequest.apply(this, arguments);
  }
})
export default function notifyError (errRow, type) { // type: 1. script  2. request
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
  if (type === 1) {
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
  } else if (type === 2) {
    Object.assign(data, errRow)
  }
  originRequest({
    url: URL,
    data: data,
    method: 'POST'
  })
}