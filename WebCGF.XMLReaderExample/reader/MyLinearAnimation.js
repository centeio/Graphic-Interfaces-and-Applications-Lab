/**
 * MyLinearAnimation
 * @constructor
 * @abstract
 */
function MyLinearAnimation(span) {
    this.span = span;
    this.controlPoints = [];
    this.segmentDurations = [];
    this.animationInitialTime = 0;
}

MyLinearAnimation.prototype = Object.create(Animation.prototype);
MyLinearAnimation.prototype.constructor = MyLinearAnimation;

MyLinearAnimation.prototype.addControlPoint = function(x,y,z) {
    this.controlPoints.push(new MyPoint(x,y,z));
}

MyLinearAnimation.prototype.calculateSegmentDurations = function() {
    var totalDistance = 0;
    console.log("Control points length: " + this.controlPoints.length);
    for(var i = 0; i < (this.controlPoints.length - 1); i++) {
        totalDistance += Math.sqrt(Math.pow(this.controlPoints[i + 1].x - this.controlPoints[i].x, 2) + 
                Math.pow(this.controlPoints[i + 1].y - this.controlPoints[i].y, 2) +
                Math.pow(this.controlPoints[i + 1].z - this.controlPoints[i].z, 2));
    }

    console.log("Total distance: " + totalDistance);
    for(var i = 0; i < (this.controlPoints.length - 1); i++) {
        this.segmentDurations.push(
            (Math.sqrt(Math.pow(this.controlPoints[i + 1].x - this.controlPoints[i].x, 2) + 
                Math.pow(this.controlPoints[i + 1].y - this.controlPoints[i].y, 2) +
                Math.pow(this.controlPoints[i + 1].z - this.controlPoints[i].z, 2)) /
            totalDistance) * (this.span * 1000));
    }
}

MyLinearAnimation.prototype.position = function(initialTime, currTime, angle) {
    
    var indice = 0;
    var time = this.segmentDurations[indice];

    while((currTime - initialTime) > time) {
        indice++;
        time += this.segmentDurations[indice];
    }

    if(indice >= this.segmentDurations.length) {
        return "done";
    }

    time -= this.segmentDurations[indice];

    var velocityX = (this.controlPoints[indice + 1].x - this.controlPoints[indice].x) /
                        this.segmentDurations[indice];
    var velocityY = (this.controlPoints[indice + 1].y - this.controlPoints[indice].y) /
                        this.segmentDurations[indice];
    var velocityZ = (this.controlPoints[indice + 1].z - this.controlPoints[indice].z) /
                        this.segmentDurations[indice];

    var x = this.controlPoints[indice].x +
                velocityX * (currTime - (initialTime + time));
    var y = this.controlPoints[indice].y +
                velocityY * (currTime - (initialTime + time));
    var z = this.controlPoints[indice].z +
                velocityZ * (currTime - (initialTime + time));
    
    if(x > this.controlPoints[this.controlPoints.length - 1].x)
        x = this.controlPoints[this.controlPoints.length - 1].x;

    if(y > this.controlPoints[this.controlPoints.length - 1].y)
        y = this.controlPoints[this.controlPoints.length - 1].y;

    if(z > this.controlPoints[this.controlPoints.length - 1].z)
        z = this.controlPoints[this.controlPoints.length - 1].z;

    angle = Math.atan((this.controlPoints[indice + 1].z - this.controlPoints[indice].z) / 
                            (this.controlPoints[indice + 1].x - this.controlPoints[indice].x));

    return new MyPoint(x,y,z);
}