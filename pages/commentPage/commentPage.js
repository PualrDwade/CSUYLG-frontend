// pages/commentPage/commentPage.js
const app = getApp()
//引入api
import * as api from '../../utils/api.js'
import {
  contentValidate
} from '../../utils/util.js'

Page({

  /**
   * 页面的初始数据和视图层绑定
   */
  data: {
    commentList: [],
    zanList: [],
    startFloor: null, //当前数据加载的起始楼层
    endFloor: null, //当前数据加载的结束楼层
    page: 1, //默认加载1页数据,每次下拉刷新增加1
    baseUrl: app.globalData.baseURL,
    isHideLoadMore: false,
    articleID: "test1",
    openId: null,
    sessionId: null,
    sending: false, //判断输入框当前是否在输入状态
    inputArea: {
      sending: false,
      sendUser: "原文",
      content: "",
      type: 0, //0表示评论文章，1表示回复评论，2表示回复回复
      toID: "", //默认是对文章进行评论的
      bottomH: 0,
      line: 0,
      commentIsNull: true, //判断input的输入框里面是否为空
    }
  },

  //初始化输入参数
  initInputParams: function() {
    this.setData({
      inputArea: {
        sending: false,
        sendUser: "赵日天",
        content: "",
        type: 0, //0表示评论文章，1表示回复评论，2表示回复回复
        toID: "", //默认是对文章进行评论的
        bottomH: 0,
        line: 0,
        commentIsNull: true, //判断input的输入框里面是否为空
      }
    })
  },

  //重设起始楼层与结束楼层的函数
  refreshFloor: function() {
    let comments = this.data.commentList
    console.log(comments)
    this.setData({
      //设置起始楼层和结束楼层
      startFloor: comments[comments.length - 1].floor,
      endFloor: comments[0].floor
    })
  },

  //输入linechange
  linechange: function(e) {
    this.setData({
      ["inputArea.line"]: e.detail.lineCount,
    })
  },


  //输入框的显示函数,关键数据是设置评论对象
  showInput: function(e) {
    console.log("此处展示输入框")
    if (e.currentTarget.dataset.type == 0) {
      //如果是0,表示评论原文
      this.setData({
        ["inputArea.sending"]: true,
        ["inputArea.type"]: 0,
        ["inputArea.sendUser"]: "原文",
        ["inputArea.toID"]: this.data.articleID,
      })
    } else if (e.currentTarget.dataset.type == 1) {
      //如果是1,表示回复评论
      this.setData({
        ["inputArea.sending"]: true,
        ["inputArea.type"]: 1,
        ["inputArea.sendUser"]: e.currentTarget.dataset.username,
        ["inputArea.toID"]: e.currentTarget.dataset.commentid
      })
    } else if (e.currentTarget.dataset.type == 2) {
      //如果是2,表示回复回复
      this.setData({
        ["inputArea.sending"]: true,
        ["inputArea.type"]: 1,
        ["inputArea.sendUser"]: e.currentTarget.dataset.username,
        ["inputArea.toID"]: e.currentTarget.dataset.replyid
      })
    }
  },

  //当聚焦时，将键盘拉起
  inputFocus: function(e) {
    console.log('键盘拉起', e)
    this.setData({
      ["inputArea.bottomH"]: e.detail.height + 290,
    })
  },


  /**
   * 当用户正在输入时，将输入值赋给inputArea.content
   *
   */
  inputing: function(e) {
    this.setData({
      ["inputArea.content"]: e.detail.value
    })
    console.log('进行输入:', this.data.inputArea.content)
  },


  /**当失去聚焦时，判断content是否为空，为空的话则设置成“请输入评论”
   *
   * */
  inputUnFocus: function(e) {
    console.log("失去焦点")
    this.setData({
      ["inputArea.bottomH"]: 0,
      ["inputArea.sending"]: false,
      ["inputArea.type"]: 0 //设置为默认对文章评论
    })
  },



  /**
   * 评论给评论
   */

  /**
   * 评论给回复
   */

  /**
   * 评论给文章
   */


  /**
   * 进行评论(文章,回复,评论),绑定视图实践监听
   * 判断type,分发给不同函数执行
   */

  sendText: function(e) {
    //进行授权操作
    app.setAuthStatus().then(res => {
      if (res.status == 200) {
        //首先判断回复内容,不能为空s
        if (!contentValidate(this.data.inputArea.content)) {
          wx.showToast({
            title: '评论内容不能为空,长度不能大于100',
            icon: 'none'
          })
          return
        }
        //重要~判断评论的具体类型
        if (this.data.inputArea.type == 0) {
          //0代表对文章进行评论
          let commentDTO = {
            content: this.data.inputArea.content,
            fromUid: app.globalData.openId,
            passageId: this.data.articleID
          }
          api.commentToPassage(commentDTO).then(res => {
            if (res.status == 200) {
              wx.showToast({
                title: '评论成功',
                icon: 'success',
                duration: 1000,
                complete: () => {
                  //清空输入框
                  this.initInputParams()
                  //添加成功完成的回调函数,刷新页面数据
                  let refreshDTO = {
                    passageId: this.data.articleID,
                    startFloor: this.data.startFloor,
                    endFloor: this.data.endFloor
                  }
                  api.getRefreshComments(refreshDTO).then(res => {
                    if (res.status == 200) {
                      let newComments = res.data.data.
                      newComments.concat(res.data.data.refreshComments)
                      this.setData({
                        commentList: newComments
                      })
                      this.refreshFloor()
                    }
                  }).catch(res => {
                    wx.showToast({
                      title: '刷新评论失败~请检查网络',
                      icon: 'none',
                      duration: 1500
                    })
                  })
                }
              })
            }
          }).catch(res => {
            wx.showToast({
              title: '评论失败~请检查网络',
              icon: 'none',
              duration: 1000
            })
          })
        } else if (this.data.inputArea.type == 1) {
          console.log('回复评论')
        } else if (this.data.inputArea.type == 2) {
          console.log('回复回复')
        }
      }
    }).catch(res => {
      if (res.status == 300) {
        console.log('用户还没有授权,进行授权操作')
        wx.navigateTo({
          url: '../index/index'
        })
      }
    }).catch(res => {
      if (res.status == 401) {
        //重新登陆
        api.login().then(res => {
          console.log("sessionId过期,重新登录")
          wx.showModal({
            title: '提示',
            content: '登陆已过期~已经为您重新登陆',
            cancelText: false
          }).catch(res => {
            console.log('重新登录失败')
          })
        })
      }
    })
  },


  /**
   * 跳转到评论详情的函数
   */
  showCommentDetail: function(e) {
    console.log(e.currentTarget.dataset.commentid)
    wx.navigateTo({
      url: '../commentDetail/commentDetail?commentId=' + e.currentTarget.dataset.commentid,
    })
  },


  /**
   * 取消点赞的函数
   */
  starHandle: function(e) {
    console.log("对" + e.currentTarget.dataset.commentid + "进行点赞操作")
  },


  /**
   * 点击用户头像的事件处理函数
   */
  clickUser: function(e) {
    console.log("点击用户" + e.currentTarget.dataset.openid)
  },


  /**
   * 复制操作监听函数
   */
  copy: function(e) {
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
  deleteComment: function(e) {
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
                content: '登陆已过期~已经为您重新登陆',
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //从url中获取文章id
    if (options.articleID) {
      this.setData({
        articleID: options.articleID,
      })
    }
    api.login().then(res => {
      console.log('登录成功')
      //设置(页面级别)sessionId和openId
      this.setData({
        openId: wx.getStorageSync('openId'),
        sessionId: wx.getStorageSync('sessionId')
      })
      //登陆成功,使用用户态获取数据
      api.getComments(this.data.articleID, this.data.page).then(res => {
        if (res.status == 200) {
          //刷新楼层数
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
    }).catch(res => {
      console.log('登录失败')
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    console.log('页面渲染完成')
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
   * 下拉刷新的函数
   */
  onPullDownRefresh: function() {
    console.log("下拉动作")
    wx.getSystemInfo({
      success(res) {
        console.log(res)
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   * 加载更多评论
   */
  onReachBottom: function() {
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
          console.log('成功加载到了更多数据')
          this.setData({
            page: this.data.page + 1
          })
          //拼接数据到视图
          this.setData({
            commentList: this.data.commentList.concat(res.data.data)
          })
          //同时刷新楼层信息
          this.refreshFloor()
        }
        //取消加载icon的显示
        setTimeout(() => {
          this.setData({
            isHideLoadMore: false
          })
        }, 100)
      } else {
        wx.showToast({
          title: '加载评论失败~',
          icon: 'none'
        })
      }
    }).catch(res => {

    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    console.log("点击分享")
  }
})