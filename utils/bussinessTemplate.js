import { login } from './api';

/**
 * 使用模版方法设计模式减少业务代码量
 * 对需要的请求进行权限验证的封装
 * 
 * @param {需要被封装的业务请求} functionalAPI 
 * @param {函数调用的数据对象} data 
 */
export const bussinessTemplate = function (functionalAPI, data) {
  return new Promise(function (resolve, reject) {
    //在调用之前进行授权判断
    getApp().isAuthStatus().then(res => {
      if (res.status == 200) {
        //调用业务流程
        console.log('开始调用业务流程')
        functionalAPI(data).then(res => {
          if (res.status == 200) {
            //业务流程成功
            var response = {
              status: 200
            }
            resolve(response)
          }
        }).catch(res => {
          if (res.status == 401) {
            wx.showToast({
              title: '登陆状态失效,请重试',
              icon: 'none',
              duration: 1000
            })
            //重新登陆
            login().then((result) => {
              wx.showToast({
                title: '已经为您重新登陆~继续浏览吧~',
                icon: 'none',
                duration: 1000
              })
            }).catch((err) => {
              wx.showToast({
                title: '重新登陆失败,请重启小程序',
                icon: 'none',
                duration: 1000
              })
            });
          } else {
            wx.showToast({
              title: '操作失败~请检查网络',
              icon: 'none',
              duration: 1000
            })
          }
        })
      }
    }).catch(res => {
      if (res.status == 300) {
        console.log('用户还没有授权,进行授权操作')
        wx.navigateTo({
          url: '../index/index'
        })
      }
      else if (res.status == 401) {
        //重新登陆
        login().then(res => {
          console.log("sessionId过期,重新登录")
          wx.showToast({
            title: '登陆已过期~已经为您重新登陆',
            icon: 'none',
            duration: 1500,
          })
        })
      }
      else {
        //发生了未知的异常
        console.log(res)
      }
    })
  })
}