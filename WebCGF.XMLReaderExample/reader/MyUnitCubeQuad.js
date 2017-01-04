/**
 * MyUnitCubeQuad
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyUnitCubeQuad(scene) {
	CGFobject.call(this,scene);

	this.quad= new MyQuad(this.scene);
	this.quad.initBuffers();
};

MyUnitCubeQuad.prototype = Object.create(CGFobject.prototype);
MyUnitCubeQuad.prototype.constructor=MyUnitCubeQuad;

MyUnitCubeQuad.prototype.display = function () {

	var deg2rad=Math.PI/180.0;
	var a_rad=30.0*deg2rad;

	//front face
	this.scene.pushMatrix();
	this.scene.translate(0,0,0.5);
	this.quad.display();
	this.scene.popMatrix();
	
	
	//down face
	this.scene.pushMatrix();
	this.scene.translate(0,-0.5,0);
	this.scene.rotate(Math.PI/2,1,0,0);
	this.quad.display();
	this.scene.popMatrix();

	//back face
	this.scene.pushMatrix();
	this.scene.translate(0,0,-0.5);
	this.scene.rotate(Math.PI,1,0,0);
	this.quad.display();
	this.scene.popMatrix();

	//upper face
	this.scene.pushMatrix();
	this.scene.translate(0,0.5,0);
	this.scene.rotate(3*Math.PI/2,1,0,0);
	this.quad.display();
	this.scene.popMatrix();

	//right face
	this.scene.pushMatrix();
	this.scene.translate(0.5,0,0);
	this.scene.rotate(Math.PI/2,0,1,0);
	this.quad.display();
	this.scene.popMatrix();

	//left face
	this.scene.pushMatrix();
	this.scene.translate(-0.5,0,0);
	this.scene.rotate(3*Math.PI/2,0,1,0);
	this.quad.display();
	this.scene.popMatrix();

	
};