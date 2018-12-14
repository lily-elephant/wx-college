var app = getApp()
Page({
  data: {
    val: ''
  },
  // 进入我的反馈
  goMyfeedback: function(){
    wx.navigateTo({
      url: '../myfeedback/myfeedback',
    })
  },
  // textarea 触发change事件改变按钮状态
  bindTextAreaBlur: function (e) {
    this.data.val = e.detail.value 
    this.setData({
      val: this.data.val
    })   
    //console.log(e.detail.value)
  },
  // 提交
  formSubmit: function(e){
    if(e.detail.value.textarea){
      var that = this
      wx.request({
        url: app.globalData.url + 'submitFeedback',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          Token: wx.getStorageSync('token')
        },
        data: {
          comment: that.data.val
        },
        success: function (res) {
          console.log(res.data.data)
          if (res.data.code == 200) {
            wx.showToast({
              title: '反馈成功'
            })
            wx.navigateBack({
              delta: 1
            })
          } else {
            wx.showToast({
              title: res.data.message,
              icon: "none"
            })
          }
        }
      })
    }else{
      wx.showToast({
        title: '请添加反馈意见',
      })
    }
  },
})