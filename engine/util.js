var PI = 3.141592653589;

function innerProduct(v1, v2)
{
    return v1.x * v2.x + v1.y * v2.y;
}

function crossProduct(v1, v2)
{
    return v1.x * v2.y - v2.x * v1.y;
}

var Vector = function()
{
    if (0 == arguments.length)
    {
        this.x = 0.0;
        this.y = 0.0;
    }
    else if (2 == arguments.length)
    {
        this.x = arguments[0];
        this.y = arguments[1];
    }
    else
    {
        console.log("Invalid number of Vector function!");
    }
}

Vector.prototype.equal = function(that)
{
    return this.x == that.x && this.y == that.y;
}

Vector.prototype.length = function()
{
    Math.sqrt(this.x * this.x + this.y * this.y);
}

Vector.prototype.rotate = function(theta)
{
    return new Vector(this.x * Math.cos(theta) - this.y * Math.sin(theta),
                      this.x * Math.sin(theta) + this.y * Math.cos(theta));
}

Vector.prototype.scale = function(ratio)
{
    return new Vector(this.x * ratio, this.y * ratio);
}

Vector.prototype.offset = function(off)
{
    return new Vector(this.x + off.x, this.y + off.y);
}

Vector.prototype.inverse = function()
{
    return new Vector(-this.x, -this.y);
}

var absoluteZeroDirectionVector = new Vector(0, 1);

function directionAsVector(direction, length)
{
    return absoluteZeroDirectionVector.rotate(direction).scale(length);
}


var LineSeg = function(p1, p2)
{
    this.p1 = p1;
    this.p2 = p2;
}

LineSeg.prototype.length = function()
{
    var dx = this.p1.x - this.p2.x;
    var dy = this.p1.y - this.p2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function isPointsInDifferentSides(line, p1, p2)
{
    var base = line.p1.inverse().offset(line.p2);
    var d1 = line.p1.inverse().offset(p1);
    var d2 = line.p1.inverse().offset(p2);
    return crossProduct(base, d1) * crossProduct(base, d2) <= 0;
}

function getLinesCrossPoint(l1, l2)
{
    if (isPointsInDifferentSides(l1, l2.p1, l2.p2) &&
        isPointsInDifferentSides(l2, l1.p1, l1.p2))
    {
        var denominator = (l1.p2.y - l1.p1.y)*(l2.p2.x - l2.p1.x) - (l1.p1.x - l1.p2.x)*(l2.p1.y - l2.p2.y);
        if (denominator==0) {
            return null;
        }

        var x = ( (l1.p2.x - l1.p1.x) * (l2.p2.x - l2.p1.x) * (l2.p1.y - l1.p1.y)
                  + (l1.p2.y - l1.p1.y) * (l2.p2.x - l2.p1.x) * l1.p1.x
                  - (l2.p2.y - l2.p1.y) * (l1.p2.x - l1.p1.x) * l2.p1.x ) / denominator ;
        var y = -( (l1.p2.y - l1.p1.y) * (l2.p2.y - l2.p1.y) * (l2.p1.x - l1.p1.x)
                   + (l1.p2.x - l1.p1.x) * (l2.p2.y - l2.p1.y) * l1.p1.y
                   - (l2.p2.x - l2.p1.x) * (l1.p2.y - l1.p1.y) * l2.p1.y ) / denominator;
        return new Vector(x, y);
    }
    return null;
}

module.exports.PI = PI;
module.exports.Vector = Vector;
module.exports.Location = Vector;
module.exports.LineSeg = LineSeg;
module.exports.directionAsVector = directionAsVector;
module.exports.isPointsInDifferentSides = isPointsInDifferentSides;
module.exports.getLinesCrossPoint = getLinesCrossPoint;
