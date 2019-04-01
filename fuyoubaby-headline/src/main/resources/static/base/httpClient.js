﻿/*发起http请求获取所需要的数据*/
//定义全局变量
var sanmi={}
//测试接口地址
sanmi.serverUrl = "http://192.168.1.10:9999/v2";
//sanmi.serverUrl = "http://develop.fangxinyuesao.com/api/v2";
//正式接口地址
//sanmi.serverUrl = "https://api.fangxinyuesao.com/v2";
//sanmi.serverUrl = "http://192.168.1.92:8080/v2";
//sanmi.serverUrl = "http://47.104.31.246:9099/v2";
//sanmi.serverUrl = "http://localhost:8080/v2";


//发送普通的请求获取数据
/*
 * param的数据类型：{url:'jdljfsdkjf',//请求路径
	          data:{a:b}, //传递的参数
	          method :'post',//请求方式,post或者get
	          dataType:'json',//数据返回方式,此处支持json或者jsonp
	          callback:'callback'//返回数据后需要调用的函数	          
             }*/
sanmi.query = function(param){
	if(param == null)
	{
		return;
	}
	param.data = param.data || {};
	//param.data.token=sanmi.getCash("token");
	var options={
			url : sanmi.serverUrl + param.url,
			data : param.data,
			type : param.method,
			cache : false,
			async: false,
			dataType : param.dataType,
			success : function(json) {
				if (param.callback) {
					var exp = param.callback + '(' + sanmi.toString(json)
							+ ');';
					eval(exp);
				}
			},
			error : function(res) {	
				if(res.status == 401){
					alert("请重新登陆");return;
				}
				if (param.callback) {
					var str = res.responseText;
					if (!str || str == '')
						str = '{"code": "0", "msg": "服务器出错!"}';
					eval(param.callback + '(' + str + ');');
				}
			}
	};
	$.ajax(options);
}
sanmi.findLoginStatus = function(param){
	if(param == null)
	{
		return;
	}
	param.data = param.data || {};
	var loginInfo=sanmi.getCash("userInfo");
	var options={
			url : sanmi.serverUrl + param.url,
			data : param.data,
			type : param.method,
			cache : false,
			async: false,
			dataType : param.dataType,
			beforeSend: function () {
	        if(loginInfo == null){
	        	return false;
	        	document.location.href="login.html";
	        }       
		   	},
			success : function(json) {
				if (param.callback) {
					var exp = param.callback + '(' + sanmi.toString(json)
							+ ');';
					eval(exp);
				}
			},
			error : function(res) {	
				if(res.status == 401){
					alert("请重新登陆");return;
				}
				if (param.callback) {
					var str = res.responseText;
					if (!str || str == '')
						str = '{"code": "0", "msg": "服务器出错!"}';
					eval(param.callback + '(' + str + ');');
				}
			}
	};
	$.ajax(options);
}
//设置缓存数据
sanmi.setCash = function(key,val)
{
	if(key == null)
	{
		return;
	}
	val = sanmi.toString(val);
	window.sessionStorage.setItem(key,val);
}
sanmi.setLocalCash = function(key,val)
{
	if(key == null)
	{
		return;
	}
	val = sanmi.toString(val);
	window.localStorage.setItem(key,val);
}
//删除缓存数据
sanmi.removeCash = function(key)
{
	window.sessionStorage.removeItem(key);
}
//获取缓存数据
sanmi.getCash = function(key)
{
	var info = window.sessionStorage.getItem(key);
	info = $.parseJSON(info);
	return info;
}
sanmi.getLocalCash = function(key)
{
	var info = window.localStorage.getItem(key);
	info = $.parseJSON(info);
	return info;
}
sanmi.replaceAll = function(source,target)
{
	var reg = new RegExp(source,'gi');
	return this.replace(reg,target);
}
//将json转化为字符串
sanmi.toString = function(json)
{
	return JSON.stringify(json);
}
//页面顶部弹出提示信息,5秒后消失
sanmi.alert = function(msg)
{
	var dlg = $("#dlg_alert");
	if(dlg.length == 0)
	{
		var width = document.body.clientWidth;
		var left = width/2 - 250;
		if(left < 0)
		{
			left = 0;
		}
		var htmlStr = "<div  id='dlg_alert' align='center' style='text-align:center;top:200px;";
		htmlStr += "width:"+width+"px;display:none;'><div style=\"position:relative;text-align:center;";
	    htmlStr += "display:block;background-color: #333;left:"+left+"px;";
	    htmlStr += "line-height:30px;font-size:14px;color:#FFFFFF;height:auto;width:500px;\">";
	    htmlStr += "</div></div>";
		$("body").append(htmlStr);
	}
	$("#dlg_alert").html(msg);
	$("#dlg_alert").show();
	setTimeout("$('#dlg_alert').hide()",5000);	
}
//字符串去前后空格
sanmi.trim = function(str)
{
	return str.replace(/(^\s*)|(\s*$)/g,"");
}
//将字符串转化为json对象
sanmi.toJson = function(str)
{
	 return JSON.parse(str);
}
//跳转到指定页面
sanmi.toPage = function(str)
{
	document.location.href=str;
}
//获取请求地址中指定的参数
sanmi.queryParam = function(name)
{
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}
//包含页面,urlStr填写需要包含的页面的相对路径，在需要显示的位置调用改方法即可
sanmi.include = function(urlStr)
{	
	  
	  var resp = $.ajax({url:urlStr,async:false});
	  var status = resp.status;
	  if(status == 200)
	  {
		  document.write(resp.responseText);  
	  }	  

}
//读取文件选择器中的文件，以文本的方式读取
//@param objId 页面file文件选择器id
//@param func 读取完文件后要执行的方法，改方法带有文本参数
sanmi.readTxtFile = function(objId,func)
{
	if(window.FileReader)
	{
		var selectedFile = document.getElementById(objId).files[0];//获取读取的File对象		 
		var name = selectedFile.name;//读取选中文件的文件名
		var size = selectedFile.size;//读取选中文件的大小		
		var reader = new FileReader();//这里是核心！！！读取操作就是由它完成的。
		reader.readAsText(selectedFile);//读取文件的内容			
		reader.onload = function(){			
			eval(func+"('" + this.result + "');");//当读取完成之后会回调这个函数,此时文件的内容存储到了result中。直接操作即可。
		};
	}
	else
	{//浏览器不支持FileReader
		alert("FileReader is not supported");
	}
	
}

//转义
sanmi.recoverHtml = function(str)
{
  str = str.replace(/&#60;/g,"<");
  str = str.replace(/&#62;/g,">");	
  str = str.replace(/&#34;/g,"'");	
  return str;
}
//系统错误提示
function sysTip(){
	layer.open({
		title:'信息提示',
		content:'<p style="text-align:center">系统错误</p>',
		btn:'',
		area:['320px','150px'],
})
setTimeout("$('.layui-layer-dialog,.layui-layer-shade').hide()",5000);
}
