/**
 * ComplexAnimation
 * @constructor
 * @abstract
 */
function ComplexAnimation(span) {
    this.span = span;
    this.center = null;
    this.radius = 0;
    this.initialAngle = 0;
    this.angle = 0;
    this.velocityX = 0;
    this.velocityZ = 0;
}

ComplexAnimation.prototype = Object.create(Animation.prototype);
ComplexAnimation.prototype.constructor = ComplexAnimation;

ComplexAnimation.prototype.addCenter = function(x,y,z) {
    this.center = new MyPoint(x,y,z);
}

ComplexAnimation.prototype.addRadius = function(radius) {
    this.radius = radius;
}

ComplexAnimation.prototype.addInitialAngle = function(initialAngle) {
    this.initialAngle = initialAngle;
}

ComplexAnimation.prototype.addAngle = function(angle) {
    this.angle = angle;
}

ComplexAnimation.prototype.position = function(initialTime, currTime, previousAngle) {
    var ret = [];

    if(((currTime - initialTime) / 1000) >= this.span) {
        ret.push("done");
        ret.push(previousAngle);
    }

    var angle = ((currTime - initialTime) / 1000) * this.angle;

    var x = ((currTime - initialTime) / 1000) * this.velocityX;
    var y = this.center.y + this.radius * Math.sin((Math.PI * (this.initialAngle + angle)) / 180);
    var z = ((currTime - initialTime) / 1000) * this.velocityZ;

    ret.push(new MyPoint(x,y,z));
    ret.push(-(Math.PI / 2) - (Math.PI * (this.initialAngle + angle) / 180));

    return ret;
}