//获取应用实例
const app = getApp()
var util = require("../../utils/util.js");
Page({
  data: {
    isOnline:true,
    img: '../../asset/img/banner1.jpg',
    indicatorDots: true, // 显示指示点
    autoplay: true, // 自动切换
    interval: 5000, // 切换时间间隔
    duration: 500, // 滑动动画时长
    homeTab: ['在线培训', '实操培训', '合格证书'], //tab栏
    currentTab: 0, // 默认第一个tab 
    lists: [],
    index: 0,
    currentIndex: 0,
    pageindex: 1, //当前页
    certificates: [], //合格证书
    getOfflineTraining: [],
    name: '', //搜索课程名字
    globalimgeurl: app.globalData.imgeurl,

    remaining: 0, // 账户余额
    hideFlag: true, // 充值弹出层默认隐藏
    enoughFlag: false, // 余额不足文字默认隐藏
    price: 0,
    ccid: ''
  },
  //事件处理函数
  tabsClick: function(e) {
    this.data.currentTab = e.currentTarget.dataset.idx;
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
    // if (e.currentTarget.dataset.idx == 1) {
    //   if (!wx.getStorageSync('token')) {
    //     util.isToken();
    //   } else {
    //     this.getOfflineTraining();
    //   }
    // }
    //this.getOfflineTraining();
  },
  //搜索框内容
  searchContent: function(e) {
    var that = this;
    that.setData({
      name: e.detail.value
    })
  },
  //搜索课程
  searchName: function(e) {
    var that = this;
    var name = that.data.name;
    if (name != '' && name != undefined) {
      wx.navigateTo({
        url: '../searchList/searchList?name=' + name
      })
    } else {
      wx.showToast({
        title: '搜索不能为空！',
      })
    }
  },
  //加载课程
  onLoadCourse: function(pageindex) {
    var that = this;
    wx.request({
      url: app.globalData.url + 'course/coursecatagorylist', //不用判断token
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Token': wx.getStorageSync('token')
      },
      data: {
        pageindex: pageindex,
        pagecount: 10
      },
      success: function(res) {
        //console.log(res.data.data)
        if (res.data.data != undefined) {
          var list = res.data.data;
          that.data.lists = that.data.lists.concat(list)
          that.setData({
            list: that.data.lists
          })

        } else {
          wx.showToast({
            title: '没有更多数据',
          })
        }
      },
      complete: function(res) {
        wx.stopPullDownRefresh();
      }
    })
  },
  // 选择学校
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
  },
  //goCourseList
  goCourseList: function(e) {
    let ccid = e.currentTarget.dataset.ccid;
    // if (!wx.getStorageSync('token')) {
    //   util.isToken();
    // } else {
    //   wx.navigateTo({
    //     url: '../courselist/courselist?ccid=' + ccid,
    //   })
    // }
    wx.navigateTo({
      url: '../courselist/courselist?ccid=' + ccid,
    })

  },

  // goBuy:function(e){
  //   let payflag = e.currentTarget.dataset.payflag;
  //   if(payflag == '0'){     
  //       wx.showToast({
  //         title: '接口待开发！',
  //         icon: 'none'
  //       })
  //   }else if(payflag == '1'){
  //     wx.showToast({
  //       title: '已购买！'
  //     })
  //   }
  // },
  goTraining: function(e) {
    var item = e.currentTarget.dataset.pic;
    wx.navigateTo({
      // url: '../traning/traning?oiid=' + item.otid + '&name=' + item.name + '&des=' + item.name + '&des=' + item.des +
      //   '&money=' + item.money + '&payflag=' + item.payflag + '&pic=' + item.pic + '&state=' + item.state
      url: '../traning/traning?oiid=' + item.otid
    })
  },
  // 证书左按钮
  leftTap: function() {
    this.data.currentIndex--;
    if (this.data.currentIndex < 0) {
      this.data.currentIndex = 0;
    }
    this.setData({
      currentIndex: this.data.currentIndex
    })
  },
  // 证书右按钮
  rightTap: function() {
    this.data.currentIndex++;
    if (this.data.currentIndex > (this.data.certificates.length - 1)) {
      this.data.currentIndex = this.data.certificates.length - 1
    }
    this.setData({
      currentIndex: this.data.currentIndex
    })
  },
  // 获取bannerlist
  getBannerList: function() {
    var that = this;
    wx.request({
      url: app.globalData.url + 'source/bannerlist', //不带token
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Token': wx.getStorageSync('token')
      },
      data: {
        product: 'BUTLER',
        pageindex: 1,
        pagecount: 3
      },
      success: function(res) {
        var _imgUrls = [];
        if (res.data != undefined) {
          that.setData({
            bannerList: res.data.data
          })
        } else {
          that.setData({
            imgUrls: [
              '../../asset/img/banner1.jpg'
            ]
          })
        }
      }
    })
  },
  jump: function(e) {
    if (e.currentTarget.dataset.data != null) {
      wx.navigateTo({
        url: '../bannerDes/bannerDes?pic=' + e.currentTarget.dataset.data.picture + '&article=' + e.currentTarget.dataset.data.article,
      })
    }
  },
  //实操培训
  getOfflineTraining: function() {
    var that = this;
    wx.request({
      url: app.globalData.url + 'getOfflineTraining',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Token': wx.getStorageSync('token')
      },
      success: function(res) {
        if (res.data.code == 200) {
          let _data = res.data.data;
          let _getOfflineTraining = [];
          if (_data.length) {
            for (let i = 0; i < _data.length; i++) {
              _getOfflineTraining.push(_data[i]);
            }
          }
          that.setData({
            getOfflineTraining: _getOfflineTraining
          })
        }
      }
    })
  },
  //获取合格证书
  getCertificate: function() {
    var that = this;
    wx.request({
      url: app.globalData.url + 'getCertificate', //不带token
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Token': wx.getStorageSync('token')
      },
      success: function(res) {
        if (res.data.code == 200) {
          //let _data = res.data.data;
          //let _certificates = [];
          that.setData({
            certificates: res.data.data
          })
        }
      }
    })
  },
  //判断是否携带token
  isToken: function() {
    if (!wx.getStorageSync('token')) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  // 申请测评
  goPersonal: function() {
    wx.navigateTo({
      url: '../editinfo/editinfo',
    })
  },
  onShow:function(){
    //console.log("-------onshow------------")
    var aaabbb = wx.getStorageSync('loadData')
    //console.log(aaabbb)
    var that = this ;
    if (wx.getStorageSync('loadData') != null && wx.getStorageSync('loadData') ){
      //console.log('aaa')
      this.data.pageindex = 1
      this.data.lists = []
      that.onLoadCourse(that.data.pageindex);
      wx.setStorageSync('loadData', false)
    }
    
    this.getOfflineTraining() 
  },
  onLoad: function() {
    //通过接口拿到isonline字段，若为ture 则为正式环境 显示正常购买逻辑，若为false 则为测试环境，隐藏所有购买相关操作 ，根据版本号对接口明定义，过审后改接口 返回值数据永久性变为ture ，不改变 。
    var that = this;
    that.getVersionInfo()
    that.onLoadCourse(that.data.pageindex);
    that.getBannerList();
    that.getCertificate();
    //that.getOfflineTraining();
    //console.log(wx.getStorageSync('token'))
  },
  getVersionInfo:function(){
    var that = this;
    wx.request({
      url: app.globalData.url + app.globalData.versionCode,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        //console.log(res.data.data.online)
        wx.setStorageSync("isOnline", res.data.data.online) 
        that.setData({
          isOnline: wx.getStorageSync("isOnline")
        })
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.data.pageindex = 1
    this.data.lists = []
    this.onLoad()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

    if (this.data.currentTab == 0) {
      this.data.pageindex += 1
      this.onLoadCourse(this.data.pageindex)
    }
  },
  goBuy: function(e) {
    if(!wx.getStorageSync('token')){
      wx.navigateTo({
        url: '../login/login',
      })
    }else{
      var that = this
      that.data.ccid = e.currentTarget.dataset.ccid;
      that.data.price = e.currentTarget.dataset.discount;
      that.getBalance()
    }
    
  },
  // 关闭弹出层
  close: function() {
    this.setData({
      hideFlag: true
    })
  },
  getBalance: function() {
    var that = this;
    wx.request({
      url: app.globalData.url + 'getbalance', //不带token
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Token': wx.getStorageSync('token')
      },
      success: function(res) {
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
  confirm: function() {
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
  pay: function() {
    var that = this;
    wx.request({
      url: app.globalData.url + 'consume',
      method: 'POST',
      data: {
        money: that.data.price * 100,
        transactionid: '0',
        businesstype: '购买模块 ',
        cid: '0',
        ccid: that.data.ccid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Token': wx.getStorageSync('token')
      },
      success: function(res) {
        if (res.data.code == '200') {
          wx.showToast({
            title: '购买成功',
          })
          that.close()
        }
      }
    })
  },
  change: function() {
    if (wx.getStorageSync('token')) {
      wx.navigateTo({
        url: '../basetest/basetest',
      })
    } else {
      wx.navigateTo({
        url: '../login/login',
      })
    }

  }

})