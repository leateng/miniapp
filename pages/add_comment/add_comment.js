// pages/add_comment/add_comment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rate: 5,
    descMapping: ["很不满意", "不满意", "一般", "满意", "非常满意"],
    tags: {
      "tag1": { color: "#999", text: "服务态度好" },
      "tag2": { color: "#999", text: "沟通积极" },
      "tag3": { color: "#999", text: "有耐心" },
      "tag4": { color: "#999", text: "通情达理" },
      "tag5": { color: "#999", text: "悉心照顾" },
      "tag6": { color: "#999", text: "吃苦耐劳" }
    },
    comment: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({ 
      photoId: options['photoId'], 
      orderNumber: options['orderNumber'],
      caregiverName: options['caregiverName']});
  },

  onRateChange(event) {
    this.setData({
      rate: event.detail
    });
  },

  onClickLabel(event){
    var tagId = event.target.dataset.tagId;
    if(this.data.tags[tagId].color == "#999"){
      this.setData({[`tags.${tagId}.color`]: "#f2826a"});
    }
    else{
      this.setData({[`tags.${tagId}.color`]: "#999"});
    }
  },

  onCommentChange(event){
    this.setData({comment: event.detail});
  },

  submitComment(event){
    console.log(this.data.rate);
    console.log(this.data.comment)
    console.log(this.data.tags)

    var seletedTags = [];
    for(var t in this.data.tags){
      if (this.data.tags[t].color != "#999"){
        seletedTags.push("#" + this.data.tags[t].text);
      }
    }

    var comment = seletedTags.join(" ") + " " + this.data.comment;
    var self = this;
    var data = {
      loginSession: wx.getStorageSync("sessionID"),
      orderNum: this.data.orderNumber,
      point: this.data.rate,
      comment: comment
    };
    wx.request({
      url: getApp().globalData.APIBase + "/addComment",
      method: 'POST',
      data: { data: encodeURIComponent(JSON.stringify(data)) },
      success: function (res) {
        console.log(res);
       
      }
    })
  }

  
})