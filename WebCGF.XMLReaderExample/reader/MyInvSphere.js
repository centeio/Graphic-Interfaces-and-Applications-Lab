/**
 * MyInvSphere
 * @constructor
 */
 function MyInvSphere(scene, radius, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.radius = radius;
	this.slices = slices;
	this.stacks = stacks;

 	this.initBuffers();
 };

MyInvSphere.prototype = Object.create(CGFobject.prototype);
MyInvSphere.prototype.constructor = MyInvSphere;

MyInvSphere.prototype.initBuffers = function() {
 	/*
 	* TODO:
 	* Replace the following lines in order to build a prism with a **single mesh**.
 	*
 	* How can the vertices, indices and normals arrays be defined to
 	* build a prism with varying number of slices and stacks?
 	*/
 	var theta = 2 * Math.PI / this.slices;
 	var phi = 2 * Math.PI / (2 * this.stacks);

 	this.vertices = [];
 	this.texCoords = [];
 	for(var j = 0; j <= this.stacks; j++){
		for (var i = 0; i < this.slices; i++) {			
			this.vertices.push(this.radius * Math.sin(j * phi) * Math.cos(i * theta),this.radius * Math.sin(j * phi) * Math.sin(i * theta), this.radius * Math.cos(j * phi));
			this.texCoords.push(0.5 * (Math.sin(j * phi) * Math.cos(i * theta)) + .5, 0.5 * (Math.sin(j * phi) * Math.sin(i * theta)) + .5);
		}
	}
	
 	this.indices = [];
	for(var j = 0; j < this.stacks; j++){
		for (var i = 0; i < this.slices; i++) {
		 	var tmp = i + j*this.slices;
		 	if(i != this.slices-1){
		 		this.indices.push(tmp + this.slices, tmp, tmp + 1); 						 		
 				this.indices.push(tmp + 1, tmp + this.slices + 1, tmp + this.slices);
 			}
 			else{
  				this.indices.push(tmp + this.slices, tmp, j * this.slices);		
 				this.indices.push(j * this.slices, (j + 1) * this.slices, tmp + this.slices);  						
 			}
		}
	}

 	this.normals = [];
 	for(var j = 0; j <= this.stacks; j++){
		for (var i = 0; i < this.slices; i++) {
			this.normals.push(-Math.sin(j * phi) * Math.cos(i * theta),- Math.sin(j * phi) * Math.sin(i * theta),- Math.cos(j * phi));
		}
	}

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };