/**
 * 验证输入内容是否符合规则
 * 规则:长度不小于10个字,
 * 不大于50个字,不能为空(空字符串)
 * @param {string} content 
 */
export const contentValidate = function (content) {
  content = content.replace(/\s+/g, "");
  if (content.length < 10 || content.length > 30) {
    return false
  }
  return true
}

/**
 * 根据id修改点赞状态
 * list可以是评论list,也可以说是回复list
 * @param {string} id
 * @param {Array} list
 */
export const changeStarState = function (id, list) {
  for (let item in list) {
    console.log(list[item], id)
    if (list[item].id == id && list[item].isZan == false) {
      list[item].isZan = true
      list[item].zanNum += 1;
      break
    }
  }
  return list
}

/**
 * 找到replyList中的待删除回复id列表
 * @param {string} targetId
 * @param {Array} replyList 
 * @returns {Array}
 */
export const findReplystoDelete = function (targetId, replyList) {
  let targetList = []
  targetList.push(targetId)
  replyList.forEach(item => {
    if (targetId == item.replyId) {
      targetList = targetList.concat(findReplystoDelete(item.id, replyList))
    }
  })
  return targetList
}

/**
 * 过滤input中的emoji表情
 * @param {string} name 
 * @returns 
 */
export const filterEmoji = function (name) {
  return name.replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig, "")
}