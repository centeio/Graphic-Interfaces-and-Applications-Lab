/**
 * MyAnimation
 * @constructor
 * @abstract
 */
function Animation() {
    if (this.constructor === Animation) {
      throw new Error("Can't instantiate abstract class!");
    }
}

Animation.prototype.span = 0;

Animation.prototype.getSpan = function() {
    return this.span;
}

/**
 @abstract
 */
Animation.prototype.position = function(currTime) {
    throw new Error("Abstract method!");
}