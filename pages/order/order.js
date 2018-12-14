// pages/order/order.js
const app = getApp();
Page({
  data: {
    tabsArr: ['待支付', '已支付'],
    currentTab: 0,
    isbuy: 0,  //[0：待支付；1：已支付]
    payList:[],
    finishList: [],
    globalimgeurl: app.globalData.imgeurl,
  },
  // tab切换
  tabsHandle: function(e){
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
    this.getOrderList(e.currentTarget.dataset.idx);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    var that = this;
    that.setData({
      isLogin:wx.getStorageSync('token')
    })
    that.getOrderList(that.data.currentTab);
  },
  //加载订单
  getOrderList:function(isbuy){
    var that = this;
    if (wx.getStorageSync("token")) {
      wx.request({
        url: app.globalData.url + 'getHKOrderList',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Token': wx.getStorageSync('token')
        },
        data: {
          pageindex: 1,
          pagecount: 10,
          isbuy: isbuy
        },
        success: function (res) {
          if (res.data.code == 200) {
            if (that.data.currentTab==0){
              that.setData({
                payList: res.data.data,
                count: res.data.count
              })
            }else{
              if (res.data.data != null){
                for (var i = 0; i < res.data.data.length; i++) {
                  res.data.data[i].create_time = res.data.data[i].create_time.substring(0, res.data.data[i].create_time.length - 2)

                  

                  res.data.data[i].update_time = res.data.data[i].update_time.substring(0, res.data.data[i].update_time.length - 2)
                }
              }
              that.setData({
                finishList: res.data.data
              })
            }
            
          }
        }
      })
    } else {
      // wx.redirectTo({
      //   url: '/pages/login/login'
      // })
      wx.showToast({
        title: '您还未登录',
      })
    }
  },
  //删除
  deleteOrder:function(e){
    var that = this;
    let ocid = e.currentTarget.dataset.ocid
    if(wx.getStorageSync('token')){
      wx.request({
        url: app.globalData.url + 'deletecourse',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Token': wx.getStorageSync('token')
        },
        data: {
          ocid:ocid
        },
        success:function(res){
          if(res.data.code == 200){
            wx.showToast({
              title: '删除成功！',
              icon:'success'
            })
            that.getOrderList(0)
          }
        }
      })
    }
  },
  //去支付
  goPayOrder: function (e){
    var that = this;
    let ocid = e.currentTarget.dataset.ocid
    let index = e.currentTarget.dataset.index
    wx.showToast({
      title: '支付接口待开发！',
    })
  },
  gojump :function(e){
    wx.navigateTo({
      url: '../coursedetail/coursedetail?cid=' + e.currentTarget.dataset.cid 
    })
    
  }
})