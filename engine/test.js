var util = require('./util.js');


exports.test_isPointsInDifferentSides = function(test){
    l1 = new util.LineSeg(new util.Vector(-1, -1), new util.Vector(1, 1));
    l2 = new util.LineSeg(new util.Vector(1, -1), new util.Vector(-1, 1));
    test.ok(util.isPointsInDifferentSides(l1, l2.p1, l2.p2));

    l1 = new util.LineSeg(new util.Vector(-1, -1), new util.Vector(-1, 1));
    l2 = new util.LineSeg(new util.Vector(1, -1), new util.Vector(1, 1));
    test.ok(!util.isPointsInDifferentSides(l1, l2.p1, l2.p2));

    l1 = new util.LineSeg(new util.Vector(-1, -1), new util.Vector(1, 1));
    l2 = new util.LineSeg(new util.Vector(1, -1), new util.Vector(1, 1));
    test.ok(util.isPointsInDifferentSides(l1, l2.p1, l2.p2));

    test.done();
};

exports.test_getLinesCrossPoint = function(test){
    l1 = new util.LineSeg(new util.Vector(-1, -1), new util.Vector(1, 1));
    l2 = new util.LineSeg(new util.Vector(1, -1), new util.Vector(-1, 1));
    test.ok(util.getLinesCrossPoint(l1, l2).equal(new util.Vector(0, 0)) );

    l1 = new util.LineSeg(new util.Vector(-1, -1), new util.Vector(1, 1));
    l2 = new util.LineSeg(new util.Vector(1, -1), new util.Vector(1, 1));
    test.ok(util.getLinesCrossPoint(l1, l2).equal(new util.Vector(1, 1)) );

    test.done();
};
