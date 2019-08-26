//index.js
//获取应用实例
const app = getApp()
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify.js';

Page({
  data: {
    activeTab: "0",
    showFilter: false,
    filters: [
      {
        name: "exp",
        nameCN: "经验",
        val: "" ,
        options: [
          {name: "所有" },
          {name: "3年以下"},
          {name: "3-5年" },
          {name: "5-10年" },
          {name: "10年以上" },
        ]
      },

      {
        name: "price",
        nameCN: "价格",
        val: "",
        options: [
          { name: "所有" },
          { name: "100-200元" },
          { name: "200-300元" },
          { name: "300元以上" },
        ]
      },

      {
        name: "rate",
        nameCN: "评分",
        val: "",
        options: [
          { name: "所有" },
          { name: "3分以下" },
          { name: "3-4分" },
          { name: "4-5分" },
          { name: "5分" },
        ]
      },

      {
        name: "sex",
        nameCN: "性别",
        val: "",
        options: [
          { name: '所有' },
          { name: '男' },
          { name: '女' }
        ]
      },
    ],

    employee: [],
    userInfo: {},
    caregiveres: [],
    filterParams: {
      offset: 0,
      limit: 20,
    },
    hasUserInfo: false,
    loading: "true",
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  onLoad: function (options) {
    console.log("options")
    console.log(options)

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    
    var self = this;
    
    // 如果是从城市选择页面跳转过来的
    if(options['city'] != undefined){
      self.setData({ city: options['city'], searchString: options['hospital'] })
      // 获取护工列表数据
      self.getCaregiveres({});
    }
    else{
      // 因为刚进入这个页面时，app.js中的地理位置信息可能还没有获取，
      // 所以把第一次刷新护工数据放在getLocation的回调里
      wx.getLocation({
        type: 'wgs84',
        success(res) {
          //const latitude = res.latitude
          //const longitude = res.longitude
          //const speed = res.speed
          //const accuracy = res.accuracy
          getApp().globalData.locationInfo['latitude'] = res['latitude'];
          getApp().globalData.locationInfo['longitude'] = res['longitude'];

          // 获取当前城市名称
          wx.request({
            url: app.globalData.APIBase + '/getPosition',
            method: 'GET',
            data: {
              data: encodeURIComponent(JSON.stringify({
                longitude: getApp().globalData.locationInfo['longitude'],
                latitude: getApp().globalData.locationInfo['latitude']
              }))
            },
            success: function (res) {
              getApp().globalData.locationInfo['city'] = res['data']['data']['city']
              self.setData({ city: getApp().globalData.locationInfo['city'] })

              // 获取护工列表数据
              self.getCaregiveres({});
            }
          });

          
        }
      });
    }
  },

  buildParams: function () {
    var queryParams = {};
    this.parseFilterVal();
    Object.assign(queryParams, app.globalData.locationInfo);
    Object.assign(queryParams, this.data.filterParams);

    if(this.data.searchString != "" && this.data.searchString != undefined){
      queryParams['hospital'] = this.data.searchString;
    }

    if (this.data.city != "" && this.data.city != undefined) {
      queryParams['city'] = this.data.city;
    }

    return queryParams;
  },

  getCaregiveres: function () {
    var params = this.buildParams();
    var self = this;
    console.log("queryParams");
    console.log(params)
    wx.request({
      url: app.globalData.APIBase + '/listCaregiver',
      method: 'GET',
      data: { data: encodeURIComponent(JSON.stringify(params)) },
      success: function (res) {
        // 关闭loading
        self.setData({ loading: "false" });

        var data = res.data['data'];        
        // 没有更多数据了
        if(data.length == 0){
          Notify({
            text: '没有更多数据了...',
            duration: 2000,
            selector: '#notify',
            backgroundColor: '#1989fa'
          });
        }
        else{
          var caregiveres = self.data.caregiveres.concat(data);
          self.setData({ caregiveres: caregiveres });
        }
      }
    })
  },

  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  // event.detail 的值为当前选中项的索引
  onTabChange: function(event) {    
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
    if(event.detail == 2){
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

  // 刷新搜索框的值
  onChange: function(event) {
    this.setData({
      searchString: event.detail
    });
  }, 

  // 响应搜索按钮
  onSearch: function (event){
    // 清空已有的护工数据，从第一页重新开始获取
    this.setData({ "filterParams.offset": 0 });
    this.setData({ caregiveres: [] });
    console.log(this.data)
    this.getCaregiveres();
  },

  // 点击搜索条件按钮
  onClickFilterButton: function(event){
    var currentFilterType = event.currentTarget.dataset.filterType;
    var currentFilterIndex = event.currentTarget.dataset.filterIndex;
    var currentFilterOptions = this.data.filters[currentFilterIndex].options;

    /*
    this.setData({ currentFilterType: currentFilterType, currentFilterIndex: currentFilterIndex, showFilter: true}, function(){
      this.getCaregiveres();
    });
    */

    // 打开当前的点击的过滤选择框
    this.setData({ 
      currentFilterType: currentFilterType, 
      currentFilterIndex: currentFilterIndex, 
      showFilter: true });
  },

  // 选择了某个过滤条件
  onFilterSelect: function(event){
    var currentFilterIndex = parseInt(this.data.currentFilterIndex);
    var val = event.detail.name == "所有" ? "" : event.detail.name;
    this.setData({ 
      showFilter: false, 
      [`filters[${currentFilterIndex}].val`]: val }, 
      function() {
        // 清空已有的护工数据，从第一页重新开始获取
        this.setData({ "filterParams.offset": 0 });
        this.setData({ caregiveres: [] });
        this.getCaregiveres();
      }
    );
  },

  // 解析filter的val，并把设置响应的值到filterParams
  parseFilterVal(){
    // 经验
    var exp = this.data.filters[0].val;
    var price = this.data.filters[1].val;
    var rate = this.data.filters[2].val;
    var sex = this.data.filters[3].val;

    switch(exp){
      case "3年以下":
        this.setData({ "filterParams.expMin":  0 });
        this.setData({ "filterParams.expMax":  3 });
        break;
      case "3-5年":
        this.setData({ "filterParams.expMin": 3 });
        this.setData({ "filterParams.expMax": 5 });
        break;
      case "5-10年":
        this.setData({ "filterParams.expMin": 5 });
        this.setData({ "filterParams.expMax": 10 });
        break;
      case "10年以上":
        this.setData({ "filterParams.expMin": 10 });
        delete this.data.filterParams['expMax'];
        break;
      default:
        delete this.data.filterParams['expMin'];
        delete this.data.filterParams['expMax'];
    }

    switch(price) {
      case "100-200元":
        this.setData({ "filterParams.priceMin": 100 });
        this.setData({ "filterParams.priceMax": 200 });
        break;
      case "200-300元":
        this.setData({ "filterParams.priceMin": 200 });
        this.setData({ "filterParams.priceMax": 300 });
        break;
      case "300元以上":
        this.setData({ "filterParams.priceMin": 300 });
        delete this.data.filterParams['priceMax'];
        break;
      default:
        delete this.data.filterParams['priceMin'];
        delete this.data.filterParams['priceMax'];
    }

    switch (rate) {
      case "3分以下":
        this.setData({ "filterParams.pointMin": 1 });
        this.setData({ "filterParams.pointMax": 2 });
        break;
      case "3-4分":
        this.setData({ "filterParams.pointMin": 3 });
        this.setData({ "filterParams.pointMax": 4 });
        break;
      case "4-5分":
        this.setData({ "filterParams.pointMin": 4 });
        this.setData({ "filterParams.pointMax": 5 });
        break;
      case "5分":
        this.setData({ "filterParams.pointMin": 5 });
        delete this.data.filterParams['pointMax'];
        break;
      default:
        delete this.data.filterParams['pointMin'];
        delete this.data.filterParams['pointMax'];
    }

    switch (sex) {
      case "男":
        this.setData({ "filterParams.gender": 'm' });
        break;
      case "女":
        this.setData({ "filterParams.gender": 'f' });
        break;
      default:
        delete this.data.filterParams['gender'];
    }

  },

  onFilterClose: function(event){    
  },

  onFilterCancel: function(event) {
    this.setData({ showFilter: false})
  },

  onClickEmployee: function(event){
    var employeeId = event.currentTarget.dataset.employeeId;
    wx.navigateTo({
      url: `/pages/employee_detail/employee_detail?employeeId=${employeeId}`,
    })
  },

  // 加载更多数据
  onMore(){
    this.setData({ "filterParams.offset": (this.data.filterParams.offset + 1) });
    this.setData({ loading: "true" });
    this.getCaregiveres();
  },

  // 跳转到选择城市页面
  chooseCity: function(){
    wx.redirectTo({
      url: '/pages/choose_city/choose_city'
    })
  },

})