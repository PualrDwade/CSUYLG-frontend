// pages/components/commentInput/commentInput.js

//引入api
import {
  commentToPassage,
  replyToComment
} from '../../../utils/api';

import {
  bussinessTemplate
} from '../../../utils/bussinessTemplate';
import {
  contentValidate,
  filterEmoji
} from '../../../utils/util';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 占位符绑定数据,用户可以自定义
    placeholder: {
      type: String,
      value: ' 在此输入你的回复~',
    },
    //输入框聚焦控制
    focus: {
      type: Boolean,
      value: false
    },
    //评论方式,0表示评论,1表示回复评论,3表示回复回复
    type: {
      type: Number,
      value: '0' //默认对文章评论
    },
    //评论目标的id
    targetId: {
      type: String,
    },
    //用户的id
    openId: {
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


    /**
     * 点击确认发送,判断内容
     */
    bindInputConfirm: function () {
      if (this.data.type == 0) {
        //进行评论
        let commentDTO = {
          fromUid: this.data.openId,
          passageId: this.data.targetId,
          content: filterEmoji(this.data.inputValue) //过滤emoji
        }
        console.log('对文章发起评论,dto:', commentDTO)
        //使用业务模版调用具体的业务
        bussinessTemplate(this.addComment, commentDTO).then((result) => {
          if (result.status == 200) {
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
        }).catch((err) => {
          console.log('未知错误:', err)
        });
      } else {
        //进行回复
        let replyDTO = {
          content: filterEmoji(this.data.inputValue),
          fromUid: this.data.openId,
          replyType: this.data.type,
          replyId: this.data.targetId
        }
        console.log('对评论', replyDTO.replyId, '发起回复,data:', replyDTO)
        bussinessTemplate(this.addReply, replyDTO).then(res => {
          if (res.status == 200) {
            wx.showToast({
              title: '回复成功',
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
          console.log(res)
        })
      }
    },



    /**
     * 键盘输入的事件监听
     * @param {键盘输入} e 
     */
    bindKeyInput: function (e) {
      //设置值,绑定输入内容框
      this.setData({
        //确保为字符串
        inputValue: ""+e.detail.value
      })
    },



    /**
     * 进行评论的业务方法
     * 业务方法只需要完成业务级别的验证
     * 异常只需要用reject将api的响应返回
     * 减轻了方法的职责
     * 使用模版方法设计模式减少重复验证代码
     * @param {评论传输对象} commentDTO 
     */
    addComment: function (commentDTO) {
      return new Promise(function (resolve, reject) {
        //首先判断回复内容是否合理
        if (!contentValidate(commentDTO.content)) {
          wx.showToast({
            title: '评论或回复内容不能为空,长度在10-30字之间哟~',
            icon: 'none',
            duration: 1500
          })
          return
        }
        //进行api请求
        commentToPassage(commentDTO).then(res => {
          resolve(res)
        }).catch(res => {
          reject(res)
        })
      })
    },



    /**
     * 进行回复的业务方法
     * 业务方法只需要完成业务级别的验证
     * 异常只需要用reject将api的响应返回
     * 减轻了方法的职责
     * 使用模版方法设计模式减少重复验证代码
     * @param {回复传输对象,对评论或者回复进行回复} replyDTO 
     */
    addReply: function (replyDTO) {
      return new Promise(function (resolve, reject) {
        //首先判断回复内容是否合理
        if (!contentValidate(replyDTO.content)) {
          wx.showToast({
            title: '评论或回复内容不能为空,长度在10-30字之间哟~',
            icon: 'none',
            duration: 2000
          })
          return
        }
        //进行api请求
        replyToComment(replyDTO).then(res => {
          resolve(res)
        }).catch(res => {
          reject(res)
        })
      })
    },



    /**
     * 绑定输入框失去焦点时的动作
     * @param {时间参数} e 
     */
    bindblur: function (e) {
      this.triggerEvent('cancleInput', {})
    }
  },




})