// pages/home/home.js
import * as util from '../../utils/util';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '',
  },

  /**
   * 
   * @param {事件参数} e 
   */
  bindKeyInput: function (e) {
    //设置值,绑定输入内容框
    this.setData({
      inputValue: e.detail.value
    })
  },

  /**
   * 
   * @param {事件参数} e 
   */
  search: function (e) {
    if (!util.searchValidate(this.data.inputValue)) {
      wx.showToast({
        title: '文章id不能为空!',
        icon: 'none',
        duration: 1500,
        mask: true,
      });
      this.setData({
        inputValue: ''
      })
    } else {
      let articleId = this.data.inputValue
      this.setData({
        inputValue: ''
      })
      //查询
      wx.navigateTo({
        url: '/pages/commentPage/commentPage?articleId=' + articleId,
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})