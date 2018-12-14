// pages/answercard/answercard.js
const app = getApp();
Page({
  data: {
    ccid: '',
    job: '',
    opacityFlag: false ,
    prevFlag: false, // 有没有上一题，false表示没有
    nextFlag: true, // 有没有下一题，false表示没有
    animationData: {}, // 答题卡动画
    list: [], // 题目数组 types为0表示单选，types为1表示多选
    startPage: 1, // 请求题目
    answerList: [], //单选答案
    // obj2: {},
    currentIndex: 0, // 当前所在题目的索引
    mulCount: 0, //多选题个数
    singleCount: 0, //单选题数
    count:0,
    arr: [],
    oid: '',
    length: 1,
    totalScore: 0,
    showSubmit:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.loadQuestion(options);
    //console.log(options)
  },
  // 请求试题数据方法
  loadQuestion: function(options) {
    //请求数据方法
    let that = this;
    wx.request({
      url: app.globalData.url + 'exam/examlistaaa',
      data: {
        ccid: options.ccid,
        name: '',
        ismust: ''
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Token': wx.getStorageSync('token')
      },
      success: function(res) {
        that.data.list = res.data.data
        for (let i = 0; i < that.data.list.length; i++) {
          that.data.totalScore = that.data.totalScore + parseInt(that.data.list[i].score)
          if (that.data.list[i].examtype == 'SINGLE') {
            that.data.singleCount += 1;
          } else if (that.data.list[i].examtype == 'MULTIPLE') {
            that.data.mulCount += 1;
          }
          that.setData({
            ccid: options.ccid,
            count: options.count,
            singleCount: that.data.singleCount,
            mulCount: that.data.mulCount,
            job: options.name,
            totalScore: that.data.totalScore
          })
        }
        that.setData({
          list: that.data.list,
        })
      }
    })
  },
  // 点击单选按钮
  radioChange(e) { // 0 S 1 M
    for (let i = 0; i < this.data.answerList.length; i++) {
      if (this.data.answerList[i].eid == e.currentTarget.dataset.eid) {
        this.data.answerList.splice(i, 1)
      }
    }
    var obj = {
      eid: e.currentTarget.dataset.eid,
      oid: e.detail.value
    }
    this.setData({
      oid: e.detail.value
    });
    this.data.answerList.push(obj);
    //最后一道题 打完 提示交卷
    if (this.data.currentIndex == this.data.list.length - 1) {
      this.setData({
        showSubmit: true
      })
    }

    

  },
  // 点击多选
  checkboxChange: function(e) {
    for (let i = 0; i < this.data.answerList.length; i++) {
      if (this.data.answerList[i].eid == e.currentTarget.dataset.eid) {
        this.data.answerList.splice(i, 1)
      }
    }
    var obj = {
      eid: e.currentTarget.dataset.eid,
      oid: (e.detail.value).join(',')
    }
    this.setData({
      oid: e.detail.value
    });
    this.data.answerList.push(obj);
    //最后一道题 打完 提示交卷
    if (this.data.currentIndex == this.data.list.length - 1) {
      this.setData({
        showSubmit: true
      })
    }
  },
  // 答题卡提交并查看结果 
  submit: function() {
    var that = this;
    for (let i = 0; i < that.data.arr.length; i++) {
      if (that.data.arr[i]['eid'] == undefined) {
        wx.showToast({
          title: '题目未做完！',
          icon: 'none'
        })
        return false;
      }
    }
    that.submitAnswer();
  },
  //提交答案
  submitAnswer: function() {
    var that = this;
    //console.log()
    if (that.data.answerList.length == that.data.count ) {
      wx.showModal({
        title: '提示',
        content: '您确认现在交卷吗？',
        confirmText: '确认',
        success: function(res) {
          if (res.confirm) {
            wx.request({
              url: app.globalData.url + 'exam/addresults',
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Token': wx.getStorageSync('token')
              },
              data: {
                answer: JSON.stringify(that.data.answerList)
              },
              success: function(res) {
                if (res.data.code == 200) {
                  wx.showToast({
                    title: '交卷成功！'
                  })
                  wx.request({
                    url: app.globalData.url + 'exam/getEaxmRecord',
                    method: 'POST',
                    header: {
                      'content-type': 'application/x-www-form-urlencoded',
                      'Token': wx.getStorageSync('token')
                    },
                    data: {
                      ccid: that.data.ccid
                    },
                    success: function(res) {
                      if (res.data.code == 200) {
                        let score = res.data.data[0]['score'];
                        let name = res.data.data[0]['name'];
                        wx.navigateTo({
                          url: '/pages/result/result?score=' + score + '&name=' + 'name'
                        })
                      }
                    }
                  })
                }
              }
            })
          }
          //else if (res.cancel) {
          //that.animationFn('100%');
          //}
        }
      })
    }else{
      wx.showToast({
        title: '试题还未做完',
        icon:"none"
      })
    }
  },
  // 点击交卷
  submitExam: function() {
    var that = this;
    that.submitAnswer();
  },
  // 点击上一题
  prevQue: function() {
    // 如果有上一题
    var that = this;
    let _len = that.data.list.length;
    if (that.data.currentIndex > 0) {
      this.data.currentIndex--;
      this.setData({
        currentIndex: this.data.currentIndex,
        nextFlag: true
      })
    }
    if (that.data.currentIndex == 0) {
      that.setData({
        prevFlag: false
      })
      wx.showToast({
        title: '没有上一题',
        icon:"none"
      })
    }
  },
  // 点击下一题
  nextQue: function() {
    var that = this;
    let _len = that.data.list.length;
    //console.log(that.data.list , "试题")
    //console.log(that.data.answerList , "答案" )
    // 判断下一题的答案是否存在答题卡上  若在 进入到 下一题  若不在 
    if (that.data.currentIndex < _len - 1) {
      console.log(that.data.answerList) // 23  24 
      console.log(that.data.list[that.data.currentIndex].eid , "当前试题eid") // 25
      var isNext = false ;
      for (let j = 0; j < that.data.answerList.length; j++) {
        if (that.data.list[that.data.currentIndex].eid == that.data.answerList[j].eid){
          isNext = true;
        } 
      }
      // if (){

      // }
      //that.data.list[that.data.currentIndex]
      if (!isNext) {
        wx.showToast({
          title: '请作答后再尝试',
          icon:"none"
        })
      } else {
        that.data.currentIndex++;
        that.setData({
          currentIndex: that.data.currentIndex,
          prevFlag: true,
          oid: ''
        })
      }
    }else{
      if (that.data.showSubmit){
        wx.showToast({
          title: '已答完，去提交',
          icon: "none"
        })
      }else{
        wx.showToast({
          title: '已经是最后一道试题',
          icon: "none"
        })
      }
      
    }
    if (that.data.currentIndex == _len - 1) {
      that.setData({
        nextFlag: false,
      })
    }
  },
  // 点击答题卡
  answerCard: function() {
    var that = this;
    var arr = [];
    for (let l = 0; l < that.data.count; l++) {
      let obj = {};
      obj.index = l;
      arr.push(obj)
    }
    for (let j = 0; j < that.data.answerList.length; j++) {
      arr[j].eid = that.data.answerList[j].eid;
    }
    that.setData({
      arr: arr,
      opacityFlag: true
    })
    this.animationFn('-100%');
  },
  // 收起答题卡
  fold: function() {
    this.animationFn('100%');
    opacityFlag: false

  },
  // 答题卡页面弹出动画
  animationFn: function(pos) {
    var animation = wx.createAnimation({
      duration: 600,
      timingFunction: 'ease',
    })
    //this.animation = animation
    animation.translateY(pos).step()
    this.setData({
      animationData: animation.export()
    })
  },
  catchTouchMove:function(){
    return false
  },
  //点击答题卡 跳转 试题页面 并关闭答题卡
  jump_exam:function(e){
    var that = this ;
    console.log(e.currentTarget.dataset.cantap)

    that.data.currentIndex = e.currentTarget.dataset.index 
    if (e.currentTarget.dataset.cantap == 'true'){
      that.setData({
        currentIndex: that.data.currentIndex,
        prevFlag: true,
        oid: ''
      })
      if (that.data.currentIndex == 0){
        that.setData({
          prevFlag:false,
          nextFlag:true
        })
      }else if (that.data.currentIndex == that.data.count - 1 ) {
        that.setData({
          prevFlag: true,
          nextFlag: false
        })
      } else {
        that.setData({
          prevFlag: true,
          nextFlag: true
        })
      }
      that.fold()
    }else{
      wx.showToast({
        title: '您还未作答',
        icon:'none'
      })
    }
    

  }

})