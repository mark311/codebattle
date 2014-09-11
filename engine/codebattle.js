var util = require("./util.js");
var Vector = util.Vector;
var Location = util.Vector;


var Commander = function()
{
    this.radarDirection = 0.0;
    this.gunDirectionAmend = 0.0;
    this.bodyDirectionAmend = 0.0;
    this.acceleration = 0.0;
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

var Tank = function()
{
    this.bodyDirection = 0.0;
    this.gunDirection = 0.0;
    this.radarDirection = 0.0;
    this.speed = 0.0;
    this.location = new Location();
}

var BattleField = function(width, height)
{
    this.width = width;
    this.height = height;
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
    this.players = new Array();
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

Game.prototype.generateSensor = function(tank)
{
    var sensor = {};
    sensor.location = tank.location;
    sensor.bodyDirection = tank.bodyDirection;
    sensor.gunDirection = tank.gunDirection;
    sensor.radarDirection = tank.radarDirection;
    sensor.obstacleDistance = 100.0;
    sensor.obstacleType = "soil";
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
