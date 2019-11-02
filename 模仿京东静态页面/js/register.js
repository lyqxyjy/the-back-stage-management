window.addEventListener('load',function(){
    var regtel = /^1[3|5|8|7]\d{9}$/;
    var regqq  =/^\d{6,12}$/;
    var tel = document.querySelector('#tel');
    var qq = document.querySelector('#qq');
    
    pandun(tel,regtel);
    pandun(qq,regqq);
    
    function pandun(ele,reg){
        ele.onblur = function(){
            if(reg.test(this.value)){
                console.log(this.nextElementSibling.nextElementSibling);
                this.nextElementSibling.nextElementSibling.style.display='block';
            }else {
                console.log(this.nextElementSibling);
                this.nextElementSibling.style.display = 'block';
            }
        }
    }
   
})