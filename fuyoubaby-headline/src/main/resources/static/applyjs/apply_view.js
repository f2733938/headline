$(function() {
	var userId = sanmi.queryParam("userId");
	//获取医生申请发布资质详情
	doctorApplyView();
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

	if(status == "0") {
		alert(json.msg);
		//sanmi.toPage("/index.html");
		return;
	}
	console.info(json);
	if(json.info.apaCheckStatus == 'PASS_CHECK'){
		$("#waiting").hide();
		$("#refuse").hide();
		$("#agree").show();
	}else if(json.info.apaCheckStatus == 'REJECT'){
		$("#waiting").hide();
		$("#refuse").show();
		$("#agree").hide();
		$("#refuse_reason").html("拒绝原因: "+json.info.apaRejectReason);
	}
	$("#userName").val(json.info.apaRealName);
	$("#sex").val(json.info.apaSex);
	$("#birthday").val(json.info.apaBirthDay);
	$("#idCard").val(json.info.apaIdCard);
	$("#sex").val(json.info.sexName);
	$("#area").val(json.info.pca);
	$("#userId").val(json.info.apaUserId);
	$("#applyId").val(json.info.apaId);
	if(json.info.publishTypeFlag == 'DOCTOR'){
	//	$("#inst-input").val(json.info.doctorInfo.padHospital);
        $("#padHospital").val(json.info.doctorInfo.padHospital);
	$("#padDepartment").val(json.info.doctorInfo.padDepartment);
	$("#padTitle").val(json.info.doctorInfo.padTitle);
	}else{
		$("#paiInstitutionName").val(json.info.orgInfo.paiInstitutionName);  
		$("#paiOperationPhone").val(json.info.orgInfo.paiOperationPhone);  
	}
	
	var html = template('applyView', json.info);
	//console.info(html);
	//$(".channel-list").html(html);
	document.getElementById('imageList').innerHTML = html;
}
