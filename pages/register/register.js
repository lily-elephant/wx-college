// pages/register/register.js
var util = require("../../utils/util.js");
var app = getApp();
Page({
  data: {
    phoneNumber: '',
    msg: '重新获取',
    second: 60,
    waitFlag: false,
    hash: '',
    tamp: '',
    identifyCode: '',
    pwd: '',
    confirmPwd: '',
    nickname: '',
    registertype: ''
  },
  /*
  *获取验证码的值
  */
  getIdentify: function (e) {
    this.data.identifyCode = e.detail.value;
  },
  /**
   *获取密码值
   */
  getPwd: function (e) {
    this.data.pwd = e.detail.value;
  },
  /**
   *确认密码值
   */
  getConfirm: function (e) {
    this.data.confirmPwd = e.detail.value;
  },
  /*
   * 用户昵称
  */
  getNickname: function (e) {
    this.data.nickname = e.detail.value;
  },
  /* 
  * 点击重新获取
  */
  getCode: function () {
    var that = this;
    console.log(that.data.phone);
    var myreg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/
    if (!myreg.test(this.data.phoneNumber)) {
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
        username: that.data.phone,//17614924188
        usertype: 'BUTLER',
        registertype: 2
      },
      success: function (res) {
        if (res.data.code == 200) {
          wx.showToast({
            title: '验证码已发送',
          })
          that.data.hash = res.data.data.hash
          that.data.tamp = res.data.data.tamp 
          that.setData({
            //hash: res.data.data.hash,
            //tamp: res.data.data.tamp,
            waitFlag: true
          })
          util.countdown(that);
        } else if (res.data.code == 402){
          wx.showToast({
            title: '验证码已过期',
            icon: "none"
          })
        } else if (res.data.code == 405) {
          wx.showToast({
            title: '发送失败',
            icon: "none"
          })
        }else{
          wx.showToast({
            title: res.data.message,
            icon: "none"
          })
        }
      }
    })
  },
  //注册
  registerTouch: function () {
    var that = this;
    if (that.data.identifyCode == null) {
      wx.showToast({
        title: '提示',
        content: '验证码不能为空！',
      })
      return false;
    }
    if (that.data.pwd == null && that.data.confirmPwd == null && that.data.pwd != that.data.confirmPwd) {
      wx.showToast({
        title: '提示',
        content: '请确认密码！',
      })
      return false;
    }
    if (that.data.nickname == null) {
      wx.showToast({
        title: '昵称不能为空',
      })
      return false;
    }
    wx.request({
      url: app.globalData.url + 'user/register',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        username: that.data.phoneNumber,  //17614924188
        usertype: 'BUTLER',
        password: that.data.pwd,
        verifycode: that.data.identifyCode,   //验证码
        registertype: 0, //0：注册 1：找回密码
        hash: that.data.hash,
        tamp: that.data.tamp,
        name: that.data.nickname
      },
      success: function (res) {

        // 获取用户token 并保存token 
        wx.setStorageSync('token', res.data.data.Token)
        //console.log(wx.getStorageSync('token'));
        wx.setStorageSync('loadData', true)
        if (res.data.code == 200) {
          wx.showToast({
            title: '注册成功！',
            icon: "success"
          })
          wx.switchTab({
            url: '/pages/index/index',
          })
        } else {
          wx.showToast({
            title: "error"
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this 
    that.data.hash = options.hash
    that.data.tamp = options.tamp
    that.data.phoneNumber = options.phone
  }
})