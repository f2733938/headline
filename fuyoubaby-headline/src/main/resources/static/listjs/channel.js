$(function() {
	var userId = sanmi.queryParam("userId");
	//妇幼头条文章类型列表
	articleTypeList();
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
});
//处理返回值
function typeDetailHander(json) {
	var status = json.status;
	//console.info(status);
	if(status == "0") {
		alert(json.msg);
		//sanmi.toPage("/index.html");
		return;
	}
	var html = template('typefloorList', json);
	console.info(html);
	//$(".channel-list").html(html);
	document.getElementById('channel').innerHTML = html;
}
