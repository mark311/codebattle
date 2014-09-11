var codebattle = require('./codebattle.js');

var MotionListener = function()
{}
MotionListener.prototype.onObjectMoved = function(time, object, location)
{
    console.log(time, location);
}

game = new codebattle.Game();
game.addMotionListener(new MotionListener());

var Controller1 = function() {}
Controller1.prototype.onStep = function(sensor, commander)
{
    commander.accelerate(1);
}

p1 = new codebattle.Player("Alice");
p1.setController(new Controller1());
t1 = new codebattle.Tank();
p1.drive(t1);

var Controller2 = function() {}
Controller2.prototype.onStep = function(sensor, commander)
{
}

p2 = new codebattle.Player("Bob");
p2.setController(new Controller2());
t2 = new codebattle.Tank();
p2.drive(t2);

game.addPlayer(p1);
game.addPlayer(p2);
game.setTimeLimit(10);
game.run();
