import { getSetting, chooseAddress, openSetting, showModal, showToast } from '../../utils/asyncWx.js';
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        address: {},
        cart: [],
        allChecked: false,
        totalPrice: 0,
        totalNum: 0
    },

    onShow() {
        //获取缓存中的地址信息
        const address = wx.getStorageSync("address");
        //获取缓存中的购物车数据
        const cart = wx.getStorageSync("cart") || [];
        this.setData({
            address
        });
        this.setCart(cart)

    },
    //点击收货地址
    async handleChooseAddress() {

        try {
            //获取权限的状态
            const res1 = await getSetting();
            const scopeAddress = res1.authSetting["scope.address"];
            // 判断权限状态
            if (scopeAddress === false) {
                await openSetting();
            }
            // 调用收货地址api wx.chooseAddress
            let address = await chooseAddress();
            address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
            //将地址信息存入缓存中
            wx.setStorageSync("address", address)
        } catch (error) {
            console.log(error);
        }


    },
    //设置购物车状态同时 重新计算 底部工具栏的数据 全选 总价格 购买的数量
    setCart(cart) {
        let allChecked = true;
        let totalPrice = 0;
        let totalNum = 0;
        cart.forEach(v => {
                if (v.checked) {
                    totalPrice += v.num * v.goods_price;
                    totalNum += v.num;
                } else {
                    allChecked = false;
                }
            })
            //判断数组是否为空
        allChecked = cart.length != 0 ? allChecked : false;
        this.setData({
            cart,
            totalPrice,
            totalNum,
            allChecked
        });
        wx.setStorageSync("cart", cart);
    },
    //商品的选中
    handleItemChange(e) {
        const goods_id = e.currentTarget.dataset.id;
        let { cart } = this.data;
        let index = cart.findIndex(v => v.goods_id === goods_id);
        cart[index].checked = !cart[index].checked;
        this.setCart(cart);
    },
    //全选
    handleItemAllCheck() {
        //获取data中的数据
        let { cart, allChecked } = this.data;

        allChecked = !allChecked;
        //循环修改cart数组中的商品选中状态
        cart.forEach(v => v.checked = allChecked);
        //把修改后的值重新赋值给data中
        this.setCart(cart);
    },
    async handleItemNumEdit(e) {
        //获取参数
        const { operation, id } = e.currentTarget.dataset;

        //获取购物车数组
        let { cart } = this.data;
        // //找到要修改的商品索引
        const index = cart.findIndex(v => v.goods_id === id);
        console.log(id);

        //判断是否执行删除
        if (cart[index].num === 1 && operation === -1) {
            //弹窗提示 showModal
            const res = await showModal({ content: "是否删除该商品?" });
            if (res.confirm) {
                cart.splice(index, 1);
                this.setCart(cart);
            }

        } else {
            //修改数量
            cart[index].num += operation;
            this.setCart(cart);
        }
    },
    async handlePay() {
        const { address, totalNum } = this.data;
        //判断收货地址
        if (!address.userName) {
            await showToast({ title: "您还没有选择收货地址" });
            return;
        }
        //判断商品数量是否为零
        if (totalNum === 0) {
            await showToast({ title: "你还没有选择任何商品" });
            return;
        }
        //跳转支付页面
        wx.navigateTo({
            url: '/pages/pay/index'
        });

    }


})