//获取应用实例
const app = getApp()
var util = require("../../utils/util.js");
Page({
  data: {
    //isOnline: wx.getStorageSync("isOnline"),
    course:[],
    globalimgeurl: app.globalData.imgeurl,

    remaining: 0, // 账户余额
    hideFlag: true, // 充值弹出层默认隐藏
    enoughFlag: false, // 余额不足文字默认隐藏
    price: 0,
    ccid: ''
  },
  //goCourseList
  goCourseList:function(e){
    let ccid = e.currentTarget.dataset.ccid;
    wx.navigateTo({
      url: '../courselist/courselist?ccid=' + ccid,
    })
  },
  onLoad:function(options){
    var that = this;
    that.setData({
      isOnline: wx.getStorageSync("isOnline")
    })
    var name = options.name 
    that.loadData(name)
  },
  loadData: function (name){
    var that = this 
      wx.request({
        url: app.globalData.url + 'course/serachcoursecatagorylist', //接口待定
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Token': wx.getStorageSync('token')
        },
        data: {
          name: name,
          pageindex: 1 ,
          pagecount: 10000
        },
        success: function (res) {
          //console.log(res.data.ortherdata)
          if(res.data.code == '200'){
            that.setData({
              course:res.data.data
            })
          }
        }
      })
  },
  goBuy: function (e) {
    if (!wx.getStorageSync('token')) {
      wx.navigateTo({
        url: '../login/login',
      })
    } else {
      var that = this
      that.data.ccid = e.currentTarget.dataset.ccid;
      that.data.price = e.currentTarget.dataset.discount;
      that.getBalance()
    }
  },
  // 关闭弹出层
  close: function () {
    this.setData({
      hideFlag: true
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
  confirm: function () {
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
  pay: function () {
    var that = this;
    wx.request({
      url: app.globalData.url + 'consume',
      method: 'POST',
      data: {
        money: that.data.price * 100,
        transactionid: '0',
        businesstype: '购买模块 ',
        cid: '0',
        ccid: that.data.ccid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Token': wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.data.code == '200') {
          wx.showToast({
            title: '购买成功',
          })
          that.close()
        }
      }
    })
  }
})
