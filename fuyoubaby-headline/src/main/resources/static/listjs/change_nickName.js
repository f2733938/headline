$(function() {
    var nickName = sanmi.queryParam("nickName");
    $("#nickName").val(decodeURI(nickName));
})
function save(){
	var nickName = $("#nickName").val();
	if (nickName == ""){
        $.alert("昵称不能为空");
        return;
	}
	var userId = sanmi.queryParam("userId");
	//执行修改逻辑
	var param = {
			url: '/user/info/change',
			data: {
				'userid': userId,
				"nickname": nickName,
			},
			method: 'post',
			dataType: 'json',
			callback: 'changeDetailHander',
		}
		sanmi.query(param);
}
function changeDetailHander(json){
	
	var status = json.status;
	console.info(json);
	if(status == "0") {
        $.alert("昵称不符合规范");
		//sanmi.toPage("/index.html");
		return;
	}
 		 $.alert("修改昵称成功",function (){
             var userId = sanmi.queryParam("userId");
             sanmi.toPage("/view/person/person-info.html?userId="+userId);
		 });


}
function back(){
	var userId = sanmi.queryParam("userId");
	sanmi.toPage("/view/person/person-info.html?userId="+userId);
}

