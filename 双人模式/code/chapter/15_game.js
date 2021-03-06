var simpleLevelPlan = [
  "                      ",
  "                      ",
  "  x              = x  ",
  "  x         o o    x  ",
  "  x @      xxxxx   x  ",
  "  xxxxx            x  ",
  "      x!!!!!!!!!!!!x  ",
  "      xxxxxxxxxxxxxx  ",
  "                      "
];
//设计一个简单的调试小地图
//grid 格子  lava熔岩

function Level(plan) {
  this.width = plan[0].length;
  this.height = plan.length;
  this.grid = [];
  this.actors = [];

  for (var y = 0; y < this.height; y++) {
    var line = plan[y], gridLine = [];
    for (var x = 0; x < this.width; x++) {
      var ch = line[x], fieldType = null;
      var Actor = actorChars[ch];
      if (Actor)
        this.actors.push(new Actor(new Vector(x, y), ch));
      else if (ch == "x")
        fieldType = "wall";
      else if (ch == "!")
        fieldType = "lava";
        else if (ch == "w")
        fieldType = "lava2";
      gridLine.push(fieldType);
    }
    this.grid.push(gridLine);
  }
  this.player = this.actors.filter(function(actor) {
    return actor.type == "player";
  })[0];

  //  this.player2 = this.actors.filter(function(actor) {
  //   return actor.type == "player2";
  // })[0];   //玩家2
  // this.status = this.finishDelay = null;
}
//解释地图翻译地图

Level.prototype.isFinished = function() {
  return this.status != null && this.finishDelay < 0;
};
 //判断是否游戏结束

function Vector(x, y) { //Vector矢量
  this.x = x; this.y = y;
}
Vector.prototype.plus = function(other) {
  return new Vector(this.x + other.x, this.y + other.y);
};
Vector.prototype.times = function(factor) {
  return new Vector(this.x * factor, this.y * factor);
};//向量的改变

var actorChars = {
  "@": Player,
  "u":Player2,     //玩家2
  "o": Coin,
  "=": Lava, "|": Lava, "v": Lava,
  "g": Ghost,
};

function Player2(pos) {
  this.pos = pos.plus(new Vector(0, -0.5));
  this.size = new Vector(1, 1.4);
  this.speed = new Vector(0, 0);
}
Player2.prototype.type = "player2";

Player2.prototype.act = function(step, level, keys) {
  this.moveX(step, level, keys);
  this.moveY(step, level, keys);

  var otherActor = level.actorAt(this);
  if (otherActor)
    level.playerTouched2(otherActor.type, otherActor);

  // Losing animation
  if (level.status == "lost") {
    this.pos.y += step;
    this.size.y -= step;
  }
};
var leftCount1 = 0;
var rightCount1 = 0;
Player2.prototype.moveX = function(step, level, keys) {
  this.speed.x = 0;
  if (keys.left1) {
    this.speed.x -= playerXSpeed;
    leftCount1++;
    rightCount1 = 0;
  }
  if (keys.right1) {
    rightCount1++;
    leftCount1 = 0;
    this.speed.x += playerXSpeed;
  }
  // else {
  //   leftCount1 = 0;
  //   rightCount1 = 0;
  // }
  var motion = new Vector(this.speed.x * step, 0);
  var newPos = this.pos.plus(motion);
  var obstacle = level.obstacleAt(newPos, this.size);
  if (obstacle)
    level.playerTouched2(obstacle);
  else
    this.pos = newPos;
};
Player2.prototype.moveY = function(step, level, keys) {
  this.speed.y += step * gravity;
  var motion = new Vector(0, this.speed.y * step);
  var newPos = this.pos.plus(motion);
  var obstacle = level.obstacleAt(newPos, this.size);
  if (obstacle) {
    level.playerTouched2(obstacle);
    if (keys.up1 && this.speed.y > 0)
      this.speed.y = -jumpSpeed;
    else
      this.speed.y = 0;
  } else {
    this.pos = newPos;
  }
};
Level.prototype.playerTouched2 = function(type, actor) {
  if (type == "lava2" && this.status == null) {
    this.status = "lost";
    this.finishDelay = 1;
  }
  if (type == "ghost" && this.status == null) {    //触碰到鬼魂的动作   新增1
    this.status = "lost";
    this.finishDelay = 1;
  }
   if (type == "coin") {
    this.actors = this.actors.filter(function(other) {
      return other != actor;
    });
    if (!this.actors.some(function(actor) {
      return actor.type == "coin";
    })) {
      this.status = "won";
      this.finishDelay = 1;
    }
  }
};

// function Player2(pos) {
//   this.pos = pos.plus(new Vector(0, -0.5));
//   this.size = new Vector(1.5, 1.5);
//   this.speed = new Vector(0, 0);
// }//设置玩家的size为1X1像素       速度为0
// Player2.prototype.type = "player2";   //玩家2

// Player2.prototype.act = function(step, level) {
//   this.moveX(step, level, keys);
//   this.moveY(step, level, keys);

//   var otherActor = level.actorAt(this);
//   if (otherActor)
//     level.playerTouched2(otherActor.type, otherActor);

//   // Losing animation  失败动画
//   if (level.status == "lost") {
//     this.pos.y += step;
//     this.size.y -= step;
//   }
// };    //玩家2

// var player2XSpeed = 7;//玩家X方向的速度
// Player2.prototype.moveX = function(step, level, keys) {
//   this.speed.x = 0;
//   if (keys.left) {
//     this.speed.x -= player2XSpeed; 
// }
//   if (keys.right) {
//     this.speed.x += player2XSpeed;
// }

//   var motion = new Vector(this.speed.x * step, 0);
//   var newPos = this.pos.plus(motion);
//   var obstacle = level.obstacleAt(newPos, this.size);
//   if (obstacle)
//     level.playerTouched2(obstacle);
//   else
//     this.pos = newPos;
// };//玩家2水平方向的运动处理

// var gravity2 = 30;   //重力
// var jumpSpeed2 = 17;  //跳跃速度

// Player2.prototype.moveY = function(step, level, keys) {
//   this.speed.y += step * gravity2;
//   var motion = new Vector(0, this.speed.y * step);
//   var newPos = this.pos.plus(motion);
//   var obstacle = level.obstacleAt(newPos, this.size);
//   if (obstacle) {
//     level.playerTouched2(obstacle);
//     if (keys.up && this.speed.y > 0)
//       this.speed.y = -jumpSpeed2;
//     else
//       this.speed.y = 0;
//   } else {
//     this.pos = newPos;
//   }//玩家2竖直方向运动处理

//   Level.prototype.playerTouched2 = function(type, actor) {
//   if (type == "lava" && this.status == null) {
//     this.status = "lost";
//     this.finishDelay = 1;
//   }
//   if (type == "ghost" && this.status == null) {    //触碰到鬼魂的动作   新增1
//     this.status = "lost";
//     this.finishDelay = 1;
//   }
//    else if (type == "coin") {
//     this.actors = this.actors.filter(function(other) {
//       return other != actor;
//     });
//     if (!this.actors.some(function(actor) {
//       return actor.type == "coin";
//     })) {
//       this.status = "won";
//       this.finishDelay = 1;
//     }
//   }
// };//玩家2碰撞动画

function Ghost(pos) {
    this.pos = pos;
    this.size = new Vector(1, 1);
    this.speed = new Vector(-1, 0);
    this.repeatPos = pos;
}
Ghost.prototype.type = "ghost";
//初始化鬼魂的语句

Ghost.prototype.act = function(step, level) {
var newPos = this.pos.plus(this.speed.times(step));
  if (!level.obstacleAt(newPos, this.size))
    this.pos = newPos;
  else
    this.speed = this.speed.times(-1);
};//处理鬼魂的的运动

function Player(pos) {
  this.pos = pos.plus(new Vector(0, -0.5));
  this.size = new Vector(1, 1.4);
  this.speed = new Vector(0, 0);
}//设置玩家的size为1X1像素       速度为0
Player.prototype.type = "player";
//初始化玩家的语句



function Lava(pos, ch) {
  this.pos = pos;
  this.size = new Vector(1, 1);
  if (ch == "=") {
    this.speed = new Vector(2, 0);
  } else if (ch == "|") {
    this.speed = new Vector(0, 2);
  } else if (ch == "v") {
    this.speed = new Vector(0, 3);
    this.repeatPos = pos;
  }
}
Lava.prototype.type = "lava";
//初始化岩浆的语句




function Coin(pos) {
  this.basePos = this.pos = pos.plus(new Vector(0.2, 0.1));
  this.size = new Vector(0.6, 0.6);
  this.wobble = Math.random() * Math.PI * 2;//金币的晃动轨迹
}
Coin.prototype.type = "coin";
//初始化硬币的语句
var simpleLevel = new Level(simpleLevelPlan);

function elt(name, className) {
  var elt = document.createElement(name);
  if (className) elt.className = className;
  return elt;
}

function DOMDisplay(parent, level) {
  this.wrap = parent.appendChild(elt("div", "game"));
  this.level = level;

  this.wrap.appendChild(this.drawBackground());
  this.actorLayer = null;
  this.drawFrame();
}

var scale = 20;

DOMDisplay.prototype.drawBackground = function() {
  var table = elt("table", "background");
  table.style.width = this.level.width * scale + "px";
  this.level.grid.forEach(function(row) {
    var rowElt = table.appendChild(elt("tr"));
    rowElt.style.height = scale + "px";
    row.forEach(function(type) {
      rowElt.appendChild(elt("td", type));
    });
  });
  return table;
};

DOMDisplay.prototype.drawActors = function() {
  var wrap = elt("div");
  this.level.actors.forEach(function(actor) {
    var rect = wrap.appendChild(elt("div",
                                    "actor " + actor.type));

    if(actor.type == "player"){
        if(leftCount == 0 && rightCount == 0)
        rect.style.backgroundImage = "url(image/r1.png)";
        else if(rightCount > 0){
          var n1 = parseInt((rightCount % 16)/2)+2;
        rect.style.backgroundImage = "url(image/r"+n1+".png)";
      }
      else if(leftCount > 0){
          var n1 = parseInt((leftCount % 16)/2)+2;
        rect.style.backgroundImage = "url(image/l"+n1+".png)";
      } 
      
    }
    if(actor.type == "player2"){
        if(leftCount1 == 0 && rightCount1 == 0)
        rect.style.backgroundImage = "url(image/r1.png)";
        else if(rightCount1 > 0){
          var n1 = parseInt((rightCount1 % 16)/2)+2;
        rect.style.backgroundImage = "url(image/r"+n1+".png)";
      }
      else if(leftCount1 > 0){
          var n1 = parseInt((leftCount1 % 16)/2)+2;
        rect.style.backgroundImage = "url(image/l"+n1+".png)";
      } 
      
    }
    //人物的走动实现  



    rect.style.width = actor.size.x * scale + "px";
    rect.style.height = actor.size.y * scale + "px";
    rect.style.left = actor.pos.x * scale + "px";
    rect.style.top = actor.pos.y * scale + "px";
  });
  
  return wrap;
};

DOMDisplay.prototype.drawFrame = function() {
  if (this.actorLayer)
    this.wrap.removeChild(this.actorLayer);
  this.actorLayer = this.wrap.appendChild(this.drawActors());
  this.wrap.className = "game " + (this.level.status || "");
  this.scrollPlayerIntoView();
};

DOMDisplay.prototype.scrollPlayerIntoView = function() {
  var width = this.wrap.clientWidth;
  var height = this.wrap.clientHeight;
  var margin = width / 3;

  // The viewport
  var left = this.wrap.scrollLeft, right = left + width;
  var top = this.wrap.scrollTop, bottom = top + height;

  var player = this.level.player;
  var center = player.pos.plus(player.size.times(0.5))
                 .times(scale);

  if (center.x < left + margin)
    this.wrap.scrollLeft = center.x - margin;
  else if (center.x > right - margin)
    this.wrap.scrollLeft = center.x + margin - width;
  if (center.y < top + margin)
    this.wrap.scrollTop = center.y - margin;
  else if (center.y > bottom - margin)
    this.wrap.scrollTop = center.y + margin - height;
};//视野的切换

DOMDisplay.prototype.clear = function() {
  this.wrap.parentNode.removeChild(this.wrap);
};//清除关卡

//处理事件的冲突
Level.prototype.obstacleAt = function(pos, size) {
  var xStart = Math.floor(pos.x);
  var xEnd = Math.ceil(pos.x + size.x);
  var yStart = Math.floor(pos.y);
  var yEnd = Math.ceil(pos.y + size.y);

  if (xStart < 0 || xEnd > this.width || yStart < 0)
    return "wall";
  if (yEnd > this.height)
    return "lava";
  for (var y = yStart; y < yEnd; y++) {
    for (var x = xStart; x < xEnd; x++) {
      var fieldType = this.grid[y][x];
      if (fieldType) return fieldType;
    }
  }
};

Level.prototype.actorAt = function(actor) {
  for (var i = 0; i < this.actors.length; i++) {
    var other = this.actors[i];
    if (other != actor &&
        actor.pos.x + actor.size.x > other.pos.x &&
        actor.pos.x < other.pos.x + other.size.x &&
        actor.pos.y + actor.size.y > other.pos.y &&
        actor.pos.y < other.pos.y + other.size.y)
      return other;
  }
};

var maxStep = 0.05;//读取按键的时间间隔

Level.prototype.animate = function(step, keys) {
  if (this.status != null)
    this.finishDelay -= step;

  while (step > 0) {
    var thisStep = Math.min(step, maxStep);
    this.actors.forEach(function(actor) {
      actor.act(thisStep, this, keys);
    }, this);
    step -= thisStep;
  }
};

Lava.prototype.act = function(step, level) {
  var newPos = this.pos.plus(this.speed.times(step));
  if (!level.obstacleAt(newPos, this.size))
    this.pos = newPos;
  else if (this.repeatPos)
    this.pos = this.repeatPos;
  else
    this.speed = this.speed.times(-1);
};//处理岩浆的运动

var wobbleSpeed = 8, wobbleDist = 0.07;
//摆动速度速度         摆动距离
Coin.prototype.act = function(step) {
  this.wobble += step * wobbleSpeed;
  var wobblePos = Math.sin(this.wobble) * wobbleDist;
  this.pos = this.basePos.plus(new Vector(0, wobblePos));
};//硬币的运动

var playerXSpeed = 7;//玩家X方向的速度
var moveFlag = 0;
var leftCount = 0;
var rightCount = 0;
Player.prototype.moveX = function(step, level, keys) {
 this.speed.x = 0;
  if (keys.left) {
    this.speed.x -= playerXSpeed; 
     leftCount++;
    rightCount = 0;
}
  else if (keys.right) {
    this.speed.x += playerXSpeed;
    rightCount++;
    leftCount = 0;
}
// else {
//     leftCount = 0;
//     rightCount = 0;
//   }

  var motion = new Vector(this.speed.x * step, 0);
  var newPos = this.pos.plus(motion);
  var obstacle = level.obstacleAt(newPos, this.size);
  if (obstacle)
    level.playerTouched(obstacle);
  else
    this.pos = newPos;
};//水平方向的运动处理

var gravity = 30;   //重力
var jumpSpeed = 17;  //跳跃速度

Player.prototype.moveY = function(step, level, keys) {
  this.speed.y += step * gravity;
  var motion = new Vector(0, this.speed.y * step);
  var newPos = this.pos.plus(motion);
  var obstacle = level.obstacleAt(newPos, this.size);
  if (obstacle) {
    level.playerTouched(obstacle);
    if (keys.up && this.speed.y > 0)
      this.speed.y = -jumpSpeed;
    else
      this.speed.y = 0;
  } else {
    this.pos = newPos;
  }
};

Player.prototype.act = function(step, level, keys) {
  this.moveX(step, level, keys);
  this.moveY(step, level, keys);

  var otherActor = level.actorAt(this);
  if (otherActor)
    level.playerTouched(otherActor.type, otherActor);

  // Losing animation  失败动画
  if (level.status == "lost") {
    this.pos.y += step;
    this.size.y -= step;
  }
};

Level.prototype.playerTouched = function(type, actor) {
  if (type == "lava" && this.status == null) {
    this.status = "lost";
    this.finishDelay = 1;
  }
  if (type == "ghost" && this.status == null) {    //触碰到鬼魂的动作   新增1
    this.status = "lost";
    this.finishDelay = 1;
  }
   else if (type == "coin") {
    this.actors = this.actors.filter(function(other) {
      return other != actor;
    });
    if (!this.actors.some(function(actor) {
      return actor.type == "coin";
    })) {
      this.status = "won";
      this.finishDelay = 1;
    }
  }
};//碰撞动画

var arrowCodes = {37: "left", 38: "up", 39: "right",
65: "left1", 87: "up1", 68: "right1"};

function trackKeys(codes) {
  var pressed = Object.create(null);
  function handler(event) {
    if (codes.hasOwnProperty(event.keyCode)) {
      var down = event.type == "keydown";
      pressed[codes[event.keyCode]] = down;
      event.preventDefault();
    }
  }
  addEventListener("keydown", handler);
  addEventListener("keyup", handler);
  return pressed;
}

function runAnimation(frameFunc) {
  var lastTime = null;
  function frame(time) {
    var stop = false;
    if (lastTime != null) {
      var timeStep = Math.min(time - lastTime, 100) / 1000;
      stop = frameFunc(timeStep) === false;
    }
    lastTime = time;
    if (!stop)
      requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

var arrows = trackKeys(arrowCodes);

function runLevel(level, Display, andThen) {
  var display = new Display(document.body, level);
  runAnimation(function(step) {
    level.animate(step, arrows);
    display.drawFrame(step);
    if (level.isFinished()) {
      display.clear();
      if (andThen)
        andThen(level.status);
      return false;
    }
  });
}

// function runGame(plans, Display) {
//   function startLevel(n) {
//     runLevel(new Level(plans[n]), Display, function(status) {
//       if (status == "lost")
//         startLevel(n);
//       else if (n < plans.length - 1)
//         startLevel(n + 1);
//       else
//         console.log("You win!");
//     });
//   }
//   startLevel(0);
// }

  function runGame(plans, Display) {
    function startLevel(n, lives) {
      runLevel(new Level(plans[n]), Display, function(status) {
        if (status == "lost") {
          if (lives > 0) {
            startLevel(n, lives - 1);
            cutlife();
          } else {
            console.log("Game over");
            startLevel(0, 3);
            life=4;
            showlife();
            cs();
          }     
        } else if (n < plans.length - 1) {
          startLevel(n + 1, lives);
        } else {
          console.log("You win!");
        }
      });
    }
    startLevel(0, 3);
  }
  runGame(GAME_LEVELS, DOMDisplay);
  //3条命



function show_confirm()         //自定义提示函数
{
var r=confirm("点击OK继续游戏");
if (r==true)
  {
  alert("游戏继续");
  running = "yes";
  runAnimation(animation);//运行动画
  }
else
  {
  timeflag = 0;    
    stopCount();
  alert("可以点击ESC继续游戏");
  }
}
var timeflag = 1;

    function runLevel(level, Display, andThen) {
    var display = new Display(document.body, level);
    var running = "yes";
    function handleKey(event) {
      if (event.keyCode == 27) {
        if (running == "no") {
          if(timeflag == 0){
            timedCount();
          }
          running = "yes";
          runAnimation(animation);//运行动画
        } else if (running == "pausing") {
          running = "yes";
        } else if (running == "yes") {
          show_confirm();
          running = "pausing";
        }
      }
    }
    addEventListener("keydown", handleKey);
    var arrows = trackKeys(arrowCodes);

    function animation(step) {
      if (running == "pausing") {
        running = "no";
        return false;
      }

      level.animate(step, arrows);
      display.drawFrame(step);
      if (level.isFinished()) {
        display.clear();
        removeEventListener("keydown", handleKey);
        arrows.unregister(); 
        if (andThen)
          andThen(level.status);
        return false;
      }
    }
    runAnimation(animation);
  }

  function trackKeys(codes) {
    var pressed = Object.create(null);
    function handler(event) {
      if (codes.hasOwnProperty(event.keyCode)) {
        var state = event.type == "keydown";
        pressed[codes[event.keyCode]] = state;
        event.preventDefault();
      }
    }
    addEventListener("keydown", handler);
    addEventListener("keyup", handler);

    pressed.unregister = function() {
      removeEventListener("keydown", handler);
      removeEventListener("keyup", handler);
    };
    return pressed;
  }

  runGame(GAME_LEVELS, DOMDisplay);
  //游戏暂停



