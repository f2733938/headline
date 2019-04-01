$(function() {
	var area = sanmi.queryParam("area");
	var flag = sanmi.queryParam("flag");
	var areaLevel = sanmi.queryParam("areaLevel");
	var areaName = sanmi.queryParam("areaName");
	var userId = sanmi.queryParam("userId");
	$("#userId").val(userId);
	$("#areaName").val(decodeURI(areaName));
	//根据定位are获取区级信息
	cityInfoByarea();

	function cityInfoByarea() {
		var param = {
			url: '/area/current/list',
			data: {
				'area': area,
				'areaLevel': areaLevel,
			},
			method: 'post',
			dataType: 'json',
			callback: 'cityByareaHander',
		}
		sanmi.query(param);
	}

});
//处理返回值
function cityByareaHander(json) {
	var status = json.status;
	//console.info(status);
	if(status == "0") {
		alert(json.msg);
		//sanmi.toPage("/index.html");
		return;
	}
	var html = template('cityList', json);
	//console.info(html);
	//$(".channel-list").html(html);
	document.getElementById('channel').innerHTML = html;
	var html = template('citysList', json);
	document.getElementById('citys').innerHTML = html;
	var html = template('areasList', json);
	document.getElementById('areas').innerHTML = html;
	var a = sanmi.getCash("areaName");
	//alert(a);
	//alert(decodeURI(areaName));
	if(a != null){
		var a1=a.indexOf("市");
		var a2=a.substring(a1+1,a1.length);
		$("#city").html(a2);


	}else{
		var areaName = sanmi.queryParam("areaName");

		$("#city").html(decodeURI(areaName));
	}
	
	//省市区 区域代码
	//$("#area").val(json.info.area);
	$("#citya").val(json.info.city);
	$("#provincea").val(json.info.province);
}