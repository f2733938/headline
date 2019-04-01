$(function () {
    var recommend = sanmi.queryParam("recommend");
    var secondLevelArticleTypeId = sanmi.queryParam("secondLevelArticleTypeId");
    var keyword = sanmi.queryParam("keyword");
    var userId = sanmi.queryParam("userId");
    var cityCode = sanmi.queryParam("cityCode");
    var data;
    if (keyword != "" && keyword != null) {
        data = {
            keyword: keyword,
            userId: userId,
        }
    } else if (cityCode != "" && cityCode != null) {
        data = {
            cityCode: cityCode,
            userId: userId,
        }
    } else if (secondLevelArticleTypeId != "" && secondLevelArticleTypeId != null) {
        data = {
            secondLevelArticleTypeId: secondLevelArticleTypeId,
            userId: userId,
        }
    } else {
        data = {
            recommend: "true",
            userId: userId,
        }
    }
    //妇幼头条文章列表
    articleList();
    //妇幼头条文章类型列表
    articleTypeList();

    function articleList() {
        var param = {
            url: '/headline/article/info/list',
            data: /* {
				'recommend': recommend,
				'secondLevelArticleTypeId': secondLevelArticleTypeId,
				'keyword': keyword,
				"userId": userId,
				"cityCode": cityCode,
			},*/data,
            method: 'post',
            dataType: 'json',
            callback: 'topicDetailHander',
        }
        sanmi.query(param);
    }

    function articleTypeList() {
        var param = {
            url: '/headline/article/type/twoLevelList',
            data: {
                'userId': userId,
            },
            method: 'post',
            dataType: 'json',
            callback: 'typeDetailHander',
        }
        sanmi.query(param);
    }

    //获取session的值,赋予头像
    $.ajax({
        type: "POST", //提交方式
        url: "/user/login/getSession",//路径
        data: {},//数据，这里使用的是Json格式进行传输
        success: function (result) {//返回数据根据结果进行相应的处理
            console.log("session获取的值为:" + result);
            //debugger;
            console.log("用户头像的信息为:" + result.uHeadImage);
            if (result == "" || result == undefined) {
                return;
            }
            if (result.uHeadImage != "") {
                $(".user-head").attr("style", "background-image:url(" + result.uHeadImage + ");");
            }
            //sanmi.setCash("userInfo",result);
        }

    });
});

//处理返回值
function topicDetailHander(json) {
    var status = json.status;
    if (status == "0") {
        alert(json.msg);
        //sanmi.toPage("/index.html");
        return;
    }

    console.info(json);
    if (json.info == ""){
        var html = "<img src='/resources/images/WUZX@3x.png ' style='width:8rem;display: block;margin:4rem auto;'>";
        html=html+"<p style='text-align: center;font-size: 0.75rem;color: grey'>暂无评论~</p>"
        $(".content1").html(html);
        return;
    }
    var userId = sanmi.queryParam("userId");
    console.info(json);
    json.userId =userId;
    var html = template('stickfloorList', json);
    document.getElementById('content1').innerHTML = html;
    var html = template('floorList', json);
    document.getElementById('content2').innerHTML = html;
    //获取用户头像
    /*	var userInfo= sanmi.getCash("userInfo");
        if(userInfo != null && userInfo != ""){
            $(".user-head").attr("style","background-image:url("+userInfo.uHeadImage+");");
        }*/
    //console.log("用户信息为:"+userInfo);
}

//处理返回值
function typeDetailHander(json) {
    var status = json.status;
    //console.info(status);
    if (status == "0") {
        alert(json.msg);
        //sanmi.toPage("/index.html");
        return;
    }
    //console.info(json);
    //只在初始主页提供定位
    var recommend = sanmi.queryParam("recommend");
    //debugger;
    var cityCode = "370102";
    sanmi.setCash("cityCode", cityCode);
    if(recommend != null){
    //定位功能
    var map = new AMap.Map("");
    var lnglatXY = [117.13685, 36.67686]; //默认坐标，济南
    //获取当前定位
    map.plugin('AMap.Geolocation', function () {
        geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, //是否使用高精度定位，默认:true
            timeout: 10000 //超过10秒后停止定位，默认：无穷大
        });
        map.addControl(geolocation);
        geolocation.getCurrentPosition(function (status, result) {
            //定位成功
            if (status == "complete") {
                lnglatXY = [result.position.getLng(), result.position.getLat()];
                //alert(lnglatXY);
            }
            regeocoder();
        });
    });

    //逆地理编码
    function regeocoder() {
        var geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all"
        });
        geocoder.getAddress(lnglatXY, function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
                geocoder_CallBack(result); //获取地址成功
            } else {
                //获取地址失败失败，默认济南市历下区
                //		window.location.href = "${request.getContextPath()}/nosecure/index.html";
                //setSession('370102', '历下区');
                $("#cityCode").val("370102");
                sanmi.setCash("areaName", "山东济南市历下区");
            }
        });
        var marker = new AMap.Marker({ //加点
            map: map,
            position: lnglatXY
        });
        map.setFitView();
    }

    //获取定位编码
    function geocoder_CallBack(data) {
        //debugger;
        //获取行政区划
        var comp = data.regeocode.addressComponent.adcode;
        //获取当前地区名称
        var areaName = data.regeocode.addressComponent.district;
        var city = data.regeocode.addressComponent.city;
        var province = data.regeocode.addressComponent.province
        //alert(comp);
        console.log(province + city + areaName);
        cityCode = comp;
        //记录当前用户定位信息
        $("#cityCode").val(cityCode);
        sanmi.setCash("cityCode", cityCode);
        sanmi.setCash("areaName", province + city + areaName);
    }
    }
    //定位获取结束
    var html = template('typefloorList', json);
    //console.info(html);
    //$(".typeList").html(html);
    document.getElementById('typeList').innerHTML = html;
    //debugger;
    var userId = sanmi.queryParam("userId");
    var secondLevelArticleTypeId = sanmi.queryParam("secondLevelArticleTypeId");
    var recommend = sanmi.queryParam("recommend");
    var applyhref = $(".pull-right").attr("href");
    var cityCode =  sanmi.getCash("cityCode");
    //第三方访问的链接
    var platform= sanmi.queryParam("platform");
    console.log("platform的标识"+platform)
    if (platform != null && platform!="null"){
        $(".user-head").hide();
    }
    //搜索链接
    $("#search").attr("href", "/view/search.html?userId=" + userId + "&area=" + cityCode +"&platform="+platform);
    //申请资质链接
    //$(".pull-right").attr("href", "qualification-apply.html?userId=" + userId + "&area=" + cityCode);
    //本地链接
    $("#local").attr("href", "/view/index.html?cityCode=" + cityCode + "&userId=" + userId +"&platform="+platform );
    //推荐链接,默认加载,携带地区和用户id数据
    $("#recommend").attr("href", "/view/index.html?recommend=true&userId=" + userId+"&platform="+platform);
    //动态添加分类的跳转参数,以防切换分类时,缺少数据
    for (var i = 0, l = json.info.length; i < l; i++) {
        for (var key in json.info[i]) {
            $("#" + json.info[i][key]).attr("href", $("#" + json.info[i][key]).attr("href") + "&userId=" + userId+"&platform="+platform);　　　　 //alert(key+':'+json.info[i][key]);
        }
    }
    //文章详情跳转链接,动态添加userId参数(滚轮滑动加载的数据无效,去除动态添加参数 5.18更)
/*    $.each($("#content2 a"), function (i, e) {
        var w = $(e).attr("href");
        $(e).attr("href", w + "&userId=" + userId+"&platform="+platform);
        //console.info(w);
    })
    $.each($("#content1 a"), function (i, e) {
        var w = $(e).attr("href");
        $(e).attr("href", w + "&userId=" + userId+"&platform="+platform);
        //console.info(w);
    })*/
    //点击某二级分类时,默认选择状态
    if (recommend != null ) {
        $("#recommend").attr("class", "selected");
        $(".atTop").show();
    } else if (secondLevelArticleTypeId == null) {
        $("#local").attr("class", "selected");
        $(".atTop").hide(); //隐藏置顶标签
    } else {
        $("#" + secondLevelArticleTypeId).attr("class", "selected");
        $(".atTop").hide();
    }
    console.info(secondLevelArticleTypeId);
}

function person() {
    var userId = sanmi.queryParam("userId");
    //没有用户信息,跳转到登录页面
    if (userId == undefined || userId == "" || userId == "null") {
        sanmi.toPage("/view/login.html");
    } else {
        sanmi.toPage("/view/person/person-center.html?userId=" + userId);
    }
}
