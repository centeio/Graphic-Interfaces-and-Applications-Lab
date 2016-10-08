/**
 * MyPolygon
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyPolygon(scene, radius, sides) {
	CGFobject.call(this,scene);
	
	this.sides = sides || 3;
	this.radius = radius;
	this.initBuffers();
};

MyPolygon.prototype = Object.create(CGFobject.prototype);
MyPolygon.prototype.constructor = MyPolygon;

MyPolygon.prototype.initBuffers = function () {
	
	this.vertices = [];
	this.indices = [];
    this.texCoords = [];
    this.normals = [];
	this.angle = Math.PI * 2 / this.sides;
	
	this.vertices.push(0,0,0);
	this.texCoords.push(0.5, 0.5);
	this.normals.push(0,0,1);
	for(i = 0; i < this.sides; i++) {
		this.vertices.push(this.radius * Math.cos(i * this.angle), this.radius * Math.sin(i * this.angle), 0);
		this.normals.push(0,0,1);
		this.texCoords.push((Math.cos(i * this.angle) + 1) / 2, Math.abs((Math.sin(i * this.angle) - 1)) / 2);
		if(i > 0)
			this.indices.push(0, i, i + 1);
	}
	this.indices.push(0,this.sides,1);
		
	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};