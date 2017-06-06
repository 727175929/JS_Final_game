var life=3

function showlife(){       //显示生命值
    document.getElementById("life").value=life;
}

function addlife()    //生命值加1
 {
 life++;
 document.getElementById("life").value=life;
 }

function cutlife()     //生命值减1
 {
    life--;
     document.getElementById("life").value=life;
    
 }
