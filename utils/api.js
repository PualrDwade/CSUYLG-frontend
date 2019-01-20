/**
 * @author:PuarlDwade
 * @create at 2019/1/12
 * @note:api接口工具模块
 */

/**
 * 进行登陆的api接口,获取sessionId与openId存入本地
 */
export const login = function () {
  return new Promise(function (resolve, reject) {
    console.log("得到了app")
    wx.login({
      success: res => {
        wx.request({
          url: getApp().globalData.baseURL + '/api/user/login?code=' + res.code,
          method: "GET",
          success: function (res) {
            if (res.data.code == 200) {
              console.log('发起后台登陆请求,结果为:', res, '同时写入本地缓存')
              wx.setStorageSync(
                'sessionId',
                res.data.data.sessionId,
              )
              wx.setStorageSync(
                'openId',
                res.data.data.openId,
              )
              //构造返回值
              var response = {
                status: 200,
              }
              resolve(response)
            } else {
              console.log('登陆api请求失败,结果为:', res)
              var response = {
                status: 300
              }
              reject(response)
            }
          },
          fail: res => {
            console.log('wx.login请求发起失败')
            var response = {
              status: 300,
            }
            reject(response)
          }
        })
      },
    })
  })
}


/**
 * 进行文章评论的api接口
 */
export const commentToPassage = function (commentDTO) {
  return new Promise(function (resolve, reject) {
    commentDTO.fromUid = wx.getStorageSync('openId')
    //使用promise封装请求
    wx.request({
      url: getApp().globalData.baseURL + '/api/comment',
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'sessionId': wx.getStorageSync('sessionId')
      },
      data: JSON.stringify(commentDTO),
      success: function (res) {
        if (res.data.code == 200) {
          console.log('评论成功', res)
          var response = {
            status: 200
          }
          resolve(response)
        } else if (res.data.code == 401) {
          var response = {
            status: 401
          }
          reject(response)
        }
      },
      fail: function () {
        var response = {
          status: 300
        }
        reject(response)
      }
    })
  })
}


/**
 * 进行后端auth同步的api接口
 */
export const auth = function (userInfo) {
  return new Promise(function (resolve, reject) {
    // 添加openId字段
    userInfo.id = wx.getStorageSync('openId')
    console.log("授权状态发起,请求数据为:\n", userInfo)
    wx.request({
      url: getApp().globalData.baseURL + '/api/user/auth',
      dataType: 'json',
      data: JSON.stringify(userInfo),
      header: {
        'content-type': 'application/json',
        'sessionId': wx.getStorageSync('sessionId')
      },
      method: 'POST',
      success: res => {
        if (res.data.code == 200) {
          var response = {
            status: 200
          }
          resolve(response)
        } else if (res.data.code == 401) {
          //sessionId失效
          var response = {
            status: 401
          }
          reject(response)
        }
      },
      fail: res => {
        var response = {
          status: 300
        }
        reject(response)
      }
    })
  })
}


/**
 * 获取文章评论回复数据的api接口
 * @Param:passageId:文章id
 * @Param:page:分页的页数
 */
export const getComments = function (passageId, page) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: getApp().globalData.baseURL + '/api/passage/' + passageId + '/comments?page=' + page,
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'sessionId': wx.getStorageSync('sessionId')
      },
      success: res => {
        if (res.data.code == 200) {
          console.log(res.data)
          console.log("文章评论内容api请求成功")
          var response = {
            status: 200,
            data: res.data
          }
          resolve(response)
        } else {
          var response = {
            status: 300,
            data: res.data
          }
          reject(response)
        }
      }
    })
  })
}


/**
 * 删除回复内容api接口
 */
export const deleteComment = function (commentId) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: getApp().globalData.baseURL + '/api/comment/' + commentId,
      header: {
        'content-type': 'application/json',
        'sessionId': wx.getStorageSync('sessionId')
      },
      method: 'DELETE',
      success: function (res) {
        if (res.data.code == 200) {
          console.log("删除评论api请求成功")
          var response = {
            status: 200
          }
          resolve(response)
        } else if (res.data.code == 401) {
          //sessionId失效,返回错误信息
          var response = {
            status: 401
          }
          reject(response)
        } else {
          console.log(res.data)
          var response = {
            status: 300,
            message: res.data.message
          }
          reject(response)
        }
      },
      fail: function (res) {
        console.log("wx.request请求发起失败")
      }
    })
  })
}


/**
 * 文章评论刷新的接口
 * @Param:refreshDTD:
 * refreshDTO
 */
export const getRefreshComments = function (refreshDTO) {
  return new Promise(function (resolve, reject) {
    console.log(refreshDTO)
    wx.request({
      url: getApp().globalData.baseURL + '/api/passage/comments/refresh',
      data: JSON.stringify(refreshDTO),
      header: {
        'content-type': 'application/json',
        'sessionId': wx.getStorageSync('sessionId')
      },
      method: 'POST',
      success: function (res) {
        if (res.data.code == 200) {
          console.log('文章评论数据刷新成功,数据为:', res.data)
          var response = {
            status: 200,
            data: res.data
          }
          resolve(response)
        } else {
          console.log('文章刷新api请求失败')
          var response = {
            status: 300,
            data: res.data
          }
          reject(response)
        }
      },
      fail: function (res) {
        console.log('wx.request请求失败')
        var response = {
          status: 300
        }
        reject(response)
      },
    })
  })
}


/**
 * 根据评论id得到评论的详情内容
 * @param {评论的id} commentId 
 */
export const getCommentDetail = function (commentId) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: getApp().globalData.baseURL + '/api/comment/' + commentId + '/replys',
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'sessionId': wx.getStorageSync('sessionId')
      },
      success: res => {
        if (res.data.code == 200) {
          console.log('评论详情api请求成功,返回消息:', res.data)
          var response = {
            status: 200,
            data: res.data.data
          }
          resolve(response)
        }
        else {
          //请求失败,直接把log显示给前端
          var response = {
            status: 300,
            message: res.data.message
          }
          reject(response)
        }
      },
      fail: function (res) {
        console.log('wx.request请求失败')
        var response = {
          status: 300,
          message: '请求失败~请检查网络哟'
        }
        reject(response)
      }
    })
  })
}


/**
 * 进行回复的api接口 
 * @param {*} replyDTO 
 */
export const replyToComment = function (replyDTO) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: getApp().globalData.baseURL + '/api/reply',
      data: JSON.stringify(replyDTO),
      header: {
        'content-type': 'application/json',
        'sessionId': wx.getStorageSync('sessionId')
      },
      method: 'POST',
      success: (result) => {
        if (result.data.code == 200) {
          console.log("回复api请求成功")
          var response = {
            status: 200
          }
          resolve(response)
        }
        else if (result.data.code == 401) {
          var response = {
            status: 401
          }
          reject(response)
        }
      },
      fail: () => {
        console.log("wx.request发起失败")
        var response = {
          status: 300
        }
        reject(response)
      },
    });
  })
}


/**
 * 删除回复内容
 * @param {回复id} replyId 
 */
export const deleteReply = function (replyId) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: getApp().globalData.baseURL + '/api/reply/' + replyId,
      header: {
        'content-type': 'application/json',
        'sessionId': wx.getStorageSync('sessionId')
      },
      method: 'DELETE',
      success: function (res) {
        if (res.data.code == 200) {
          console.log("删除回复api请求成功")
          var response = {
            status: 200
          }
          resolve(response)
        } else if (res.data.code == 401) {
          //sessionId失效,返回错误信息
          var response = {
            status: 401
          }
          reject(response)
        } else {
          console.log(res.data)
          var response = {
            status: 300,
            message: res.data.message
          }
          reject(response)
        }
      },
      fail: function (res) {
        console.log("wx.request请求发起失败")
      }
    })
  })
}


/**
 * 对目标进行点赞操作,无法重复点赞
 * @param {点赞传输对象} starDTO
 * {
  "toId": "string",
  "toType": 0,
  "userId": "string"
} 
 */

export const addStar = function (starDTO) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: getApp().globalData.baseURL + '/api/star',
      data: JSON.stringify(starDTO),
      header: {
        'content-type': 'application/json',
        'sessionId': wx.getStorageSync('sessionId')
      },
      method: 'POST',
      success: (result) => {
        console.log(result)
        if (result.data.code == 200) {
          var response = {
            status: 200
          }
          resolve(response)
        }
        else if (result.data.code == 401) {
          var response = {
            status: 401
          }
          reject(response)
        }
        else if (result.data.code == 400) {
          var response = {
            status: 300,
            message: result.data.message
          }
          reject(response)
        }
      },
      fail: () => {
        console.log('wx.request发起失败')
      }
    })
  })
}