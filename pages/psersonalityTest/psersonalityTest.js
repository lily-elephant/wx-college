var app = getApp()
Page({

  data: {
    answerList: []
  },
  jobTap: function(e) {
    for (var i = 0; i < this.data.answerList.length; i++) {
      if (this.data.answerList[i].no == e.currentTarget.dataset.no) {
        this.data.answerList.splice(i, 1)
      }
    }
    var obj = {
      no: e.currentTarget.dataset.no,
      answer: e.detail.value
    }
    this.data.answerList.push(obj)
    console.log(this.data.answerList)
  },

  submit: function() {
    var a  = 0 ;
    var b  = 0;
    var c  = 0;
    var d  = 0;
    var e  = 0;
    var f  = 0;
    var g  = 0;
    var h  = 0;
    var i  = 0;
    for (var o = 0; o < this.data.answerList.length; o++) {
      switch (this.data.answerList[o].answer) {
        case "A":
          a  += 1 ;
          break
        case "B":
          b += 1;
          break
        case "C":
          c += 1;
          break
        case "D":
          d += 1;
          break
        case "E":
          e += 1;
          break
        case "F":
          f += 1;
          break
        case "G":
          g += 1;
          break
        case "H":
          h += 1;
          break
        case "I":
          i += 1;
          break
        default:
          break
      }
    }
    if ((a + b + c + d + e + f + g + h + i) == 144){
      var ben = [
        { des: "和平型", count: a },
        { des: "怀疑型", count: b },
        { des: "成功型", count: c },
        { des: "完美型", count: d },
        { des: "浪漫型", count: e },
        { des: "助人型", count: f },
        { des: "领袖型", count: g },
        { des: "思想型", count: h },
        { des: "欢乐型", count: i }
      ]
      var compare = function (obj1, obj2) {
        var val1 = obj1.count;
        var val2 = obj2.count;
        if (val1 < val2) {
          return 1;
        } else if (val1 > val2) {
          return -1;
        } else {
          return 0;
        }
      }
      var result = JSON.stringify(ben.sort(compare))
      wx.request({
        url: app.globalData.url + 'savePersonalityAnswer',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Token': wx.getStorageSync('token')
        },
        data: {
          result: result
        },
        success: function (res) {
          if (res.data.code == 200) {
            wx.navigateBack({
              delta: 1
            })
            wx.showToast({
              title: '提交成功',
            })
          }
        },
      })
    }else{
      wx.showToast({
        title: '请回答完整',
      })
    }
    
    
    
    

    
  },
  onLoad: function(options) {
    var that = this;
    that.loadData();
  },
  //加载测试数据
  loadData: function() {
    var that = this;
    wx.request({
      url: app.globalData.url + 'getPersonalityTest',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Token': wx.getStorageSync('token')
      },
      success: function(res) {
        //console.log(res.data.data)
        if (res.data.data != undefined) {
          that.setData({
            list: res.data.data
          })

        } else {
          wx.showToast({
            title: '没有更多数据',
          })
        }
      },
    })
  },



})