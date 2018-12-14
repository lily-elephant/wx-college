var app = getApp()
Page({
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getbill() 
  },
  getbill: function () {
    var that = this;
    wx.request({
      url: app.globalData.url + 'getbill',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Token': wx.getStorageSync('token')
      },
      success: function (res) {
        that.setData({
          list:res.data.data 
        })
      }
    })
  }
})