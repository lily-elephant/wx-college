// pages/wallet/wallet.js
var app = getApp() 
Page({
  data: {
    remaining: 500
  },

  // 进入交易明细
  goTrade: function(){
    wx.navigateTo({
      url: '../trade/trade',
    })
  },
  // 进入充值
  goRecharge: function(){
    wx.navigateTo({
      url: '../recharge/recharge',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBalance()
    var that = this 
    that.setData({
      isOnline: wx.getStorageSync("isOnline")
    })
  },
  getBalance: function () {
    var that = this;
    wx.request({
      url: app.globalData.url + 'getbalance',    //不带token
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Token': wx.getStorageSync('token')
      },
      success: function (res) {
        //console.log(res.data.data)
        that.setData({
          remaining: res.data.data / 100
        })
      }
    })
  },

})