window.addEventListener('load',function(){
    // 第一个功能：鼠标在focus上箭头显示，离开箭头消失
    var arrow_l = document.querySelector('.arrow-l');
    var arrow_r = document.querySelector('.arrow-r');
    var focus = document.querySelector('.focus');
    var focuswidth = focus.offsetWidth;//图片宽度就是focus的宽度
    var num = 0;//每移动一次num就加1，总共要移动图片数量减一次
    var circul = 0;//每移动一次circul就加1小圆点就左移

    focus.addEventListener('mouseenter',function(){
        arrow_l.style.display = 'block';
        arrow_r.style.display = 'block';
        // 当鼠标在focus上时，定时器取消
        clearInterval(timer);
        timer = null;
    })

    focus.addEventListener('mouseleave',function(){
        arrow_l.style.display = 'none';
        arrow_r.style.display = 'none';
        timer = setInterval(function(){
            // 手动调用点击事件，调用之后就是arrow-r.click的事件
            arrow_r.click();
        },2000)
    })
    // 第二个功能 动态生成小圆圈，有几个图片就生成几个圆圈
    var ul= focus.querySelector('ul');
    var ol = focus.querySelector('.circul');

    for(var i=0;i<ul.children.length;++i){
        // 创建节点
        var li = document.createElement('li');
         li.setAttribute('index',i);//添加索引属性index
        // 插入节点
        ol.appendChild(li);
        // 第三个功能 小圆圈的排他思想点击事件
        li.addEventListener('click',function(){
            // 干掉所有人
            for(var i=0; i<ol.children.length; ++i){
                ol.children[i].className = '';
            }
            // 留下我自己
            this.className = 'current';

            //第四个功能 点击源点，移动图片，移动的是ul
            // ul的移动距离就是小圆圈的索引号 乘上图片的宽度 ul是向左走所以是负值
           
            var index = this.getAttribute('index') ;
            num = index;
            circul = index;
            animate1(ul,-index*focuswidth);
        }) 
    }
    ol.children[0].className = 'current';
    // 克隆第一个li
    var first  = ul.children[0].cloneNode(true);
    ul.appendChild(first);
    // 第五个功能 点击箭头ul滑动
   
   var flag = true;
    arrow_r.addEventListener('click', function(){
        if(flag){
            flag = false
            // 当num到最后一张图片的时候，将left清零，并将num清零 从新开始移动
        if(num == ul.children.length-1){
            ul.style.left = 0;
            num = 0;
        }
       num++;
       animate1(ul,-num * focuswidth,function(){
           flag = true;
       });
        circul++;
        if(circul==ol.children.length){
            circul = 0;
        }
        // 再利用排他思想
        circulChange();
        }
    })
    // 左箭头功能，
    arrow_l.addEventListener('click',function(){
       if(flag){
           flag = false;
         // 如果到num是0说明是第一个，需要将left移动最后，并且num是最大的
         if(num == 0){
            ul.style.left = -(ul.children.length-1)*focuswidth+'px';
            num = ul.children.length-1;
        }
       num--;
       animate1(ul,-num * focuswidth,function(){
           flag = true;
       });
        circul--;
        // 如果circru小于0说明到了第一个圆圈，则circul跳到最后一个
        if(circul < 0){
            circul = ol.children.length-1;
        }
          // 再利用排他思想
        circulChange();
       }
       
    })
    function circulChange(){
         // 再利用排他思想
         for(var i=0;i<ol.children.length;++i){
            ol.children[i].className = ''; 
        }
        ol.children[circul].className = 'current';
    }
    // 第六个功能自动播放
    var timer = setInterval(function(){
        // 手动调用点击事件，调用之后就是arrow-r.click的事件
        arrow_r.click();
    },2000)
})