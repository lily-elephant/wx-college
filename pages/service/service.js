// pages/service/service.js
const app = getApp();
Page({
  data: {
    list: []
  },
  //获取订单信息
  getRecord: function () {
    var that = this;
    if(wx.getStorageSync('token')){
      wx.request({
        url: app.globalData.url + 'getRecord',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          Token: wx.getStorageSync('token')
        },
        success: function (res) {
          //console.log(res.data.data)
          if (res.data.code == 200) {
            that.setData({
              list: res.data.data
            })
          }
        }
      })
    }else{
      // wx.navigateTo({
      //   url: '/pages/login/login',
      // })
      wx.showToast({
        title: '您还未登录',
      })
      
      
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    var that = this 
    that.setData({
      isLogin: wx.getStorageSync('token')
    })
    this.getRecord()
  }
})