import { request } from "../../request/index.js";
//Page Object
Page({
    data: {
        //轮播图数组
        swiperList: [],
        catesList: [],
        floorList: []

    },
    //options(Object)
    onLoad: function(options) {
        //封装到request.js中方便多次调用
        //发送异步请求获取轮播图数据
        // wx.request({
        //     url: 'https://api.zbztb.cn/api/public/v1/home/swiperdata',
        //     data: {},
        //     header: { 'content-type': 'application/json' },
        //     method: 'GET',
        //     dataType: 'json',
        //     responseType: 'text',
        //     success: (result) => {
        //         // console.log(result);
        //         this.setData({
        //             swiperList: result.data.message
        //         })
        //     },
        //     fail: () => {},
        //     complete: () => {}
        // });
        this.getSwiperList();
        this.getCatesList();
        this.getFloorList();

    },
    //获取轮播图数据
    getSwiperList() {
        request({ url: "/home/swiperdata" })
            .then(result => {
                this.setData({
                    swiperList: result
                })
            })
    },
    // 获取分类导航数据
    getCatesList() {
        request({ url: "/home/catitems" })
            .then(result => {
                this.setData({
                    catesList: result
                })
            })
    },
    // 获取楼层数据
    getFloorList() {
        request({ url: "/home/floordata" })
            .then(result => {
                this.setData({
                    floorList: result
                })
            })
    }
});