// pages/findpwd/findpwd.js
var app = getApp()
var util = require("../../utils/util.js");
Page({
  data: {
    phoneNumber: '',
    msg: '重新获取',
    second: 60,
    waitFlag: false,
    state: undefined,
    jsonTit: '',
    identifyCode:'',
    pwd:'',
    confirmPwd:''
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
  * 点击重新获取
  */
  getCode: function () {
    var that = this;
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
        username: that.data.phoneNumber,
        usertype: 'BUTLER',
        registertype: 1
      },
      success: function (res) {
        if (res.data.code == 200) {
        wx.showToast({
          title: '验证码发送成功',
        })
          that.setData({
            hash: res.data.data.hash,
            tamp: res.data.data.tamp,
            waitFlag: true
          })
          util.countdown(that);
        } else {
          wx.showToast({
            title: res.data.message,
            icon: "none"
          })
        }
      }
    })
  },
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    var that = this;
    that.setData({
      phoneNumber: options.phone,
      registertype: options.registertype,
      hash: options.hash,
      tamp: options.tamp
    })
    if (that.data.registertype == 1) {
      that.data.jsonTit = '找回密码';
    } else if (that.data.registertype != 0) {
      that.data.jsonTit = '修改密码';
    }
    that.setData({
      registertype: that.data.registertype
    })
    wx.setNavigationBarTitle({
      title: that.data.jsonTit //页面标题为路由参数
    })
  },
  //找回密码  &&  修改密码
  findpwdTouch: function () {
    var that = this;
    //console.log(that.data.identifyCode)
    //console.log(that.data.pwd)
    //console.log(that.data.confirmPwd)
    if (that.data.identifyCode == '') {
      //console.log('123456789')
      wx.showToast({
        title: '请输入校验码',
        icon: "none",
        duration: 1000
      })
      return false;
    }
    if ((that.data.pwd == '' && that.data.confirmPwd == '') || that.data.pwd != that.data.confirmPwd) {
      wx.showToast({
        title: '请确认密码',
        icon: "none",
        duration: 1000
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
        verifycode: that.data.identifyCode,
        registertype: 1,
        hash: that.data.hash,
        tamp: that.data.tamp
      },
      success: function (res) {
        if (res.data.code == 200) {
          wx.setStorageSync('token', res.data.data.Token)
          //console.log(wx.getStorageSync('token'));
          wx.setStorageSync('loadData', true)
          wx.showToast({
            title: '密码找回成功！',
            icon: "success",
            duration: 3000
          })
          wx.switchTab({
            url: '/pages/index/index',
          })
        } else {
          wx.showToast({
            title: '密码找回失败',
            icon: "none"
          })
        }
      }
    })
  }
})
