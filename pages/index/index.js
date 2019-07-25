//index.js
//获取应用实例
const app = getApp()

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
    page: 1,
    perPage: 20,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  onLoad: function () {
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

    // 获取护工列表数据
    this.getCaregiveres({});
  },

  buildParams: function () {
    return {};
  },

  getCaregiveres: function () {
    var params = this.buildParams();
    var self = this;
    wx.request({
      url: 'https://jingshi.site:8443/listCaregiver',
      method: 'GET',
      data: params,
      success: function (res) {
        self.setData({ caregiveres: res.data['data'] });
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
      //wx.makePhoneCall({
       // phoneNumber: '17779336015',
     // })

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
    console.log("searching: " + this.data.searchString);
  },

  // filters
  onClickFilterButton: function(event){
    var currentFilterType = event.currentTarget.dataset.filterType;
    var currentFilterIndex = event.currentTarget.dataset.filterIndex;
    var currentFilterOptions = this.data.filters[currentFilterIndex].options;
    this.setData({ currentFilterType: currentFilterType, currentFilterIndex: currentFilterIndex, showFilter: true}, function(){
      this.getCaregiveres();
    });
  },

  onFilterSelect: function(event){
    var currentFilterIndex = parseInt(this.data.currentFilterIndex);
    var val = event.detail.name == "所有" ? "" : event.detail.name;
    this.setData({ showFilter: false, [`filters[${currentFilterIndex}].val`]: val }, function () {
      this.getCaregiveres();
    });
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
  }
})