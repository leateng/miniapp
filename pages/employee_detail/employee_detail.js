// pages/employee_detail/employee_detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    plain: "plain",
    minDate: new Date().getTime(),
    currentDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      } else if (type === 'day') {
        return `${value}日`;
      }
      return value;
    },
    value: "",
    payment: "1",  //支付方式
    days: 1, //服务天数
    caregiver: { photoURL: "/images/avatar.png"},
    calenderShow: false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData(options);

    var d = new Date()
    console.log(d)
    var today = d.getFullYear()+ "-" + (d.getMonth()+1) + "-" + d.getDate();
    this.setData({today: today});
    this.getCaregivere(this.data.employeeId);

    console.log(this.data)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getCaregivere: function(caregiverId){
    var self = this;
    wx.request({
      url: 'https://jingshi.site:8443/queryCaregiver',
      method: 'GET',
      data: { data: encodeURIComponent(JSON.stringify({ caregiverId: caregiverId}))},
      success: function (res) {
        var caregiver = res.data['data'];
        caregiver["photoURL"] = "http://47.93.238.25:8000/static/image/photo/"+caregiver['photoId']+ ".jpg";
        self.setData({ caregiver: res.data['data'] });
      }
    })
  },

  onInput(event) {
    this.setData({
      currentDate: event.detail
    });
  },

  onPaymentChange(event) {
    this.setData({
      payment: event.detail
    });
  },

  onPaymentClick(event) {
    const { name } = event.currentTarget.dataset;
    this.setData({
      payment: name
    });
  },

  // 添加收藏
  addReservation(event){

  },

  // 删除收藏
  delReservation(event){

  },

  // 选择开始服务时间
  selectStartDate(event){
    this.setData({calenderShow: true})
  },

  confirmSelectDate(event){
    console.log(event.detail)
    console.log(event)
  },
  
  cancelSelectDate(event){
    this.setData({ calenderShow: false })
  }

})