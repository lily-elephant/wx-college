var app = getApp();
Page({
  data: {
    questionList: '',
    eid: '',
    oid: '',
    answerList: []

  },
  jobTap: function(e) {
    for (var i = 0; i < this.data.answerList.length; i++) {
      if (this.data.answerList[i].eid == e.currentTarget.dataset.eid) {
        this.data.answerList.splice(i, 1)
      }
    }
    var obj = {
      eid: e.currentTarget.dataset.eid,
      oid: e.detail.value
    }
    this.data.answerList.push(obj)
  },
  // 点击多选
  checkboxChange: function (e) {
    for (let i = 0; i < this.data.answerList.length; i++) {
      if (this.data.answerList[i].eid == e.currentTarget.dataset.eid) {
        this.data.answerList.splice(i, 1)
      }
    }
    var obj = {
      eid: e.currentTarget.dataset.eid,
      oid: (e.detail.value).join(',')
    }
    this.data.answerList.push(obj);
  },
  /**
   * 提交
   */
  submit: function() {
    //console.log(JSON.stringify(this.data.answerList))
    if (wx.getStorageSync('token')) {
      wx.request({
        url: app.globalData.url + 'exam/addresults',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Token': wx.getStorageSync('token')
        },
        data: {
          answer: JSON.stringify(this.data.answerList)
        },
        success: function(res) {
          if (res.data.code == 200) {
            wx.switchTab({
              url: '../index/index'
            })
            wx.showToast({
              title: '需求保存成功',
              icon: "success"
            })
          } else {
            wx.showToast({
              title: res.data.message,
              icon: "none"
            })
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '../login/login',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.request({
      url: app.globalData.url + '/exam/baseExamlist',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Token': wx.getStorageSync('token')
      },
      success: function(res) {
        if (res.data.data.length != 0) {
          that.setData({
            questionList: res.data.data,
            eid: res.data.data[0].eid
          })
        } else {
          wx.showToast({
            title: '暂无数据',
            icon: 'none',
            duration: 5000
          })
          wx.switchTab({
            url: '../index/index',
          })
        }
      }
    })
  }
})