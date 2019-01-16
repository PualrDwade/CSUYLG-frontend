//app.js
import {
  auth
} from 'utils/api.js'

App({
  // 设置全局数据
  globalData: {
    baseURL: "http://api.xuanxuan.store"
  },

  /**
   * 判断是否授权,如果没有授权则返回错误码
   * 如果已授权则直接拉取用户信息,同步本地与远程 
   */
  setAuthStatus: function() {
    let that = this
    return new Promise(function(resolve, reject) {
      //获取用户授权状态,如果已授权,则同步授权数据
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            //已经授权了,可以直接获取用户的详细信息
            wx.getUserInfo({
              success: res => {
                console.log("得到用户基本信息:", res.userInfo)
                //本地数据同步
                wx.setStorageSync(
                  'userInfo',
                  res.userInfo,
                )
                //调用后端同步auth的api
                auth(wx.getStorageSync('userInfo')).then(res => {
                  if (res.status == 200) {
                    var response = {
                      status: 200
                    }
                    resolve(response)
                  }
                }).catch(res => {
                  console.log("auth api请求失败,服务器用户数据同步失败")
                })
              }
            })
          } else {
            //如果用户尚未授权
            console.log('用户没有授权,请进行授权')
            var response = {
              status: 300
            }
            reject(response)
          }
        }
      })
    })
  },

  /**
   *  小程序启动函数
   */
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    console.log("app onlauch 执行结束")
  },

})