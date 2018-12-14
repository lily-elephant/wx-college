Page({
  data: {
    sex: [
      { value: 0, label: '男' },
      { value: 1, label: '女' }
    ],
    condition: [
      { value: 0, label: '健康' },
      { value: 1, label: '病史' }
    ]
  },
  // 进入人格测评首页
  goExam: function () {
    wx.navigateTo({
      url: '../personalexam/personalexam',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  }
})