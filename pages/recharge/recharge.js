// pages/recharge/recharge.js
var app = getApp() 
Page({
  data: {
    currentIdx: 0,
    money:0
  },
  // 
  radioChange: function (e) {
    this.setData({
      currentIdx: e.detail.value
    })
    var that = this ;
    //console.log('radio发生change事件，携带value值为：', )
    that.data.money = e.detail.value
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getChargePropertices() 
  },
  getChargePropertices:function(){
    var that = this 
    wx.request({
      url: app.globalData.url + 'getChargePropertices',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Token': wx.getStorageSync('token')
      },
      success: function (res) {
        console.log(res.data.data)
        that.setData({
          list: res.data.data
        })
      },
    })
  },
  gocharge:function(){
    var that = this 
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: app.globalData.url + 'getopenid',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'Token': wx.getStorageSync('token')
            },
            data: {
              code: res.code
            },
            success: function (res) {
              var openid = res.data.openid;
              wx.request({
                url: app.globalData.url + 'wxPay',
                method: 'POST',
                header: {
                  'content-type': 'application/x-www-form-urlencoded',
                  'Token': wx.getStorageSync('token')
                },
                data: {
                  openid: openid,
                  money: that.data.money * 100 ,
                  productBrief: "充值",
                  transactionid: '0',
                  businesstype: '充值',
                  osid: '0',
                },
                success: function (res) {
                  console.log(res.data.data)
                  var data = res.data.data
                  //console.log(JSON.parse(res.data.data))
                  var orderNumber = res.data.ordernumber
                  wx.requestPayment({
                    'timeStamp': data.timeStamp,
                    'nonceStr': data.nonceStr,
                    'package': data.package,
                    'signType': 'MD5',
                    'paySign': data.paySign,
                    'success': function (res) {
                      //console.log(res, 1111111111111);
                      wx.showToast({
                        title: '充值成功',
                      })
                      wx.navigateBack({
                        delta:1
                      })
                    },
                    'fail': function (res) {
                      //console.log(res, 222222222);
                      wx.showToast({
                        title: '取消支付',
                        icon:null
                      })
                    }

                  });
                }
              })
            },
            fail: function (err) {
              console.log(err)
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  }
})