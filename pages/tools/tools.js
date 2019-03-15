
import * as util from '../../utils/util';
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 表单提交生成UUID,复制进入剪切板
   */
  generate: function () {
    let uuid = util.generateUUID();
    wx.setClipboardData({
      data: uuid,
      success: (result) => {
        wx.hideToast();
        wx.showModal({
          title: '成功',
          content: '生成文章id:\n' + uuid + "\n已复制到剪切板",
          confirmText: '确定',
          showCancel: false,
          confirmColor: '#3CC51F',
          success: (result) => {
            if (result.confirm) {

            }
          },
          fail: () => { },
          complete: () => { }
        });
      },
    })
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