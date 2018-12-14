var app = getApp()
Page({

  data: {
    answerList: []
  },

  jobTap: function (e) {
    for (var i = 0; i < this.data.answerList.length; i++) {
      if (this.data.answerList[i].no == e.currentTarget.dataset.no) {
        this.data.answerList.splice(i, 1)
      }
    }
    var obj = {
      no: e.currentTarget.dataset.no,
      type: e.currentTarget.dataset.type,
      answer: e.detail.value
    }
    this.data.answerList.push(obj)
    console.log(this.data.answerList)
  },

  submit: function () {
    var a = 0;
    var b = 0;
    var c = 0;
    var d = 0;
    var e = 0;
    var f = 0;
    var g = 0;
    var h = 0;
    var i = 0;
    var j = 0;
    var k = 0;
    var l = 0;
    var m = 0;
    var n = 0;
    var o = 0;
    var p = 0;

    for (var z = 0; z < this.data.answerList.length; z++) {
      switch (this.data.answerList[z].type) {
        case "乐群性":
          a += 1;
          break
        case "聪慧性":
          b += 1;
          break
        case "稳定性":
          c += 1;
          break
        case "持强性":
          d += 1;
          break
        case "兴奋性":
          e += 1;
          break
        case "有恒性":
          f += 1;
          break
        case "敢为性":
          g += 1;
          break
        case "敏感性":
          h += 1;
          break
        case "怀疑性":
          i += 1;
          break
        case "幻想性":
          j += 1;
          break
        case "世故性":
          k += 1;
          break
        case "忧虑性":
          l += 1;
          break
        case "实验性":
          m += 1;
          break
        case "独立性":
          n += 1;
          break
        case "自律性":
          o += 1;
          break
        case "紧张性":
          p += 1;
          break
        default:
          break
      }
    }
    if ((a + b + c + d + e + f + g + h + i + g + k + l + m + n + o + p ) == 187) {
      var ben = [
        { des: "乐群性", count: a },
        { des: "聪慧性", count: b },
        { des: "稳定性", count: c },
        { des: "持强性", count: d },
        { des: "兴奋性", count: e },
        { des: "有恒性", count: f },
        { des: "敢为性", count: g },
        { des: "敏感性", count: h },
        { des: "怀疑性", count: i },
        { des: "幻想性", count: j },
        { des: "世故性", count: k },
        { des: "忧虑性", count: l },
        { des: "实验性", count: m },
        { des: "独立性", count: n },
        { des: "自律性", count: o },
        { des: "紧张性", count: p }
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
        url: app.globalData.url + 'savePersonalityAnswerTwo',
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
    } else {
      wx.showToast({
        title: '请回答完整',
      })
    }






  },
  onLoad: function (options) {
    var that = this;
    that.loadData();
  },
  //加载测试数据
  loadData: function () {
    var that = this;
    wx.request({
      url: app.globalData.url + 'getSixteenTest',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Token': wx.getStorageSync('token')
      },
      success: function (res) {
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