function animate1(element,tg,callback){
       
    clearInterval(element.timer);
    element.timer = setInterval(function(){
        // 要将步长取整，才能符合精度要求
        var step = (tg - element.offsetLeft) / 10;
        if(step>0){
            step = Math.ceil(step);
            
        }else if(step < 0){
            step = Math.floor(step);
        }
      
        // 为了防止动画后退，只能向上取整
        // if(step > 0){
        //     step = math.ceil(step);
        //     // 如果是负值则向下取整
        // }else if(step < 0){
        //     step = math.floor(step);
        // }
       
        if(element.offsetLeft == tg){
            clearInterval(element.timer);
            // 这个函数结束，回调函数开始
            // if(callback){
            //     callback();
            // }
            callback && callback()
           
        }
        element.style.left = element.offsetLeft + step +'px';
    },10)
}