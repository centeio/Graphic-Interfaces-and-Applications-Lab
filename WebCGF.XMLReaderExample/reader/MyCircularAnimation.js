/**
 * MyCircularAnimation
 * @constructor
 * @abstract
 */
function MyCircularAnimation(scene, span) {
    this.scene = scene;
    this.span = span;
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

MyCircularAnimation.prototype.position = function(currTime) {
    
}