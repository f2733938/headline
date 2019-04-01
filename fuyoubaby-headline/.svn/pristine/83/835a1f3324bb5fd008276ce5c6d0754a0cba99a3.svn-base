package com.sanmi.microservice.headline.login.params;

import com.sanmi.core.framework.valid.annotations.PhoneValidator;
import lombok.Data;
import org.hibernate.validator.constraints.NotEmpty;

/**
 * 登录请求参数实体
 *
 * @author：于起宇 <br/>
 * ===============================
 * Created with IDEA.
 * Date：2018/3/27
 * Time：上午9:43
 * 简书：http://www.jianshu.com/u/092df3f77bca
 * ================================
 */
@Data
public class LoginParam {
    /**
     * 手机号请求参数
     */
    @NotEmpty(message = "手机号格式不正确.")
    @PhoneValidator
    private String phone;
    /**
     * 登录密码
     */
    @NotEmpty(message = "密码格式不正确.")
    private String password;
}
