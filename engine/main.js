var codebattle = require('./codebattle.js');
var util = require('./util.js');
var display = require('./display.js');

game = new codebattle.Game();

var Controller1 = function() {}
Controller1.prototype.onStep = function(sensor, commander)
{
    commander.accelerate(1);
}

p1 = new codebattle.Player("Alice");
p1.setController(new Controller1());
t1 = new codebattle.Tank(game.map.center(),
                         new display.TerminalFace("A", "red"),
                         new display.TerminalFace("", ""));
p1.drive(t1);

var Controller2 = function() {}

Controller2.prototype.ensureSpeed = function(sensor, commander, speed, error)
{
    if (sensor.speed < speed - error)
    {
        commander.accelerate(+0.6);
    }
    else if (sensor.speed > speed + error)
    {
        commander.accelerate(-0.6);
    }
}

Controller2.prototype.showStatus = function(sensor, commander)
{
    var radarDirectionDegree = sensor.radarDirection * 180 / util.PI;
    commander.leaveMessage("Radar:(" + sensor.obstacleDistance.toFixed(3) + ", " + radarDirectionDegree.toFixed(1) + "')",
                           "Location:(" + sensor.location.x.toFixed(3) + ", " + sensor.location.y.toFixed(3) + ")",
                           "Speed:" + sensor.speed.toFixed(3),
                           "Orientation:" + sensor.bodyDirection.toFixed(1) + "'");
}

Controller2.prototype.onStep = function(sensor, commander)
{
    this.ensureSpeed(sensor, commander, 5.0, 1.0);
    commander.radarDirection = sensor.radarDirection + util.PI / 18;
    this.showStatus(sensor, commander);
}

p2 = new codebattle.Player("Bob");
p2.setController(new Controller2());
t2 = new codebattle.Tank(game.map.center(),
                         new display.TerminalFace("B", "blue"),
                         new display.TerminalFace("", ""));
p2.drive(t2);

game.addPlayer(p1);
game.addPlayer(p2);
game.setTimeLimit(10);
game.run();
game.exportMotionDataToFile("motion.json");
