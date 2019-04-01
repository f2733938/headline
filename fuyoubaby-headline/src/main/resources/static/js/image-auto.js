function resize_img(pic){ //参数
	var w=$(pic).parent().width();
	var h=$(pic).parent().height();
    var re_new_size = function(r) {
      //根据比率重新计算宽度
      return {
        w: pic.width / r,
        h: pic.height / r
      };
    };
    var re_offset = function(n) {
      //根据新的宽高度返回偏移量
      return {
        off_l: (n.w - w) * 0.5,
        off_t: (n.h - h) * 0.5
      };
    };
    var re_position = function(o, n) {
      //重新定位图片
      pic.style.cssText = "position:absolute;top:" + -o.off_t + "px;left:" + -o.off_l + "px;width:" + n.w + "px;height:" + n.h + "px;";
    };
    var execute = function(rate) { //总执行函数
      var new_size = re_new_size(rate),
      offset_new = re_offset(new_size);
      re_position(offset_new, new_size);
    };

    //判断变量
    var rate_of_w = pic.width / w,
    rate_of_h = pic.height / h,
    rate;
    if (rate_of_w >= 1) {
      //图片宽度大于显示区域宽度
      if (rate_of_h >= 1) {
        //且图片高度大于显示区域高度
        rate = Math.min(rate_of_w, rate_of_h);
      } else {
        //图片高度小于显示区域
        rate = pic.height / h;
      }
    } else {
      //图片宽度小于显示区域宽度
      if (rate_of_h >= 1) {
        //且图片高度大于显示区域高度
        rate = pic.width / w;
      } else {
        //图片高度小于显示区域高度
        rate = Math.min(rate_of_w, rate_of_h);
      }
    }
    execute(rate);
    //执行入口  
  }
