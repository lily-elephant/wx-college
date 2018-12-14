// pages/courselist/courselist.js
const app = getApp();
Page({
  data: {
    //isOnline: wx.getStorageSync("isOnline"),
    tabList: ['目录','介绍'],
    currentTab: 0, // 当前tab为目录
    course:{},
    remaining: 0, // 账户余额
    hideFlag: true, // 充值弹出层默认隐藏
    enoughFlag: false, // 余额不足文字默认隐藏
    globalimgeurl: app.globalData.imgeurl,
    price: 0,
    cid:'0',
    ccid:'',
    //当前ccid ismust状态 
    ismust:''
  },
  // 目录介绍切换
  tabsHandle: function(e){
    this.data.currentTab = e.currentTarget.dataset.idx;
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },
  // 跳转去考试
  goExam: function(){
    if(!wx.getStorageSync('token')){
      wx.navigateTo({
        url: '../login/login',
      })
    }else{
      var that = this;
      let _data = that.data.course.data;
      //判断该ccid 是否未必学课程 若不是 判断是否有题目后 跳转考试
      // 若为必学ccid  判断所有cid 为已经学完 
      if(that.data.ismust == 0){
        if (that.data.course.ortherdata[0]['istest'] == '0') {
          wx.showToast({
            title: '该课程暂时没有题目！',
            icon: 'none'
          })
        }else{
          wx.navigateTo({
            url: '../online/online',
          })
        }
      }else{
        var isJump = true;
        for (let i = 0; i < _data.length; i++) {
          if (_data[i]['islearn'] == 0 ) {
            wx.showToast({
              title: '还未学完所有课程！',
              icon: 'none'
            })
            isJump = false
          }
        }
        if (isJump) {
          wx.navigateTo({
            url: '../online/online',
          })
        }
      }
      

      // var isJump = true;
      // for (let i = 0; i < _data.length; i++) {
      //   if (_data[i]['isbuy'] == 1 && _data[i]['money'] != 0) {
      //     wx.showToast({
      //       title: '还未学完所有课程！',
      //       icon: 'none'
      //     })
      //     isJump = false
      //   }
      //   if (that.data.course.ortherdata[0]['istest'] == '0') {
      //     wx.showToast({
      //       title: '该课程暂时没有题目！',
      //       icon: 'none'
      //     })
      //     isJump = false
      //   }
      // }
      // if (isJump) {
      //   wx.navigateTo({
      //     url: '../online/online',
      //   })
      // }
    }  
  },
  //获取当前余额
  getBalance: function () {
    var that = this;
    wx.request({
      url: app.globalData.url + 'getbalance',    //不带token
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Token': wx.getStorageSync('token')
      },
      success: function (res) {
        //console.log(res.data.data)
        if (res.data.data / 100 >= that.data.price) {
          that.setData({
            hideFlag: false, // 弹窗显示
            enoughFlag: false // 不提示余额不足
          })
        } else {
          that.setData({
            hideFlag: false,
            enoughFlag: true // 提示余额不足
          })
        }
        that.setData({
          remaining: res.data.data / 100
        })
      }
    })
  },
  // 点击购买或者图片弹出支付弹出层
  payPop: function (state, price , cid ) {
    if (state == '1') { // 0 已购 1 未购
      this.getBalance()
      this.data.price = price
      this.data.cid = cid 
      if (this.data.remaining >= price) {
        this.setData({
          hideFlag: false, // 弹窗显示
          enoughFlag: false // 不提示余额不足
        })
      } else {
        this.setData({
          hideFlag: false,
          enoughFlag: true // 提示余额不足
        })
      }
    }
  },
  // 进入课程详情
  aaa:function(e){
    console.log(e)
    let cid = e.currentTarget.dataset.cid;
      wx.navigateTo({
        url: '../coursedetail/coursedetail?cid=' + cid
      })
  },
  //支付，购买
  goDetails: function(e){
    if(!wx.getStorageSync('token')){
        wx.navigateTo({
          url: '../login/login',
        })
    }else{
      let state = e.currentTarget.dataset.state;
      let price = e.currentTarget.dataset.price;
      let cid = e.currentTarget.dataset.cid;
      // 如果已经购买
      if (price == 0 || !state) {
        wx.navigateTo({
          url: '../coursedetail/coursedetail?cid=' + cid
        })
      } else {
        this.payPop(state, price, cid)
      }
    }
  },
  // 关闭弹出层
  close:function(){
    this.setData({
      hideFlag: true
    })
  },
  onPullDownRefresh: function () {
    this.onShow()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onLoad:function(options){
    var that = this;
    that.setData({
      isOnline: wx.getStorageSync("isOnline")
    })
    if (options != null) {
      that.data.ccid = options.ccid;
    }
  },
  onShow: function (options) {
    var that = this;
    if (options != null ){
      that.data.ccid = options.ccid;
    }
    //console.log(options.ccid)
    wx.request({
      url: app.globalData.url + 'course/courselist',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Token': wx.getStorageSync('token')
      },
      data: {
        ccid: that.data.ccid,
        pageindex: 1,
        pagecount: 10
      },
      success:function(res){
        //console.log(res.data.ortherdata[0].articlecontent )
        var obj = JSON.parse(res.data.ortherdata[0].articlecontent);
        that.data.ismust = res.data.ortherdata[0].ismust
        if(res.data.code == 200){
          that.setData({
            course:res.data,
            obj:obj
          })
        }
      },
      complete: function (res) {
        wx.stopPullDownRefresh();
      }
    })
  },
  confirm: function () {
    var that = this
    if (that.data.enoughFlag) {
      that.setData({
        hideFlag: true
      })
      wx.navigateTo({
        url: '../recharge/recharge',
      })
    } else {
      this.pay();
    }
  },
  pay: function () {
    var that = this;
    wx.request({
      url: app.globalData.url + 'consume',
      method: 'POST',
      data: {
        money: that.data.price * 100,
        transactionid: '0',
        businesstype: '购买课程',
        cid: that.data.cid ,
        ccid: '0'
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Token': wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.data.code == '200') {
          wx.showToast({
            title: '购买成功',
          })
          that.close()
          wx.navigateTo({
            url: '../coursedetail/coursedetail?cid=' + that.data.cid
          })
        }
      }
    })
  },
  // 关闭弹出层
  close: function () {
    this.setData({
      hideFlag: true
    })
  },
})