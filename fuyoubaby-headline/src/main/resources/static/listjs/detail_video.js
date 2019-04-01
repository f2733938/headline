$(function() {
	var articleId = sanmi.queryParam("articleId");
	var userId = sanmi.queryParam("userId");
	//妇幼头条文章详情
	articleView();
	//妇幼头条文章对应评论
	articleCommentList();
	function articleView() {
		var param = {
			url: '/headline/article/info/details',
			data: {
				'articleId': articleId,
				'userId': userId,
			},
			method: 'post',
			dataType: 'json',
			callback: 'topicDetailHander',
		}
		sanmi.query(param);
	}
		function articleCommentList() {
		var param = {
			url: '/headline/article/comment/list',
			data: {
				'articleId': articleId,
				'userId': userId,
			},
			method: 'post',
			dataType: 'json',
			callback: 'articleCommentHander',
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
	console.info(json);
	//debugger;
		$("#detail_title").html(json.info.haiTitle);
	$("#ownName").html(json.info.ownName);
	$("#haiCreateTime").html(json.info.haiCreateTime);
	$("#hasFollow").html(json.info.hasFollow);
	$("#publisherId").val(json.info.publisherId);
	$("#commentCount").html(json.info.commentCount);
	$("#haiId").val(json.info.haiId);
    $("#focusCount").html(json.info.followCount);
    $("#headings").html(json.info.videoInfo.harDesc);
    //获取用户头像
    if(json.info.ownImage != ""){
        $(".detail-head").attr("style","background-image: url("+json.info.ownImage+");");
    }

	console.info(json.info.haiId);
	if(json.info.hasFollow == 'Y'){
        $("#guanzhu").attr("src","/resources/images/yiguanzhu.png");
	}else{
        $("#guanzhu").attr("src","/resources/images/guanzhu.png");
	}
	if(json.info.hasCollect == 'Y'){	
		$("#clickCollect").attr("src","/resources/images/yishoucang.png");
	}else{
		$("#clickCollect").attr("src","/resources/images/shoucang1.png");
	}
		var html = template('stickfloorList', json.info);
		//console.info(json.info);
		//console.info(html);
	document.getElementById('detail_video').innerHTML = html;
	var userId = sanmi.queryParam("userId");
	$("#userId").val(userId);
}
//处理返回值
function articleCommentHander(json) {
	var status = json.status;
    var userId = sanmi.queryParam("userId");
	//console.info(status);
	if(status == "0") {
        $.alert(json.msg);
		//sanmi.toPage("/index.html");
		return;
	}
    json.userId =userId;
	var html = template('typefloorList', json);
	//console.info(json);
	//console.info(html);
	//$(".typeList").html(html);
	document.getElementById('comment_sec').innerHTML = html;

}
