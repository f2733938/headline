package com.sanmi.microservice.headline.weixin.service;

import com.alibaba.fastjson.JSON;
import com.hengyu.tools.http.HttpClientTools;
import com.hengyu.tools.validate.ValidateTools;
import com.sanmi.microservice.headline.configuration.properties.WeiXinProperties;
import com.sanmi.microservice.headline.weixin.bean.UserOpenIdListEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 读取关注公众号openid列表
 *
 * @author yuqiyu
 * ===============================
 * Created with Eclipse.
 * User：于起宇
 * Date：2017/9/26
 * Time：15:26
 * 简书：http://www.jianshu.com/u/092df3f77bca
 * ================================
 */
@Service("UserOpenIdListService")
public class UserOpenIdListService {
    /**
     * 微信access_token业务逻辑实现类
     */
    @Autowired
    private AccessTokenService accessTokenService;

    /**
     * 微信配置信息实体
     */
    @Autowired
    private WeiXinProperties weiXinProperties;

    /**
     * 读取关注用户openId列表
     *
     * @param nextOpenId 下一个openId(分页读取时用到，不传递时读取前10000条数据)
     * @return
     * @throws Exception
     */
    public UserOpenIdListEntity pull(String nextOpenId) throws
            Exception {
        /**
         * 从缓存内获取access_token
         */
        String access_token = accessTokenService.getToken(true);
        String url = formartUrl(access_token, nextOpenId);
        /**
         * 发送请求
         */
        String result = send(url);
        /**
         * 检查本次请求是否有效
         */
        boolean isSuccess = accessTokenService.checkToken(result);
        if (!isSuccess) {
            /**
             * 请求无效时获取新token并更新缓存数据
             */
            access_token = accessTokenService.getToken(false);
            url = formartUrl(access_token, nextOpenId);
            result = send(url);
        }
        /**
         * 返回实体内容
         */
        return JSON.parseObject(result, UserOpenIdListEntity.class);
    }

    /**
     * 格式化请求路径
     *
     * @param access_token
     * @return
     */
    String formartUrl(String access_token, String nextOpenId) throws Exception {
        return String.format(weiXinProperties.getGetUserInfoUrl(), access_token, ValidateTools.isEmpty(nextOpenId) ? "" : nextOpenId);
    }

    /**
     * 发送请求
     *
     * @param url
     * @return
     * @throws Exception
     */
    String send(String url) throws Exception {
        return HttpClientTools.post(url);
    }
}
