$(function() {
	var area = sanmi.queryParam("area");
    var userId = sanmi.queryParam("userId");
	//根据地区获取当前地区的卫生机构
	organizationByArea();
	cityNameByArea();
	//妇幼头条申请资质说明
	applyDesc();
	//判断是否申请过资质,网页.微信端申请之后返回,跳转结果页面
	isapply();
	function isapply() {
        var param = {
            url: '/headline/publisher/apply/detail',
            data: {
                'userId': userId,
            },
            method: 'post',
            dataType: 'json',
            callback: 'applyStatusHander',
        }
        sanmi.query(param);
    }
		function applyDesc() {
		var param = {
			url: '/article/',
			data: {
				'articleFlag': "HEAD_LINE_APPLY_DESC",
			},
			method: 'post',
			dataType: 'json',
			callback: 'DetailHander',
		}
		sanmi.query(param);
	}
	function organizationByArea() {
		var param = {
			url: '/headline/publisher/apply/findLocalOrg',
			data: {
				'area': area,
			},
			method: 'post',
			dataType: 'json',
			callback: 'typeDetailHander',
		}
		sanmi.query(param);
	}

	function cityNameByArea() {
		var param = {
			url: '/area/current/list',
			data: {
				'area': area,
				'areaLevel': 3,
			},
			method: 'post',
			dataType: 'json',
			callback: 'cityHander',
		}
		sanmi.query(param);
	}
});
//处理返回值
function typeDetailHander(json) {
	//debugger;
	var status = json.status;
	console.info(status);
	if(status == "0") {
		alert(json.msg);
		//sanmi.toPage("/index.html");
		return;
	}
	console.info(json);
	if(json.info != "") {
		$.each(json.info, function(index, item) {
			//alert(item.yuE)
			$("#inst-select").append("<option value='" + item.name + "'>" + item.name + "</option>");
		});
		$("#inst-select").append("<option value=''>" + '未找到所属机构,手动输入' + "</option>");
	}else{
		$("#inst-select").hide();
		$("#inst-input").show();
	}
	var userId = sanmi.queryParam("userId");
	var province = sanmi.queryParam("province");
	var city = sanmi.queryParam("city");
	var area = sanmi.queryParam("area");
	
	$("#userId").val(userId);
	$("#area").val(area);
}

function cityHander(json) {
	var status = json.status;
	//console.info(status);
	if(status == "0") {
		alert(json.msg);
		//sanmi.toPage("/index.html");
		return;
	}
	//console.info(json.info);
	var province;
	var city;
	var area;
	//debugger;
	//获取地区信息回显 默认区域地区
	for(var i = 0, l = json.info.provinceList.length; i < l; i++) {
		if(json.info.provinceList[i].chose == "Y") {
			province = json.info.provinceList[i].name;
			$("#provinceCode").val(json.info.provinceList[i].id);
		}
	}
	for(var i = 0, l = json.info.cityList.length; i < l; i++) {
		if(json.info.cityList[i].chose == "Y") {
			city = json.info.cityList[i].name;
			$("#cityCode").val(json.info.cityList[i].id);
		}
	}
	for(var i = 0, l = json.info.areaList.length; i < l; i++) {
		if(json.info.areaList[i].chose == "Y") {
			area = json.info.areaList[i].name;
			$("#areaCode").val(json.info.areaList[i].id);
		}
	}	
	$("#doc_area").val(province + city + area);
	$("#org_area").val(province + city + area);
}
//处理返回值
function DetailHander(json) {
	var status = json.status;
	console.info(json);
	if(status == "0") {
		alert(json.msg);
		//sanmi.toPage("/index.html");
		return;
	}
	$("#content").html(json.info[0].apaContent);
	sanmi.setCash("jumpUrl","qualification-apply.html");
}
function applyStatusHander(json) {
    var status = json.status;
    //console.info(status);
    if(status == "0" ) {
        alert(json.msg);
        //sanmi.toPage("/index.html");
        return;
    }
    //	debugger;
    console.info(json);
    //获取用户申请资质信息,判断跳转页面
    var userId = sanmi.queryParam("userId");
    //var cityCode = $("#cityCode").val();
    if(json.info != "") {
        if(json.info.publishTypeFlag == "DOCTOR") {
            window.location.href= "/view/qualification-apply-result.html?userId=" + userId;
        } else {
            window.location.href= "/view/operators-qualification-apply-result.html?userId=" + userId;
        }
    }
}