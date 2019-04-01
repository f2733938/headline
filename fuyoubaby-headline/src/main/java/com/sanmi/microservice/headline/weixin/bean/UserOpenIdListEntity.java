package com.sanmi.microservice.headline.weixin.bean;

import lombok.Data;

import java.io.Serializable;

/**
 * 获取关注用户openid列表实体
 * ===============================
 * Created with Eclipse.
 * User：于起宇
 * Date：2017/9/26
 * Time：15:23
 * 简书：http://www.jianshu.com/u/092df3f77bca
 * ================================
 */
@Data
public class UserOpenIdListEntity
        implements Serializable {
    /**
     * 关注该公众账号的总用户数
     */
    private Long total;
    /**
     * 拉取的OPENID个数，最大值为10000
     */
    private Long count;
    /**
     * 列表数据，OPENID的列表
     */
    private UserOpenIdListDataEntity data;
    /**
     * 拉取列表的最后一个用户的OPENID
     */
    private String next_openid;
}
