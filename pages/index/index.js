//index.js
//获取应用实例
const app = getApp()
import {
  auth
} from '../../utils/api.js'

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  //按钮绑定的事件
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //使用openID进行用户信息的修改
      console.log('点击了确认授权按钮,返回数据:', e)
      console.log("得到了app全局的userInfo", e.detail.userInfo, '同时存入本地')
      //存入本地
      wx.setStorageSync('userInfo', e.detail.userInfo)
      //同时发起后端api的数据同步请求
      auth(e.detail.userInfo).then(res => {
        if (res.status == 200) {
          console.log('auth api请求成功~数据同步成功!')
        }
      }).catch(res => {
        console.log('auth api请求失败~数据同步失败')
      })
      wx.navigateBack({})
    } else {
      console.log('用户取消了授权操作~')
    }
  },

  // 页面初始化加载
  onLoad: function () {
    if (wx.getStorageSync('userInfo')) {
      this.setData({
        userInfo: wx.getStorageSync('userInfo'),
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
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
          wx.setStorageSync(
            'userInfo',
            res.userInfo
          )
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
})