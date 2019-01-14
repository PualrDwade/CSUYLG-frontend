//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    this.globalData.sessionId = wx.getStorageSync('sessionId')
    this.globalData.openId = wx.getStorageSync('openId')
    // 登录(已经完成，可忽略了)
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url:this.globalData.baseURL+ '/api/user/login',
          method: "GET",
          data:{
            code:res.code
          },
          success:res=>{
            console.log(res)
            this.globalData.sessionId=res.data.data.sessionId
            this.globalData.openId = res.data.data.openId
            wx.setStorage({
              key: 'sessionId',
              data: res.data.data.sessionId,
            })
            wx.setStorage({
              key: 'openId',
              data: res.data.data.openId,
            })
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          console.log("用户已经获得了授权")
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log(res.userInfo)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                //如果定义了userInfoReadyCallback的方法已经定义了，就调用，否则就不调用
                 this.userInfoReadyCallback(res)
              }
            }
          })
        }else{
          //如果用户尚未授权，将跳转到index界面去进行授权处理
          wx.navigateTo({
            url: '../index/index',
          })
        }
      }
    })
  },
  userInfoReadyCallback:function(res){
    console.log(res)
    this.globalData.userInfo=res.userInfo
    console.log("sessionId"+this.globalData.sessionId)
    wx.request({
      url: this.globalData.baseURL + '/api/user/auth',
      header: {
        'content-type': 'application/json',
        'sessionId':this.globalData.sessionId
      },
      method: "POST",
      data: {
        userDTO:res.userInfo
      },
      success: res => {
        console.log(res)
        console.log("请求成功")
      }
    })
  },
  globalData: {
    sessionId:null,
    openId:null,
    userInfo: null,
    baseURL:"http://120.79.206.32"
  }
})