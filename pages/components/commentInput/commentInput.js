// pages/components/commentInput/commentInput.js

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
    //页面对应的文章id
    passageid:{
      type:String,
    },
    //评论目标的id
    targetid:{
      type:String,
    },
    //用户的id
    openid:{
      type:String
    }
  },

  /**
   * 组件的初始数据
   * 只能在组件内部使用,事实上,this.data其实就是data+properties
   */
  data: {
    inputValue:'',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 发送评论或者回复
    bindInputConfirm: function () {
      if(this.data.type == 0){
        let commentDTO = {
          fromUid:this.data.openid,
          passageId:this.data.targetid,
          content:this.data.inputValue
        }
        console.log('对文章发起评论,dto:',commentDTO)
      }
      else if(this.data.type == 1){
        console.log('对评论发起回复')
      }
      else if(this.data.type == 2){
        console.log('对回复发起回复')
      }
    },

    // 键盘键入的事件监听
    bindKeyInput: function () {
      console.log('组件进行输入')
    }
  }
})
