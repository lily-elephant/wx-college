var app = getApp()
Page({
  data: {
    infos: []
  },
  // 点击信息
  readTap: function (e) {
    console.log(e.currentTarget.dataset)
    var that = this
    wx.request({
      url: app.globalData.url + 'noticeIsRead',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        Token: wx.getStorageSync('token')
      },
      data: {
        id: e.currentTarget.dataset.id,
        type: e.currentTarget.dataset.type
      },
      success: function (res) {
        console.log(res.data.data)
        if (res.data.code == 200) {
          that.data.infos[e.currentTarget.dataset.index].isread = 1;
          that.setData({
            infos: that.data.infos
          })
        }
      }
    })
  },
  onLoad: function (options) {
    var that = this
    wx.request({
      url: app.globalData.url + 'myNotice',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        Token: wx.getStorageSync('token')
      },
      success: function (res) {
        //console.log(res.data.data)
        that.setData({
          infos: res.data.data
        })
      }
    })
  },
})