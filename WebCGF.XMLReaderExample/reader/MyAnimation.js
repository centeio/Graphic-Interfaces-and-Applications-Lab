/**
 @constructor
 @abstract
 */
function Animation(scene) {
    if (this.constructor === Animal) {
      throw new Error("Can't instantiate abstract class!");
    }

    this.span = 0;
    this.controlPoints = [];
    this.center = null;
    this.radius = 0;
    this.initialAngle = 0;
    this.angle = 0;
}

/**
 @abstract
 */
Animal.prototype.position = function(currTime) {
    throw new Error("Abstract method!");
}