var c=0
var t

function timedCount()    //计时
 {

 document.getElementById('txt').value=c
 c=c+1
 t=setTimeout("timedCount()",1000)
 }

function stopCount()     //暂停
 {
    
     clearTimeout(t)
    
 }
function cs()          //清零
{
 
     c=0  
     document.getElementById('txt').value= 0
     
}
 
