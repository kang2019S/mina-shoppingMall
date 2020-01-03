import regeneratorRuntime from '../../lib/runtime/runtime';
import { request } from "../../request/index.js";

// pages/goods_detail/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodsObj: {},
        isCollect: false
    },
    GoodsInfo: {},

    /**
     * 生命周期函数--监听页面加载
     */
    // onLoad: function(options) {
    //     const { goods_id } = options;
    //     this.getGoodsDetail(goods_id);
    // },
    onShow() {
        let pages = getCurrentPages();
        let currentPage = pages[pages.length - 1];
        let options = currentPage.options;
        const { goods_id } = options;
        this.getGoodsDetail(goods_id);

    },
    //获取商品详情数据
    async getGoodsDetail(goods_id) {
        const goodsObj = await request({ url: "/goods/detail", data: { goods_id } });
        this.GoodsInfo = goodsObj;
        // console.log(res);
        this.setData({
            goodsObj: {
                goods_name: goodsObj.goods_name,
                goods_price: goodsObj.goods_price,
                // goods_introduce: goodsObj.goods_introduce,
                // 为解决部分iphone不支持webp格式
                goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
                pics: goodsObj.pics
            }
        })
    },
    // 点击轮播图放大效果
    handlePreviewImage(e) {
        const urls = this.GoodsInfo.pics.map(v => v.pics_mid);
        const current = e.currentTarget.dataset.url;
        wx.previewImage({
            current,
            urls
        });

    },
    //点击加入购物车
    handleCartAdd() {
        let cart = wx.getStorageSync("cart") || [];
        let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
        if (index === -1) {
            this.GoodsInfo.num = 1;
            cart.push(this.GoodsInfo);
        } else {
            cart[index].num++;
        }
        wx.setStorageSync("cart", cart);
        wx.showToast({
            title: '加入成功',
            icon: 'success',
            mask: true
        });

    },
    // 点击收藏图标
    handleCollect() {
        let isCollect = false;
        //获取缓存中的商品收藏数组
        let collect = wx.getStorageSync("collect") || [];
        //判断是否被收藏过
        let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
        //当index!==-1时表示已经收藏过了
        if (index !== -1) {
            collect.splice(index, 1);
            isCollect = false;
            wx.showToast({
                total: '取消成功',
                icon: 'success',
                mask: true
            });
        } else {
            collect.push(this.GoodsInfo);
            isCollect = true;
            wx.showToast({
                total: '收藏成功',
                icon: 'success',
                mask: true
            })
        }
        //把数组中的值存入缓存中
        wx.setStorageSync("collect", collect);
        this.setData({
            isCollect
        })

    }
})