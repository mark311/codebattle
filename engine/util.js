function innerProduct(v1, v2)
{
    return v1.x * v2.x + v1.y * v2.y;
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


var absoluteZeroDirectionVector = new Vector(0, 1);

function directionAsVector(direction, length)
{
    return absoluteZeroDirectionVector.rotate(direction).scale(length);
}

module.exports.Vector = Vector;
module.exports.directionAsVector = directionAsVector;
