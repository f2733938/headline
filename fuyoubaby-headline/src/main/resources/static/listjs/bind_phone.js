$(function() {
//////////////////////////////////////////////////web不需要此功能
	//绑定手机
	$("#bind").click(function(){
		var phone = $("#phone").val();
		var newPhone = $("#newPhone").val();
		var dtm = $("#dtm").val();
		var sms = $("#sms").val();
		var password = $("#password").val();
		if(checkPhone(phone) === false){
			alert("原手机号码有误，请重填");
			return;
		}
		if(checkPhone(newPhone) === false){
			alert("新手机号码有误，请重填");
			return;
		}
		if(dtm === ""){
			alert("动态码有误，请重填");
			return;
		}
		if(sms === ""){
			alert("短信码有误，请重填");
			return;
		}
		if(checkPassword(password) === false){
			alert("密码有误，请重填");
			return;
		}
		var param = {
			url: '/user/phone/change',
			data: {
				'userId	':userId,
				'phone' : phone,
				'code' : sms,
				'password' : password
			},
			method: 'post',
			dataType: 'json',
			callback: 'registerHander',
		}
		sanmi.query(param);
	})
	//获取动态码
	$("#phone").blur(function(){
		fetchDTM();
	});
		//看不清
	$("#invisibility").click(function(){
		fetchDTM();
	})
	function fetchDTM(){
		var phone = $("#phone").val();
		if(checkPhone(phone) === false){
			return;
		}
		$("#dtmImage").attr('src',sanmi.serverUrl+"/code/image/get?phone="+phone+"&bz=3&t="+Date.parse(new Date())); 	
	}

});
//验证密码
function checkPassword(password){ 
    if(!(/[0-9a-zA-Z]{6,20}/.test(password))){ 
        return false; 
    } 
}
//验证手机号
function checkPhone(phone){ 
    if(!(/^1[34578]\d{9}$/.test(phone))){ 
        return false; 
    } 
}
//注册成功
function registerHander(json) {
	var status = json.status;
	//console.info(status);
	if(status == "0") {
		alert(json.msg);
		//sanmi.toPage("/index.html");
		return;
	}
}
