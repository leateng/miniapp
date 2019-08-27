// pages/orders/orders.js
//获取应用实例
const app = getApp()
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify.js';
import Utils from '../../utils/util.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    statusCN: ["待付款", "待服务", "已完成", "已取消"],
    statusMapping: {
      "待付款": "submitted",
      "待服务": "checked_in",
      "已完成": "appraised",
      "已取消": "canceled"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrders();
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

  // 获取我的订单
  getOrders: function () {
    var self = this;
    wx.request({
      url: getApp().globalData.APIBase + "/listOrder",
      method: 'GET',
      data: { data: encodeURIComponent(JSON.stringify({ "loginSession": wx.getStorageSync("sessionID") })) },
      success: function (res) {
        console.log(res);
        var orders = res.data['data'];
        orders.forEach(function(order){
          order['serviceTime'] = Utils.formatDate(new Date(order.fromDate)) + " - " + Utils.formatDate(new Date(order.toDate));
        });
        var grouped_orders = Utils.groupBy(orders, "status");
        self.setData({ orders: orders, grouped_orders: grouped_orders });
      }
    })
  },

  // 微信支付订单
  payOrder(event){
    console.log(event);
    // 向后台服务发起支付请求
    var payParams = {
      loginSession: wx.getStorageSync("sessionID"),
      orderNum: event.currentTarget.dataset['orderNumber']
    };

    wx.request({
      url: getApp().globalData.APIBase + "/getOrderInfoForPay",
      method: "GET",
      data: { data: encodeURIComponent(JSON.stringify(payParams)) },
      success: function (res) {
        // 发起微信支付接口
        var data = res.data.data.data;
        wx.requestPayment({
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
        });
      }
    })
  },

  // 取消订单
  cancelOrder(event) {
    console.log(event);
    var orderNumber = event.currentTarget.dataset['orderNumber'];
    var params = {
      loginSession: wx.getStorageSync("sessionID"),
      orderNum: orderNumber
    };
    var self = this;
    wx.request({
      url: app.globalData.APIBase + '/cancelOrder',
      method: 'POST',
      data: { data: encodeURIComponent(JSON.stringify(params)) },
      success: function (res) {
        console.log(res)
        if(res.data.msg == "success"){
          self.getOrders();

          Notify({
            text: '取消订单成功',
            duration: 2000,
            selector: '#notify',
            backgroundColor: '#1989fa'
          });
        }
      }
    })
  },

  // 取消已支付的订单
  cancelPayedOrder(event){

  },

  // 评价服务
  addComment(event) {
    var caregiverid = event.currentTarget.dataset['caregiverid'];
    wx.navigateTo({
      url: `/pages/add_comment/add_comment?caregiverid=${caregiverid}`,
    });
  },

  // 再次下单
  addOrder(event) {
    var caregiverid = event.currentTarget.dataset['caregiverid'];
    wx.navigateTo({
      url: `/pages/employee_detail/employee_detail?employeeId=${caregiverid}`,
    });
  },
})