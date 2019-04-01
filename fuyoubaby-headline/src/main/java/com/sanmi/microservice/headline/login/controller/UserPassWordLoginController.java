package com.sanmi.microservice.headline.login.controller;


import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.hengyu.tools.http.HttpClientTools;
import com.sanmi.core.framework.exception.LogicException;
import com.sanmi.core.framework.security.tools.ApiSecurityPostTools;
import com.sanmi.microservice.headline.common.Constants;
import com.sanmi.microservice.headline.configuration.properties.WeiXinProperties;
import com.sanmi.microservice.headline.login.params.LoginParam;
import com.sanmi.microservice.headline.login.params.UserInfoParam;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;
import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Formatter;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * 用户登录控制器
 *
 * @author：于起宇 <br/>
 * ===============================
 * Created with IDEA.
 * Date：2018/3/27
 * Time：上午9:41
 * 简书：http://www.jianshu.com/u/092df3f77bca
 * ================================
 */
@RestController
@RequestMapping(value = "/user/login")
public class UserPassWordLoginController {
    private final Logger log = LoggerFactory.getLogger(this.getClass());
    /**
     * 微信配置信息实体
     */
    @Autowired
    private WeiXinProperties weiXinProperties;
    //微信参数
    private String accessToken;
    private String jsApiTicket;
    //获取参数的时刻
    private Long getTiketTime = 0L;
    private Long getTokenTime = 0L;
    //参数的有效时间,单位是秒(s)
    private Long tokenExpireTime = 0L;
    private Long ticketExpireTime = 0L;

    /**
     * 用户名密码登录方法
     *
     * @param param 请求参数实体
     * @return
     * @throws LogicException
     */
    @RequestMapping(value = "/password", method = RequestMethod.POST)
    public JSONObject password(HttpServletRequest request,
                               HttpServletResponse response, @Valid LoginParam param)
            throws Exception {
        String url = Constants.interfaceAddress + "user/login";
        log.info("执行登录的url接口地址======>"+url);
        JSONObject result = ApiSecurityPostTools.sendResultJson(url, param);
        log.info("处理接口返回信息======>"+result);
        // System.out.println(result.getJSONObject("info").getString("password"));
        //新建session,存储登录信息
        if (result.getInteger("status") != 0) {
            HttpSession session = request.getSession();
            session.setAttribute("userInfo", result.getJSONObject("info"));
        }
        //System.out.println(session.getAttribute("info"));
        return result;
    }

    /**
     * 获取用户个人信息方法
     *
     * @param param
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/view", method = RequestMethod.POST)
    public JSONObject view(@Valid UserInfoParam param)
            throws Exception {
        String url = Constants.interfaceAddress + "user/detail";
        JSONObject result = ApiSecurityPostTools.sendResultJson(url, param);
        return result;
    }

    /**
     * 退出登录执行方法,清空session
     *
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/logout", method = RequestMethod.POST)
    public void logout(HttpServletRequest request,
                       HttpServletResponse response)
            throws Exception {
        HttpSession session = request.getSession();
        session.removeAttribute("userInfo");
    }

    /**
     * 进入个人中心判断用户登录的方法
     *
     * @param request
     * @param response
     */
    @RequestMapping(value = "/isLoginPerson", method = RequestMethod.POST)
    public void isLoginPerson(HttpServletRequest request,
                              HttpServletResponse response) {

    }

    /**
     * 用户信息绑定第三方
     *
     * @param param
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/bind", method = RequestMethod.POST)
    public JSONObject bind(HttpServletRequest request,
                           HttpServletResponse response, @Valid UserInfoParam param)
            throws Exception {
        String url = Constants.interfaceAddress + "user/register/platform";
        JSONObject result = ApiSecurityPostTools.sendResultJson(url, param);
        //新建session,存储登录信息
        if (result.getInteger("status") != 0) {
            HttpSession session = request.getSession();
            session.setAttribute("userInfo", result.getJSONObject("info"));
        }
        return result;
    }

    /**
     * 微信登录时,获取登录session,前台显示
     *
     * @param
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getSession", method = RequestMethod.POST)
    public JSONObject getSession(HttpServletRequest request,
                                 HttpServletResponse response)
            throws Exception {
        //获取服务器端session
        HttpSession session = request.getSession();
        //  session.setAttribute("userInfo", result.getJSONObject("info"));
        JSONObject result = (JSONObject) session.getAttribute("userInfo");
        return result;
    }

    /**
     * 微信自定义分享
     */
    @RequestMapping(value = "/getShareInfo", method = RequestMethod.POST)
    public Map<String, String> getShareInfo(HttpServletRequest request,
                                            HttpServletResponse response, String url) {
        //当前时间
        long now = System.currentTimeMillis();

        //判断accessToken是否已经存在或者token是否过期
        if (StringUtils.isBlank(accessToken) || (now - getTokenTime > tokenExpireTime * 1000)) {
            JSONObject tokenInfo = getAccessToken();
            if (tokenInfo != null) {
                accessToken = tokenInfo.getString("access_token");
                tokenExpireTime = tokenInfo.getLongValue("expires_in");
                //获取token的时间
                getTokenTime = System.currentTimeMillis();
                log.info("accessToken====>" + accessToken);
                log.info("tokenExpireTime====>" + tokenExpireTime + "s");
                log.info("getTokenTime====>" + getTokenTime + "ms");
            } else {
                log.info("====>tokenInfo is null~");
                log.info("====>failure of getting tokenInfo,please do some check~");
            }
        }
        //判断jsApiTicket是否已经存在或者是否过期
        if (StringUtils.isBlank(jsApiTicket) || (now - getTiketTime > ticketExpireTime * 1000)) {
            JSONObject ticketInfo = getJsApiTicket(accessToken);
            if (ticketInfo != null) {
                log.info("ticketInfo====>" + ticketInfo.toJSONString());
                jsApiTicket = ticketInfo.getString("ticket");
                ticketExpireTime = ticketInfo.getLongValue("expires_in");
                getTiketTime = System.currentTimeMillis();
                log.info("jsApiTicket====>" + jsApiTicket);
                log.info("ticketExpireTime====>" + ticketExpireTime + "s");
                log.info("getTiketTime====>" + getTiketTime + "ms");
            } else {
                log.info("====>ticketInfo is null~");
                log.info("====>failure of getting tokenInfo,please do some check~");
            }
        }
        //生成微信权限验证的参数
        Map<String, String> wechatParam = makeWXTicket(jsApiTicket, url);
        return wechatParam;

    }

    //获取accessToken
    private JSONObject getAccessToken() {
        //String accessTokenUrl = https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
        //获取微信端的accessToken
        String requestUrl = String.format(weiXinProperties.getGetAccessTokenUrl(), weiXinProperties.getAppId(), weiXinProperties.getAppSecret());
        String result = send(requestUrl);
        JSONObject jsonObject = JSON.parseObject(result);
        return jsonObject;
    }

    //获取ticket
    private JSONObject getJsApiTicket(String access_token) {
        //String apiTicketUrl = https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=ACCESS_TOKEN&type=jsapi
        // 通过acessToken 获取ticket
        String requestUrl = String.format(weiXinProperties.getGetTicketUrl(), access_token);
        String result = send(requestUrl);
        JSONObject jsonObject = JSON.parseObject(result);
        return jsonObject;
    }

    //生成微信权限验证的参数
    public Map<String, String> makeWXTicket(String jsApiTicket, String url) {
        Map<String, String> ret = new HashMap<String, String>();
        String nonceStr = createNonceStr();
        String timestamp = createTimestamp();
        String string1;
        String signature = "";

        //注意这里参数名必须全部小写，且必须有序
        string1 = "jsapi_ticket=" + jsApiTicket +
                "&noncestr=" + nonceStr +
                "&timestamp=" + timestamp +
                "&url=" + url;
        log.info("String1=====>" + string1);
        try {
            MessageDigest crypt = MessageDigest.getInstance("SHA-1");
            crypt.reset();
            crypt.update(string1.getBytes("UTF-8"));
            signature = byteToHex(crypt.digest());
            log.info("signature=====>" + signature);
        } catch (NoSuchAlgorithmException e) {
            log.error("WeChatController.makeWXTicket=====Start");
            log.error(e.getMessage(), e);
            log.error("WeChatController.makeWXTicket=====End");
        } catch (UnsupportedEncodingException e) {
            log.error("WeChatController.makeWXTicket=====Start");
            log.error(e.getMessage(), e);
            log.error("WeChatController.makeWXTicket=====End");
        }

        ret.put("url", url);
        ret.put("jsapi_ticket", jsApiTicket);
        ret.put("nonceStr", nonceStr);
        ret.put("timestamp", timestamp);
        ret.put("signature", signature);
        ret.put("appid", weiXinProperties.getAppId());

        return ret;
    }

    /**
     * 发送请求
     *
     * @param url
     * @return
     * @throws Exception
     */
    String send(String url) {
        return HttpClientTools.post(url);
    }

    //字节数组转换为十六进制字符串
    private static String byteToHex(final byte[] hash) {
        Formatter formatter = new Formatter();
        for (byte b : hash) {
            formatter.format("%02x", b);
        }
        String result = formatter.toString();
        formatter.close();
        return result;
    }

    //生成随机字符串
    private static String createNonceStr() {
        return UUID.randomUUID().toString();
    }

    //生成时间戳
    private static String createTimestamp() {
        return Long.toString(System.currentTimeMillis() / 1000);
    }

}
