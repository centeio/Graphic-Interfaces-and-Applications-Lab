/**
 * MyLinearAnimation
 * @constructor
 * @abstract
 */
function MyLinearAnimation(scene, span) {
    this.scene = scene;
    this.span = span;
}

MyLinearAnimation.prototype = Object.create(Animation.prototype);
MyLinearAnimation.prototype.constructor = MyLinearAnimation;

MyLinearAnimation.prototype.addControlPoint = function(x,y,z) {
    this.controlPoints.push(new MyPoint(x,y,z));
}

MyLinearAnimation.prototype.position = function(currTime) {
    
}