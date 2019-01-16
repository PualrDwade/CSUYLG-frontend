const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


/**
 * 验证输入内容是否符合规则
 * 规则:长度不小于10个字,
 * 不大于50个字,不能为空(空字符串)
 */
const contentValidate = function (conent) {
  if (content.length < 10 || conent.length > 50) {
    return false
  }
  //使用正则表达式匹配
  let regu = "^[ ]+$"
  let re = new RegExp(regu)
  return !re.test(content)
}

module.exports = {
  formatTime: formatTime,
  contentValidate: contentValidate
}


