// pages/commentDetail/commentDetail.js
const app = getApp()

import { getCommentDetail } from '../../utils/api';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    comment: {},
    baseUrl: app.globalData.baseURL,
    openId: wx.getStorageSync('openId'),
    type: 1,
    placeholder: ' 在此输入你的回复~',
    focus: false,//底部输入框是否拉起
    targetId: null
  },


  /**
   * 页面重置函数,指定默认的数据
   */
  resetData: function () {
    this.setData({
      type: 1,
      targetId: this.data.comment.id,
      placeholder: ' 在此输入你的回复~'
    })
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    //得到页面路由传递的参数
    let commentId = options.commentId
    getCommentDetail(commentId).then((result) => {
      console.log('debug', result)
      if (result.status == 200) {
        console.log('data:', result.data)
        this.setData({
          comment: result.data,
          //默认是回复评论
          targetId: commentId
        })
      }
    }).catch((err) => {
      if (err.status && err.status == 300) {
        wx.showToast({
          title: err.message,
          icon: 'none',
          duration: 1000
        });
      }
    });
  },


  /**
   * 进行评论具体内容的刷新
   */
  refreshComment: function () {
    let that = this
    return new Promise(function (resolve, reject) {
      if (that.data.comment.id) {
        let commentId = that.data.comment.id
        getCommentDetail(commentId).then((result) => {
          if (result.status == 200) {
            that.setData({
              comment: result.data
            })
            //重置数据
            that.resetData()
            var response = {
              status: 200
            }
            resolve(response)
          }
        }).catch((err) => {
          console.log(err)
          wx.showToast({
            title: '刷新评论失败~请检查网络',
            icon: 'none',
            duration: 1500
          })
          var response = {
            status: 300
          }
          reject(response)
        })
      }
    })
  },

  /**
   * 绑定回复发送成功的回调函数
   * @param {事件参数} e 
   */
  bindSendSucceed: function (e) {
    console.log('回复内容发送成功,data:', e)
    this.refreshComment()
  },


  /**
   * 绑定input失去焦点的处理函数
   * 重设部分页面的参数值
   * @param {事件参数} e 
   */
  bindblur: function (e) {
    //重设input数据
    this.resetData()
  },

  //进行点赞操作
  startHandle: function (e) {
    console.log("对" + e.currentTarget.dataset.commentid + "进行点赞操作")
  },

  //点击用户的头像或者用户时使用此函数
  clickUser: function (e) {
    console.log("点击用户" + e.currentTarget.dataset.openid)
  },

  //点击评论
  clickComment: function (e) {
    console.log("点击评论" + e.currentTarget.dataset.commentid)
  },


  /**
   * 复制操作
   * 将数据放入系统剪切板 
   **/
  copy: function (e) {
    console.log("长按")
    wx.setClipboardData({
      data: e.currentTarget.dataset.content,
      success(res) {
        console.log(res)
        wx.showToast({
          title: '已复制',
        })
      }
    })
  },


  /**
   * 点击了回复内容
   * @param {事件响应参数} e 
   */
  clickReply: function (e) {
    let replyId = e.currentTarget.dataset.replyid
    console.log("点击回复" + replyId)
    //设置新的placeholder
    const placeholder = '回复用户' + e.currentTarget.dataset.fromuname + '~'
    //拉起输入框,同时设置回复的目标
    this.setData({
      placeholder: placeholder,
      targetId: replyId,
      focus: true,
      type: 2 //回复回复,2类型
    })
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    //进行事件下拉刷新处理
    this.refreshComment().then((result) => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    }).catch((err) => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    })

  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }

})