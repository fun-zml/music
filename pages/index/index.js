//index.js
//http://127.0.0.1:8020/wx_cloud_music
//获取应用实例
const app = getApp();
Page({
    data: {
        list: [],
        bannerList: [
            '/images/banner1.jpg',
            '/images/banner2.jpg',
            '/images/banner3.jpg',
            '/images/banner4.jpg',
        ],
        newsongList: [],
        currentSong: {},
        playing: false,
        progress: 0,
    },
    albumDetail: function (ev) {
        var id = ev.currentTarget.dataset.id;
        var index = ev.currentTarget.dataset.index;
        var playcount = ev.currentTarget.dataset.playcount;
        wx.navigateTo({
            url: '/pages/songlist/songlist?id=' + id + '&playcount=' + playcount + '&index=' + index,
        })
    },
    more: function(){
        wx.switchTab({
            url: '/pages/poplist/poplist',
        })
    },
    process: function(list){
        var musics = [];
        for(var i=0; i<list.length; i++){
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
        if(app.songUrl == '') return;
        wx.navigateTo({
            url: '/pages/play/play?id=' + app.currentSong.songId+'&flag='+app.playing,
        })
    },
    indexPlay: function(ev){
        var songId = ev.currentTarget.dataset.id;
        var index = ev.currentTarget.dataset.index;
        wx.navigateTo({
            url: '/pages/play/play?id='+songId,
        })
        app.songList = this.data.newsongList;
        app.currentIndex = index;
        app.currentSong = {
            song: app.songList[index].title,
            singer: app.songList[index].author,
            pic: app.songList[index].pic_radio
        }
    },
    onLoad: function(options){
        var url = 'http://127.0.0.1:8020/wx/wx_cloud_music/api/topPlayList.json';
        wx.request({
            url: url,
            success: (res) => {
                this.process(res.data.playlists)
            }
        })
        wx.request({
            url: 'http://tingapi.ting.baidu.com/v1/restserver/ting?method=baidu.ting.billboard.billList&type=1&size=10&offset=0',
            success: (res) => {
                this.setData({
                    newsongList: res.data.song_list
                })
            }
        })
    },
    onShow: function(){
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

        if (app.songUrl == '') return;
        var _this = this;
        app.song.onTimeUpdate(function () {
            app.progress = app.song.currentTime / app.song.duration;
            _this.setData({
                progress: app.progress * 750 + 'rpx'
            })
        })
        this.setData({
            playing: app.playing
        })
        app.song.onStop(function () {
            _this.setData({
                playing: false,
            });
            app.playing = false;
        })
    }
})