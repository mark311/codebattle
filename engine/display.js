var TerminalFace = function(ch, color)
{
    this.ch = ch;
    this.color = color;
    this.registerId = -1;
}

TerminalFace.prototype.toJson = function()
{
    return {
        type: "terminal",
        ch: this.ch,
        color: this.color
    };
}

var GraphicDevice = function()
{
    this.faces = [];
    this.frames = [];
    this.border = {
        leftBottom: {
            x: 0,
            y: 0
        },
        rightTop: {
            x: 0,
            y: 0
        },
    };
}

GraphicDevice.prototype.setBorder = function(leftBottom, rightTop)
{
    this.border.leftBottom.x = leftBottom.x;
    this.border.leftBottom.y = leftBottom.y;
    this.border.rightTop.x = rightTop.x;
    this.border.rightTop.y = rightTop.y;
}

GraphicDevice.prototype.registerFace = function(face)
{
    this.faces.push(face.toJson());
    face.registerId = this.faces.length - 1;
}

GraphicDevice.prototype.newFrame = function()
{
    this.frames.push([]);
}

GraphicDevice.prototype.drawObject = function(face, location, direction)
{
    if (face.registerId < 0) {
        throw Error("Face has not been registered!");
    }
    this.frames[this.frames.length - 1].push({
        type: "object",
        faceId: face.registerId,
        location: {
            x: location.x,
            y: location.y
        },
        direction: direction
    });
}

GraphicDevice.prototype.drawLine = function(begin, end)
{
    this.frames[this.frames.length - 1].push({
        type: "line",
        begin: {
            x: begin.x,
            y: begin.y
        },
        end: {
            x: end.x,
            y: end.y
        }
    });
}


GraphicDevice.prototype.exportToJson = function()
{
    return JSON.stringify({
        faces: this.faces,
        border: this.border,
        frames: this.frames
    }, null, "  ");
}

module.exports.TerminalFace = TerminalFace;
module.exports.GraphicDevice = GraphicDevice;
