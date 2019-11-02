window.addEventListener('load',function(){
    // 获取元素
    var focus  = document.querySelector('.focus');
    var ul = focus.children[0];//移动的是ul
    var w = ul.offsetWidth / 5;//focus的宽度
    var ol = focus.children[1];
    var flag = false;
    // 利用定时器自动轮播图片
    var index = 0;
    var timer  = setInterval(function(){
        index++;
       
        var translatex = -index * w;//每次移动的距离
        ul.style.transition = 'all .3s';//定义过渡动画，所有属性在0.3秒内过渡
        ul.style.transform = 'translateX('+translatex+'px)'//更改属性
    },2000)
    // 当过渡完了之后，判断是否是最后一张图片，如果是最后一张就，将图片跳转到第一张
    ul.addEventListener('transitionend', function(){
        if(index >= 3){//到了最后一张
            index= 0;
            ul.style.transition = 'none';//去掉动画
            var translatex = -index * w;//返回第一张
            ul.style.transform = 'translateX('+translatex+'px)'

        }else if(index<0){
            index = 2;//到倒数第二张
            ul.style.transition = 'none';//去掉动画
            var translatex = -index * w;
            ul.style.transform = 'translateX('+translatex+'px)';
        }
        // 过渡完了之后小圆点也会跟随变化
        // 把ol里面的li的current类去掉
        ol.querySelector('.current').classList.remove('current');
        // 当前索引的li加上current
        ol.children[index].classList.add('current');

    })
    // 手指滑动轮播图
    var startx = 0;//起始位置
    var movex = 0;//移动的距离
    ul.addEventListener('touchstart',function(e){
        startx  = e.targetTouches[0].pageX;//得到手指点的位置的坐标
        clearInterval(timer);//定时器不能工作
    })
    ul.addEventListener('touchmove',function(e){
        movex = e.targetTouches[0].pageX - startx;//移动的距离
        var translatex = -index * w + movex;
        ul.style.transition = 'none';//去掉动画
        ul.style.transform = 'translateX('+translatex+'px)';
        flag = true;
    })
    // 手指离开，根据移动的距离，判断是否播放上一张还是下一张
    ul.addEventListener('touchend',function(e){
      if(flag){
        if(Math.abs(movex) > 50){
            //如果是右滑动就是播放上一张
            if(movex > 0){
                index--;
            }else {
                index++;
            }
            var translatex = -index * w ;
            ul.style.transition = 'all .3';
            ul.style.transform = 'translateX('+translatex+'px)';
           }else {
            var translatex = -index * w ;
            
            ul.style.transform = 'translateX('+translatex+'px)';
           }
      }
       //手指离开就重新开启定时器
       clearInterval(timer)//必须先清除
       timer  = setInterval(function(){
        index++;
        var translatex = -index * w;//每次移动的距离
        ul.style.transition = 'all .3s';//定义过渡动画，所有属性在0.3秒内过渡
        ul.style.transform = 'translateX('+translatex+'px)'//更改属性
    },2000)
    })
})