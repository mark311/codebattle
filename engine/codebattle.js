var util = require("./util.js");
var Vector = util.Vector;
var Location = util.Location;
var LineSeg = util.LineSeg;


var Commander = function()
{
    this.radarDirection = 0.0;
    this.gunDirectionAmend = 0.0;
    this.bodyDirectionAmend = 0.0;
    this.acceleration = 0.0;
    this.messages = new Array();
}

Commander.prototype.leaveMessage = function()
{
    var message = new Array();
    for (i in arguments) {
        message.push(arguments[i]);
    }
    this.messages.push(message);
}

Commander.prototype.accelerate = function(value)
{
    this.acceleration = value;
}

Commander.prototype.rotateBody = function(degree)
{
    this.orientationAmend += degree;
}

Commander.prototype.rotateGun = function(degree)
{
    this.gunDirectionAmend += degree;
}

Commander.prototype.setRadar = function(direction)
{
    this.radarDirection = direction;
}

var Tank = function(location)
{
    this.bodyDirection = 0.0;
    this.gunDirection = 0.0;
    this.radarDirection = 0.0;
    this.speed = 0.0;
    this.location = location;
}

var Map = function(width, height)
{
    this.width = width;
    this.height = height;
    this.lines = [
        new LineSeg(new Vector(0, 0), new Vector(this.width, 0)),
        new LineSeg(new Vector(this.width, 0), new Vector(this.width, this.height)),
        new LineSeg(new Vector(this.width, this.height), new Vector(0, this.height)),
        new LineSeg(new Vector(0, this.height), new Vector(0, 0))
    ];
}

Map.prototype.center = function()
{
    return new Location(this.width / 2, this.height / 2);
}

var Player = function(name, script)
{
    this.name = name;
}

Player.prototype.setController = function(controller)
{
    this.controller = controller;
}

Player.prototype.drive = function(tank)
{
    this.tank = tank;
}

var Game = function(battleField)
{
    this.field = battleField;
    this.motionListeners = new Array();
    this.timeLimit = 10000;
    this.map = new Map(100, 100);
    this.players = new Array();
}

Game.prototype.setMap = function(map)
{
    this.map = map;
}

Game.prototype.setTimeLimit = function(limit)
{
    this.timeLimit = limit;
}

Game.prototype.addMotionListener = function(listener)
{
    this.motionListeners.push(listener);
}

Game.prototype.addPlayer = function(player)
{
    this.players.push(player);
}

Game.prototype.getObstaclePoint = function(location, radarDirection)
{
    var radarRayLine = new LineSeg(location, location.offset(util.directionAsVector(radarDirection, 10000000)));

    for (i in this.map.lines)
    {
        var line = this.map.lines[i];
        var cross = util.getLinesCrossPoint(line, radarRayLine);
        if (cross !== null)
        {
            return cross;
        }
    }
    return null;
}

Game.prototype.generateSensor = function(tank)
{
    var sensor = {};
    sensor.location = tank.location;
    sensor.bodyDirection = tank.bodyDirection;
    sensor.gunDirection = tank.gunDirection;
    sensor.radarDirection = tank.radarDirection;
    sensor.speed = tank.speed;

    var obstaclePoint = this.getObstaclePoint(tank.location, tank.radarDirection);
    if (obstaclePoint !== null)
    {
        sensor.obstacleDistance = (new LineSeg(tank.location, obstaclePoint)).length();
        sensor.obstacleType = "wall";
    }
    else
    {
        sensor.obstacleDistance = NaN;
        sensor.obstacleType = "empty";
    }

    return sensor;
}

Game.prototype.checkCollision = function(tank)
{
    return false;
}

Game.prototype.run = function()
{
    var time = 0;
    var finished = false;

    while (!finished && time < this.timeLimit)
    {
        for (i in this.players)
        {
            var player = this.players[i];
            var tank = player.tank;

            var commander = new Commander();
            var sensor = this.generateSensor(tank);
            player.controller.onStep(sensor, commander);

            // Show messages
            for (var i in commander.messages)
            {
                var message = commander.messages[i];
                var args = new Array();
                args.push("#" + time);
                args.push("[" + player.name + "] -");
                args = args.concat(message);
                console.log.apply(console, args);
            }

            // Apply command on tank
            tank.radarDirection = commander.radarDirection;
            tank.gunDirection += commander.gunDirectionAmend;
            tank.bodyDirection += commander.bodyDirectionAmend;
            tank.speed += commander.acceleration;

            var speedVector = util.directionAsVector(tank.bodyDirection, tank.speed);
            tank.location = tank.location.offset(speedVector);

            for (i in this.motionListeners)
            {
                this.motionListeners[i].onObjectMoved(time, tank, tank.location);
            }

            // Check collision
            if (this.checkCollision(tank)) {
                player.lose = true;
                finished = true;
            }
        }
        time++;
    }
}

module.exports.Player = Player;
module.exports.Game = Game;
module.exports.Tank = Tank;
