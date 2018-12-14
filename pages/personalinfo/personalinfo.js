// pages/personalinfo/personalinfo.js
const app = getApp();
Page({
  data: {
    age:'',
    person:{},
    tabsArr: ['基本信息','考试信息','获得证书','人格测试'],
    currentTab: 0,
    // getTime: '2018-06-18', //获得证书时间
    exams: [   //考试信息
      {
        // examTime: '2018-06-18 12:00:00',
        // examTitle: '如何做好一个月嫂',
        // examScore: 80
      }
    ],
    globalimgeurl: app.globalData.imgeurl,
    phone:'',
    name:''  
  },
  goTest:function(e){
    //console.log(e.currentTarget.dataset.cansubmit)
    if ("yse" == e.currentTarget.dataset.cansubmit ){
      wx.navigateTo({
        url: '../psersonalityTest/psersonalityTest',
      })
    }
  },
  goTest2: function (e) {
    //console.log(e.currentTarget.dataset.cansubmit)
    if ("yse" == e.currentTarget.dataset.cansubmit) {
      wx.navigateTo({
        url: '../psersonalityTest2/psersonalityTest2',
      })
    }
  },
  getAges: function (identityCard) {   //身份证获取年龄
    var len = (identityCard + "").length;
    if (len == 0) {
      return 0;
    } else {
      if ((len != 15) && (len != 18)) {
        return 0;
      }
    }
    var strBirthday = "";
    if (len == 18) {
      strBirthday = identityCard.substr(6, 4) + "/" + identityCard.substr(10, 2) + "/" + identityCard.substr(12, 2);
    }
    if (len == 15) {
      strBirthday = "19" + identityCard.substr(6, 2) + "/" + identityCard.substr(8, 2) + "/" + identityCard.substr(10, 2);
    }
    //时间字符串里，必须是“/”
    var birthDate = new Date(strBirthday);
    var nowDateTime = new Date();
    var age = nowDateTime.getFullYear() - birthDate.getFullYear();
    //再考虑月、天的因素;.getMonth()获取的是从0开始的，这里进行比较，不需要加1
    if (nowDateTime.getMonth() < birthDate.getMonth() || (nowDateTime.getMonth() == birthDate.getMonth() && nowDateTime.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
    //this.data.age = age;
  },
  // 编辑
  goNeed: function(e){
    var person = e.currentTarget.dataset.person
    wx.navigateTo({
      url: '../editMyInfo/editMyInfo?idcard=' + person.idcard 
      + '&sex=' + person.sex
      + '&address1=' + person.address1
        + '&address2=' + person.address2
        + '&address3=' + person.address3
      + '&education=' + person.education
      + '&brief=' + person.brief 
      + '&username=' + person.username
        + '&marry=' + person.marry
        + '&isdrive=' + person.isdrive
        + '&describe=' + person.describes
        + '&nativeplace=' + person.nativeplace
        + '&nowsalary=' + person.nowsalary
        + '&workdate=' + person.workdate
      + '&salary=' + person.salary,
    })
  },
  // 点击tab切换
  tabHandle: function(e){
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
    if(this.data.currentTab == 1){
      this.examInfo();
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      phone:options.phone,
      name:options.name
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow(){
    var that = this;
    if (wx.getStorageSync('token')) {
      wx.request({
        url: app.globalData.url + 'auth',    //token
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Token': wx.getStorageSync('token')
        },
        success: function (res) {
          if (res.data.data != undefined) {
            var _person = res.data.data;
            that.getCertificateList(res.data.data.id)
            var _age = that.getAges(_person.idcard);
            _person['age'] = _age;
            if (_person['headimageurl'] == null ){
              _person['headimageurl'] = '../../asset/img/logo.png'
            }else{
              _person['headimageurl'] = that.data.globalimgeurl + _person['headimageurl']
            }
            
            that.setData({
              person: _person
            })
          }
        }
      })
    }
  },
  // 获取证书
  getCertificateList: function (hkid) {
    var that = this
    var headers = { 'content-type': 'application/x-www-form-urlencoded' }
    wx.request({
      url: app.globalData.url + 'housekeeper/certificatelist', //不带token
      method: 'POST',
      header: headers,
      data: {
        hkid:hkid
      },
      success: function (res) {
        that.setData({
          certificatelist: res.data.data
        })
      },
    })
  },
  //考试信息
  examInfo:function(){
    var that =this 
    wx.request({
      url: app.globalData.url + 'exam/getEaxmRecord', //不带token
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Token': wx.getStorageSync('token')
      },
      success: function (res) {
        if(res.data.code == 200){
          that.setData({
            exams: res.data.data
          })
        }
      },
    })
  }
})