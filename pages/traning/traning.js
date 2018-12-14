// pages/courselist/courselist.js
const app = getApp();
Page({
  data: {
    globalimgeurl: app.globalData.imgeurl,
    item: [],
    remaining: 0, // 账户余额
    hideFlag: true, // 充值弹出层默认隐藏
    enoughFlag: false, // 余额不足文字默认隐藏
    price: 0,
    otid: ''
  },
  // 点击购买或者图片弹出支付弹出层
  payPop: function(e) {
    if(!wx.getStorageSync("token")){
      wx.navigateTo({
        url: '../login/login',
      })
    }else{
      console.log(e.currentTarget.dataset) ;
      let state = e.currentTarget.dataset.state;
      if (state == '0') { // 未购买状态   1已购
        this.getBalance()
        let price = e.currentTarget.dataset.price;
        this.data.price = price
        //console.log(this.data.remaining >= price)
        if (this.data.remaining >= price) {
          this.setData({
            hideFlag: false, // 弹窗显示
            enoughFlag: false // 不提示余额不足
          })
        } else {
          this.setData({
            hideFlag: false,
            enoughFlag: true // 提示余额不足
          })
        }
      }
    }
  },
  // 关闭弹出层
  close: function() {
    this.setData({
      hideFlag: true
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function(options) {
    //console.log(options)
    var that = this;
    that.setData({
      isOnline: wx.getStorageSync("isOnline")
    })
    that.data.otid = options.oiid
    // var obj = JSON.parse(options.des); 
    // options.pic = app.globalData.imgeurl + options.pic
    // that.setData({
    //   item:options,
    //   obj:obj 
    // })
  },
  onShow: function() {
    var that = this
    wx.request({
      url: app.globalData.url + 'getDetailsOfflineTraining',
      method: 'POST',
      data: {
        otid: that.data.otid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Token': wx.getStorageSync('token')
      },
      success: function(res) {
        if (res.data.code == 200) {
          //console.log(res.data.data[0])
          var obj = JSON.parse(res.data.data[0].des); 
          res.data.data[0].pic = app.globalData.imgeurl + res.data.data[0].pic
          that.setData({
            item:res.data.data[0],
            obj:obj 
          })
        }
      }
    })
  },
  getBalance: function() {
    var that = this;
    wx.request({
      url: app.globalData.url + 'getbalance', //不带token
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Token': wx.getStorageSync('token')
      },
      success: function(res) {
        //console.log(res.data.data)
        if (res.data.data / 100 >= that.data.price) {
          that.setData({
            hideFlag: false, // 弹窗显示
            enoughFlag: false // 不提示余额不足
          })
        } else {
          that.setData({
            hideFlag: false,
            enoughFlag: true // 提示余额不足
          })
        }
        that.setData({
          remaining: res.data.data / 100
        })
      }
    })
  },
  confirm: function() {
    var that = this
    if (that.data.enoughFlag) {
      that.setData({
        hideFlag: true
      })
      wx.navigateTo({
        url: '../recharge/recharge',
      })
    } else {
      this.pay();
    }
  },
  pay: function() {
    var that = this;
    wx.request({
      url: app.globalData.url + 'consume',
      method: 'POST',
      data: {
        money: that.data.price * 100,
        transactionid: that.data.otid,
        businesstype: '实操培训',
        cid: '0',
        ccid: '0'
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Token': wx.getStorageSync('token')
      },
      success: function(res) {
        if (res.data.code == '200') {
          wx.showToast({
            title: '购买成功',
          })
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
  }
})