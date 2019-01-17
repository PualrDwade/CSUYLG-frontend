//app.js
import * as api from 'utils/api.js'

App({
  // 设置全局数据
  globalData: {
    baseURL: "http://api.xuanxuan.store",
    openId: null,
    sesiionId: null,
    hasLoginStatus: null
  },

  /**
   * 判断是否授权,如果没有授权则返回错误码
   * 如果已授权则返回结果
   */
  isAuthStatus: function () {
    return new Promise(function (resolve, reject) {
      //获取用户授权状态,如果已授权,则同步授权数据
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            //已经授权了,可以直接获取用户的详细信息
            console.log('用户已经授权了,不需要再授权')
            var response = {
              status: 200
            }
            resolve(response)
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
  onLaunch: function () {
    const promise = new Promise(function (resolve, reject) {
      //进行登陆,登陆之后绑定全局id
      api.login().then((result) => {
        if (result.status == 200) {
          console.log("app启动登陆成功")
          var response = {
            status: 200
          }
          resolve(response)
        }
      }).catch((err) => {
        console.log("app启动登陆失败", err)
        var response = {
          status: 300
        }
        reject(response)
      })
    })
    this.globalData.hasLoginStatus = promise
  }
})