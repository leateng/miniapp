// pages/employee_detail/employee_detail.js
//获取应用实例
const app = getApp()
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeTab: 0,
    plain: "plain",
    minDate: new Date().getTime(),
    startDateStr: "",
    endDateStr: "",
    startDate: new Date().getTime(),
    endDate: new Date().getTime(),
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
    phoneNum: "", //联系电话
    address: "", //服务地址
    caregiver: { photoURL: "/images/avatar.png"},
    startCalenderShow: false,
    endCalenderShow: false,
    favorite: false, //是否收藏
    commentTypes: ["全部", "好评", "中评", "差评"]
  },

  formatDateStr(d){
    var date = new Date(d);
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData(options);
    this.setData({
      startDateStr: this.formatDateStr(new Date().getTime()),
      endDateStr: this.formatDateStr(new Date().getTime()),
    }),
    this.getCaregivere(this.data.employeeId);
    this.getComments(this.data.employeeId);
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

  // 获取护工信息
  getCaregivere: function(caregiverId){
    var self = this;
    var params = { caregiverId: caregiverId, loginSession: wx.getStorageSync("sessionID") };
   
    wx.request({
      url: 'https://jingshi.site:8443/queryCaregiver',
      method: 'GET',
      data: { data: encodeURIComponent(JSON.stringify(params))},
      success: function (res) {
        console.log("liteng")
        console.log(res)
        var caregiver = res.data['data'];
        caregiver["photoURL"] = "http://47.93.238.25:8000/static/image/photo/"+caregiver['photoId']+ ".jpg";
        if (caregiver['favorite'] > 0){
          self.setData({ favorite: true });
        }
        self.setData({ caregiver: res.data['data'] });
      }
    })
  },

  // 获取评论信息
  getComments: function (caregiverId) {
    var self = this;
    var params = { caregiverId: caregiverId, loginSession: wx.getStorageSync("sessionID") };

    wx.request({
      url: 'https://jingshi.site:8443/listComment',
      method: 'GET',
      data: { data: encodeURIComponent(JSON.stringify(params)) },
      success: function (res) {
        self.setData({ comments: res.data['data'] });
        console.log(res.data.data)
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
    var data = event.currentTarget.dataset;
    var self = this;
    wx.request({
      url: getApp().globalData.APIBase + "/addReservation",
      method: "POST",
      data: { data: encodeURIComponent(JSON.stringify({ "loginSession": wx.getStorageSync("sessionID"), caregiverId: this.data.employeeId})) },
      success: function (res) {
        self.setData({ favorite: true });
        Notify({
          text: '添加收藏成功',
          duration: 2000,
          selector: '#notify',
          backgroundColor: '#1989fa'
        });
      }
    })
  },

  // 删除收藏
  delReservation(event){
    var data = event.currentTarget.dataset;
    var self = this;
    wx.request({
      url: getApp().globalData.APIBase + "/delReservation",
      method: "POST",
      data: { data: encodeURIComponent(JSON.stringify({ "loginSession": wx.getStorageSync("sessionID"), caregiverId: this.data.employeeId })) },
      success: function (res) {
        self.setData({ favorite: false });
        Notify({
          text: '取消收藏成功',
          duration: 2000,
          selector: '#notify',
          backgroundColor: '#1989fa'
        });
      }
    })
  },

  // 打开选择开始服务时间窗口
  selectStartDate(event){
    this.setData({ startCalenderShow: true });
    this.setData({ openDateType: "start" });
  },

  // 打开选择结束服务时间窗口
  selectEndDate(event) {
    this.setData({ endCalenderShow: true });
    this.setData({ openDateType: "end" });
  },

  // 选择时间并刷新后台data
  confirmSelectDate(event){
    console.log(event.detail);
    var dateStr = this.formatDateStr(event.detail);
    if(this.data.openDateType == "start"){
      this.setData({ startDate: event.detail, startDateStr: dateStr });
      this.setData({ startCalenderShow: false });
    }else{
      this.setData({ endDate: event.detail, endDateStr: dateStr });
      this.setData({ endCalenderShow: false });
    } 

    this.updateDays();
    this.setData({ openDateType: "" });
  },

  // 更新工作天数
  updateDays(){
    var s = this.data.startDate;
    s = new Date(s).setHours(0,0,0,0);
    var e = this.data.endDate;
    var days = ((e - s) / (24 * 3600 * 1000) + 1);
    this.setData({days: days});
  },
  
  // 关闭时间选择窗口
  cancelSelectDate(event){
    this.setData({ startCalenderShow: false });
    this.setData({ endCalenderShow: false });
    this.setData({ openDateType: "" });
  },

  // 联系电话
  onPhoneChange(event){
    this.setData({ phoneNum: event.detail });
  },

  // 地址信息
  onAddressChange(event){
    this.setData({address: event.detail});
  },

  // 提交订单
  onOrderSubmit(event){
    // 在后台添加一个订单
    var orderParams = {
      loginSession: wx.getStorageSync("sessionID"),
      cgId: this.data.employeeId,
      fromDate: this.data.startDateStr,
      toDate: this.data.endDateStr,
      cost: (this.data.days * this.data.caregiver["price"]),
      phoneNum: this.data.phoneNum,
      address: this.data.address
    };

    wx.request({
      url: getApp().globalData.APIBase + "/addOrder",
      method: "POST",
      data: { data: encodeURIComponent( JSON.stringify( orderParams )) },
      success: function (res) {
        // 向后台服务发起支付请求
        var payParams = {
          loginSession: wx.getStorageSync("sessionID"), 
          orderNum: res.data.data['orderNum']
        };
        wx.request({
          url: getApp().globalData.APIBase + "/getOrderInfoForPay",
          method: "GET",
          data: { data: encodeURIComponent(JSON.stringify( payParams )) },
          success: function (res) {
            console.log(res)
            // 发起微信支付接口
            var data = res.data.data.data;
            wx.requestPayment(
              {
                'timeStamp': data['timeStamp'],
                'nonceStr': data['nonceStr'],
                'package': data['package'],
                'signType': 'MD5',
                'paySign': data['sign'],
                'success': function (res) {
                  wx.redirectTo({
                    url: '/pages/orders/orders',
                  })
                },
                'fail': function (res) {
                  console.log("fail")
                }
              }) ;

          }
        })
      }
    })
  }

})