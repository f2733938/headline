$(function() {
	//妇幼头条注册协议
	articleTypeList();
		function articleTypeList() {
		var param = {
			url: '/article/',
			data: {
				'articleFlag': "HEADLINE_REGISTER_AGREEMENT",
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
	$("#content").html(json.info[0].apaContent);
}
