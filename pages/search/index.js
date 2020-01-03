import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goods: [],
        isFocus: false,
        inpValue: ''
    },
    TimeId: -1,
    handleInput(e) {
        //获取输入框的值
        const { value } = e.detail;
        //检验合法性
        if (!value.trim()) {
            this.setData({
                goods: [],
                isFocus: false
            })
            return;
        }
        //准备发送请求
        this.setData({
            isFocus: true
        })
        clearTimeout(this.TimeId);
        this.TimeId = setTimeout(() => {
            this.qsearch(value);
        }, 1000);
    },
    //发送请求获取搜索建议数据
    async qsearch(query) {
        const res = await request({ url: "/goods/qsearch", data: { query } });
        this.setData({
            goods: res
        })
    },
    //点击取消
    handleCancel() {
        this.setData({
            inpValue: '',
            isFocus: false,
            goods: []
        })
    }

})