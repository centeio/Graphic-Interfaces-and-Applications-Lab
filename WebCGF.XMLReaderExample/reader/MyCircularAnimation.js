/**
 * MyCircularAnimation
 * @constructor
 * @abstract
 */
function MyCircularAnimation(span) {
    this.span = span;
    this.center = null;
    this.radius = 0;
    this.initialAngle = 0;
    this.angle = 0;
}

MyCircularAnimation.prototype = Object.create(Animation.prototype);
MyCircularAnimation.prototype.constructor = MyCircularAnimation;

MyCircularAnimation.prototype.addCenter = function(x,y,z) {
    this.center = new MyPoint(x,y,z);
}

MyCircularAnimation.prototype.addRadius = function(radius) {
    this.radius = radius;
}

MyCircularAnimation.prototype.addInitialAngle = function(initialAngle) {
    this.initialAngle = initialAngle;
}

MyCircularAnimation.prototype.addAngle = function(angle) {
    this.angle = angle;
}

MyCircularAnimation.prototype.position = function(initialTime, currTime, previousAngle) {
    var ret = [];

    if(((currTime - initialTime) / 1000) >= this.span) {
        ret.push("done");
        ret.push(previousAngle);
    }

    var angle = ((currTime - initialTime) / 1000) * this.angle;

    var x = this.center.x + this.radius * Math.cos((Math.PI * (this.initialAngle + angle)) / 180);
    var y = this.center.y;
    var z = this.center.z + this.radius * Math.sin((Math.PI * (this.initialAngle + angle)) / 180);

    ret.push(new MyPoint(x,y,z));
    ret.push(-(Math.PI / 2) - (Math.PI * (this.initialAngle + angle) / 180));

    return ret;
}