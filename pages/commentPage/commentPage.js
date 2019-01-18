// pages/commentPage/commentPage.js
const app = getApp()
//引入api
import * as api from '../../utils/api.js'
//引入service层
import {
  contentValidate
} from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据和视图层绑定
   */
  data: {
    // commentService:new commentService(),
    commentList: [],
    startFloor: null, //当前数据加载的起始楼层
    endFloor: null, //当前数据加载的结束楼层
    page: 1, //默认加载1页数据,每次下拉刷新增加1
    isHideLoadMore: false,
    articleID: null,
    openId: null, //绑定全局openId
  },


  /**
   * 重设起始楼层与结束楼层的函数
   */
  refreshFloor: function () {
    let comments = this.data.commentList
    //判断是否还有评论,如果没有,则楼层设为默认值
    if (comments.length > 0) {
      this.setData({
        //设置起始楼层和结束楼层
        startFloor: comments[comments.length - 1].floor,
        endFloor: comments[0].floor
      })
    }
    else {
      this.setData({
        //设置起始楼层和结束楼层
        startFloor: 0,
        endFloor: 0
      })
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //得到promise的callback之后设置数据,强行维持同步请求
    app.globalData.hasLoginStatus.then(() => {
      //设置(页面级别)sessionId和openId
      this.setData({
        openId: wx.getStorageSync('openId'),
      })
    }).catch(() => {
      wx.showToast({
        title: '登陆状态获取失败',
        icon: 'none'
      })
    })
    //从url中获取文章id
    if (options.articleID) {
      this.setData({
        articleID: options.articleID,
      })
    }
    else {
      this.setData({
        articleID: 'test2',
      })
    }
    //随后发起api请求
    api.getComments(this.data.articleID, this.data.page).then(res => {
      if (res.status == 200) {
        //判断是否有评论内容,如果没有,则设置默认的初始值
        this.setData({
          commentList: res.data.data
        })
        this.refreshFloor()
      }
    }).catch(res => {
      console.log(res)
      wx.showModal({
        title: '提示',
        content: '文章评论获取失败,请检查网络~',
      })
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('页面渲染完成')
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
    console.log('用户卸载了页面')
  },


  /**
   * 下拉刷评论
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    let refreshDTO = {
      startFloor: this.data.startFloor,
      endFloor: this.data.endFloor,
      passageId: this.data.articleID
    }
    //刷新评论,进行用户提示
    this.refreshComments(refreshDTO).then(res => {
      if (res.addNum == 0) {
        wx.showToast({
          title: '没有新评论哦~',
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: '新增' + res.addNum + '条评论~',
          icon: 'none'
        })
      }
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    }).catch(res => {
      console.log(res)
    })
  },


  /**
   * 加载更多评论
   */
  onReachBottom: function () {
    //显示加载更多的加载icon,
    this.setData({
      isHideLoadMore: true
    })
    //发起页面刷新请求
    let passageId = this.data.articleID
    api.getComments(passageId, this.data.page + 1).then(res => {
      if (res.status == 200) {
        //判断是否有数据,如果有,则page+1表示多获得了一页的数据
        if (res.data.data.length != 0) {
          this.setData({
            commentList: this.data.commentList.concat(res.data.data),
            page: this.data.page + 1
          })
          this.refreshFloor()
          this.setData({
            isHideLoadMore: false
          })
        } else {
          console.log('到底了,没有更多数据了!')
          // 设置动画延时
          setTimeout(() => {
            this.setData({
              isHideLoadMore: false
            })
            wx.showToast({
              title: '评论已经到底了哟~',
              icon: 'none',
            })
          }, 500)
        }
      }
    }).catch(res => {
      // 设置动画延时
      setTimeout(() => {
        this.setData({
          isHideLoadMore: false
        })
        wx.showToast({
          title: '加载更多评论失败啦~请检查网络',
          icon: 'none'
        })
      }, 1000)
    })
  },





  /**
   * 刷新文章的评论数据
   * @param {评论刷新数据} refreshDTO 
   */
  refreshComments: function (refreshDTO) {
    let that = this
    return new Promise(function (resolve) {
      api.getRefreshComments(refreshDTO).then(res => {
        if (res.status == 200) {
          let newComments = res.data.data.newComments.concat(res.data.data.refreshComments)
          that.setData({
            commentList: newComments
          })
          that.refreshFloor()
          //判断是否有新的评论,生成回调
          var response = {
            addNum: res.data.data.addNum
          }
          resolve(response)
        }
      }).catch(res => {
        console.log(res)
        wx.showToast({
          title: '刷新评论失败~请检查网络',
          icon: 'none',
          duration: 1500
        })
      })
    })
  },


  /**
   * 取消点赞的函数
   */
  starHandle: function (e) {
    console.log("对" + e.currentTarget.dataset.commentid + "进行点赞操作")
  },


  /**
   * 点击用户头像的事件处理函数
   */
  clickUser: function (e) {
    console.log("点击用户" + e.currentTarget.dataset.openid)
  },


  /**
   * 复制操作监听函数
   */
  copy: function (e) {
    console.log("长按")
    wx.setClipboardData({
      data: e.currentTarget.dataset.content,
      success(res) {
        wx.showToast({
          title: '已复制',
        })
      }
    })
  },


  /**
   * 点击删除评论的事件处理函数
   */
  deleteComment: function (e) {
    wx.showModal({
      title: '提示',
      content: '确认删除该评论嘛~',
      success: res => {
        //判断用户是否点击了确认
        if (!res.confirm) {
          return
        }
        console.log("删除评论" + e.currentTarget.dataset.commentid)
        const commentId = e.currentTarget.dataset.commentid
        api.deleteComment(commentId).then(res => {
          if (res.status == 200) {
            wx.showToast({
              title: '删除评论成功',
              icon: 'success',
              duration: 1000,
              complete: res => {
                //回调函数,从视图变量中删除评论
                this.setData({
                  commentList: this.data.commentList.filter(item => {
                    return item.id != commentId
                  })
                })
                this.refreshFloor()
              }
            })
          }
        }).catch(res => {
          if (res.status == 300) {
            wx.showToast({
              title: '删除评论失败',
              icon: 'success',
              duration: 1000
            })
          }
        }).catch(res => {
          if (res.status == 401) {
            //重新登陆
            api.login().then(res => {
              console.log("sessionId过期,重新登录")
              wx.showModal({
                title: '提示',
                content: '登陆已过期~为您重新登陆',
              }).catch(res => {
                console.log('重新登录失败')
              })
            })
          }
        })
      }
    })
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log("点击分享")
  },


  /**
   * 绑定发送评论成功的回调函数
   * @param {事件参数} e 
   */
  bindSendSucceed: function (e) {
    console.log('评论发送成功,数据:', e)
    let refreshDTO = {
      startFloor: this.data.startFloor,
      endFloor: this.data.endFloor,
      passageId: this.data.articleID
    }
    //刷新评论
    this.refreshComments(refreshDTO)
  }
})