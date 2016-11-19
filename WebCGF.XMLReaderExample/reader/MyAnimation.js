/**
 * MyAnimation
 * @constructor
 * @abstract
 */
function Animation(scene) {
    if (this.constructor === Animal) {
      throw new Error("Can't instantiate abstract class!");
    }
}

Animation.prototype.scene = null;
Animation.prototype.span = 0;
Animation.prototype.controlPoints = [];
Animation.prototype.center = null;
Animation.prototype.radius = 0;
Animation.prototype.initialAngle = 0;
Animation.prototype.angle = 0;

Animation.prototype.getSpan = function() {
    console.log(this.span);
    return this.span;
}

/**
 @abstract
 */
Animation.prototype.position = function(currTime) {
    throw new Error("Abstract method!");
}