// pages/poplist/poplist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      list: [],
  },
  process: function (list) {
      var musics = [];
      for (var i = 0; i < list.length; i++) {
          var music = {};
          music.playCount = list[i].playCount;
          music.name = list[i].name;
          music.id = list[i].id;
          music.coverImgUrl = list[i].coverImgUrl;
          musics.push(music);
      }
      this.setData({
          list: musics
      })

  },
  albumDetail: function (ev) {
      var id = ev.currentTarget.dataset.id;
      var index = ev.currentTarget.dataset.index;
      var playcount = ev.currentTarget.dataset.playcount;
      wx.navigateTo({
          url: '/pages/songlist/songlist?id=' + id + '&playcount=' + playcount + '&index=' + index,
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var url = 'http://127.0.0.1:8020/wx/wx_cloud_music/api/topPlayList2.json';
      wx.request({
          url: url,
          success: (res) => {
              this.process(res.data.playlists)
          }
      })
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