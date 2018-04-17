// pages/songlist/songlist.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        infoObj: {},
        currentSong: {},
        playing: false,
        progress: 0,
    },
    play: function (ev) {
        var songId = ev.currentTarget.dataset.id;
        var index = ev.currentTarget.dataset.index;
        wx.navigateTo({
            url: '/pages/play/play?id=' + songId,
        })
        app.currentIndex = index;
        app.songList = this.data.list;
        app.currentSong = {
            song: app.songList[index].title,
            singer: app.songList[index].author,
            pic: app.songList[index].pic_radio
        }
        this.setData({
            currentSong: app.currentSong,
            progress: 0
        })
        app.progress = 0;
    },
    next: function () {
        if (app.songUrl == '') return;
        this.setData({
            progress: 0
        })
        app.currentIndex += 1;
        if (app.currentIndex == app.songList.length) app.currentIndex = 0;
        var songId = app.songList[app.currentIndex].song_id;
        this.getSong(songId);

    },
    getSong: function (songId) {
        this.setData({
            lrc: ''
        })
        var url = 'http://tingapi.ting.baidu.com/v1/restserver/ting?method=baidu.ting.song.play&songid=' + songId;
        wx.request({
            url,
            success: (res) => {
                app.songUrl = res.data.bitrate.file_link;
                app.currentSong = {
                    songId: res.data.songinfo.song_id,
                    song: res.data.songinfo.title,
                    singer: res.data.songinfo.author,
                    pic: res.data.songinfo.pic_radio
                }
                app.playing = true;
                var _this = this;

                var song = app.song;
                song.src = app.songUrl;
                //   song.onTimeUpdate(function () {
                //       var totalFen = parseInt(song.duration / 60);
                //       var totalMiao = parseInt(song.duration % 60);
                //       var fen = parseInt(song.currentTime / 60);
                //       var miao = parseInt(song.currentTime % 60);
                //       var tempTime = parseInt(song.currentTime);
                //       _this.setData({
                //           progress: app.progress*750+'rpx'
                //       })
                //   });


                this.setData({
                    playing: true,
                    currentSong: app.currentSong,
                })
                wx.setNavigationBarTitle({
                    title: res.data.songinfo.title
                })

            }
        })
    },
    toplay: function () {
        if (app.songUrl == '') return;
        wx.navigateTo({
            url: '/pages/play/play?id=' + app.currentSong.songId,
        })
    },
    playbar: function (ev) {
        if (app.songUrl == '') return;
        if (app.playing) {
            this.setData({
                playing: !app.playing
            });
            app.song.pause();
        } else {
            app.song.play();
            var url = 'http://tingapi.ting.baidu.com/v1/restserver/ting?method=baidu.ting.song.play&songid=' + app.currentSong.songId;
            wx.request({
                url,
                success: (res) => {
                    app.currentSong = {
                        songId: res.data.songinfo.song_id,
                        song: res.data.songinfo.title,
                        singer: res.data.songinfo.author,
                        pic: res.data.songinfo.pic_radio
                    }
                }
            })
            this.setData({
                playing: !app.playing
            })
        }
        app.playing = !app.playing;
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var id = options.id;
        var url = "http://tingapi.ting.baidu.com/v1/restserver/ting?method=baidu.ting.billboard.billList&type=" + id + "&size=50&offset=0";

        wx.request({
            url,
            success: (res) => {
                var infoObj = {
                    sign: res.data.billboard.comment,
                    backgroundUrl: res.data.billboard.pic_s210,
                    time: res.data.billboard.update_date
                };
                this.setData({
                    infoObj,
                    list: res.data.song_list
                })
            }
        })
        var tempObj = {
            pic: '/images/player-bar.png'
        }
        if (app.songUrl == '') {
            this.setData({
                currentSong: tempObj,
            })
        } else {
            this.setData({
                currentSong: app.currentSong,
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
        if (app.songUrl == '') return;
        var _this = this;
        app.song.onTimeUpdate(function () {
            app.progress = app.song.currentTime / app.song.duration;
            _this.setData({
                progress: app.progress * 750 + 'rpx'
            })
        })
        this.setData({
            playing: app.playing,
            currentSong: app.currentSong
        })
        app.song.onStop(function () {
            _this.setData({
                playing: false,
            });
            app.playing = false;
        })
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