$(function() {
	var userId = sanmi.queryParam("userId");
	//获取医生申请发布资质详情
	doctorApplyView();
	//妇幼头条申请资质说明
	applyDesc();

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

	function doctorApplyView() {
		var param = {
			url: '/headline/publisher/apply/detail',
			data: {
				'userId': userId,
			},
			method: 'post',
			dataType: 'json',
			callback: 'infoDetailHander',
		}
		sanmi.query(param);
	}
});
//处理返回值
function infoDetailHander(json) {
	var status = json.status;
	//console.info(status);
	sanmi.setCash("jumpUrl", "qualification_apply_edit.html");
	if(status == "0") {
		alert(json.msg);
		//sanmi.toPage("/index.html");
		return;
	}
	console.info(json);
	//回显性别信息,处理性别显示样式
	$("#sex").val(json.info.apaSex);
	if(json.info.apaSex == 'B') {
		$("#doc_man").attr("src", "/resources/images/yxz.png");
		$("#org_man").attr("src", "/resources/images/yxz.png");
		$("#doc_woman").attr("src", "/resources/images/wxz.png");
		$("#org_woman").attr("src", "/resources/images/wxz.png");
		$("#sex").val("B");
	} else {
		$("#doc_woman").attr("src", "/resources/images/yxz.png");
		$("#org_woman").attr("src", "/resources/images/yxz.png");
		$("#doc_man").attr("src", "/resources/images/wxz.png");
		$("#org_man").attr("src", "/resources/images/wxz.png");
		$("#sex").val("G");
	}
	//debugger;
	$("#userId").val(json.info.apaUserId);
	$("#applyId").val(json.info.apaId);
	//根据申请类型,回显显示信息
	if(json.info.publishTypeFlag == 'DOCTOR') {
		$(".yisheng").show();
		$("#doc_infomation").show();
		$(".qiye").hide();
		$("#licese").html("*医师从业资格证");
		$("#doc_userName").val(json.info.apaRealName);
		$("#doc_idCard").val(json.info.apaIdCard);
		$("#inst-input").val(json.info.doctorInfo.padHospital);
		$("#doc_division").val(json.info.doctorInfo.padDepartment);
		$("#doc_title").val(json.info.doctorInfo.padTitle);
		//$("#doc_area").val(json.info.pca);
		$("#doc_birthday").val(json.info.apaBirthDay);
	} else {
		$(".qiye").show();
		$("#doc_infomation").hide();
		$(".yisheng").hide();
		$("#licese").html("*卫生机构营业执照");
		$("#org_userName").val(json.info.apaRealName);
		$("#orgName").val(json.info.orgInfo.paiInstitutionName);
		$("#org_telephone").val(json.info.orgInfo.paiOperationPhone);
		$("#org_birthday").val(json.info.apaBirthDay);
		$("#org_idCard").val(json.info.apaIdCard);
		//$("#org_area").val(json.info.pca);
		//$("#sex").val(json.info.apaSex);
	}
	//存储地区信息,当选择地区时,即时保存
	$("#role").val(json.info.publishTypeFlag)
	$("#org_area").val(json.info.pca);
	$("#doc_area").val(json.info.pca);
	var area = sanmi.queryParam("area");
	var city = sanmi.queryParam("city");
	var province = sanmi.queryParam("province");
	//debugger;
	if(area != null) {
		$("#areaCode").val(json.info.apaArea);
		$("#cityCode").val(json.info.apaCity);
		$("#provinceCode").val(json.info.apaProvice);
	} else {
		$("#areaCode").val(json.info.apaArea);
		$("#cityCode").val(json.info.apaCity);
		$("#provinceCode").val(json.info.apaProvice);
	}
	//回显图片信息
	for(var i = 0, l = json.info.imageList.length; i < l; i++) {
		if(json.info.imageList[i].imageTypeFlag == "ID_CARD_POSITIVE") {
			$("#img1").attr("style", "background-image:url('" + json.info.imageList[i].imageUrl + "')");
		} else if(json.info.imageList[i].imageTypeFlag == "ID_CARD_REVERSE") {
			$("#img2").attr("style", "background-image:url('" + json.info.imageList[i].imageUrl + "')");
		} else if(json.info.imageList[i].imageTypeFlag == "ID_CARD_HAND") {
			$("#img3").attr("style", "background-image:url('" + json.info.imageList[i].imageUrl + "')");
		} else if(json.info.imageList[i].imageTypeFlag == "WORK_PROVE") {
			$("#img4").attr("style", "background-image:url('" + json.info.imageList[i].imageUrl + "')");
		} else if(json.info.imageList[i].imageTypeFlag == "OTHER_PROVE1") {
			$("#img5").attr("style", "background-image:url('" + json.info.imageList[i].imageUrl + "')");
			$("#imgId1").val('"' + json.info.imageList[i].paiId + '"');
		} else {
			$("#img6").attr("style", "background-image:url('" + json.info.imageList[i].imageUrl + "')");
			$("#imgId2").val('"' + json.info.imageList[i].paiId + '"');
			//alert(json.info.imageList[i].paiId);
		}
	}
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
	//记录初始请求网页,选择地区完成时返回此页面
	sanmi.setCash("jumpUrl", "qualification_apply_edit.html");
}