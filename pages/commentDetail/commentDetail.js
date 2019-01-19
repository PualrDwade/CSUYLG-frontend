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
    focus:false,//底部输入框是否拉起
    targetId: null
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
   * 
   **/
  copy: function (e) {
    console.log("长按")
    console.log(e)
  },

  //点击回复
  clickReply: function (e) {
    console.log("点击回复" + e.currentTarget.dataset.replyid)
    //拉起输入框
    this.setData({
      focus:true
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})