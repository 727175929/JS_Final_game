function Ghost(pos) {
    this.pos = pos;
    this.size = new Vector(1, 1);
    this.speed = new Vector(1, 1);
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
};//处理鬼魂的运动