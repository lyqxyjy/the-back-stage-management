window.addEventListener('load',function(){
    var priview_img = document.querySelector('.preview_img');
    var mask = document.querySelector('.mask');
    var big = document.querySelector('.big');

    //显示和隐藏
    priview_img.addEventListener('mousemove',function(){
        mask.style.display = 'block';
        big.style.display = 'block';
    })
    priview_img.addEventListener('mouseout',function(){
        mask.style.display = 'none';
        big.style.display = 'none';
    })
    // 鼠标移动的时候，让黄色的盒子跟着鼠标来走
    priview_img.addEventListener('mousemove',function(e){
        // 计算出鼠标在盒子内的坐标
        var x = e.pageX - this.offsetLeft;
        var y = e.pageY - this.offsetTop;
        //要考虑mask盒子的父盒子是否有定位
        var mx =  x - mask.offsetWidth / 2 ;
        var my =  y - mask.offsetHeight / 2;
        
        // 遮挡层最大横向移动距离，就是图片盒子的宽减去mask盒子
        var maskMax = priview_img.offsetWidth - mask.offsetWidth;
        if(mx <= 0){
            mx = 0;
        }else if(mx >= maskMax){
            mx = maskMax;
        }
        //遮挡层最大竖向移动距离就是图片盒子的高减去mask盒子的高
        if(my <= 0){
            my = 0;
        }else if(my >= maskMax){
            my = maskMax;
        }
        
        mask.style.left  = mx +'px';
        mask.style.top = my + 'px';

        //大图片移动距离 = 遮挡层移动距离 * 大图片最大移动距离 / 遮挡层最大移动距离
        var bigimg = document.querySelector('.bigIMG');
        var bigmax = bigimg.offsetWidth - big.offsetWidth;
        var bigx= mx * bigmax / maskMax;
        var bigy= my * bigmax / maskMax;
        bigimg.style.left = -bigx +'px';
        bigimg.style.top = -bigy +'px';
    })
})