// pages/choose_city/choose_city.js
const app = getApp();
import Utils from '../../utils/util.js';
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    // 获取当前城市名称
    wx.request({
      url: app.globalData.APIBase + '/listHospital',
      method: 'GET',
      success: function (res) {
        var hospitals = res['data']['data'];
        var groupedHospital = Utils.groupBy(hospitals, 'city');
        self.setData({ 
          hospitals: hospitals, 
          groupedHospital: groupedHospital, 
          citys: Object.keys(groupedHospital)});
        Toast.clear();
        self.setData({show: true});
      }
    });
  },

  onShow: function(){
    Toast.loading({
      duration: 0,
      message: '加载中...'
    });
  },

  onChooseCity(event){
    var city = event.currentTarget.dataset.city;
    wx.redirectTo({
      url: `/pages/index/index?city=${city}`,
    })
  },

  onChooseHospital(event){
    var hospital = event.currentTarget.dataset.hospital;
    var info = this.data.hospitals.find(function(e){
      return e['hospital'] == hospital
    });

    console.log(info)
    wx.redirectTo({
      url: `/pages/index/index?city=${info['city']}&hospital=${info['hospital']}`,
    })
  },

  backToIndex(){
    wx.redirectTo({
      url: '/pages/index/index?quitFromSelect=1',
    })
  }
})