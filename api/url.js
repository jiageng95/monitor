import request from './http.js'

const baseUrl = 'http://127.0.0.1:7001' // 测试

export const login = (data) => request(baseUrl + '/auth/login', data, 'POST') // 登录
export const getIndex = (data) => request(baseUrl + '/user/info', data) // 获取首页
export const getArticleList = (data) => request(baseUrl + '/article/list', data) // 获取文章列表
export const notifyError = (data) => request(baseUrl + '/debug/submit', data, 'POST') // 上报bug
export const getBugList = (data) => request(baseUrl + '/debug/getBugList', data) // 获取bug列表
export const getBugInfo = (data) => request(baseUrl + '/debug/getBugInfo', data) // 获取bug信息
