var codebattle = require('./codebattle.js');
var util = require('./util.js');
var display = require('./display.js');

var DEGREE = util.PI / 180.0;

var ensureSpeed = function(sensor, commander, speed, error)
{
    if (sensor.speed < speed - error)
    {
        commander.accelerate(+3.0);
        return false;
    }
    else if (sensor.speed > speed + error)
    {
        commander.accelerate(-3.0);
        return false;
    }
    else
    {
        return true;
    }
}

var showStatus = function(sensor, commander)
{
    var radarDirectionDegree = sensor.radarDirection * 180 / util.PI;
    commander.leaveMessage("Radar:(" + sensor.obstacleDistance.toFixed(3) + ", " + radarDirectionDegree.toFixed(1) + "')",
                           "Location:(" + sensor.location.x.toFixed(3) + ", " + sensor.location.y.toFixed(3) + ")",
                           "Speed:" + sensor.speed.toFixed(3),
                           "Orientation:" + sensor.bodyDirection.toFixed(1) + "'");
}



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

var Controller2 = function() {
    this.state = "MOVING"
}

Controller2.prototype.onStep = function(sensor, commander)
{
    if (this.state == "TURNING")
    {
        var stopped = ensureSpeed(sensor, commander, 1.0, 0.05);
        if (stopped)
        {
            commander.bodyDirectionAmend = 10 * DEGREE;
        }
        if (sensor.obstacleDistance > 20.0)
        {
            this.state = "MOVING";
        }
    } else if (this.state == "MOVING")
    {
        ensureSpeed(sensor, commander, 5.0, 0.05);
        if (sensor.obstacleDistance < 20.0)
        {
            this.state = "TURNING";
            commander.leaveMessage("Near obstacle!!  Stop!!!");
        }

    }

    commander.radarDirection = sensor.bodyDirection;
    showStatus(sensor, commander);
}


var Controller3 = function() {
    this.radar_state = "<|";
    this.middleObstacleDistance = NaN;
    this.leftObstacleDistance = NaN;
    this.rightObstacleDistance = NaN;
}

Controller3.prototype.onStep = function(sensor, commander)
{
    switch (this.radar_state)
    {
    case "<|":
        this.middleObstacleDistance = sensor.obstacleDistance;
        commander.radarDirection = sensor.bodyDirection + 30 * DEGREE;
        this.radar_state = "\\";
        break;
    case "|>":
        this.middleObstacleDistance = sensor.obstacleDistance;
        commander.radarDirection = sensor.bodyDirection - 30 * DEGREE;
        this.radar_state = "/";
        break;
    case "\\":
        this.leftObstacleDistance = sensor.obstacleDistance;
        commander.radarDirection = sensor.bodyDirection;
        this.radar_state = "|>";
        break;
    case "/":
        this.rightObstacleDistance = sensor.obstacleDistance;
        commander.radarDirection = sensor.bodyDirection;
        this.radar_state = "<|";
        break;
    }

    if (this.middleObstacleDistance < 20.0) {
        ensureSpeed(sensor, commander, 0.0, 0.05);
    }
    else {
        ensureSpeed(sensor, commander, 5.0, 0.05);
    }

    if (this.leftObstacleDistance <= 30.0 && this.rightObstacleDistance <= 30.0)
    {
        commander.bodyDirectionAmend = 30 * DEGREE;
    }
    else if (this.leftObstacleDistance > 30.0 && this.rightObstacleDistance > 30.0)
    {
    }
    else
    {
        if (this.leftObstacleDistance > this.rightObstacleDistance) {
            commander.bodyDirectionAmend = 30 * DEGREE;
        }
        else {
            commander.bodyDirectionAmend = -30 * DEGREE;
        }
    }
    commander.leaveMessage(this.leftObstacleDistance.toFixed(3),
                           this.middleObstacleDistance.toFixed(3),
                           this.rightObstacleDistance.toFixed(3));
    showStatus(sensor, commander);
}

p2 = new codebattle.Player("Bob");
p2.setController(new Controller3());
t2 = new codebattle.Tank(game.map.center(),
                         new display.TerminalFace("B", "blue"),
                         new display.TerminalFace("", ""));
p2.drive(t2);

//game.addPlayer(p1);
game.addPlayer(p2);
game.setTimeLimit(1000);
game.run();
game.exportMotionDataToFile("motion.json");
