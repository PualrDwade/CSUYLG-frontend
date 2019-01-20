
import {
    addStar,
    login
} from '../utils/api';


/**
 * 进行点赞的业务操作方法
 * @param {点赞传输对象} starDTO 
 */
export const addStarService = function (starDTO) {
    return new Promise(function (resolve, reject) {
        addStar(starDTO).then((result) => {
            console.log('点赞业务方法service方法调用成功')
            if (result.status == 200) {
                wx.showToast({
                    title: '点赞成功~',
                    icon: 'none',
                    duration: 1500
                });
                resolve(result)
            }
        }).catch((err) => {
            if (err.status == 300) {
                //抛出了业务异常
                wx.showToast({
                    //直接进行服务端信息的显示
                    title: err.message,
                    icon: 'none',
                    duration: 1500
                });
            } else if (err.status == 401) {
                //登陆验证失败,需要重新进行登陆
                //重新登陆
                login().then(res => {
                    console.log("sessionId过期,重新登录")
                    wx.showToast({
                        title: '登陆已过期~已经为您重新登陆',
                        icon: 'none',
                        duration: 1500,
                    })
                })
            }
        })
    })
}