import { request } from "../../request/index.js";

//引入ES7的async语法
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        leftMenuList: [],
        rightContent: [],
        currentIndex: 0,
        scrollTop: 0
    },
    Cates: [],
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // this.getCates();
        //本地存储技术
        const Cates = wx.getStorageSync("cates");
        if (!Cates) {
            this.getCates();
        } else {
            if (Date.now() - Cates.time > 1000 * 100) {
                this.getCates();
            } else {
                // console.log('使用缓存数据');

                this.Cates = Cates.data;
                let leftMenuList = this.Cates.map(v => v.cat_name);
                let rightContent = this.Cates[0].children;
                this.setData({
                    leftMenuList,
                    rightContent
                })
            }
        }
    },
    //过去分类数据
    /*     getCates() {
            request({ url: "/categories" })
                .then(res => {
                    this.Cates = res.data.message;

                    // 把接口的数据存入到本地存储中
                    wx.setStorageSync("cates", { time: Date.now(), data: this.Cates })
                        // 左侧菜单栏
                    let leftMenuList = this.Cates.map(v => v.cat_name);
                    let rightContent = this.Cates[0].children;
                    this.setData({
                        leftMenuList,
                        rightContent
                    })
                })
        }, */

    //利用ES7的async语法优化getCates
    async getCates() {
        const res = await request({ url: "/categories" });
        // this.Cates = res.data.message;
        this.Cates = res; //简化代码

        // 把接口的数据存入到本地存储中
        wx.setStorageSync("cates", { time: Date.now(), data: this.Cates })
            // 左侧菜单栏
        let leftMenuList = this.Cates.map(v => v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
            leftMenuList,
            rightContent
        })
    },
    handleItemTap(e) {
        const { index } = e.currentTarget.dataset;
        // console.log(e);
        let rightContent = this.Cates[index].children;
        this.setData({
            currentIndex: index,
            rightContent,
            scrollTop: 0
        })
    }
})