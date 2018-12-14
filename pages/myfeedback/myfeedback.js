var app = getApp()
Page({
  data: {
    list: []
  },

  onLoad: function () {
    var that = this 
    wx.request({
      url: app.globalData.url + 'myFeedback',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        Token: wx.getStorageSync('token')
      },
      success: function (res) {
        console.log(res.data.data)
        if (res.data.code == 200) {
          that.setData({
            list:res.data.data
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: "none"
          })
        }
      }
    })
  },

})