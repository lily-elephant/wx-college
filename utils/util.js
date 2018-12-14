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
// 验证码倒计时
function countdown(that) {
  var second = that.data.second;
  if (second == 0) {
    timer = null;
    that.setData({
      waitFlag: false,
      second: 60,
      msg: '重新获取'
    });
    return false;
  }
  var timer = setTimeout(function () {
    that.setData({
      second: second - 1
    });
    countdown(that);
  }, 1000)
}
//判断token 是否为空
function isToken(){
  wx.navigateTo({
    url: '/pages/login/login',
  })
}
module.exports = {
  countdown: countdown,
  isToken: isToken,
  formatTime: formatTime
}
