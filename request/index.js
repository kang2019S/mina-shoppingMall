let ajaxTimes = 0;

export const request = (params) => {
    //判断 url中是否带有/url/ 请求私有路径时，带上header token
    let header = {...params.header };
    if (params.url.includes("/my/")) {
        header["Authorization"] = wx.getStorageSync("token");
    }
    ajaxTimes++;
    wx.showLoading({
        title: '加载中',
        mask: true
    });
    // 公共URL
    const baseUrl = "https://api.zbztb.cn/api/public/v1";
    return new Promise((resolve, reject) => {
        wx.request({
            ...params,
            header: header,
            url: baseUrl + params.url,
            success: (result) => {
                resolve(result.data.message);
            },
            fail: (err) => {
                reject(err);
            },
            complete: () => {
                ajaxTimes--;
                if (ajaxTimes === 0) {
                    wx.hideLoading()
                }
            }
        });
    })
};