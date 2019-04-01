package com.sanmi.microservice.headline.weixin.bean;

import lombok.Data;

import java.io.Serializable;

/**
 * 获取用户列表时数据对象内容
 * ===============================
 * Created with Eclipse.
 * User：于起宇
 * Date：2017/9/26
 * Time：15:24
 * 简书：http://www.jianshu.com/u/092df3f77bca
 * ================================
 */
@Data
public class UserOpenIdListDataEntity
        implements Serializable {
    /**
     * 获取的openid列表
     */
    private String[] openid;
}
