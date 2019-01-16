// pages/commentDetail/commentDetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comment: {},
    baseUrl: app.globalData.baseURL,
    inputArea: {
      sending: false,
      sendUser: "赵日天",
      content: "",
      type: 0, //0表示进行文章的发帖工作，1表示回复该帖子，2表示回复回复
      toID: "",
      bottomH: 0,
      line: 0,
      commentIsNull: true, //判断input的输入框里面是否为空
    }
  },

  //进行点赞操作
  startHandle: function(e) {
    console.log("对" + e.currentTarget.dataset.commentid + "进行点赞操作")
  },

  //点击用户的头像或者用户时使用此函数
  clickUser: function(e) {
    console.log("点击用户" + e.currentTarget.dataset.openid)
  },

  //点击评论
  clickComment: function(e) {
    console.log("点击评论" + e.currentTarget.dataset.commentid)
  },

  //复制
  copy: function(e) {
    console.log("长按")
    console.log(e)
  },

  //点击回复
  clickReply: function(e) {
    console.log("点击回复" + e.currentTarget.dataset.replyid)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let commentId = options.commentId
    wx.request({
      url: this.data.baseUrl + '/api/comment/' + commentId + '/replys',
      method: 'get',
      success: res => {
        console.log('返回消息:', res.data)
        this.setData({
          comment: res.data.data
        })
      }

    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})