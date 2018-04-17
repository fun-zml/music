// pages/rank/rank.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      rankItemList: []
  },
  albumDetail: function (ev) {
      var id = ev.currentTarget.dataset.id;
      wx.navigateTo({
          url: '/pages/ranksong/ranksong?id=' + id,
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var rankList = [1,2,11,21,22,23,24,25];
    var total = [];
    for(let i=0; i<rankList.length; i++){
        wx.request({
            url: 'http://tingapi.ting.baidu.com/v1/restserver/ting?method=baidu.ting.billboard.billList&type='+rankList[i]+'&size=10&offset=0',
            success: (res) => {
                var tempObj = {
                    name: res.data.billboard.name,
                    pic: res.data.billboard.pic_s210,
                    id: rankList[i]
                }
                total.push(tempObj);
                this.setData({
                    rankItemList: total
                })
            }
        })
    }
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
  
  }
})