var life=4

function showlife(){       //显示生命值
    document.getElementById("life").value=life;
    if(life == 4)
         document.getElementById("life2").innerHTML = "";
}

function addlife()    //生命值加1
 {
 life++;
 document.getElementById("life").value=life;
 }

function cutlife()     //生命值减1
 {
    life--;
    if(life==1)
     document.getElementById("life2").innerHTML = "您的生命值只剩余1，死亡将会回到第一关卡，并且重新计时";
     document.getElementById("life").value=life;
    
 }
