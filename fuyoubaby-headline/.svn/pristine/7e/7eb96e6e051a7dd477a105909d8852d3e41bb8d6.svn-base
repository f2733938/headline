package com.sanmi.microservice.headline.weixin.service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.hengyu.tools.http.HttpClientTools;
import com.hengyu.tools.parse.ParseTools;
import com.hengyu.tools.validate.ValidateTools;
import com.sanmi.microservice.headline.configuration.properties.WeiXinProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

/**
 * 获取请求token的值
 *
 * @author yuqiyu
 * ===============================
 * Created with Eclipse.
 * User：于起宇
 * Date：2017/9/26
 * Time：15:28
 * 简书：http://www.jianshu.com/u/092df3f77bca
 * ================================
 */
@Service
public class AccessTokenService {
    /**
     * redis缓存key
     */
    private static final String ACCESS_TOKEN_KEY = "accessToken";

    /**
     * 注入微信配置
     */
    @Autowired
    private WeiXinProperties weiXinProperties;

    /**
     * redis缓存
     */
    @Autowired
    private RedisTemplate redisTemplate;

    /**
     * 获取access_token
     *
     * @param isUseRedisCache 是否使用redis缓存数据
     * @return
     * @throws Exception
     */
    public final String getToken(boolean isUseRedisCache) throws Exception {
        /**
         * 使用redis缓存数据进行返回
         */
        if (isUseRedisCache) {
            Object redis_access_token = redisTemplate.opsForValue().get(ACCESS_TOKEN_KEY);
            if (ValidateTools.isNotEmpty(redis_access_token)) {
                return ParseTools.toString(redis_access_token);
            }
        }

        /**
         * 获取格式化后的请求路径
         * 未格式化字符串在resources/config/weixin.properties文件内
         */
        String url = String.format(weiXinProperties.getGetAccessTokenUrl(), weiXinProperties.getAppId(), weiXinProperties.getAppSecret());
        /**
         * 发送请求
         * 获取返回值
         */
        String result = HttpClientTools.post(url);
        /**
         * 转换jsonObject数据
         */
        JSONObject object = null;
        if (ValidateTools.isNotEmpty(result)) {
            object = JSON.parseObject(result);
        }
        /**
         * 返回access_token
         */
        String access_token = ValidateTools.isNotEmpty(object) ? object.getString("access_token") : "";
        if (ValidateTools.isNotEmpty(access_token)) {
            /**
             * 替换redis缓存数据库内的数据
             */
            redisTemplate.opsForValue().set("accessToken", access_token);
        }
        return access_token;
    }

    /**
     * 检查access_token是否有效
     * 接口返回是否正常
     * 返回数据存在errcode<>0时，重新获取access_token
     *
     * @param httpResult
     * @return
     * @throws Exception
     */
    public final boolean checkToken(String httpResult) throws Exception {
        if (ValidateTools.isNotEmpty(httpResult)) {
            JSONObject object = JSON.parseObject(httpResult);
            return ValidateTools.isNotEmpty(object) && "0".equals(object.getString("errcode"));
        }
        return false;
    }
}
