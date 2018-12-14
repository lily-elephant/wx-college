var app = getApp() 
var util = require("../../utils/util.js");
Page({
  data: {
    phone: null, // 手机号初始化
    msg: '获取验证码', // 验证码文字初始化
    flag: false, // 判断密码还是手机验证码登录，false验证码登录
    waitFlag: false, // 判断是否点击获取验证码，true已点击
    second: 60, // 获取验证码倒计时
    hash: null,
    tamp: null,
    verifycode: null
  },
  /**
   * 获取手机号
   */
  getPhone: function (e) {
    this.data.phone = e.detail.value;
  },
  /**
   *获取密码值
   */
  getPwd: function (e) {
    this.data.pwd = e.detail.value;
  },
  /*
  *获取验证码的值
  */
  getIdentify: function (e) {
    this.data.verifycode = e.detail.value;
  },
  /*
  *点击获取验证码
  */
  getCode: function () {
    var that = this;
    //console.log(that.data.phone);
    var myreg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/
    if (!myreg.test(this.data.phone)) {
      wx.showModal({
        title: '提示',
        content: '请输入有效的手机号码！',
        showCancel: false,
        duration: 2000
      })
      return false;
    }
    wx.request({
      url: app.globalData.url + 'user/getverifycode',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        username: that.data.phone,
        usertype: 'BUTLER',
        registertype: 2
      },
      success: function (res) {
        if (res.data.code == 200) {
          that.setData({
            hash: res.data.data.hash,
            tamp: res.data.data.tamp,
            waitFlag: true
          })
          util.countdown(that);
          wx.showToast({
            title: '验证码发送成功',
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
  // 登陆并判断登陆方式
  login: function () {
    var that = this;
    if (that.data.flag == false) {  //验证码登录
      wx.request({
        url: app.globalData.url + 'user/loginbyverifycode',
        method: 'POST',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        data: {
          username: that.data.phone,  //17614924188
          usertype: 'BUTLER',
          verifycode: that.data.verifycode, //验证码
          hash: that.data.hash,
          tamp: that.data.tamp
        },
        success: function (res) {
          if (res.data.code == 200) {
            wx.setStorageSync('token', res.data.data.Token)
            wx.setStorageSync('loadData', true)
            //console.log(wx.getStorageSync('token'));
            wx.showToast({
              title: "登录成功！",
              icon: "success"
            })
            wx.navigateBack({
              delta: 1
            })
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          }
        }
      })
    } else if (that.data.flag == true) {
      wx.request({
        url: app.globalData.url + 'user/loginbypassword',
        method: 'POST',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        data: {
          username: that.data.phone,
          usertype: 'BUTLER',
          password: that.data.pwd
        },
        success: function (res) {
          if (res.data.code == 200) {
            wx.setStorageSync('token', res.data.data.Token)
            wx.setStorageSync('loadData', true)
            wx.showToast({
              title: '登录成功！',
              icon: 'success'
            })
            wx.navigateBack({
              delta: 1
            })
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          }
        },
        fail:function(res){
          console.log(res)
        }
      })
    }
  },
  /*
  *点击切换登录方式
  */ 
  wayLogin: function(){
    this.setData({
      phone: null,
      flag: !this.data.flag
    })
  },
  /* 
  *页面跳转
  */
  goRegister: function(){
    wx.navigateTo({
      url: '../identify/identify?registertype=0'
    })
  },
  goForget: function () {
    wx.navigateTo({
      url: '../identify/identify?registertype=1'
    })
  }
})