const app = getApp();
var util = require("../../utils/util.js");
Page({
  data: {
    idcard:'',
    sex:'',
    sexArray: ['男', '女'],
    sexIndex:0,
    address1: '',
    address2:'',
    address3:'',
    education: '',
    eduArray:['小学','初中','高中','大专','中专','本科','研究生','博士','博士后'],
    marryArray: ['未婚','已婚','已婚已育'],
    isdriveArray:['有','无'],
    eduIndex:0,
    marryIndex:0,
    isdriveIndex:0,
    brief: '',
    nativeplace:'',
    describe:'',
    salary:'',
    nowsalary: '',
    workdate:'',
    marry:'',
    isdrive:'',
    stand_isdrive:'',
    stand_marry:'',
    stand_idcard: '',
    stand_sex: '',
    stand_address1: '',
    stand_address2: '',
    stand_address3: '',
    stand_education: '',
    stand_brief: '',
    stand_nativeplace: '',
    stand_describe: '',
    stand_salary: '',
    stand_nowsalary:'',
    stand_workdate:'',
    username:'',
    region:[]
  },
  //region
  bindRegionChange: function (e) {    
    var add = e.detail.value;
    this.data.address1 = add[0]
    this.data.address2 = add[1] + add[2]
    this.setData({
      address1: this.data.address1,
      address2: this.data.address2
    })
  },
  // sex
  bindPickerChange: function (e) {
    let idx = e.detail.value;
    this.setData({
      sex: this.data.sexArray[idx],
      sexIndex:e.detail.value
    })
  },
  bindchangeMarry: function (e) {
    let idx = e.detail.value;
    this.setData({
      marry: this.data.marryArray[idx],
      marryIndex: e.detail.value
    })
  },
  bindchangeIsdrive: function (e) {
    let idx = e.detail.value;
    this.setData({
      isdrive: this.data.isdriveArray[idx],
      isdriveIndex: e.detail.value
    })
  },
  //education
  bindchangeEducation:function(e){
    let ids = e.detail.value;
    this.setData({
      education: this.data.eduArray[ids],
      eduIndex: e.detail.value
    })
  },
  listeneriscardInput: function (e) {
    this.data.idcard = e.detail.value;

  },
  listenerSexInput: function (e) {
    this.data.sex = e.detail.value;

  },
  listenerSalaryInput:function(e){
    this.data.salary = e.detail.value;
  },
  listenernowSalaryInput: function (e) {
    this.data.nowsalary = e.detail.value;
  },
  listenerWorkdateInput: function (e) {
    this.data.workdate = e.detail.value;
  },
  listenerAddressInput: function (e) {
    this.data.address3 = e.detail.value;

  },
  listenerEducationInput: function (e) {
    this.data.education = e.detail.value;

  },
  listenerDesInput: function (e) {
    this.data.brief = e.detail.value;

  },
  listenerPlaceInput: function (e) {
    this.data.nativeplace = e.detail.value;

  },
  listenerDescribeInput: function (e) {
    this.data.describe = e.detail.value;

  },
  onShow: function () {

  },
  onLoad:function(options){
    //console.log(options)
    var that = this 
    that.data.stand_idcard = options.idcard,
    that.data.stand_sex = options.sex,
    that.data.stand_marry = options.marry,
    that.data.stand_isdrive = options.isdrive,
    that.data.stand_address1 = options.address1,
    that.data.stand_address2 = options.address2,
    that.data.stand_address3 = options.address3,
    that.data.stand_education = options.education,
    that.data.stand_brief = options.brief,
    that.data.stand_nativeplace = options.nativeplace,
    that.data.stand_describe = options.describe,
    that.data.username = options.username
    that.data.stand_salary = options.salary 
    that.data.stand_nowsalary = options.nowsalary 
    that.data.stand_workdate = options.workdate 
    that.setData({
      idcard: options.idcard,
      sex: options.sex,
      marry:options.marry,
      isdrive:options.isdrive,
      address1: options.address1,
      address2: options.address2,
      address3: options.address3,
      education: options.education,
      brief: options.brief,
      nativeplace: options.nativeplace,
      describe: options.describe,
      salary: options.salary,
      nowsalary: options.nowsalary,
      workdate: options.workdate,
    })
  },
  reset:function(){
    var that = this
    that.setData({
      idcard: that.data.stand_idcard,
      sex: that.data.stand_sex,
      marry:that.data.stand_marry,
      isdrive:that.data.stand_isdrive,
      address1: that.data.stand_address1,
      address2: that.data.stand_address2,
      address3: that.data.stand_address3,
      education: that.data.stand_education,
      brief: that.data.stand_brief,
      nativeplace: that.data.stand_nativeplace,
      describe: that.data.stand_describe,
      salary: that.data.stand_salary,
      nowsalary: that.data.stand_nowsalary,
      workdate: that.data.stand_workdate
    })
  },
  isSubmit(){
    var that = this 
    if (that.data.idcard == ''){
      wx.showToast({
        title: '请填写身份证号',
      })
      return false ;
    }
    if (that.data.sex == '') {
      wx.showToast({
        title: '请填写性别',
      })
      return false;
    }
    if (that.data.salary == '') {
      wx.showToast({
        title: '请填写期望薪资',
      })
      return false;
    }
    if (that.data.nowsalary == '') {
      wx.showToast({
        title: '请填写当前薪资',
      })
      return false;
    }
    if (that.data.workdate == '') {
      wx.showToast({
        title: '请填写工作时间',
      })
      return false;
    }
    if (that.data.address3 == '') {
      wx.showToast({
        title: '请填写籍贯',
      })
      return false;
    }
    if (that.data.education == '') {
      wx.showToast({
        title: '请填写最高学历',
      })
      return false;
    }
    if (that.data.marry == '') {
      wx.showToast({
        title: '请填写婚育状况',
      })
      return false;
    }
    if (that.data.isdrive == '') {
      wx.showToast({
        title: '请填写有无驾驶证',
      })
      return false;
    }
    if (that.data.nativeplace == '') {
      wx.showToast({
        title: '请填写现居住地',
      })
      return false;
    }
    if (that.data.describe == '') {
      wx.showToast({
        title: '请填写工作经历',
      })
      return false;
    }
    if (that.data.brief == '') {
      wx.showToast({
        title: '请填写自我评价',
      })
      return false;
    }
    return true ;
  },
  lodaData(){
    var that = this;
    wx.request({
      url: app.globalData.url + 'housekeeper/editHousekeeperInfo',  //不用判断token
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Token': wx.getStorageSync('token')
      },
      data: {
        username:that.data.username,
        idcard: that.data.idcard,
        sex: that.data.sex,
        marry:that.data.marry,
        isdrive:that.data.isdrive,
        address1: that.data.address1,
        address2:that.data.address2,
        address3:that.data.address3,
        education: that.data.education,
        brief: that.data.brief,
        nativeplace: that.data.nativeplace,
        describes: that.data.describe,
        salary: that.data.salary,
        nowsalary: that.data.nowsalary,
        workdate: that.data.workdate
      },
      success: function (res) {
        if(res.data.code == '200'){
          wx.showToast({
            title: '保存成功',
          })
          wx.navigateBack({
            delta:1
          })
        }else{
          wx.showToast({
            title: '保存失败',
          })
        }
      }
    }) 
  },
  submit: function () {
    if (this.isSubmit()){
      this.lodaData();
    }
  },
  
})