/**
 * MyView
 * @constructor
 */
function MyView(near, far, angle, x1, y1, z1, x2, y2, z2) {	
	
	this.near = near;
	this.far = far;
	this.angle = angle;

	this.fromX = x1;
	this.fromY = y1;
	this.fromZ = z1;

	this.toX = x2;
	this.toY = y2;
	this.toZ = z2;
};