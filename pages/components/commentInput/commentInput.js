// pages/components/commentInput/commentInput.js

//引入api
import {
  commentToPassage,
  replyToComment
} from '../../../utils/api';

import { contentValidate } from '../../../utils/util';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 占位符绑定数据,用户可以自定义
    placeholder: {
      type: String,
      value: ' 请进行输入'
    },
    //评论方式,0表示评论,1表示回复评论,3表示回复回复
    type: {
      type: Number,
      value: '0'//默认对文章评论
    },
    //评论目标的id
    targetid: {
      type: String,
    },
    //用户的id
    openid: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   * 只能在组件内部使用,事实上,this.data其实就是data+properties
   */
  data: {
    inputValue: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {

    //初始化组件数据的方法
    initData: function () {
      this.setData({
        inputValue: '',
      })
    },

    // 发送评论或者回复
    bindInputConfirm: function () {
      if (this.data.type == 0) {
        let commentDTO = {
          fromUid: this.data.openid,
          passageId: this.data.targetid,
          content: this.data.inputValue
        }
        console.log('对文章发起评论,dto:', commentDTO)
        this.addComment(commentDTO)
      }
      else if (this.data.type == 1) {
        console.log('对评论发起回复')
      }
      else if (this.data.type == 2) {
        console.log('对回复发起回复')
      }
    },

    // 键盘键入的事件监听
    bindKeyInput: function (e) {
      console.log('组件进行输入', e)
      this.setData({
        inputValue: e.detail.value
      })
    },

    /**
    * 进行评论
    * @param {评论传输对象,对文章进行评论} commentDTO 
    */
    addComment: function (commentDTO) {
      //进行授权判断        
      getApp().isAuthStatus().then(res => {
        if (res.status == 200) {
          if (!contentValidate(commentDTO.content)) {
            wx.showToast({
              title: '评论或回复内容不能为空,长度在10-50字之间哟~',
              icon: 'none',
              duration: 2000
            })
            return
          }
          //进行api请求
          commentToPassage(commentDTO).then(res => {
            if (res.status == 200) {
              wx.showToast({
                title: '评论成功',
                icon: 'success',
                duration: 1000,
                complete: () => {
                  //清空输入框
                  this.initData()
                  //触发成功发送事件,其他页面监听事件进行响应
                  this.triggerEvent('sendSucceed', {})
                }
              })
            }
          }).catch(res => {
            if (res.status == 401) {
              wx.showToast({
                title: '登陆状态失效,请重试',
                icon: 'none',
                duration: 1000
              })
              //重新登陆
              api.login().then((result) => {
                wx.showToast({
                  title: '已经为您重新登陆~继续浏览吧~',
                  icon: 'none',
                  duration: 1000
                })
              }).catch((err) => {
                wx.showToast({
                  title: '重新登陆失败,请重启小程序',
                  icon: 'none',
                  duration: 1000
                })
              });
            } else {
              wx.showToast({
                title: '操作失败~请检查网络',
                icon: 'none',
                duration: 1000
              })
              console.log(res)
            }
          })
        }
      }).catch(res => {
        if (res.status == 300) {
          console.log('用户还没有授权,进行授权操作')
          wx.navigateTo({
            url: '../index/index'
          })
        }
        else if (res.status == 401) {
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
        else {
          console.log(res)
        }
      })
    },


    /**
     * 进行回复
     * @param {回复传输对象,对评论或者回复进行回复} replyDTO 
     */
    addReply: function (replyDTO) {
      let that = this
      return new Promise(function (resolve, reject) {
        //发起api请求
      })
    }
  },

})
