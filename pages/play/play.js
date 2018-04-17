// pages/play/play.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    playing: '',
    song: {},
    stickAction: '',
    lrcArr: [],
    lrc: '',
  },
  play: function(){
      this.setData({
          playing: !this.data.playing
      });
      if(!this.data.playing){
          app.song.pause();
      }else{
          if(app.stop){
              this.getSong(app.currentSong.songId);
          }else{
              app.song.play();
          }
          
      }
      app.playing = this.data.playing;
  },
  next: function(){
      app.currentIndex += 1;
      if (app.currentIndex == app.songList.length) app.currentIndex=0;
      var songId = app.songList[app.currentIndex].song_id;
      if (songId == undefined) songId = app.songList[app.currentIndex].songid;
      this.getSong(songId);
      
  },
  prev: function(){
      app.currentIndex -= 1;
      if (app.currentIndex == -1) app.currentIndex = app.songList.length-1;
      var songId = app.songList[app.currentIndex].song_id;
      if (songId == undefined) songId = app.songList[app.currentIndex].songid;
      this.getSong(songId);
  },
  getSong: function(songId){
      this.setData({
          lrc: ''
      })
      var url = 'http://tingapi.ting.baidu.com/v1/restserver/ting?method=baidu.ting.song.play&songid=' + songId;
      wx.request({
          url,
          success: (res) => {
              var temp = app.currentSong.songId;
              app.songUrl = res.data.bitrate.file_link;

              app.currentSong = {
                  songId: res.data.songinfo.song_id,
                  song: res.data.songinfo.title,
                  singer: res.data.songinfo.author,
                  pic: res.data.songinfo.pic_radio
              }
              if(app.playing === ''){
                  app.playing = true;
              }

              var song = app.song;
              var _this = this;
              if (temp != songId) {
                  song.src = app.songUrl;
                  app.playing = true;
              }
              if(app.stop){
                  song.src = app.songUrl;
                  app.stop = false;
              }
              

              song.onTimeUpdate(function () {
                  var totalFen = parseInt(song.duration / 60);
                  var totalMiao = parseInt(song.duration % 60);
                  var fen = parseInt(song.currentTime / 60);
                  var miao = parseInt(song.currentTime % 60);
                  var tempTime = parseInt(song.currentTime);
                  app.progress = song.currentTime/song.duration;

                  if (_this.data.lrcArr[tempTime] && _this.data.lrcArr!=undefined){
                      _this.setData({
                          lrc: _this.data.lrcArr[tempTime]
                      })
                  }
              });
              song.onStop(function () {
                  _this.setData({
                      playing: false,
                      lrc: ''
                  });
                  app.playing = false;
                  app.currentSong.pic = '/images/player-bar.png';
                  app.currentSong.song = '';
                  app.currentSong.singer = '';
                  app.stop = true;
              })


              this.setData({
                  song: res.data.songinfo,
                  playing: app.playing
              })
              wx.setNavigationBarTitle({
                  title: res.data.songinfo.title
              })

          }
      })

      wx.request({
          url: 'http://tingapi.ting.baidu.com/v1/restserver/ting?method=baidu.ting.song.lry&songid=' + songId,
          success: (res) => {
              if (res.data.lrcContent){
                  var lrcArr = this.analytic(res.data.lrcContent);
                  this.setData({
                      lrcArr
                  })
              }
          }
      })
  },
  analytic: function(lrc){
      var lyrics = lrc.split("\n");
      var lrcObj = {};
      for (var i = 0; i < lyrics.length; i++) {
          var lyric = decodeURIComponent(lyrics[i]);
          var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
          var timeRegExpArr = lyric.match(timeReg);
          if (!timeRegExpArr) continue;
          var clause = lyric.replace(timeReg, '');
          for (var k = 0, h = timeRegExpArr.length; k < h; k++) {
              var t = timeRegExpArr[k];
              var min = Number(String(t.match(/\[\d*/i)).slice(1)),
                  sec = Number(String(t.match(/\:\d*/i)).slice(1));
              var time = min * 60 + sec;
              lrcObj[time] = clause;
          }
      }
      return lrcObj;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var songId = options.id;
    this.getSong(songId);
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