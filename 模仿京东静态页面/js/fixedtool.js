window.addEventListener('load',function(){
    var fixedtool = document.querySelector('.fixedtool');
    
    if(window.pageYOffset >= 500){
        fixedtool.style.display = 'block';
    }
})