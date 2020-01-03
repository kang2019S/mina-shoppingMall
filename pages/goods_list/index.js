import { request } from "../../request/index.js";

//引入ES7的async语法
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
    data: {
        tabs: [{
                id: 0,
                value: '综合',
                isActive: true
            },
            {
                id: 1,
                value: '销量',
                isActive: false
            },
            {
                id: 2,
                value: '价格',
                isActive: false
            }
        ],
        goodsList: []
    },
    QueryParams: {
        query: "",
        cid: "",
        pagenum: 1,
        pagesize: 10
    },
    totalPages: 0,
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // console.log(options);
        this.QueryParams.cid = options.cid;
        this.getGoodsList();
    },
    async getGoodsList() {
        const res = await request({ url: "/goods/search", data: this.QueryParams });
        //  总条数
        const total = res.total;
        // 计算总页数
        this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
        this.setData({
                goodsList: [...this.data.goodsList, ...res.goods]
            })
            // 手动关闭下拉刷新窗口
        wx.stopPullDownRefresh();
    },
    handleTabsItemChange(e) {
        // console.log(e);
        const { index } = e.detail;
        let { tabs } = this.data;
        tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
        this.setData({
            tabs
        })
    },
    //滚动条触底事件
    onReachBottom() {
        if (this.QueryParams.pagenum >= this.totalPages) {
            // console.log('没有下一页数据');
            wx.showToast({
                title: '没有下一页数据'
            });


        } else {
            this.QueryParams.pagenum++;
            this.getGoodsList();
        }
    },
    // 页面下拉刷新
    onPullDownRefreash() {
        this.setData({
            goodsList: []
        })
        this.QueryParams.pagenum = 1;
        this.getGoodsList();
    }
})