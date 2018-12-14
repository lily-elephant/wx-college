
Page({
  data: {
    answer1: [
      { label: '月嫂工作', value: '1' },
      { label: '0-3岁孩子保姆', value: '2' },
      { label: '护理老人', value: '3' }
    ],
    answer2: [
      { label: '无经验', value: '1' },
      { label: '1-3年', value: '2' },
      { label: '4-6年', value: '3' },
      { label: '10年以上', value: '4' }
    ]
  },
  /**
   * 问题1的答案
   */
  jobTap: function (e) {
    this.data.job = e.detail.value;
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  /**
   * 问题2的答案
   */
  yearTap: function (e) {
    this.data.year = e.detail.value;
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  /**
   * 提交
   */
  submit: function () {
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

})