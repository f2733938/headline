$(function() {
	var articleId = sanmi.queryParam("articleId");
	var userId = sanmi.queryParam("userId");
	//妇幼头条文章对应评论
	articleCommentList();
    //妇幼头条文章详情,只查询文章评论数量
    articleView();
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
});
//处理返回值
function articleCommentHander(json) {
	var status = json.status;
	//console.info(status);
	if(status == "0") {
		alert(json.msg);
		//sanmi.toPage("/index.html");
		return;
	}
    var userId = sanmi.queryParam("userId");
    console.info(json);

    json.userId =userId;
	var html = template('typefloorList', json);
	console.info(json);
	$(".title").html("评论管理("+json.info.length+")");
	//console.info(html);
	//$(".typeList").html(html);
	document.getElementById('comment_sec').innerHTML = html;

	var articleId = sanmi.queryParam("articleId");
	$("#userId").val(userId);
		$("#articleId").val(articleId);
	//$("#back").attr("href","detail.html?articleId="+articleId+"&userId="+userId);
    if (json.info == ""){
        var html = "<img src='/resources/images/WUZX@3x.png ' style='width:8rem;display: block;margin:4rem auto;'>";
        html=html+"<p style='text-align: center;font-size: 0.75rem;color: grey'>暂无评论~</p>"
        $("#comment_sec").html(html);
    }
}
//处理返回值
function topicDetailHander(json) {
    var status = json.status;
    //console.info(status);
    if (status == "0") {
        alert(json.msg);
        //sanmi.toPage("/index.html");
        return;
    }
    $(".title").html("评论管理("+json.info.commentCount+")");
}
