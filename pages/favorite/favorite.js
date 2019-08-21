// pages/favorite/favorite.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeTab: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // todo：获取护工列表数据， 应修改为获取关注的护工列表
    this.getLikeCaregiveres({});
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

  // event.detail 的值为当前选中项的索引
  onTabChange: function (event) {
    console.log(event.detail);

    // 首页
    if (event.detail == 0) {
      wx.redirectTo({
        url: '/pages/index/index'
      })
    }

    // 收藏
    if (event.detail == 1) {
      wx.redirectTo({
        url: '/pages/favorite/favorite'
      })
    }

    // 客服
    if (event.detail == 2) {
      wx.redirectTo({
        url: '/pages/customer_service/customer_service'
      })
    }

    // 个人
    if (event.detail == 3) {
      wx.redirectTo({
        url: '/pages/personal/personal'
      })
    }
  },

  buildParams: function () {
    return {};
  },

  getLikeCaregiveres: function () {
    var self = this;
    wx.request({
      url: getApp().globalData.APIBase + "/listReservation",
      method: 'GET',
      data: { data: encodeURIComponent(JSON.stringify({ "loginSession": wx.getStorageSync("sessionID") })) },
      success: function (res) {
        console.log(res);
        //self.setData({ caregiveres: res.data['data'].slice(0, 3) });
        
      }
    })
  },
})