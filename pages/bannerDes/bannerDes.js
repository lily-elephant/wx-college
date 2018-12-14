// pages/bannerDes/bannerDes.js
var app = getApp() 
Page({
  data:{
    globalimgeurl: app.globalData.imgeurl
  },

  onLoad: function (options) {
    var that = this ; 
    var pic = app.globalData.imgeurl + options.pic 
    var article = options.article 
    var obj = JSON.parse(article);
    //console.log(obj)
    that.setData({
      pic:pic ,
      list: obj
    })
  },
  /**
* 监听视频加载错误状态
*/
  listenerVideo: function (e) {
    console.log(e.detail.errMsg);
  },

})