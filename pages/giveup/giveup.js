var app = getApp()
Page({
  data: {
      interviewid:'',
      index:''
  },
  onLoad:function(option){
    this.data.interviewid = option.interviewid
    this.data.index = option.index
  },
  // 点击取消
  cancelTap: function(){
    wx.navigateBack({
      delta:1
    })
  },
  // 点击确定 code为1表示由放弃雇佣进入的面试预约
  sureTap: function(){
    var that= this 
    wx.request({
      url: app.globalData.url + 'order/cancelInterviewTwo',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded', 'Token': wx.getStorageSync('token') },
      data: {
        interviewid: this.data.interviewid
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == '200') {
          wx.showToast({
            title: '操作成功',
          })
          // wx.switchTab({
          //   url: '../interviewrecord/interviewrecord?from=giveup&index=' + that.data.index ,
          // })
          wx.navigateBack({
            delta:1
          })

          wx.setStorageSync('from', 'giveup')
          wx.setStorageSync('index', that.data.index )

          // wx.navigateBack({
          //   delta:1
          // })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      }
    })
  }
})