$(function() {
	var recommend = sanmi.queryParam("recommend");
	var secondLevelArticleTypeId = sanmi.queryParam("secondLevelArticleTypeId");
	var userId = sanmi.queryParam("userId");
	var keyword = sanmi.queryParam("keyword");
	var myCollect = sanmi.queryParam("myCollect");
	var myFollow = sanmi.queryParam("myFollow");
	var myHistory = sanmi.queryParam("myHistory");
    var data;
    if(recommend != "" && recommend != null){
        data = {
            recommend:"true",
            userId:userId,
        }
    }else if(myCollect != "" && myCollect != null){
        data = {
            myCollect:myCollect,
            userId:userId,
        }
    }else if(secondLevelArticleTypeId != "" && secondLevelArticleTypeId != null){
        data = {
            secondLevelArticleTypeId:secondLevelArticleTypeId,
            userId:userId,
        }
    }else if(myFollow != "" && myFollow != null){
        data = {
            myFollow:myFollow,
            userId:userId,
        }
    }else if(myHistory != "" && myHistory != null){
        data = {
            myHistory:myHistory,
            userId:userId,
        }
    }else {
        data = {
            keyword:decodeURI(keyword),
            userId:userId,
        }
    }
	//妇幼头条文章列表
	articleList();
	function articleList() {
		var param = {
			url: '/headline/article/info/list',
			data: data,
			method: 'post',
			dataType: 'json',
			callback: 'topicDetailHander',
		}
		sanmi.query(param);
	}
});
//处理返回值
function topicDetailHander(json) {
	var status = json.status;
	//console.info(status);
	if(status == "0") {
		alert(json.msg);
		//sanmi.toPage("/index.html");
		return;
	}
	//console.info(json);
    var userId = sanmi.queryParam("userId");
	var platform =sanmi.queryParam("platform");
    var keyword = sanmi.queryParam("keyword");
	if(platform != null && keyword == null){
	    $(".fixed-idx").hide();
	    $(".content_major").css("margin-top",0);
    }
    json.userId =userId;
		var html = template('floorList', json);
		console.info(json.info);
		console.info(html);
	$(".line-con").html(html);
	//没有值时,显示默认图片
	if (json.info == ""){
	    var html = "<img src='/resources/images/WUZX@3x.png ' style='width:4rem;display: block;margin:2rem auto;margin-top:6rem'>";
	    html=html+"<p style='text-align: center;font-size: 0.75rem;color:#666666'>暂无资讯~</p>"
/*	    var html = "<img src='/resources/images/WUZX@3x.png ' style='width:8rem;display: block;margin:4rem auto;'>";
	    html=html+"<p style='text-align: center;font-size: 0.75rem;color: grey'>暂无资讯~</p>"*/
        $(".line-con").html(html);
    }
	//debugger;
	var keyword = sanmi.queryParam("keyword");
	if(keyword != null){
		$("#serachTxt").val(decodeURI(keyword));
	}

    //文章详情跳转链接,动态添加userId参数,5.8弃用
/*    $.each($(".line-con a"), function(i, e) {
        var w = $(e).attr("href");
        $(e).attr("href", w + "&userId=" + userId+"&platform="+platform);
    })*/

	//document.getElementById('content').innerHTML = html;
	
	//var html = template('imageBox', json.info);
	/*if((json.info.imageList.length-6)>0){
		console.log("大于6")
		$("#img-more-count").html(json.info.imageList.length-6);
	}else{
		$(".img-more").hide();
	}*/
	//$(".my-gallery").html(html);
}
