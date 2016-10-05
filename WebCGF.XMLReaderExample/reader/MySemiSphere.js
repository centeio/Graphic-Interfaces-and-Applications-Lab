/**
 * MySemiSphere
 * @constructor
 */
 function MySemiSphere(scene, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.slices = slices;
	this.stacks = stacks;

 	this.initBuffers();
 };

 MySemiSphere.prototype = Object.create(CGFobject.prototype);
 MySemiSphere.prototype.constructor = MySemiSphere;

 MySemiSphere.prototype.initBuffers = function() {
 	/*
 	* TODO:
 	* Replace the following lines in order to build a prism with a **single mesh**.
 	*
 	* How can the vertices, indices and normals arrays be defined to
 	* build a prism with varying number of slices and stacks?
 	*/
 	var theta = 2 * Math.PI / this.slices;
 	var phi = Math.PI / (2 * this.stacks);

 	this.vertices = [];
 	this.texCoords = [];
 	for(var j = 0; j <= this.stacks; j++){
		for (var i = 0; i < this.slices; i++) {			
			this.vertices.push(Math.sin(j * phi) * Math.cos(i * theta), Math.sin(j * phi) * Math.sin(i * theta), Math.cos(j * phi));
			this.texCoords.push(0.5 * (Math.sin(j * phi) * Math.cos(i * theta)) + .5, 0.5 * (Math.sin(j * phi) * Math.sin(i * theta)) + .5);
		}
	}
	
 	this.indices = [];
	for(var j = 0; j < this.stacks; j++){
		for (var i = 0; i < this.slices; i++) {
		 	var tmp = i + j*this.slices;
		 	if(i != this.slices-1){
		 		this.indices.push(tmp + this.slices, tmp + 1, tmp);
 				this.indices.push(tmp + 1, tmp + this.slices, tmp + this.slices + 1);
 			}
 			else{
 				this.indices.push(tmp + this.slices, j * this.slices, tmp);
 				this.indices.push(j * this.slices, tmp + this.slices, (j + 1) * this.slices);
 			}
		}
	}

 	this.normals = [];
 	for(var j = 0; j <= this.stacks; j++){
		for (var i = 0; i < this.slices; i++) {
			this.normals.push(Math.sin(j*phi)*Math.cos(i*theta), Math.sin(j*phi)*Math.sin(i*theta), Math.cos(j*phi));
		}
	}

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };