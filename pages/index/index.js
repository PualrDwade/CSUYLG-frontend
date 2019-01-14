//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  bindGetUserInfo:function(e){
    if(e.detail.userInfo){
      //如果用户点击了确定按钮进行授权
      //使用openID进行用户信息的修改
      console.log(e)
      //既然已经授权了就tm的赶快提交你的个人信息吧。唉，真是麻烦
      app.bindGetUserInfo(e.detail.userInfo)
      //啊，终于上传完了，既然上传完了，就返回刚才的那个页面阿布
      wx.navigateBack({
      })
    }else{
      //如果用户点击了拒绝按钮拒绝授权,那就tm的强制他授权，不授权我咋干活啊，真是会给我们找事情，写个逻辑我容易么？为什么就有人点开小程序却不授权嗯？没错，说得就是你
      console.log("用户点击了拒绝授权按钮")
      wx.showModal({
        title: 'ヾ(￣0￣； )ノ',
        content: '还能不能好好玩耍了，不授权我咋获取你的信息呢？快重新给我权限',
        showCancel:false,
        confirmText:"返回授权",
        success:function(res){
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
