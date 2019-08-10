//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    //wx.login({
      //success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      //}
   // })

    wx.login({
      // 获取code成功
      success: function (res) {
        var code = res.code;
        if (code) {
          console.log('获取用户登录凭证：' + code);
          getApp().globalData.code = code;
          // todo: 发送 res.code 到后台换取 openId, sessionKey, unionId
          wx.request({
            url: getApp().globalData.APIBase+"/login",
            method: 'POST',
            data: { data: encodeURIComponent(JSON.stringify({ code: getApp().globalData.code })) },
            success: function (res) {
              console.log(res.data["data"]["loginSession"])
              wx.setStorage({
                key: 'sessionID',
                data: res.data["data"]["loginSession"]
              })
            }
          })

        } else {
          console.log('获取用户登录态失败：' + res.errMsg);
        } 
      },

      // 获取code成功
      fail: function(res){
        console.log('获取code失败！')
      }
    });


    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    // 获取地理位置
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        //const latitude = res.latitude
        //const longitude = res.longitude
        //const speed = res.speed
        //const accuracy = res.accuracy
        getApp().globalData.locationInfo = res;
        console.log(getApp().globalData.locationInfo)  
      }
    })
  },

  globalData: {
    userInfo: null,
    locationInfo: null,
    city: null,
    code: null,
    APIBase: "https://jingshi.site:8443"
  }
})