// pages/coursedetail/coursedetail.js
const app = getApp();
Page({
  data: {
    //isOnline: wx.getStorageSync("isOnline"),
    course: [],
    globalimgeurl: app.globalData.imgeurl,
    showCanvas:true,
    sharebtn:true, 
    money:0,
    isbuy:'',
    videoContext:'',
    cid:'',
    remaining: 0, // 账户余额
    hideFlag: true, // 充值弹出层默认隐藏
    enoughFlag: false, // 余额不足文字默认隐藏
  },
  sharePic: function(e) {
    this.cancel()
    //console.log(e)
    var name = e.currentTarget.dataset.name;
    var brief = e.currentTarget.dataset.brief;
    var picture = this.data.globalimgeurl + e.currentTarget.dataset.coursepicture;
    console.log(picture)
    var that = this 
    wx.downloadFile({
      url: picture,
      success: function(res) {
        console.log(res)
        // var ben_brief = ""
        // if (brief.length >= 50){
        //   ben_brief = brief.slice(0, 50) + "..."
        // }else{
        //   ben_brief = brief 
        // }

        let briefArray = [];
        //为了防止过长，分割字符串,每行18个
        for (let i = 0; i < brief.length / 18; i++) {
          if (i > 2) {
            break;
          }
          if(i == 2 ){
            briefArray.push(brief.substr(i * 18, 18) + "...");
          }else{
            briefArray.push(brief.substr(i * 18, 18));
          }
          
        }

        if (res.statusCode === 200) {
          //先创建一个画布
          const ctx = wx.createCanvasContext("mycanvans")
          //填充背景色
          ctx.fillStyle = '#fff';
          ctx.fillRect(0, 0, 300, 300)
          //将图片转化为画布
          ctx.drawImage(res.tempFilePath, 0, 0, 300, 150)

          // 作者名称
          //ctx.setTextAlign('center')    // 文字居中
          ctx.setFillStyle('#333333')  // 文字颜色：黑色
          ctx.setFontSize(16)         // 文字字号：22px
          ctx.fillText(name, 16,180)

          //ctx.setFillStyle('#666666')  // 文字颜色：黑色
          //ctx.setFontSize(12)
          //ctx.fillText(ben_brief, 16, 210)

          var yOffset = 210;
          briefArray.forEach(function (value) {
            ctx.setFontSize(12);
            ctx.setFillStyle('#666666');
            //canvasCtx.setTextAlign('left');
            ctx.fillText(value, 16, yOffset);
            yOffset += 25;
          });


          ctx.stroke()
          ctx.drawImage("../../asset/img/qrcode.jpg", 234, 234, 50, 50)
          //ctx.draw()
          that.setData({
            showCanvas: false
          })
          //成功执行，draw方法中进行回调
          ctx.draw(true, function () {
            //console.log("draw callback success")
            //保存临时图片
            wx.canvasToTempFilePath({
              x: 0,
              y: 0,
              width: 300,
              height: 300,
              destWidth: 300,
              destHeight: 300,
              canvasId: 'mycanvans',
              success: function (res) {
                //console.log("get tempfilepath(success) is:",)
                that.data.tempFilePath = res.tempFilePath
                that.setData({
                  sharebtn: false
                })
              },
              fail: function () {
                //console.log('get tempfilepath is fail')
              }
            })
          })
        }
      }
    })
  },
  close:function(){
    var that = this ;
    that.setData({
      showCanvas: true,
      sharebtn: true
    })
  },
  save: function (){
    var that = this
    //将图片保存在系统相册中(应先获取权限，)
    wx.saveImageToPhotosAlbum({
      filePath: that.data.tempFilePath  ,
      success(res) {
        //console.log("save photo is success")
        that.setData({
          showCanvas:true,
          sharebtn: true
        })
        wx.showToast({
          title: '保存成功',
        })
      },
      fail: function () {
        //console.log("save photo is fail")
      }
    })
  },
  //显示对话框
  showModal: function() {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  cancel: function() {
    this.hideModal()
  },
  //隐藏对话框
  hideModal: function() {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  //去登录
  gologin:function(){
    wx.navigateTo({
      url: '../login/login',
    })
  },
  //去购买
  gopay:function(e){
    if (!wx.getStorageSync('token')) {
      wx.navigateTo({
        url: '../login/login',
      })
    } else {
      let state = e.currentTarget.dataset.state;
      let price = e.currentTarget.dataset.price;
      let cid = e.currentTarget.dataset.cid;
      // 如果已经购买
      if (price == 0 || !state) {
        //不做处理
      } else {
        this.payPop(state, price, cid)
      }
    }

  },
  // 点击购买或者图片弹出支付弹出层
  payPop: function (state, price, cid) {
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
  // 关闭弹出层
  close_bottom: function () {
    this.setData({
      hideFlag: true
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
        cid: that.data.cid,
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
          that.close_bottom()
          that.onShow()
        }
      }
    })
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
  
  onLoad: function (options){
    var that = this 
    that.setData({
      isOnline: wx.getStorageSync("isOnline")
    })
    that.data.cid = options.cid 
  },
  onShow: function() {
    var that = this;
    that.setData({
      show01: false,
      show02: true,
      show03: true 
    })
    wx.request({
      url: app.globalData.url + 'course/getcoursedetail',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Token': wx.getStorageSync('token')
      },
      data: {
        cid: that.data.cid 
      },
      success: function(res) {
        //console.log(res.data.data)
        if (res.data.code == 200) {
          that.data.money = res.data.data[0].money 
          that.data.isbuy = res.data.data[0].isbuy 
          var article = res.data.data[0].article
          var obj = JSON.parse(article);
          that.setData({
            course: res.data.data[0],
            obj: obj
          })
        }
      }
    })
  },

  // 是否登录 && 是否购买  
  // 否 视频时长设置为10秒 
  //  播放成功回调后   未登录 提示登录  未购买 提示购买   
  //
  listen_play:function(e){
    var currentTime = e.detail.currentTime ; 
    var duration = e.detail.duration; 
    if (duration >= 10 && currentTime > 10){
      this.isHasRole()
    } else if (duration < 10 && currentTime > (duration/2)){
      this.isHasRole()
    }
  },
  //是否是收费资源  是登录   否继续观看    登录   是否已经购买 购买 播放  否则去购买  
  isHasRole:function(){
    var that = this 
    if(that.data.money != 0){
      if (!wx.getStorageSync('token')) {
        console.log("去登录")
        this.data.videoContext.pause(); 
        that.setData({
          show01: true,
          show02: false,
          show03: true 
        })
      }else{
        if(that.data.isbuy == 1){
          console.log("购买")
          this.data.videoContext.pause(); 
          that.setData({
            show01: true,
            show02: true,
            show03: false
          })
        }else{
          that.setData({
            show01: false,
            show02: true,
            show03: true
          })
        }
      }
    }else{
      that.setData({
        show01: false,
        show02: true,
        show03: true
      })
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function(res) {
    this.data.videoContext = wx.createVideoContext('myVideo')
  },

})