// pages/commentPage/commentPage.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentList:[],
    zanList:[],
    total:0,
    baseUrl:app.globalData.baseURL,
    isHideLoadMore:false,
    articleID:"test1",
    openId:getApp().globalData.openId,
    sending:false,//判断输入框当前是否在输入状态
    inputArea:{
      sending:false,
      sendUser:"赵日天",
      content:"",
      type:0,//0表示进行文章的发帖工作，1表示回复该帖子，2表示回复回复
      toID:"",
      bottomH:0,
      line:0,
      commentIsNull:true,//判断input的输入框里面是否为空
    }
  },
  linechange:function(e){
    this.setData({
      ["inputArea.line"]: e.detail.lineCount,
    })
  },
  showInput:function(e){
    console.log(e)
    console.log("此处展示输入框")
    if(e.currentTarget.dataset.type==0){
      this.setData({
        ["inputArea.type"]: 0,
        ["inputArea.sending"]: true,
        ["inputArea.sendUser"]:"原文",
        ["inputArea.toID"]:this.data.articleID,
      })
    }else{
      this.setData({
        ["inputArea.sending"]:true,
        ["inputArea.type"]:1,
        ["inputArea.sendUser"]:e.currentTarget.dataset.username,
        ["inputArea.toID"]:e.currentTarget.dataset.commentid
      })
    }
    console.log(this.data.inputArea)
  },
  //当聚焦时，将键盘拉起
  inputFocus:function(e){
    console.log(e)
    this.setData({
      ["inputArea.bottomH"]: e.detail.height+290,
    })
  },
  //当用户正在输入时，将输入值赋给inputArea.content
  inputing:function(e){
    this.setData({
      ["inputArea.content"]: e.detail.value
    })
    console.log(this.data.inputArea.content)
  },
  //当失去聚焦时，判断content是否为空，为空的话则设置成“请输入评论”
  inputUnFocus: function (e) {
    console.log("失去焦点")
    this.setData({
      ["inputArea.bottomH"]: 0,
      ["inputArea.sending"]: false
    })
  },
  sendText:function(e){
    console.log(this.data.inputArea)
  },
  jumpCommentDetailPage:function(e){
    console.log(e.currentTarget.dataset.commentid)
    wx.navigateTo({
      url: '../commentDetail/commentDetail?commentID='+e.currentTarget.dataset.commentid,
    })
  },
  zanDeal: function(e){
    console.log("对"+e.currentTarget.dataset.commentid+"进行点赞操作")
  },
  //点击用户的头像或者用户时使用此函数
  clickUser:function(e){
    console.log("点击用户"+e.currentTarget.dataset.openid)
  },
  clickComment:function(e){
    console.log("点击评论"+e.currentTarget.dataset.commentid)
    this.setData({
      ["inputArea.sending"]: true,
      ["inputArea.type"]: 1,
      ["inputArea.toID"]: e.currentTarget.dataset.commentid,
      ["inputArea.sendUser"]: e.currentTarget.dataset.username,
    })
    console.log(this.data.inputArea)
  }, 
  copy: function (e) {
    console.log("长按")
    wx.setClipboardData({
      data: e.currentTarget.dataset.content,
      success(res){
        wx.showToast({
          title: '已复制',
        })
      }
    })
  },
  deleteComment:function(e){
    console.log("删除评论"+e.currentTarget.dataset.commentid)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.articleID){
      this.setData({
        articleID: options.articleID
      })
    }
    console.log("获取文章ID"+this.data.articleID+"的前十条评论区，递减序")
    wx.request({
      url: this.data.baseUrl+'/api/passage/'+this.data.articleID+'/comments',
      method:'GET',
      data:{
        page:1
      },
      success:res=>{
        console.log(res)
        this.setData({
          commentList:res.data.data
        })
      }

    })
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
    console.log("下拉动作")
    wx.getSystemInfo({
      success(res) {
        console.log(res)
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("加载更多")
    this.setData({
      isHideLoadMore: true
    })
    setTimeout(() => {
      this.setData({
        isHideLoadMore: false,
      })
    }, 1000)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
      console.log("点击分享")
  }
})