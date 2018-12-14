// pages/answercard/answercard.js
var util = require("../../utils/util.js");
Page({
  data: {
    score: 50,
    name:'',
    second:5
  },
  // 结束跳转
  countdown:function() {
    var that = this;
    var second = that.data.second;
    if(second == 0) {
      // timer = null;
      // that.setData({
      //   second: 10
      // });
      // return false;
      wx.switchTab({
        url: '../index/index'
      })
    }
    var timer = setTimeout(function () {
        that.setData({
          second: second - 1
        });
        that.countdown();
      }, 1000)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      score: options.score,
      name:options.name
    })
    that.countdown();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})