$(function() {
	var publisher = sanmi.queryParam("publisherId");
    var userId = sanmi.queryParam("userId");
	//发布者用户详情
    publisherInfo();
    articleList();
		function publisherInfo() {
		var param = {
			url: '/headline/publisher/info/detail',
			data: {
				'userId': userId,
				"publisher":publisher,
			},
			method: 'post',
			dataType: 'json',
			callback: 'infoHander',
		}
		sanmi.query(param);
	}
	//发布者发布的文章
    function articleList() {
        var param = {
            url: '/headline/article/info/list',
            data: {
                "publisher":publisher
            },
            method: 'post',
            dataType: 'json',
            callback: 'topicDetailHander',
        }
        sanmi.query(param);
    }
});
//处理返回值
function infoHander(json) {
	var status = json.status;
	//console.info(status);
	if(status == "0") {
		alert(json.msg);
		//sanmi.toPage("/index.html");
		return;
	}
    console.info(json);

	if (json.info != "" && json != undefined){
	    if(json.info.ownImage != ""){
            $(".pub-head").attr("style","background-image:url("+json.info.ownImage+");");
        }
        if(json.info.hasFollow == 'Y'){
            $(".fbz-gu").addClass("fbz-nogu");
            $(".fbz-gu").html("已关注");
        }else{
            $(".fbz-gu").removeClass("fbz-nogu");
            $(".fbz-gu").html("关注");
        }
        $("#fansCount").html(json.info.followCount);
        $("#newsCount").html(json.info.articleCount);
        $("#readCount").html(json.info.formatReadCount);
        if (json.info.ownOrgName != ""){
            $("#ownName").html(json.info.ownName +"-"+ json.info.ownOrgName);
        }else {
            $("#ownName").html(json.info.ownName);
        }

    }
}
//处理返回值
function topicDetailHander(json) {
    var status = json.status;
    //console.info(status);
    if(status == "0") {
        alert(json.msg);
        //sanmi.toPage("/index.html");
        return;
    }
    var userId = sanmi.queryParam("userId");
    json.userId =userId;
    console.info(json);
    var html = template('floorList', json);
    document.getElementById('content2').innerHTML = html;
}

