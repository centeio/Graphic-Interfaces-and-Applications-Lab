/**
 * MyPoint
 * @constructor
 */
function MyPoint(x, y, z) {

	this.x = x;
    this.y = y;
    this.z = z;
};

MyPoint.prototype.getX = function() {
    return x;
};

MyPoint.prototype.getY = function() {
    return y;
};

MyPoint.prototype.getZ = function() {
    return z;
};

MyPoint.prototype.setX = function(X) {
    this.x = X;
}

MyPoint.prototype.getY = function(Y) {
    this.y = Y;
}

MyPoint.prototype.getZ = function(Z) {
    this.z = Z;
}
