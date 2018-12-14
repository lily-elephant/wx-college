// pages/online/online.js
const app = getApp();
Page({
  data: {
    // 考试科目数据
    objectArray:[],
    index: 0, // 默认第一个
    count:'',
    ccid:''
  },
  /**
   * 选择考试科目
   */ 
  bindPickerChange: function (e) {
    var that = this;
    let _index = e.detail.value;
    let _ccid = that.data.objectArray[_index]['ccid'];
    this.setData({
      index: _index,
      ccid: _ccid
    })
    that.getExamCount(that.data.ccid);
  },
  /**
   * 去考试
   */
  goExam:function(){
    var that = this;
    let index = that.data.index;
    wx.navigateTo({
      url: '../answercard/answercard?ccid=' + that.data.ccid 
            + '&count=' + that.data.count 
            + '&name=' + that.data.objectArray[index]['name']
    })
  },
  // 获取考试题目数目
  getExamCount:function(){
    var that = this;
    wx.request({
      url: app.globalData.url + 'course/gettestcontent',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Token': wx.getStorageSync('token')
      },
      data: {
        ccid: that.data.ccid
      },
      success: function (res) {
        if (res.data.code == 200) {
          let data = res.data.data;
          that.setData({
            count:data.count,
            single: data.single,
            multiple: data.multiple
            
          })
        }
      }
    })
  },
  gettestlist:function(){
    var that = this;
    wx.request({
      url: app.globalData.url + 'course/gettestlist',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Token': wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.data.code == 200) {
          let _data = res.data.data;
          let _objectArray = [];
          if (_data.length) {
            for (let i = 0; i < _data.length; i++) {
              let obj = {};
              obj.ccid = _data[i]['ccid'];
              obj.name = _data[i]['name'];
              _objectArray.push(obj);
            }
            that.setData({
              objectArray: _objectArray,
              ccid: _data[0]['ccid']
            })
            that.getExamCount();
          }
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.gettestlist();
  }
})