package com.sanmi.microservice.headline.common;

/**
 * @author：许志国 <br/>
 * ===============================
 * Date：2018/3/27
 * Time：16:41
 * ================================
 */
public class Constants {
    /** 接口地址 正式*/
    //public static final String interfaceAddress="http://api.fangxinyuesao.com/v2/";
    /** 接口地址 测试*/
 //   public static final String interfaceAddress="http://develop.fangxinyuesao.com/api/v2/";
    public static final String interfaceAddress="http://192.168.1.10:9999/v2/";
    //public static final String interfaceAddress="https://api.fangxinyuesao.com/v2/";
    /** 接口返回status标识 */
    public static final String STATUS_SUCCESS = "1";//成功

    /**状态码*/
    public static final String STATE_ZC = "0";
    /**
     * 微信第三方绑定,登录标识
     */
    public static final String PLATFORM = "HEADLINE_WECHAT_OPEN";
    /**
     * 主页后缀信息
     */
    public static final String INDEX = "index";
    /**
     * 来自第三方的访问标识
     */
    public static final String FLAG = "FYBB_WECHAT_OPEN";
}
