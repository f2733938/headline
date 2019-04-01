$(function(){
    var url = location.href.split('#').toString();//url不能写死
    $.ajax({
        type : "post",
        url : "/user/login/getShareInfo",
        dataType : "json",
        async : false,
        data:{url:url},
        success : function(data) {
            wx.config({
                debug: false,////生产环境需要关闭debug模式
                appId: data.appid,//appId通过微信服务号后台查看
                timestamp: data.timestamp,//生成签名的时间戳
                nonceStr: data.nonceStr,//生成签名的随机字符串
                signature: data.signature,//签名
                jsApiList: [//需要调用的JS接口列表
                    'checkJsApi',//判断当前客户端版本是否支持指定JS接口
                    'onMenuShareTimeline',//分享给好友
                    'onMenuShareAppMessage'//分享到朋友圈
                ]
            });
        },
        error: function(xhr, status, error) {
            //alert(status);
            //alert(xhr.responseText);
        }
    })
});