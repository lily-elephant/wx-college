var app = getApp()
Page({
  /**
   * 生命周期函数--监听页面加载
   */
  data: {
    globalimgeurl: app.globalData.imgeurl
  },
  onLoad: function (options) {
    this.getData()
  },
  getData: function () {
    var that = this
    wx.request({
      url: app.globalData.url + 'source/articlelist',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        name: '关于我们',
        pageindex: 1,
        pagecount: 1
      },
      success: function (res) {
        var obj = JSON.parse(res.data.data[0].content);
        that.setData({
          list: obj
        })
      }
    })
  },

})